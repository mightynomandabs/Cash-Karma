import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import CreateDropSection from "@/components/CreateDropSection";
import RecentDropsFeed from "@/components/RecentDropsFeed";
import NotificationSystem from "@/components/NotificationSystem";
import ProfileCard from "@/components/ProfileCard";
import DailyGoals from "@/components/DailyGoals";
import KarmaLegendsLeaderboard from "@/components/KarmaLegendsLeaderboard";
import SocialSharing from "@/components/SocialSharing";
import GoodVibesBoard from "@/components/GoodVibesBoard";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard' | 'social' | 'community'>('feed');

  const handleDropCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return <RecentDropsFeed refreshTrigger={refreshTrigger} />;
      case 'leaderboard':
        return <KarmaLegendsLeaderboard />;
      case 'social':
        return <SocialSharing />;
      case 'community':
        return <GoodVibesBoard />;
      default:
        return <RecentDropsFeed refreshTrigger={refreshTrigger} />;
    }
  };

  return (
    <NotificationSystem>
      <div className="min-h-screen bg-background flex flex-col">
        <HeroSection />
        
        {user && (
          <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto space-y-16">
              {/* Profile and Gamification Section */}
              <section>
                <div className="grid md:grid-cols-2 gap-8">
                  <ProfileCard />
                  <DailyGoals />
                </div>
              </section>

              {/* Create Drop Section */}
              <section>
                <CreateDropSection onDropCreated={handleDropCreated} />
              </section>
              
              {/* Navigation Tabs */}
              <section>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  <button
                    onClick={() => setActiveTab('feed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'feed'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Recent Drops
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'leaderboard'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Karma Legends
                  </button>
                  <button
                    onClick={() => setActiveTab('social')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'social'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Share Karma
                  </button>
                  <button
                    onClick={() => setActiveTab('community')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === 'community'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Good Vibes
                  </button>
                  <button
                    onClick={() => navigate('/wallet')}
                    className="px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Wallet
                  </button>
                </div>
                
                {/* Tab Content */}
                <div>
                  {renderTabContent()}
                </div>
              </section>
            </div>
          </div>
        )}
        
        {!user && (
          <>
            <BrandSection />
            <FeaturesSection />
          </>
        )}
        
        <div className="pt-16">
          <Footer />
        </div>
      </div>
    </NotificationSystem>
  );
};

export default Index;
