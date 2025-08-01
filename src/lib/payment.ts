import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'

type Drop = Database['public']['Tables']['drops']['Row']
type PaymentSession = Database['public']['Tables']['payment_sessions']['Row']

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface CreateDropParams {
  amount: number
  message?: string
  display_name?: string
  avatar_url?: string
  upi_id?: string
}

export interface PaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
}

export class PaymentService {
  private static instance: PaymentService
  private razorpayLoaded = false

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async loadRazorpay(): Promise<void> {
    if (this.razorpayLoaded) return

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        this.razorpayLoaded = true
        resolve()
      }
      script.onerror = () => reject(new Error('Failed to load Razorpay'))
      document.head.appendChild(script)
    })
  }

  async createDrop(params: CreateDropParams): Promise<{ drop: Drop; paymentSession: PaymentSession }> {
    console.log('PaymentService.createDrop called with params:', params);
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User not authenticated')
    }

    console.log('User authenticated:', user.id);

    // Create drop record
    const dropData = {
      sender_id: user.id,
      amount: params.amount,
      message: params.message,
      display_name: params.display_name,
      avatar_url: params.avatar_url,
      upi_id: params.upi_id,
      status: 'pending'
    };
    
    console.log('Creating drop with data:', dropData);
    
    const { data: drop, error: dropError } = await supabase
      .from('drops')
      .insert(dropData)
      .select()
      .single()

    if (dropError) {
      console.error('Error creating drop:', dropError);
      throw new Error(`Error creating drop: ${dropError.message}`)
    }

    console.log('Drop created successfully:', drop.id);

    // Create payment session
    const sessionData = {
      user_id: user.id,
      drop_id: drop.id,
      razorpay_order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: params.amount,
      fee_amount: Math.ceil(params.amount * 0.02), // 2% fee
      status: 'pending'
    };
    
    console.log('Creating payment session with data:', sessionData);
    
    const { data: paymentSession, error: sessionError } = await supabase
      .from('payment_sessions')
      .insert(sessionData)
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating payment session:', sessionError);
      throw new Error(`Error creating payment session: ${sessionError.message}`)
    }

    console.log('Payment session created successfully:', paymentSession.id);

    return { drop, paymentSession }
  }

  async initiatePayment(drop: Drop, paymentSession: PaymentSession): Promise<void> {
    console.log('PaymentService.initiatePayment called with:', { dropId: drop.id, sessionId: paymentSession.id });
    
    try {
      await this.loadRazorpay()
      console.log('Razorpay loaded successfully');

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated')
      }

      console.log('User authenticated for payment:', user.id);

      // Get user profile for prefill
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single()

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
      console.log('Razorpay key configured:', !!razorpayKey);

      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      const options: PaymentOptions = {
        key: razorpayKey,
        amount: paymentSession.amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Cash Karma',
        description: `Karma Drop - ${drop.message || 'Spread some love!'}`,
        order_id: paymentSession.razorpay_order_id,
        handler: async (response: any) => {
          console.log('Payment success handler called:', response);
          await this.handlePaymentSuccess(response, drop.id)
        },
        prefill: {
          name: profile?.display_name || user.email?.split('@')[0] || '',
          email: user.email || '',
        },
        notes: {
          drop_id: drop.id,
          user_id: user.id
        },
        theme: {
          color: '#10B981'
        }
      }

      console.log('Razorpay options configured:', { 
        amount: options.amount, 
        order_id: options.order_id,
        description: options.description 
      });

      const razorpay = new window.Razorpay(options)
      console.log('Razorpay instance created, opening checkout...');
      razorpay.open()
      
    } catch (error) {
      console.error('Error in initiatePayment:', error);
      throw error;
    }
  }

  private async handlePaymentSuccess(response: any, dropId: string): Promise<void> {
    try {
      // Update payment session with payment ID
      const { error: updateError } = await supabase
        .from('payment_sessions')
        .update({
          razorpay_payment_id: response.razorpay_payment_id,
          status: 'completed'
        })
        .eq('drop_id', dropId)

      if (updateError) {
        console.error('Error updating payment session:', updateError)
      }

      // The webhook will handle the rest of the processing
      console.log('Payment successful:', response)
      
      // Show success notification
      // You can integrate with your toast system here
      
    } catch (error) {
      console.error('Error handling payment success:', error)
      throw error
    }
  }

  async createWithdrawal(amount: number, upiId: string): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Check wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('pending_balance')
      .eq('user_id', user.id)
      .single()

    if (!wallet || wallet.pending_balance < amount) {
      throw new Error('Insufficient balance')
    }

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        user_id: user.id,
        amount: amount,
        upi_id: upiId,
        status: 'pending'
      })
      .select()
      .single()

    if (withdrawalError) throw new Error(`Error creating withdrawal: ${withdrawalError.message}`)

    // Call backend to process payout
    const response = await fetch('/api/process-payout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
      },
      body: JSON.stringify({
        withdrawal_id: withdrawal.id,
        amount: amount,
        upi_id: upiId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to process payout')
    }

    return withdrawal
  }

  async getPaymentHistory(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        drops (
          id,
          message,
          amount
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Error fetching transactions: ${error.message}`)

    return transactions || []
  }

  async getWalletBalance(): Promise<{
    pending_balance: number
    total_earned: number
    total_withdrawn: number
  }> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase.rpc('get_user_wallet_balance', {
      p_user_id: user.id
    })

    if (error) throw new Error(`Error fetching wallet balance: ${error.message}`)

    return data?.[0] || { pending_balance: 0, total_earned: 0, total_withdrawn: 0 }
  }

  async getUserBadges(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data: badges, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (
          name,
          description,
          icon_url,
          category
        )
      `)
      .eq('user_id', user.id)

    if (error) throw new Error(`Error fetching badges: ${error.message}`)

    return badges || []
  }
}

export const paymentService = PaymentService.getInstance() 