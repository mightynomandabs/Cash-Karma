# Cash Karma Backend Integration

This document outlines the complete backend integration for the Cash Karma application, including database schema, payment processing, drop matching, and security measures.

## 🗄️ Database Schema

### Enhanced Drops Table
The drops table has been enhanced with all required fields:

```sql
-- Key fields added:
- display_name: TEXT
- avatar_url: TEXT  
- upi_id: TEXT
- matched_id: UUID (references drops.id)
- payment_id: TEXT
- payout_id: TEXT
```

### New Tables Created

#### 1. User Profiles
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  karma_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_given INTEGER DEFAULT 0,
  total_received INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 2. Badges & Achievements
```sql
CREATE TABLE public.badges (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT CHECK (category IN ('streak', 'amount', 'social', 'special')),
  requirement_value INTEGER NOT NULL
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  badge_id UUID REFERENCES public.badges(id),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
```

#### 3. Transactions
```sql
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  drop_id UUID REFERENCES public.drops(id),
  type TEXT CHECK (type IN ('drop_sent', 'drop_received', 'withdrawal', 'fee', 'bonus')),
  amount INTEGER NOT NULL,
  fee_amount INTEGER DEFAULT 0,
  net_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  razorpay_payment_id TEXT,
  razorpay_payout_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 4. Payment Sessions
```sql
CREATE TABLE public.payment_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  drop_id UUID REFERENCES public.drops(id),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  fee_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 🔄 Drop Matching Logic

### Matching Algorithm
1. **Amount-based pairing**: Drops are matched only with drops of the same amount
2. **Random selection**: Within amount brackets, drops are randomly paired
3. **Status progression**: `pending` → `matched` → `paid`
4. **CRON scheduling**: Automatic matching every 5 minutes

### Edge Function: `match-drops`
- **Location**: `supabase/functions/match-drops/index.ts`
- **Purpose**: Matches pending drops automatically
- **Scheduling**: Can be triggered via CRON or manually

### CRON Job: `cron-match-drops`
- **Location**: `supabase/functions/cron-match-drops/index.ts`
- **Purpose**: Automated drop matching
- **Frequency**: Every 5 minutes (configurable)

## 💳 Payment Integration

### Razorpay Integration

#### 1. Payment Flow
```
User creates drop → Payment session created → Razorpay checkout → 
Payment processed → Webhook received → Drop status updated → 
Receiver wallet credited
```

#### 2. Fee Calculation
- **2% fee** on all drops
- Fee is calculated and deducted automatically
- Fee amount: `Math.ceil(amount * 0.02)`

#### 3. Webhook Handler
- **Location**: `supabase/functions/razorpay-webhook/index.ts`
- **Events handled**:
  - `payment.captured`: Successful payment
  - `payment.failed`: Failed payment
  - `payout.processed`: Successful withdrawal
  - `payout.failed`: Failed withdrawal

### Payment Service
- **Location**: `src/lib/payment.ts`
- **Features**:
  - Razorpay SDK integration
  - Payment session management
  - Transaction history
  - Wallet balance tracking
  - Badge system integration

## 🔐 Security Measures

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

```sql
-- Example: Users can only view their own transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);
```

### Webhook Signature Verification
```typescript
const expectedSignature = createHmac('sha256', webhookSecret)
  .update(body)
  .toString('hex')

if (signature !== expectedSignature) {
  throw new Error('Invalid webhook signature')
}
```

### Authentication Checks
- All API routes verify user authentication
- Token validation on every request
- User ownership verification for sensitive operations

## 🚀 Deployment Setup

### 1. Environment Variables
Create `.env.local` with the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RAZORPAY_ACCOUNT_NUMBER=your_account_number

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Migration
Run the migration to set up the enhanced schema:

```bash
# Apply the enhanced schema migration
supabase db push
```

### 3. Edge Functions Deployment
Deploy the edge functions:

```bash
# Deploy all functions
supabase functions deploy match-drops
supabase functions deploy razorpay-webhook
supabase functions deploy cron-match-drops
```

### 4. CRON Job Setup
Set up the CRON job in Supabase:

```sql
-- Create a CRON job that runs every 5 minutes
SELECT cron.schedule(
  'match-drops-cron',
  '*/5 * * * *',
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/cron-match-drops'',
    headers := ''{"Authorization": "Bearer ' || current_setting(''request.header.apikey'') || '"}''::jsonb
  );'
);
```

## 📊 Monitoring & Analytics

### Database Functions
- `get_user_wallet_balance()`: Get user's wallet balance
- `check_and_award_badges()`: Award badges based on user activity
- `match_pending_drops()`: Match pending drops
- `calculate_fee()`: Calculate 2% fee
- `process_payment_completion()`: Process payment completion

### Logging
- All edge functions include comprehensive logging
- Payment events are logged for debugging
- Error tracking for failed operations

## 🔧 API Endpoints

### Frontend Services
- `paymentService`: Handle payments and withdrawals
- `dropMatchingService`: Manage drop matching and status
- `walletService`: Wallet balance and transactions

### Backend APIs
- `/api/process-payout`: Process withdrawal payouts
- Webhook endpoints for Razorpay events

## 🎯 Key Features Implemented

### ✅ Completed
1. **Enhanced Database Schema**: All required fields added
2. **Drop Matching Logic**: CRON-based automatic matching
3. **Payment Integration**: Complete Razorpay integration
4. **Fee Handling**: 2% fee calculation and processing
5. **Security**: RLS policies and webhook verification
6. **Badge System**: Achievement tracking and awarding
7. **Transaction History**: Complete payment tracking
8. **Wallet Management**: Balance tracking and withdrawals

### 🔄 Status Updates
- `pending`: Drop created, waiting for match
- `matched`: Drop paired with another drop
- `paid`: Payment completed successfully
- `failed`: Payment failed
- `cancelled`: Drop cancelled by user

## 🛠️ Usage Examples

### Creating a Drop
```typescript
import { paymentService } from '@/lib/payment'

const { drop, paymentSession } = await paymentService.createDrop({
  amount: 100,
  message: "Spread some love!",
  display_name: "Anonymous",
  avatar_url: "https://example.com/avatar.png"
})

await paymentService.initiatePayment(drop, paymentSession)
```

### Checking Drop Status
```typescript
import { dropMatchingService } from '@/lib/drop-matching'

const status = await dropMatchingService.getDropStatus(dropId)
console.log(`Drop status: ${status.status}`)
```

### Processing Withdrawal
```typescript
const withdrawal = await paymentService.createWithdrawal(500, "user@upi")
```

## 🔍 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Verify webhook URL in Razorpay dashboard
   - Check webhook secret configuration
   - Ensure function is deployed correctly

2. **Drops not matching**
   - Check CRON job is running
   - Verify `match_pending_drops()` function exists
   - Check for pending drops in database

3. **Payment failures**
   - Verify Razorpay credentials
   - Check webhook signature verification
   - Review payment session status

### Debug Commands
```bash
# Check pending drops
supabase db query "SELECT * FROM drops WHERE status = 'pending'"

# Check payment sessions
supabase db query "SELECT * FROM payment_sessions WHERE status = 'pending'"

# Test webhook locally
supabase functions serve razorpay-webhook
```

## 📈 Performance Considerations

1. **Indexing**: All frequently queried columns are indexed
2. **Batch Processing**: Drop matching processes in batches
3. **Caching**: Consider Redis for frequently accessed data
4. **Monitoring**: Set up alerts for failed operations

## 🔮 Future Enhancements

1. **Real-time Updates**: WebSocket integration for live status updates
2. **Advanced Matching**: ML-based matching algorithms
3. **Analytics Dashboard**: Detailed user analytics
4. **Multi-currency Support**: Support for different currencies
5. **Advanced Badges**: More complex achievement system

---

This backend integration provides a robust, scalable foundation for the Cash Karma application with comprehensive payment processing, secure data handling, and automated drop matching. 