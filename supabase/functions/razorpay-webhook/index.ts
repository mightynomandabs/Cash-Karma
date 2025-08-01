import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/hash/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment: {
      entity: {
        id: string
        entity: string
        amount: number
        currency: string
        status: string
        order_id: string
        method: string
        amount_refunded: number
        refund_status: string | null
        captured: boolean
        description: string
        card_id: string | null
        bank: string | null
        wallet: string | null
        vpa: string | null
        email: string
        contact: string
        notes: Record<string, string>
        fee: number
        tax: number
        error_code: string | null
        error_description: string | null
        created_at: number
      }
    }
    order: {
      entity: {
        id: string
        entity: string
        amount: number
        currency: string
        receipt: string
        status: string
        attempts: number
        notes: Record<string, string>
        created_at: number
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify webhook signature
    const signature = req.headers.get('x-razorpay-signature')
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    
    if (!signature || !webhookSecret) {
      throw new Error('Missing signature or webhook secret')
    }

    const body = await req.text()
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body)
      .toString('hex')

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature')
    }

    const payload: RazorpayWebhookPayload = JSON.parse(body)
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different webhook events
    switch (payload.event) {
      case 'payment.captured':
        await handlePaymentCaptured(supabase, payload)
        break
      case 'payment.failed':
        await handlePaymentFailed(supabase, payload)
        break
      case 'payout.processed':
        await handlePayoutProcessed(supabase, payload)
        break
      case 'payout.failed':
        await handlePayoutFailed(supabase, payload)
        break
      default:
        console.log(`Unhandled webhook event: ${payload.event}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Webhook processed successfully',
        event: payload.event 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Failed to process webhook' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function handlePaymentCaptured(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  const order = payload.payload.order.entity

  try {
    // Find the payment session by order ID
    const { data: paymentSession, error: fetchError } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('razorpay_order_id', order.id)
      .single()

    if (fetchError || !paymentSession) {
      throw new Error(`Payment session not found for order: ${order.id}`)
    }

    // Update payment session
    const { error: updateError } = await supabase
      .from('payment_sessions')
      .update({
        razorpay_payment_id: payment.id,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentSession.id)

    if (updateError) {
      throw new Error(`Error updating payment session: ${updateError.message}`)
    }

    // Process the drop completion
    const { error: processError } = await supabase.rpc('process_payment_completion', {
      p_drop_id: paymentSession.drop_id,
      p_razorpay_payment_id: payment.id,
      p_status: 'completed'
    })

    if (processError) {
      throw new Error(`Error processing payment completion: ${processError.message}`)
    }

    console.log(`Payment captured successfully for drop: ${paymentSession.drop_id}`)

  } catch (error) {
    console.error('Error handling payment captured:', error)
    throw error
  }
}

async function handlePaymentFailed(supabase: any, payload: RazorpayWebhookPayload) {
  const payment = payload.payload.payment.entity
  const order = payload.payload.order.entity

  try {
    // Find the payment session by order ID
    const { data: paymentSession, error: fetchError } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('razorpay_order_id', order.id)
      .single()

    if (fetchError || !paymentSession) {
      throw new Error(`Payment session not found for order: ${order.id}`)
    }

    // Update payment session
    const { error: updateError } = await supabase
      .from('payment_sessions')
      .update({
        razorpay_payment_id: payment.id,
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentSession.id)

    if (updateError) {
      throw new Error(`Error updating payment session: ${updateError.message}`)
    }

    // Update drop status to failed
    const { error: dropError } = await supabase
      .from('drops')
      .update({
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentSession.drop_id)

    if (dropError) {
      throw new Error(`Error updating drop status: ${dropError.message}`)
    }

    console.log(`Payment failed for drop: ${paymentSession.drop_id}`)

  } catch (error) {
    console.error('Error handling payment failed:', error)
    throw error
  }
}

async function handlePayoutProcessed(supabase: any, payload: RazorpayWebhookPayload) {
  // Handle successful payout processing
  const payout = payload.payload.payout?.entity
  
  if (!payout) {
    console.log('No payout data in webhook payload')
    return
  }

  try {
    // Update withdrawal status
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'completed',
        razorpay_payout_id: payout.id,
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_payout_id', payout.id)

    if (updateError) {
      console.error('Error updating withdrawal status:', updateError)
    }

    console.log(`Payout processed successfully: ${payout.id}`)

  } catch (error) {
    console.error('Error handling payout processed:', error)
    throw error
  }
}

async function handlePayoutFailed(supabase: any, payload: RazorpayWebhookPayload) {
  // Handle failed payout processing
  const payout = payload.payload.payout?.entity
  
  if (!payout) {
    console.log('No payout data in webhook payload')
    return
  }

  try {
    // Update withdrawal status
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({
        status: 'failed',
        failure_reason: payout.failure_reason || 'Payout failed',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_payout_id', payout.id)

    if (updateError) {
      console.error('Error updating withdrawal status:', updateError)
    }

    console.log(`Payout failed: ${payout.id}`)

  } catch (error) {
    console.error('Error handling payout failed:', error)
    throw error
  }
} 