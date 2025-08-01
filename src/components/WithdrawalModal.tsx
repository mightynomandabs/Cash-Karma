import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Sparkles,
  AlertCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletService, WalletBalance, WithdrawalRequest } from '@/lib/wallet';
import { toast } from 'sonner';
import ConfettiAnimation from './ConfettiAnimation';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface WithdrawalStep {
  id: 'amount' | 'upi' | 'processing' | 'success' | 'error';
  title: string;
  description: string;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WithdrawalStep['id']>('amount');
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [upiId, setUpiId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [payoutId, setPayoutId] = useState<string>('');

  const threshold = WalletService.getWithdrawalThreshold();

  const steps: WithdrawalStep[] = [
    {
      id: 'amount',
      title: 'Select Amount',
      description: 'Choose how much you want to withdraw'
    },
    {
      id: 'upi',
      title: 'Enter UPI ID',
      description: 'Where should we send your money?'
    },
    {
      id: 'processing',
      title: 'Processing Payment',
      description: 'Sending money to your UPI ID...'
    },
    {
      id: 'success',
      title: 'Payment Successful!',
      description: 'Your money is on its way'
    },
    {
      id: 'error',
      title: 'Payment Failed',
      description: 'Something went wrong'
    }
  ];

  useEffect(() => {
    if (isOpen && user) {
      loadBalance();
      setCurrentStep('amount');
      setAmount(0);
      setUpiId('');
      setError('');
      setPayoutId('');
    }
  }, [isOpen, user]);

  const loadBalance = async () => {
    if (!user) return;

    try {
      const balanceData = await WalletService.getWalletBalance(user.id);
      setBalance(balanceData);
      // Set default amount to available balance
      setAmount(balanceData.pending_balance);
    } catch (error) {
      console.error('Error loading balance:', error);
      toast.error('Failed to load wallet balance');
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= (balance?.pending_balance || 0)) {
      setAmount(numValue);
    }
  };

  const handleUpiChange = (value: string) => {
    setUpiId(value);
  };

  const validateUpiId = (upi: string): boolean => {
    return WalletService.validateUPIId(upi);
  };

  const handleNext = () => {
    if (currentStep === 'amount') {
      if (amount < threshold) {
        toast.error(`Minimum withdrawal amount is ₹${threshold}`);
        return;
      }
      if (amount > (balance?.pending_balance || 0)) {
        toast.error('Amount exceeds available balance');
        return;
      }
      setCurrentStep('upi');
    } else if (currentStep === 'upi') {
      if (!validateUpiId(upiId)) {
        toast.error('Please enter a valid UPI ID (e.g., name@bank)');
        return;
      }
      setCurrentStep('processing');
      processWithdrawal();
    }
  };

  const handleBack = () => {
    if (currentStep === 'upi') {
      setCurrentStep('amount');
    }
  };

  const processWithdrawal = async () => {
    if (!user) return;

    setIsProcessing(true);
    setError('');

    try {
      const request: WithdrawalRequest = {
        amount,
        upi_id: upiId
      };

      const result = await WalletService.createWithdrawal(user.id, request);

      if (result.success) {
        setPayoutId(result.payout_id || '');
        setCurrentStep('success');
        toast.success('Withdrawal successful!', {
          description: 'Your money will be transferred within 10 seconds'
        });
        onSuccess?.();
      } else {
        setError(result.error || 'Withdrawal failed');
        setCurrentStep('error');
        toast.error('Withdrawal failed', {
          description: result.error
        });
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      setError('Failed to process withdrawal');
      setCurrentStep('error');
      toast.error('Withdrawal failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (currentStep === 'processing') return; // Prevent closing during processing
    onClose();
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {currentStep === 'success' && <ConfettiAnimation />}
      <DialogContent className="max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            {currentStepData?.title}
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-2 h-2 rounded-full transition-colors
                  ${currentStep === step.id ? 'bg-primary' : 'bg-muted'}
                `} />
                {index < steps.length - 1 && (
                  <div className="w-4 h-px bg-muted mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {currentStep === 'amount' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Withdrawal Amount
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pl-8"
                    placeholder="Enter amount"
                    min={threshold}
                    max={balance?.pending_balance || 0}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available: ₹{balance?.pending_balance || 0} | Min: ₹{threshold}
                </p>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Instant UPI payout</strong> - No extra fees - Takes 10 seconds
                </AlertDescription>
              </Alert>
            </div>
          )}

          {currentStep === 'upi' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="upi" className="text-sm font-medium">
                  UPI ID
                </Label>
                <Input
                  id="upi"
                  type="text"
                  value={upiId}
                  onChange={(e) => handleUpiChange(e.target.value)}
                  placeholder="name@bank"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your UPI ID (e.g., john@icici)
                </p>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Destination Verification</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        We'll send ₹{amount} to <strong>{upiId || 'your UPI ID'}</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Processing Payment</h3>
                <p className="text-muted-foreground">
                  Sending ₹{amount} to {upiId}...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>This usually takes 10 seconds</span>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-green-600">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  ₹{amount} sent to {upiId}
                </p>
              </div>
              {payoutId && (
                <Badge variant="secondary" className="text-xs">
                  ID: {payoutId}
                </Badge>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Money transferred successfully!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  You'll receive a notification when the money arrives
                </p>
              </div>
            </div>
          )}

          {currentStep === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-red-600">Payment Failed</h3>
                <p className="text-muted-foreground">
                  {error || 'Something went wrong'}
                </p>
              </div>
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Don't worry, your balance hasn't been deducted. Please try again.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {currentStep !== 'processing' && (
          <div className="flex gap-3 mt-6">
            {currentStep === 'amount' && (
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={amount < threshold || amount > (balance?.pending_balance || 0)}
              >
                Continue
              </Button>
            )}

            {currentStep === 'upi' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1"
                  disabled={!validateUpiId(upiId)}
                >
                  Withdraw ₹{amount}
                </Button>
              </>
            )}

            {currentStep === 'success' && (
              <Button 
                onClick={handleClose} 
                className="flex-1"
              >
                Done
              </Button>
            )}

            {currentStep === 'error' && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('amount')}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleClose} 
                  className="flex-1"
                >
                  Close
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal; 