# Google OAuth Configuration Guide

## Current Status
✅ Local environment variables configured
✅ NextAuth properly configured
⚠️ **ACTION REQUIRED:** Add localhost redirect URI to Google Cloud Console

## Steps to Configure Google OAuth for Local Development

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Select Your OAuth 2.0 Client ID
- Look for your OAuth 2.0 Client ID (the one configured in your .env.local file)
- Click on it to edit

### 3. Add Localhost Redirect URIs
Under "Authorized redirect URIs", add:
```
http://localhost:3000/api/auth/callback/google
```

**Current redirect URIs should include:**
- `https://www.histronics.com/api/auth/callback/google` (Production)
- `http://localhost:3000/api/auth/callback/google` (Local Development) ← **ADD THIS**

### 4. Save Changes
Click "Save" at the bottom of the page

## Testing the Sign-In Flow

### Local Development (http://localhost:3000)
1. Go to http://localhost:3000
2. Click "Board Sign-in" in the header
3. Should redirect to http://localhost:3000/signin?callbackUrl=/dashboard
4. Click "Sign in with Google" button
5. Google OAuth page should appear
6. Sign in with an authorized email:
   - zack@xogosgaming.com
   - braden@kennyhertzperry.com
   - enjoyweaver@gmail.com
   - mckaylaareece@gmail.com
   - sturs49@gmail.com
7. Should redirect back to http://localhost:3000/dashboard (the secured board dashboard)

### Production (https://www.histronics.com)
The production flow should work as-is with the existing redirect URI.

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Cause:** The redirect URI in Google Cloud Console doesn't match the one NextAuth is sending

**Solution:**
1. Check the error message for the actual redirect URI being sent
2. Add that exact URI to Google Cloud Console
3. Make sure there are no trailing slashes or typos

### Error: "Access Denied"
**Cause:** Email not on the whitelist

**Solution:**
- Only authorized emails in `lib/auth/authorized-emails.ts` can sign in
- To add a new email, update that file and redeploy

### Error: "Configuration Error"
**Cause:** Missing or invalid environment variables

**Solution:**
- Verify .env.local has GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, NEXTAUTH_SECRET
- For production (AWS Amplify), verify environment variables in AWS Amplify Console

## Environment Variables

### Local Development (.env.local)
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### Production (AWS Amplify)
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=https://www.histronics.com
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**Note:** The actual values are already configured in your local .env.local file and AWS Amplify environment variables.

## Next Steps

1. ✅ Add localhost redirect URI to Google Cloud Console (see steps above)
2. ✅ Test the sign-in flow locally
3. ✅ If working, commit changes
4. ✅ Push to deploy to production
5. ✅ Test production sign-in flow

## Files Modified in This Session
- `.env.local` - Added NEXTAUTH_URL and NEXTAUTH_SECRET
- `GOOGLE_OAUTH_SETUP.md` - Created this guide (new file)
