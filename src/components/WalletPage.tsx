import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WalletBalance from './WalletBalance';
import WithdrawalModal from './WithdrawalModal';
import TransactionHistory from './TransactionHistory';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWithdrawClick = () => {
    setIsWithdrawalModalOpen(true);
  };

  const handleWithdrawalSuccess = () => {
    // Refresh components after successful withdrawal
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Wallet</h1>
          <p className="text-muted-foreground">Please sign in to view your wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Your Wallet
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your earnings and withdrawals
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wallet Balance - Takes 1/3 on large screens */}
        <div className="lg:col-span-1">
          <WalletBalance 
            key={refreshKey}
            onWithdrawClick={handleWithdrawClick}
          />
        </div>

        {/* Transaction History - Takes 2/3 on large screens */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Transaction History</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-6">
              <TransactionHistory 
                key={refreshKey}
                className="w-full"
              />
            </TabsContent>
            
            <TabsContent value="stats" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 border rounded-lg bg-card/20 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Total Earned</h3>
                  <p className="text-3xl font-bold text-green-600">₹0</p>
                  <p className="text-sm text-muted-foreground">All time earnings</p>
                </div>
                <div className="p-6 border rounded-lg bg-card/20 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Total Withdrawn</h3>
                  <p className="text-3xl font-bold text-blue-600">₹0</p>
                  <p className="text-sm text-muted-foreground">Successfully withdrawn</p>
                </div>
                <div className="p-6 border rounded-lg bg-card/20 backdrop-blur-sm">
                  <h3 className="font-semibold text-lg mb-2">Success Rate</h3>
                  <p className="text-3xl font-bold text-purple-600">100%</p>
                  <p className="text-sm text-muted-foreground">Successful withdrawals</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
};

export default WalletPage; 