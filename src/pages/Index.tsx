import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import LiveChatWidget from "@/components/LiveChatWidget";
import RecentDropsTicker from "@/components/RecentDropsTicker";
import BadgeShowcase from "@/components/BadgeShowcase";
import CreateDropSection from "@/components/CreateDropSection";
import RecentDropsFeed from "@/components/RecentDropsFeed";
import NotificationSystem from "@/components/NotificationSystem";
import ProfileCard from "@/components/ProfileCard";
import DailyGoals from "@/components/DailyGoals";
import KarmaLegendsLeaderboard from "@/components/KarmaLegendsLeaderboard";
import SocialSharing from "@/components/SocialSharing";
import GoodVibesBoard from "@/components/GoodVibesBoard";
import LogoutButton from "@/components/LogoutButton";
import DropsErrorBoundary from "@/components/DropsErrorBoundary";
import AnimatedSection from "@/components/AnimatedSection";

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
        <Navigation />
        <Header />
        
        {/* Home Section */}
        <div id="home">
          <HeroSection />
        </div>
        
        {user && (
          <div className="py-16 px-6">
            {/* Header with logout button */}
            <AnimatedSection delay={200}>
              <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary hover:text-primary-gold transition-colors duration-300">Welcome, {user.name}!</h1>
                  <p className="text-text-secondary hover:text-text-primary transition-colors duration-300">Ready to spread some karma?</p>
                </div>
                <LogoutButton />
              </div>
            </AnimatedSection>
            
            <div className="max-w-6xl mx-auto space-y-16">
              {/* Profile and Gamification Section */}
              <AnimatedSection delay={400}>
                <section>
                  <div className="grid md:grid-cols-2 gap-8">
                    <ProfileCard />
                    <DailyGoals />
                  </div>
                </section>
              </AnimatedSection>

              {/* Create Drop Section */}
              <AnimatedSection delay={600}>
                <section>
                  <CreateDropSection onDropCreated={handleDropCreated} />
                </section>
              </AnimatedSection>
              
              {/* Navigation Tabs */}
              <AnimatedSection delay={800}>
                <section>
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <button
                      onClick={() => setActiveTab('feed')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${
                        activeTab === 'feed'
                          ? 'bg-primary-gold text-text-primary shadow-soft'
                          : 'bg-surface-gray-100 text-text-secondary hover:text-text-primary hover:bg-surface-gray-200'
                      }`}
                    >
                      Recent Drops
                    </button>
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${
                        activeTab === 'leaderboard'
                          ? 'bg-primary-gold text-text-primary shadow-soft'
                          : 'bg-surface-gray-100 text-text-secondary hover:text-text-primary hover:bg-surface-gray-200'
                      }`}
                    >
                      Karma Legends
                    </button>
                    <button
                      onClick={() => setActiveTab('social')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${
                        activeTab === 'social'
                          ? 'bg-primary-gold text-text-primary shadow-soft'
                          : 'bg-surface-gray-100 text-text-secondary hover:text-text-primary hover:bg-surface-gray-200'
                      }`}
                    >
                      Share Karma
                    </button>
                    <button
                      onClick={() => setActiveTab('community')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation ${
                        activeTab === 'community'
                          ? 'bg-primary-gold text-text-primary shadow-soft'
                          : 'bg-surface-gray-100 text-text-secondary hover:text-text-primary hover:bg-surface-gray-200'
                      }`}
                    >
                      Good Vibes
                    </button>
                    <button
                      onClick={() => navigate('/wallet')}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-accent-purple text-surface-white hover:bg-accent-purple/90 hover:scale-105 active:scale-95 flex items-center gap-2 touch-manipulation shadow-soft hover:shadow-lg"
                    >
                      <Wallet className="w-4 h-4" />
                      Wallet
                    </button>
                  </div>
                  
                  {/* Tab Content */}
                  <div>
                    <DropsErrorBoundary>
                      {renderTabContent()}
                    </DropsErrorBoundary>
                  </div>
                </section>
              </AnimatedSection>
            </div>
          </div>
        )}
        
        {!user && (
          <>
            {/* About Section */}
            <div id="about">
              <BrandSection />
            </div>
            
            {/* Team Section */}
            <div id="team">
              <Team />
            </div>
            
            {/* Testimonials Section */}
            <Testimonials />
            
            {/* FAQ Section */}
            <div id="faq">
              <FAQSection />
            </div>
            
            {/* Contact Section */}
            <div id="contact">
              <ContactSection />
            </div>
          </>
        )}
        
        <div className="pt-16">
          <Footer />
        </div>

        {/* Sticky CTA for non-logged-in users only */}
        {!user && <StickyCTA />}
        
        {/* Interactive Components */}
        {!user && <LiveChatWidget />}
        {!user && <RecentDropsTicker />}
        
        {/* Badge Showcase for logged-in users */}
        {user && (
          <div id="achievements">
            <BadgeShowcase />
          </div>
        )}
      </div>
    </NotificationSystem>
  );
};

export default Index;
