# Deployment Guide - Netlify

## 📋 Prerequisites

- GitHub account with access to https://github.com/0Anshu1/retail-ai-fe.git
- Netlify account (free tier available at https://netlify.com)
- Node.js 18+ installed locally
- Git installed and configured

## 🚀 Step 1: Prepare Code for Deployment

### 1.1 Clean Up Local Repository
```bash
# Remove node_modules and build artifacts
rm -r node_modules .next dist

# Install fresh dependencies
npm install

# Build locally to test
npm run build
```

### 1.2 Verify .gitignore
The `.gitignore` file is already created and includes:
- `.env.local` (sensitive environment variables)
- `node_modules/`
- `.next/` build directory
- Database files
- IDE and OS files

## 🔄 Step 2: Push Code to GitHub

### 2.1 Clone the Repository
```bash
git clone https://github.com/0Anshu1/retail-ai-fe.git
cd retail-ai-fe
```

### 2.2 Copy Your Code
```bash
# Copy all files from your current project to the cloned repo
# (excluding node_modules and .next)

# On Windows PowerShell:
Copy-Item -Path "D:\ZEEX-AI\Jeeja-Fashion\*" -Destination ".\retail-ai-fe\" -Recurse -Exclude @("node_modules", ".next", ".git")

# On macOS/Linux:
cp -r /path/to/Jeeja-Fashion/* ./retail-ai-fe/ --exclude=node_modules --exclude=.next --exclude=.git
```

### 2.3 Initialize Git and Push
```bash
cd retail-ai-fe

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Initial commit: RTSP camera integration with AI analytics"

# Push to main branch
git push origin main
```

### 2.4 Verify on GitHub
Visit https://github.com/0Anshu1/retail-ai-fe to confirm files are pushed (without sensitive data)

## 🌐 Step 3: Deploy on Netlify

### 3.1 Connect GitHub to Netlify

1. Go to https://app.netlify.com
2. Click **"New site from Git"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select repository: **retail-ai-fe**
6. Click **"Connect"**

### 3.2 Configure Build Settings

Netlify should auto-detect Next.js configuration. Verify:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 (or higher)

If not auto-detected, set manually:
1. Click **"Site settings"**
2. Go to **"Build & deploy"** → **"Build settings"**
3. Update the values above

### 3.3 Set Environment Variables

1. Go to **Site settings** → **"Build & deploy"** → **"Environment"**
2. Click **"Edit variables"**
3. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
MONGODB_URI=your-mongodb-connection-string
WEBRTC_SERVER_URL=https://your-webrtc-server.com
```

**Important**: Only add `NEXT_PUBLIC_*` variables that are safe to expose in frontend code.

### 3.4 Trigger Deployment

1. Click **"Deploy site"**
2. Netlify will:
   - Clone your repository
   - Install dependencies
   - Run `npm run build`
   - Deploy to CDN

3. Wait for deployment to complete (usually 2-5 minutes)

## ✅ Step 4: Verify Deployment

### 4.1 Check Deployment Status
- Netlify dashboard shows deployment progress
- Green checkmark = successful deployment
- Click on the deployment to see logs

### 4.2 Access Your Site
- Netlify provides a URL like: `https://your-site-name.netlify.app`
- Test the application:
  - Camera dashboard: `/dashboard/cameras`
  - Analytics: `/dashboard/analytics`
  - Login: `/login`

### 4.3 Test Key Features
```bash
# Test API endpoints
curl https://your-site-name.netlify.app/api/cameras

# Test camera dashboard
# Visit: https://your-site-name.netlify.app/dashboard/cameras
```

## 🔧 Step 5: Configure Custom Domain (Optional)

1. Go to **Site settings** → **"Domain management"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `cameras.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## 🔐 Step 6: Enable HTTPS

Netlify automatically provides HTTPS with Let's Encrypt:
- All sites get free SSL certificate
- Auto-renewal enabled
- Redirects HTTP to HTTPS

## 📊 Step 7: Monitor Deployment

### 7.1 View Logs
1. Go to **"Deploys"** tab
2. Click on any deployment
3. View build logs and errors

### 7.2 Set Up Notifications
1. Go to **"Site settings"** → **"Notifications"**
2. Add email notifications for:
   - Deploy succeeded
   - Deploy failed
   - Deploy preview ready

### 7.3 Enable Analytics
1. Go to **"Analytics"** tab
2. View traffic, performance metrics
3. Monitor user engagement

## 🔄 Step 8: Continuous Deployment

### 8.1 Auto-Deploy on Push
- Netlify automatically deploys when you push to main branch
- No additional configuration needed

### 8.2 Deploy Previews
- Every pull request gets a preview URL
- Test changes before merging
- Share preview with team

### 8.3 Rollback Deployment
1. Go to **"Deploys"** tab
2. Find previous deployment
3. Click **"Publish deploy"** to rollback

## 🚨 Troubleshooting

### Build Fails
```bash
# Check build logs in Netlify dashboard
# Common issues:
# 1. Missing environment variables
# 2. Node version mismatch
# 3. Dependency conflicts

# Fix locally first:
npm install
npm run build
```

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings on backend
- Ensure backend is accessible from Netlify

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB network access settings
- Ensure IP whitelist includes Netlify servers

### WebRTC Not Working
- WebRTC server must be accessible from Netlify
- Update `WEBRTC_SERVER_URL` environment variable
- Check firewall and CORS settings

## 📝 Environment Variables Reference

### Frontend-Safe Variables (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WEBRTC_SERVER=https://webrtc.yourdomain.com
NEXT_PUBLIC_APP_NAME=Retail AI
```

### Backend Variables (Not exposed to frontend)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
RTSP_SERVER_IP=65.1.214.31
```

## 🎯 Post-Deployment Checklist

- [ ] Site is accessible at Netlify URL
- [ ] Camera dashboard loads all 47 cameras
- [ ] Model selection works
- [ ] Analytics dashboard displays correctly
- [ ] API endpoints respond properly
- [ ] Environment variables are set
- [ ] HTTPS is enabled
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring and alerts enabled
- [ ] Team has access to Netlify dashboard

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Help**: https://docs.github.com
- **Netlify Support**: https://support.netlify.com

## 🔄 Future Updates

To deploy updates:

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main

# Netlify automatically deploys
# Monitor deployment in Netlify dashboard
```

That's it! Your application is now deployed on Netlify with continuous deployment enabled.