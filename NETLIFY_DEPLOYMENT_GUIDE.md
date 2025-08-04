# Netlify Deployment - Google OAuth Fix Guide

## 🔍 **Problem**
Google OAuth works in development but fails on Netlify deployment.

## 🛠️ **Solution Steps**

### **Step 1: Update Google Cloud Console**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Update OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID
   - Click "Edit" (pencil icon)

3. **Add Netlify Authorized Redirect URIs**
   ```
   https://your-app-name.netlify.app/auth/callback
   https://your-custom-domain.com/auth/callback (if you have one)
   ```

4. **Save Changes**

### **Step 2: Update Supabase Configuration**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Update Authentication Settings**
   - Go to "Authentication" > "URL Configuration"
   - Add your Netlify URLs:
     ```
     Site URL: https://your-app-name.netlify.app
     Redirect URLs: 
     - https://your-app-name.netlify.app/auth/callback
     - https://your-custom-domain.com/auth/callback
     ```

3. **Update Google Provider**
   - Go to "Authentication" > "Providers" > "Google"
   - Ensure Google provider is enabled
   - Verify Client ID and Secret are correct

### **Step 3: Configure Netlify Environment Variables**

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com/
   - Select your site

2. **Add Environment Variables**
   - Go to "Site settings" > "Environment variables"
   - Add these variables:
     ```
     VITE_SUPABASE_URL=https://pcvrqiogqnrmekbjmdsf.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdnJxaW9ncW5ybWVrYmptZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzY4NDgsImV4cCI6MjA2OTU1Mjg0OH0.d4TH8MsHEXsS-Zwc-GDrpElt17CnwMQ8C9WhIsb_zcI
     VITE_GOOGLE_CLIENT_ID=292429606594-o0uq25qn7r30tlaerl1c0ot5s5bv32tm.apps.googleusercontent.com
     ```

### **Step 4: Deploy and Test**

1. **Trigger a new deployment**
   - Push changes to your repository
   - Netlify will auto-deploy

2. **Test Google OAuth**
   - Visit your Netlify site
   - Try "Continue with Google" button
   - Check browser console for any errors

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Redirect URI mismatch"**
**Solution:**
- Add your exact Netlify URL to Google Cloud Console
- Include both `https://` and `http://` versions if needed

### **Issue 2: "Invalid client"**
**Solution:**
- Verify Google Client ID in Netlify environment variables
- Check that Client ID matches in Supabase dashboard

### **Issue 3: "CORS errors"**
**Solution:**
- Add your Netlify domain to Supabase allowed origins
- Go to Supabase > Settings > API > Allowed origins

### **Issue 4: "Authentication failed"**
**Solution:**
- Check browser console for specific error messages
- Verify all environment variables are set in Netlify
- Ensure Supabase project is in the same region

## 🔧 **Debugging Steps**

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for error messages
   - Check Network tab for failed requests

2. **Verify Environment Variables**
   - Add console.log to check if variables are loaded
   - Verify in Netlify dashboard

3. **Test Redirect URLs**
   - Manually visit: `https://your-site.netlify.app/auth/callback`
   - Should show authentication callback page

## 📝 **Environment Variables for Netlify**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pcvrqiogqnrmekbjmdsf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdnJxaW9ncW5ybWVrYmptZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzY4NDgsImV4cCI6MjA2OTU1Mjg0OH0.d4TH8MsHEXsS-Zwc-GDrpElt17CnwMQ8C9WhIsb_zcI

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=292429606594-o0uq25qn7r30tlaerl1c0ot5s5bv32tm.apps.googleusercontent.com

# Test User Credentials (for development/testing only)
VITE_TEST_USER_EMAIL=testuser@example.com
VITE_TEST_USER_PASSWORD=password123
VITE_ADMIN_USER_EMAIL=admin@test.com
VITE_ADMIN_USER_PASSWORD=admin123
VITE_DEMO_USER_EMAIL=demo@demo.com
VITE_DEMO_USER_PASSWORD=demo123
VITE_TEST_ACCESS_TOKEN=test-access-token
VITE_TEST_REFRESH_TOKEN=test-refresh-token

# Environment
NODE_ENV=production
```

## 🎯 **Quick Checklist**

- [ ] Google Cloud Console: Added Netlify redirect URIs
- [ ] Supabase Dashboard: Updated site URL and redirect URLs
- [ ] Netlify Dashboard: Added environment variables
- [ ] Deployed and tested Google OAuth
- [ ] Checked browser console for errors

## 🆘 **Need Help?**

1. Check the browser console for specific error messages
2. Verify all URLs match exactly (including https://)
3. Ensure environment variables are set in Netlify
4. Test with a fresh browser session (clear cookies)

---

**Remember:** The key is ensuring that your Netlify domain is added to both Google Cloud Console and Supabase redirect URLs! 