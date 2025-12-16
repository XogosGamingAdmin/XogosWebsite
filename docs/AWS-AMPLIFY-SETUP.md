# AWS Amplify Deployment Setup

**Last Updated:** 2025-12-16

This guide explains how to configure environment variables and deploy XogosBoard to AWS Amplify.

---

## Prerequisites

1. AWS Account with Amplify access
2. GitHub repository connected to AWS Amplify
3. Liveblocks account with API keys
4. Google OAuth credentials (for authentication)

---

## Environment Variables Configuration

### Step 1: Access Amplify Console

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app (XogosWebsite)
3. Click on **"App settings"** in the left sidebar
4. Click on **"Environment variables"**

### Step 2: Add Required Environment Variables

Click **"Manage variables"** and add the following:

#### Required Variables

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `LIVEBLOCKS_SECRET_KEY` | `sk_prod_xxxxxxxxxxxx...` | Your Liveblocks secret key |
| `NEXTAUTH_SECRET` | `your-random-32-char-string` | NextAuth encryption key |
| `NEXTAUTH_URL` | `https://your-domain.amplifyapp.com` | Your deployment URL |
| `GOOGLE_CLIENT_ID` | `123456789.apps.googleusercontent.com` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxxxxxxxxxxxx` | Google OAuth client secret |

#### Optional Variables (Blockchain)

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| `PRIVATE_KEY` | `0x...` | Wallet private key for blockchain |
| `NEXT_PUBLIC_RPC_URL_4002` | `https://rpc.testnet.fantom.network` | Fantom testnet RPC |
| `NEXT_PUBLIC_RPC_URL_250` | `https://rpc.ftm.tools` | Fantom mainnet RPC |
| `NEXT_PUBLIC_RPC_URL_137` | `https://polygon-rpc.com` | Polygon RPC |

### Step 3: Get Your API Keys

#### Liveblocks Secret Key

1. Go to [Liveblocks Dashboard](https://liveblocks.io/dashboard/apikeys)
2. Sign in or create an account
3. Copy your **Secret Key** (starts with `sk_prod_` or `sk_dev_`)
4. Paste it as the value for `LIVEBLOCKS_SECRET_KEY`

#### NextAuth Secret

Generate a random secret:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to **APIs & Services** > **Credentials**
4. Create **OAuth 2.0 Client ID** if you haven't already
5. Add authorized redirect URI:
   ```
   https://your-app-name.amplifyapp.com/api/auth/callback/google
   ```
6. Copy the **Client ID** and **Client Secret**

### Step 4: Configure NEXTAUTH_URL

1. After your first deployment, AWS Amplify will provide a URL like:
   ```
   https://main.d1234567890abc.amplifyapp.com
   ```
2. Update the `NEXTAUTH_URL` environment variable with this URL
3. Also update Google OAuth authorized redirect URIs with this URL

---

## Build Configuration

The repository includes an `amplify.yml` file that configures the build process:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Custom Build Settings (Optional)

If you need to customize the build:

1. Go to **App settings** > **Build settings**
2. Edit the build specification
3. You can modify:
   - Build commands
   - Output directory
   - Cache paths
   - Environment-specific settings

---

## Deployment Steps

### Initial Deployment

1. **Connect Repository**
   - In Amplify Console, click **"Connect app"**
   - Choose **GitHub**
   - Select your repository: `XogosGamingAdmin/XogosWebsite`
   - Choose branch: `main`

2. **Configure Build Settings**
   - Amplify will auto-detect Next.js
   - Use the default build settings or customize
   - Click **"Next"**

3. **Add Environment Variables**
   - Follow the steps above to add all required variables
   - Click **"Save"**

4. **Deploy**
   - Click **"Save and deploy"**
   - Amplify will start building your app

### Subsequent Deployments

After the initial setup, deployments are automatic:
- Push to `main` branch triggers automatic deployment
- Build takes approximately 3-5 minutes
- Preview your changes at the Amplify URL

---

## Troubleshooting

### Build Fails with Liveblocks Error

**Error:**
```
Error: Invalid value for field 'secret'. Secret keys must start with 'sk_'.
```

**Solution:**
1. Verify `LIVEBLOCKS_SECRET_KEY` is set in environment variables
2. Ensure the key starts with `sk_prod_` or `sk_dev_`
3. Redeploy the app after adding/updating the variable

### Build Fails with "Authentication failed"

**Error:**
```
Authentication failed: No data returned
```

**Solution:**
1. Check that all required environment variables are set:
   - `LIVEBLOCKS_SECRET_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
2. Verify the values are correct (no extra spaces)
3. Redeploy

### OAuth Redirect URI Mismatch

**Error:**
```
redirect_uri_mismatch
```

**Solution:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add the Amplify URL to **Authorized redirect URIs**:
   ```
   https://your-app.amplifyapp.com/api/auth/callback/google
   ```
4. Save and try again

### ESLint Warnings During Build

**Warning:**
```
Warning: 'variableName' is assigned a value but never used
```

**Solution:**
These are warnings and won't stop the build. To fix:
1. Remove unused variables from the code
2. Or add ESLint ignore comments:
   ```typescript
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const unusedVar = value;
   ```

### Build Timeout

**Error:**
```
Build timed out
```

**Solution:**
1. Check if dependencies are too large
2. Enable dependency caching (already configured in `amplify.yml`)
3. Contact AWS support to increase timeout limit

---

## Environment Variable Security

### Best Practices

1. **Never commit** `.env.local` to version control
2. **Use different keys** for development and production:
   - Development: `sk_dev_...`
   - Production: `sk_prod_...`
3. **Rotate secrets** regularly
4. **Limit access** to AWS Amplify console

### Managing Secrets

- All environment variables in Amplify are encrypted at rest
- Only build processes and the running app can access them
- Use AWS Secrets Manager for highly sensitive data (optional)

---

## Testing Deployment

### After Successful Deployment

1. **Visit Your App**
   - Open the Amplify URL in your browser
   - Example: `https://main.d1234567890abc.amplifyapp.com`

2. **Test Authentication**
   - Click "Sign In"
   - Test Google OAuth login
   - Verify you can access authenticated pages

3. **Test Real-time Features**
   - Create a new text document
   - Test collaborative editing
   - Verify Liveblocks connection works

4. **Check Browser Console**
   - Open Developer Tools (F12)
   - Check for any errors
   - Verify no authentication issues

### Common Issues After Deployment

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| White screen | Build error | Check Amplify build logs |
| Can't sign in | OAuth misconfiguration | Update Google redirect URIs |
| Real-time not working | Liveblocks key issue | Verify environment variables |
| 404 on routes | Build artifacts issue | Check `amplify.yml` config |

---

## Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to **App settings** > **Domain management**
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXTAUTH_URL` to your custom domain
6. Update Google OAuth redirect URIs

### DNS Configuration

Add these records to your DNS provider:

```
Type: CNAME
Name: www (or subdomain)
Value: [provided by Amplify]
```

---

## Monitoring and Logs

### View Build Logs

1. Go to your app in Amplify Console
2. Click on the deployment you want to inspect
3. Expand build phases to see detailed logs

### View Runtime Logs

1. Go to **Monitoring** tab
2. View:
   - Access logs
   - Error logs
   - Performance metrics

### CloudWatch Integration

Amplify automatically sends logs to CloudWatch:
- Build logs: `/aws/amplify/[app-id]`
- Access logs: `/aws/amplify/[app-id]/access`

---

## Performance Optimization

### Enable Caching

Already configured in `amplify.yml`:
- Node modules cached
- Next.js build cache preserved

### Configure CDN

Amplify uses CloudFront CDN automatically:
- Static assets cached at edge locations
- Faster global delivery
- Automatic SSL/TLS

### Monitor Performance

Use Amplify's built-in monitoring:
- Response times
- Error rates
- Traffic patterns

---

## Cost Estimation

### Free Tier

AWS Amplify Free Tier includes:
- 1,000 build minutes per month
- 15 GB data transfer out per month
- 5 GB storage

### Beyond Free Tier

- Build minutes: $0.01 per minute
- Storage: $0.023 per GB per month
- Data transfer: $0.15 per GB

**Estimated monthly cost for XogosBoard:**
- Low traffic: $0-5
- Medium traffic: $5-20
- High traffic: $20-100+

---

## Rollback

### Rollback to Previous Version

1. Go to your app in Amplify Console
2. Find the successful deployment you want to rollback to
3. Click **"Redeploy this version"**
4. Confirm rollback

### Manual Rollback via Git

```bash
# Revert to previous commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

---

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Liveblocks Documentation](https://liveblocks.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## Support

**Build failing?** Check:
1. [BUILD.md](./BUILD.md) - Complete build documentation
2. [Section 13: Troubleshooting](./13-troubleshooting/README.md)
3. AWS Amplify build logs

**Environment issues?** Verify:
1. All required variables are set
2. Values are correct (no typos)
3. Keys start with correct prefixes

---

**Last reviewed:** 2025-12-16
**Next review:** After first successful deployment
