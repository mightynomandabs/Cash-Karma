import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { withdrawal_id, amount, upi_id } = req.body

    if (!withdrawal_id || !amount || !upi_id) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify user authentication
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get withdrawal details
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawal_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' })
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' })
    }

    // Initialize Razorpay
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    // Create payout
    const payoutData = {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
      fund_account_id: upi_id, // This should be a fund account ID, not UPI ID
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: `payout_${withdrawal_id}`,
      narration: 'Cash Karma withdrawal'
    }

    const payout = await razorpay.payouts.create(payoutData)

    // Update withdrawal with payout ID
    const { error: updateError } = await supabase
      .from('withdrawals')
      .update({
        razorpay_payout_id: payout.id,
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', withdrawal_id)

    if (updateError) {
      throw new Error(`Error updating withdrawal: ${updateError.message}`)
    }

    // Update user's wallet balance
    const { error: walletError } = await supabase
      .from('wallets')
      .update({
        pending_balance: supabase.raw(`pending_balance - ${amount}`),
        total_withdrawn: supabase.raw(`total_withdrawn + ${amount}`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (walletError) {
      throw new Error(`Error updating wallet: ${walletError.message}`)
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: amount,
        fee_amount: 0,
        net_amount: amount,
        status: 'processing',
        razorpay_payout_id: payout.id,
        description: 'Withdrawal to UPI'
      })

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError)
    }

    return res.status(200).json({
      message: 'Payout initiated successfully',
      payout_id: payout.id,
      status: 'processing'
    })

  } catch (error) {
    console.error('Error processing payout:', error)
    return res.status(500).json({
      error: 'Failed to process payout',
      message: error.message
    })
  }
} 