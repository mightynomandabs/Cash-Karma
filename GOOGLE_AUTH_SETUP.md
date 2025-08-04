# Google OAuth Authentication Setup Guide

## 🔍 **Current Issue**
Google authentication is not working because the Google OAuth credentials are not configured.

## 🛠️ **How to Fix Google Auth**

### **Step 1: Create Google OAuth Credentials**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     https://pcvrqiogqnrmekbjmdsf.supabase.co/auth/v1/callback
     http://localhost:8080/auth/callback
     http://localhost:8081/auth/callback
     ```

4. **Copy Your Credentials**
   - Copy the Client ID and Client Secret

### **Step 2: Configure Environment Variables**

Create a `.env` file in your project root with:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

### **Step 3: Configure Supabase**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Configure Authentication**
   - Go to "Authentication" > "Providers"
   - Enable Google provider
   - Add your Google Client ID and Client Secret

3. **Set Redirect URLs**
   - Add these redirect URLs in Supabase:
     ```
     http://localhost:8080/auth/callback
     http://localhost:8081/auth/callback
     https://yourdomain.com/auth/callback
     ```

### **Step 4: Test the Setup**

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Try Google Sign-In**
   - Click "Continue with Google" button
   - Should redirect to Google OAuth flow

## 🔧 **Current Fallback**

Until Google OAuth is configured, the app will:
- Show an error message when Google sign-in is attempted
- Continue to work with Magic Link and Test authentication
- Provide clear feedback about the missing configuration

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Google OAuth is not configured"**
   - Solution: Add VITE_GOOGLE_CLIENT_ID to your .env file

2. **"Redirect URI mismatch"**
   - Solution: Add all redirect URIs to Google Cloud Console

3. **"Invalid client"**
   - Solution: Check that Client ID and Secret are correct

4. **"CORS errors"**
   - Solution: Ensure redirect URIs include your domain

## 📝 **Alternative Authentication Methods**

While Google OAuth is being set up, you can use:

1. **Magic Link Authentication** (Recommended)
   - Enter email address
   - Click link in email to sign in

2. **Test Authentication** (Development only)
   - Use test credentials:
     - Email: testuser@example.com
     - Password: password123

## 🎯 **Next Steps**

1. Set up Google OAuth credentials
2. Add environment variables
3. Configure Supabase
4. Test the authentication flow
5. Deploy with proper production credentials

---

**Need Help?** Check the console for specific error messages and refer to the troubleshooting section above. 