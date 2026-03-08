# Retail AI - Frontend Deployment Guide

## 📦 Project Overview

This is a Next.js-based retail AI analytics platform with:
- **47 RTSP cameras** integration
- **5 AI recognition models** (Face, Person, Object, Crowd, Behavior)
- **Real-time analytics dashboard**
- **WebRTC streaming** support
- **MongoDB** backend integration

## 🚀 Quick Start - Push to GitHub & Deploy to Netlify

### Step 1: Prepare Your Local Repository

```bash
# Navigate to your project
cd D:\ZEEX-AI\Jeeja-Fashion

# Verify .gitignore is in place
# (should exclude .env.local, node_modules, .next, etc.)

# Clean up
rm -r node_modules .next

# Install fresh dependencies
npm install

# Test build locally
npm run build
```

### Step 2: Push to GitHub

```bash
# Clone the target repository
git clone https://github.com/0Anshu1/retail-ai-fe.git
cd retail-ai-fe

# Copy your code (excluding sensitive files)
# Windows PowerShell:
Copy-Item -Path "..\Jeeja-Fashion\*" -Destination "." -Recurse -Exclude @("node_modules", ".next", ".git", ".env.local")

# Add all files
git add .

# Commit
git commit -m "Initial commit: RTSP camera integration with AI analytics"

# Push
git push origin main
```

### Step 3: Deploy on Netlify

#### Option A: Using Netlify UI (Recommended for Beginners)

1. **Go to Netlify**: https://app.netlify.com
2. **Sign up/Login** with GitHub account
3. **Click "New site from Git"**
4. **Select GitHub** as provider
5. **Authorize Netlify** to access your repositories
6. **Select repository**: `retail-ai-fe`
7. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18
8. **Add environment variables** (see below)
9. **Click "Deploy site"**

#### Option B: Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Follow prompts to connect GitHub repository
```

### Step 4: Configure Environment Variables

In Netlify dashboard:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **Edit variables**
3. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_WEBRTC_SERVER=https://your-webrtc-server.com
```

**Note**: Only add `NEXT_PUBLIC_*` variables (safe for frontend). Backend secrets stay in `.env.local` (not pushed to GitHub).

### Step 5: Verify Deployment

- Netlify provides a URL: `https://your-site-name.netlify.app`
- Test the application:
  - Dashboard: `https://your-site-name.netlify.app/dashboard/cameras`
  - API: `https://your-site-name.netlify.app/api/cameras`

## 📋 What Gets Pushed to GitHub

✅ **Included**:
- All source code (app/, components/, lib/, models/)
- Configuration files (package.json, tsconfig.json, tailwind.config.ts)
- Documentation (README.md, DEPLOYMENT_GUIDE.md)
- Scripts (scripts/)
- Public assets

❌ **Excluded** (via .gitignore):
- `.env.local` (sensitive environment variables)
- `node_modules/` (dependencies)
- `.next/` (build output)
- `.git/` (git metadata)
- IDE files (.vscode/, .idea/)
- OS files (Thumbs.db, .DS_Store)

## 🔐 Security Best Practices

### 1. Environment Variables
```bash
# .env.local (NOT pushed to GitHub)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
RTSP_SERVER_IP=65.1.214.31

# Frontend-safe variables (can be in code)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Sensitive Files
- Never commit `.env.local`
- Never commit API keys or credentials
- Use `.gitignore` to exclude sensitive files

### 3. GitHub Secrets (Optional)
For CI/CD workflows, use GitHub Secrets:
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets for sensitive data
3. Reference in workflows: `${{ secrets.SECRET_NAME }}`

## 🔄 Continuous Deployment

### Auto-Deploy on Push
```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push origin main

# Netlify automatically deploys
# Monitor at: https://app.netlify.com/sites/your-site/deploys
```

### Deploy Previews
- Every pull request gets a preview URL
- Test changes before merging
- Share with team for review

### Rollback
1. Go to Netlify **Deploys** tab
2. Find previous deployment
3. Click **Publish deploy** to rollback

## 📊 Monitoring & Analytics

### Netlify Dashboard
- **Deploys**: View deployment history and logs
- **Analytics**: Monitor traffic and performance
- **Functions**: Manage serverless functions
- **Notifications**: Set up alerts

### Performance Optimization
- Netlify CDN automatically caches static assets
- Next.js automatic code splitting
- Image optimization with next/image
- Compression enabled by default

## 🚨 Troubleshooting

### Build Fails
```bash
# Check build logs in Netlify dashboard
# Common issues:
# 1. Missing environment variables
# 2. Node version mismatch
# 3. Dependency conflicts

# Fix locally:
npm install
npm run build
```

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings on backend
- Ensure backend is accessible from Netlify

### WebRTC Not Working
- WebRTC server must be accessible from Netlify
- Update `NEXT_PUBLIC_WEBRTC_SERVER` environment variable
- Check firewall and CORS settings

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment/netlify
- **GitHub Docs**: https://docs.github.com
- **Environment Variables**: https://docs.netlify.com/configure-builds/environment-variables/

## 🎯 Deployment Checklist

- [ ] Code pushed to GitHub (without sensitive files)
- [ ] Netlify site created and connected to GitHub
- [ ] Build settings configured correctly
- [ ] Environment variables added
- [ ] Deployment successful (green checkmark)
- [ ] Site accessible at Netlify URL
- [ ] Camera dashboard loads correctly
- [ ] API endpoints respond properly
- [ ] Custom domain configured (optional)
- [ ] Monitoring and alerts enabled

## 💡 Tips

1. **Test locally first**: `npm run build && npm run start`
2. **Use preview deployments**: Test PRs before merging
3. **Monitor logs**: Check Netlify logs for errors
4. **Set up notifications**: Get alerts on deployment status
5. **Use custom domain**: Makes your site more professional
6. **Enable analytics**: Track user engagement

## 🤝 Team Collaboration

### Invite Team Members
1. Go to Netlify **Team** settings
2. Click **Invite team member**
3. Enter email address
4. Set permissions (Admin, Developer, Viewer)

### GitHub Collaboration
1. Add collaborators to GitHub repository
2. Set branch protection rules
3. Require pull request reviews
4. Use GitHub Issues for tracking

## 📞 Support

- **Netlify Support**: https://support.netlify.com
- **GitHub Support**: https://support.github.com
- **Next.js Community**: https://github.com/vercel/next.js/discussions

---

**Happy Deploying! 🚀**