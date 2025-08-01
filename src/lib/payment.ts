import { supabase } from '@/integrations/supabase/client'

interface PaymentResult {
  status: 'success' | 'failed';
  paymentId?: string;
  orderId?: string;
  amount?: number;
  error?: string;
}

interface MockPaymentData {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
}

export class MockPaymentService {
  private static instance: MockPaymentService

  private constructor() {}

  static getInstance(): MockPaymentService {
    if (!MockPaymentService.instance) {
      MockPaymentService.instance = new MockPaymentService()
    }
    return MockPaymentService.instance
  }

  async processPayment(paymentData: MockPaymentData): Promise<PaymentResult> {
    console.log('MockPaymentService.processPayment called with:', paymentData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 80% success rate
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      const paymentId = 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      console.log('Payment successful:', { paymentId, orderId: paymentData.orderId });
      
      return {
        status: 'success',
        paymentId: paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount
      };
    } else {
      console.log('Payment failed');
      
      return {
        status: 'failed',
        error: 'Payment failed due to insufficient funds'
      };
    }
  }

  async createDrop(params: any): Promise<{ drop: any; paymentSession: any }> {
    console.log('MockPaymentService.createDrop called with params:', params);
    
    // Simulate database operations
    const drop = {
      id: 'drop_' + Date.now(),
      sender_id: 'user_' + Date.now(),
      amount: params.amount,
      message: params.message,
      display_name: params.display_name,
      avatar_url: params.avatar_url,
      status: 'pending'
    };

    const paymentSession = {
      id: 'session_' + Date.now(),
      user_id: 'user_' + Date.now(),
      drop_id: drop.id,
      razorpay_order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: params.amount,
      fee_amount: Math.ceil(params.amount * 0.02),
      status: 'pending'
    };

    console.log('Mock drop and payment session created:', { dropId: drop.id, sessionId: paymentSession.id });

    return { drop, paymentSession };
  }

  async initiatePayment(drop: any, paymentSession: any): Promise<void> {
    console.log('MockPaymentService.initiatePayment called with:', { dropId: drop.id, sessionId: paymentSession.id });
    
    const paymentData: MockPaymentData = {
      amount: paymentSession.amount,
      currency: 'INR',
      orderId: paymentSession.razorpay_order_id,
      description: `Karma Drop - ${drop.message || 'Spread some love!'}`
    };

    try {
      const result = await this.processPayment(paymentData);
      
      if (result.status === 'success') {
        // Update drop status to paid
        console.log('Payment successful, updating drop status');
        
        // Simulate success notification
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('payment-success', {
            detail: {
              paymentId: result.paymentId,
              orderId: result.orderId,
              amount: result.amount
            }
          }));
        }
      } else {
        // Simulate failure notification
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('payment-failed', {
            detail: {
              error: result.error
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error in mock payment:', error);
      throw error;
    }
  }

  async getPaymentHistory(): Promise<any[]> {
    // Return mock payment history
    return [
      {
        id: '1',
        amount: 100,
        status: 'completed',
        created_at: new Date().toISOString(),
        description: 'Karma Drop'
      },
      {
        id: '2',
        amount: 50,
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        description: 'Karma Drop'
      }
    ];
  }

  async getWalletBalance(): Promise<{
    pending_balance: number;
    total_earned: number;
    total_withdrawn: number;
  }> {
    // Return mock wallet balance
    return {
      pending_balance: 250,
      total_earned: 500,
      total_withdrawn: 100
    };
  }
}

export const mockPaymentService = MockPaymentService.getInstance(); 