import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  ExternalLink,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletService } from '@/lib/wallet';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  className?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ className }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Tables<'withdrawals'>['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactionHistory();
    }
  }, [user]);

  const loadTransactionHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const history = await WalletService.getWithdrawalHistory(user.id);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const formatAmount = (amount: number) => {
    return `₹${amount}`;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No transactions yet</h3>
            <p className="text-muted-foreground">
              Your withdrawal history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {formatAmount(transaction.amount)}
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>to {transaction.upi_id}</span>
                      {transaction.razorpay_payout_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => {
                            // In a real app, this would open Razorpay dashboard
                            console.log('Payout ID:', transaction.razorpay_payout_id);
                          }}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </span>
                  </div>
                </div>
                
                {transaction.failure_reason && (
                  <div className="text-right">
                    <p className="text-xs text-red-600 max-w-32">
                      {transaction.failure_reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory; 