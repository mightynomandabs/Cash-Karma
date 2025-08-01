import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export interface WalletBalance {
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

export interface WithdrawalRequest {
  amount: number;
  upi_id: string;
}

export interface WithdrawalResult {
  success: boolean;
  payout_id?: string;
  error?: string;
}

export class WalletService {
  private static readonly WITHDRAWAL_THRESHOLD = 30; // ₹30 minimum

  /**
   * Get user's wallet balance
   */
  static async getWalletBalance(userId: string): Promise<WalletBalance> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_wallet_balance', { p_user_id: userId });

      if (error) throw error;

      if (data && data.length > 0) {
        return data[0];
      }

      return {
        pending_balance: 0,
        total_earned: 0,
        total_withdrawn: 0
      };
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Check if user can withdraw (meets minimum threshold)
   */
  static async canWithdraw(userId: string): Promise<boolean> {
    const balance = await this.getWalletBalance(userId);
    return balance.pending_balance >= this.WITHDRAWAL_THRESHOLD;
  }

  /**
   * Get withdrawal threshold
   */
  static getWithdrawalThreshold(): number {
    return this.WITHDRAWAL_THRESHOLD;
  }

  /**
   * Create a withdrawal request
   */
  static async createWithdrawal(userId: string, request: WithdrawalRequest): Promise<WithdrawalResult> {
    try {
      // Validate amount
      if (request.amount < this.WITHDRAWAL_THRESHOLD) {
        return {
          success: false,
          error: `Minimum withdrawal amount is ₹${this.WITHDRAWAL_THRESHOLD}`
        };
      }

      // Check if user has sufficient balance
      const balance = await this.getWalletBalance(userId);
      if (request.amount > balance.pending_balance) {
        return {
          success: false,
          error: 'Insufficient balance'
        };
      }

      // Create withdrawal record
      const { data: withdrawal, error: insertError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: userId,
          amount: request.amount,
          upi_id: request.upi_id,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Process payout through Razorpay
      const payoutResult = await this.processRazorpayPayout(request);

      if (payoutResult.success) {
        // Update withdrawal status to completed
        await supabase
          .from('withdrawals')
          .update({
            status: 'completed',
            razorpay_payout_id: payoutResult.payout_id
          })
          .eq('id', withdrawal.id);

        // Update wallet balance
        await supabase
          .from('wallets')
          .update({
            pending_balance: balance.pending_balance - request.amount,
            total_withdrawn: balance.total_withdrawn + request.amount
          })
          .eq('user_id', userId);

        return {
          success: true,
          payout_id: payoutResult.payout_id
        };
      } else {
        // Update withdrawal status to failed
        await supabase
          .from('withdrawals')
          .update({
            status: 'failed',
            failure_reason: payoutResult.error
          })
          .eq('id', withdrawal.id);

        return {
          success: false,
          error: payoutResult.error
        };
      }
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return {
        success: false,
        error: 'Failed to process withdrawal'
      };
    }
  }

  /**
   * Process payout through Razorpay API
   */
  private static async processRazorpayPayout(request: WithdrawalRequest): Promise<WithdrawalResult> {
    try {
      // In a real implementation, you would call Razorpay's Payouts API
      // For now, we'll simulate the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const payout_id = `pout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          payout_id
        };
      } else {
        return {
          success: false,
          error: 'UPI transfer failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Error processing Razorpay payout:', error);
      return {
        success: false,
        error: 'Payment processing failed'
      };
    }
  }

  /**
   * Get user's withdrawal history
   */
  static async getWithdrawalHistory(userId: string): Promise<Tables<'withdrawals'>['Row'][]> {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting withdrawal history:', error);
      throw error;
    }
  }

  /**
   * Save user's UPI ID
   */
  static async savePayoutMethod(userId: string, upi_id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_payout_methods')
        .upsert({
          user_id: userId,
          upi_id,
          is_default: true
        }, {
          onConflict: 'user_id,upi_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving payout method:', error);
      throw error;
    }
  }

  /**
   * Get user's saved payout methods
   */
  static async getPayoutMethods(userId: string): Promise<Tables<'user_payout_methods'>['Row'][]> {
    try {
      const { data, error } = await supabase
        .from('user_payout_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting payout methods:', error);
      throw error;
    }
  }

  /**
   * Validate UPI ID format
   */
  static validateUPIId(upi_id: string): boolean {
    // Basic UPI ID validation (name@bank format)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
    return upiRegex.test(upi_id);
  }
} 