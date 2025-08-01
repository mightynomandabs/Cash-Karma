-- Create wallet table for user balances
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pending_balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_withdrawn INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create withdrawals table for transaction history
CREATE TABLE public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  upi_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  razorpay_payout_id TEXT,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_payout_methods table for storing UPI IDs
CREATE TABLE public.user_payout_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upi_id TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, upi_id)
);

-- Enable Row Level Security on new tables
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payout_methods ENABLE ROW LEVEL SECURITY;

-- Wallet policies
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert wallets" ON public.wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update wallets" ON public.wallets FOR UPDATE USING (true);

-- Withdrawals policies
CREATE POLICY "Users can view their own withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update withdrawals" ON public.withdrawals FOR UPDATE USING (true);

-- User payout methods policies
CREATE POLICY "Users can view their own payout methods" ON public.user_payout_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payout methods" ON public.user_payout_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payout methods" ON public.user_payout_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payout methods" ON public.user_payout_methods FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX idx_user_payout_methods_user_id ON public.user_payout_methods(user_id);

-- Create function to update wallet balance when drops are paid
CREATE OR REPLACE FUNCTION public.update_wallet_on_drop_paid()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when drop status changes to 'paid'
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    -- Insert or update wallet for receiver
    INSERT INTO public.wallets (user_id, pending_balance, total_earned)
    VALUES (NEW.receiver_id, NEW.amount, NEW.amount)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      pending_balance = wallets.pending_balance + EXCLUDED.pending_balance,
      total_earned = wallets.total_earned + EXCLUDED.total_earned,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update wallet when drops are paid
CREATE TRIGGER update_wallet_on_drop_paid
  AFTER UPDATE ON public.drops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wallet_on_drop_paid();

-- Create function to get user's wallet balance
CREATE OR REPLACE FUNCTION public.get_user_wallet_balance(p_user_id UUID)
RETURNS TABLE (
  pending_balance INTEGER,
  total_earned INTEGER,
  total_withdrawn INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(w.pending_balance, 0) as pending_balance,
    COALESCE(w.total_earned, 0) as total_earned,
    COALESCE(w.total_withdrawn, 0) as total_withdrawn
  FROM public.wallets w
  WHERE w.user_id = p_user_id;
  
  -- If no wallet exists, return zeros
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, 0;
  END IF;
END;
$$ LANGUAGE plpgsql; 