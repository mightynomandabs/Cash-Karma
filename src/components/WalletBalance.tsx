import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletService, WalletBalance } from '@/lib/wallet';
import { cn } from '@/lib/utils';

interface WalletBalanceProps {
  onWithdrawClick?: () => void;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ onWithdrawClick }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [canWithdraw, setCanWithdraw] = useState(false);

  const threshold = WalletService.getWithdrawalThreshold();

  useEffect(() => {
    if (user) {
      loadWalletBalance();
    }
  }, [user]);

  const loadWalletBalance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [balanceData, canWithdrawData] = await Promise.all([
        WalletService.getWalletBalance(user.id),
        WalletService.canWithdraw(user.id)
      ]);

      setBalance(balanceData);
      setCanWithdraw(canWithdrawData);
    } catch (error) {
      console.error('Error loading wallet balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = balance 
    ? Math.min((balance.pending_balance / threshold) * 100, 100)
    : 0;

  if (loading) {
    return (
      <Card className="w-full bg-card/20 backdrop-blur-sm border-border/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-card/20 backdrop-blur-sm border-border/30">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Your Wallet</h3>
            <p className="text-sm text-muted-foreground">Manage your earnings</p>
          </div>
        </div>

        {/* Balance Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">
              ₹{balance?.pending_balance || 0}
            </span>
            <span className="text-sm text-muted-foreground">Pending Balance</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Total Earned: ₹{balance?.total_earned || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              <span>Total Withdrawn: ₹{balance?.total_withdrawn || 0}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Withdrawal Progress</span>
            <span className="text-sm text-muted-foreground">
              ₹{balance?.pending_balance || 0} / ₹{threshold}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {progressPercentage >= 100 ? 'Ready to withdraw!' : `${Math.round(progressPercentage)}% to threshold`}
            </span>
            <span className="text-xs text-muted-foreground">
              Min: ₹{threshold}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={onWithdrawClick}
                  disabled={!canWithdraw}
                  className={cn(
                    "w-full h-12 text-lg font-semibold transition-all duration-300",
                    canWithdraw
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl animate-pulse"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {canWithdraw ? (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Withdraw Now
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Collect More Drops
                    </>
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {!canWithdraw && (
              <TooltipContent>
                <p>Collect more drops to unlock withdrawal!</p>
                <p className="text-xs">Minimum ₹{threshold} required</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Info Message */}
        {!canWithdraw && balance && balance.pending_balance > 0 && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-600">
                You need ₹{threshold - (balance.pending_balance)} more to withdraw
              </span>
            </div>
          </div>
        )}

        {canWithdraw && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                Ready for instant UPI payout! 🎉
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletBalance; 