import { useState, useEffect } from "react";
import { 
  Trophy, 
  Crown, 
  Star, 
  Heart, 
  Zap, 
  Target, 
  Gift, 
  Users, 
  Award, 
  Sparkles,
  Lock,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: 'karma' | 'social' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  glowColor: string;
}

const BadgeShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const achievements: Achievement[] = [
    {
      id: 'first-drop',
      name: 'First Drop',
      description: 'Made your first karma drop',
      icon: Gift,
      category: 'karma',
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      glowColor: 'from-green-400 to-green-600'
    },
    {
      id: 'karma-pioneer',
      name: 'Karma Pioneer',
      description: 'Reached 10 drops milestone',
      icon: Star,
      category: 'karma',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      glowColor: 'from-blue-400 to-blue-600'
    },
    {
      id: 'social-butterfly',
      name: 'Social Butterfly',
      description: 'Connected with 50+ community members',
      icon: Users,
      category: 'social',
      rarity: 'epic',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      glowColor: 'from-purple-400 to-purple-600'
    },
    {
      id: 'karma-legend',
      name: 'Karma Legend',
      description: 'Achieved 100 drops with 100% match rate',
      icon: Crown,
      category: 'milestone',
      rarity: 'legendary',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      glowColor: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'heart-warrior',
      name: 'Heart Warrior',
      description: 'Donated to 5 different cause categories',
      icon: Heart,
      category: 'karma',
      rarity: 'rare',
      unlocked: false,
      progress: 3,
      maxProgress: 5,
      glowColor: 'from-pink-400 to-pink-600'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Made 10 drops in a single day',
      icon: Zap,
      category: 'milestone',
      rarity: 'epic',
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      glowColor: 'from-orange-400 to-orange-600'
    },
    {
      id: 'target-master',
      name: 'Target Master',
      description: 'Hit 100% accuracy on cause matching',
      icon: Target,
      category: 'special',
      rarity: 'legendary',
      unlocked: false,
      progress: 85,
      maxProgress: 100,
      glowColor: 'from-red-400 to-red-600'
    },
    {
      id: 'community-champion',
      name: 'Community Champion',
      description: 'Helped 25 new users join the platform',
      icon: Award,
      category: 'social',
      rarity: 'epic',
      unlocked: false,
      progress: 12,
      maxProgress: 25,
      glowColor: 'from-indigo-400 to-indigo-600'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', count: achievements.length },
    { id: 'karma', label: 'Karma', count: achievements.filter(a => a.category === 'karma').length },
    { id: 'social', label: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { id: 'milestone', label: 'Milestone', count: achievements.filter(a => a.category === 'milestone').length },
    { id: 'special', label: 'Special', count: achievements.filter(a => a.category === 'special').length }
  ];

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'shadow-gray-400/50';
      case 'rare':
        return 'shadow-blue-400/50';
      case 'epic':
        return 'shadow-purple-400/50';
      case 'legendary':
        return 'shadow-yellow-400/50';
      default:
        return 'shadow-gray-400/50';
    }
  };

  const handleBadgeClick = (badge: Achievement) => {
    setSelectedBadge(badge);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-brand-yellow" />
            <Badge variant="secondary" className="bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30">
              Achievements
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent">
            your karma achievements
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            unlock badges and showcase your impact on the world
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-brand-green to-brand-pink text-white border-0' 
                  : 'bg-background/80 backdrop-blur-sm border-border/50'
              }`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`group relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                achievement.unlocked ? 'hover:scale-105' : 'opacity-60'
              } ${isAnimating && selectedBadge?.id === achievement.id ? 'animate-pulse' : ''}`}
              onClick={() => handleBadgeClick(achievement)}
            >
              {/* Glow effect for unlocked badges */}
              {achievement.unlocked && (
                <div className={`absolute inset-0 bg-gradient-to-r ${achievement.glowColor} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
              )}

              <CardHeader className="p-6 text-center">
                <div className="relative mx-auto mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? `bg-gradient-to-r ${achievement.glowColor} text-white shadow-lg ${getRarityGlow(achievement.rarity)}` 
                      : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {achievement.unlocked ? (
                      <achievement.icon className="w-8 h-8" />
                    ) : (
                      <Lock className="w-8 h-8" />
                    )}
                  </div>
                  
                  {/* Unlock indicator */}
                  {achievement.unlocked && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  
                  {/* Progress bar for locked badges */}
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-brand-green to-brand-pink h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / achievement.maxProgress!) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Unlock date for unlocked badges */}
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Unlocked {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </div>

                {/* Rarity badge */}
                <Badge variant="outline" className={`text-xs mt-3 ${getRarityColor(achievement.rarity)}`}>
                  {achievement.rarity}
                </Badge>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <Trophy className="w-8 h-8 text-brand-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {achievements.filter(a => a.unlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Badges Unlocked</div>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <Crown className="w-8 h-8 text-brand-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {achievements.filter(a => a.unlocked && a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-muted-foreground">Legendary Badges</div>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <Star className="w-8 h-8 text-brand-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <Sparkles className="w-8 h-8 text-brand-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {achievements.filter(a => !a.unlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Badges Remaining</div>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-6">
            Keep dropping karma to unlock more achievements!
          </p>
          <Button 
            className="bg-gradient-to-r from-brand-green to-brand-pink hover:from-brand-green/90 hover:to-brand-pink/90 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <Gift className="w-5 h-5 mr-2" />
            Make a Drop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgeShowcase; 