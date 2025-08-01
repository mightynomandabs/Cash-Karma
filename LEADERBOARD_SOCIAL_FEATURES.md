# Cash Karma - Leaderboard & Social Features

This document outlines the new leaderboard and social functionality implemented for the Cash Karma app.

## 🏆 Karma Legends Leaderboard

### Features
- **Top 10 Droppers** (weekly/all-time)
- **Top 10 Receivers** (weekly/all-time) 
- **Streak Masters** section
- **User's current rank** display (even if not in top 10)
- **Neon borders** for top 3 with pulse animations
- **Period toggles** (Weekly/All Time)

### Database Schema
```sql
-- Leaderboard entries table
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  period_type TEXT CHECK (period_type IN ('weekly', 'all_time')),
  category TEXT CHECK (category IN ('droppers', 'receivers', 'streak_masters')),
  score INTEGER DEFAULT 0,
  rank INTEGER,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Key Functions
- `LeaderboardService.updateUserLeaderboard()` - Updates user's leaderboard stats
- `LeaderboardService.calculateStreak()` - Calculates current and longest streaks
- `LeaderboardService.getUserRank()` - Gets user's rank in specific category
- `LeaderboardService.getTopPerformers()` - Gets top 10 for category

## 📱 Social Sharing

### Features
- **Auto-generated screenshot cards** for drops/milestones
- **Share buttons**: Instagram Story, X (Twitter), WhatsApp Status, TikTok
- **Web Share API** integration
- **#CashKarmaDropWeek** hashtag campaigns
- **Download image** functionality
- **Copy text** to clipboard

### Canvas Generation
- Creates Instagram Story-sized images (1080x1920)
- Gradient backgrounds with brand colors
- Dynamic content based on drop/milestone data
- Branded hashtags and app information

### Share Platforms
```javascript
// Instagram Story
- Downloads image for manual sharing
- Opens Instagram app

// X (Twitter)  
- Opens tweet composer with pre-filled text
- Includes hashtags and app URL

// WhatsApp Status
- Opens WhatsApp with pre-filled message
- Includes image and text

// TikTok
- Copies text to clipboard
- User pastes in video description
```

## 💫 Good Vibes Board

### Features
- **Anonymous positive story sharing** (pre-moderated)
- **In-app reactions** (❤️ 😂 😊 🔥) with burst animations
- **Featured stories** highlighting
- **Community guidelines** enforcement
- **Real-time reaction updates**

### Database Schema
```sql
-- Social stories table
CREATE TABLE public.social_stories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Story reactions table
CREATE TABLE public.story_reactions (
  id UUID PRIMARY KEY,
  story_id UUID REFERENCES social_stories(id),
  user_id UUID REFERENCES auth.users(id),
  reaction_type TEXT CHECK (reaction_type IN ('heart', 'laugh', 'smile', 'fire')),
  created_at TIMESTAMP
);
```

### Reaction System
- **4 reaction types**: Heart, Laugh, Smile, Fire
- **Burst animations** on reaction
- **Real-time updates** without page refresh
- **Toggle functionality** (click to add/remove)

## 🎨 UI/UX Enhancements

### Animations
```css
/* Burst animation for reactions */
@keyframes burst {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Pulse glow for top ranks */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.5); }
  50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
}

/* Neon border for top 3 */
@keyframes neon-border {
  0%, 100% { border-color: rgba(236, 72, 153, 0.5); }
  50% { border-color: rgba(236, 72, 153, 0.8); }
}
```

### Navigation
- **Tab-based navigation** between features
- **Smooth transitions** between sections
- **Responsive design** for mobile/desktop

## 🔧 Technical Implementation

### Components
- `KarmaLegendsLeaderboard.tsx` - Main leaderboard component
- `SocialSharing.tsx` - Social sharing functionality
- `GoodVibesBoard.tsx` - Community stories board
- `LeaderboardService` - Backend leaderboard logic

### Database Migrations
- `20250101000000_leaderboard_social_features.sql` - New tables and functions
- Updated Supabase types for TypeScript support

### Integration Points
- **CreateDropSection** - Updates leaderboard on drop creation
- **RecentDropsFeed** - Shows social sharing options
- **ProfileCard** - Displays user's current ranks

## 🚀 Usage

### For Users
1. **View Leaderboard**: Navigate to "Karma Legends" tab
2. **Share Drops**: Use "Share Karma" tab for social sharing
3. **Share Stories**: Use "Good Vibes" tab for community stories
4. **React to Stories**: Click reaction buttons on stories

### For Developers
1. **Run migrations**: Apply the new SQL migration
2. **Update types**: Regenerate Supabase types
3. **Test features**: Verify leaderboard calculations and social sharing

## 🔒 Privacy & Security

### Privacy Controls
- **Anonymous posting** option for stories
- **Pre-moderation** for all community content
- **User consent** for social sharing
- **Data minimization** in shared content

### Security Measures
- **Row Level Security** on all new tables
- **Input validation** for story content
- **Rate limiting** for reactions and submissions
- **Content filtering** for inappropriate content

## 📊 Analytics & Insights

### Leaderboard Metrics
- **Weekly/All-time rankings**
- **Streak tracking**
- **Drop frequency analysis**
- **User engagement patterns**

### Social Metrics
- **Share engagement rates**
- **Story submission volume**
- **Reaction patterns**
- **Hashtag campaign performance**

## 🎯 Future Enhancements

### Planned Features
- **Real-time leaderboard updates**
- **Advanced streak analytics**
- **Social media integration APIs**
- **Community moderation tools**
- **Gamification rewards for social engagement**

### Technical Improvements
- **WebSocket integration** for real-time updates
- **Image optimization** for social sharing
- **Advanced caching** for leaderboard data
- **A/B testing** for social features

---

*This implementation maintains the existing Cash Karma design system while adding powerful social and competitive features that enhance user engagement and community building.* 