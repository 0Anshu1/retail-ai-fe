# ⚡ Quick Deploy - 5 Minutes to Production

## 🎯 TL;DR - Just Do This

### 1. Push to GitHub (2 minutes)
```powershell
# Clone target repo
git clone https://github.com/0Anshu1/retail-ai-fe.git
cd retail-ai-fe

# Copy your code
Copy-Item -Path "..\Jeeja-Fashion\*" -Destination "." -Recurse -Exclude @("node_modules", ".next", ".git", ".env.local")

# Push
git add .
git commit -m "Initial commit: RTSP camera integration"
git push origin main
```

### 2. Deploy on Netlify (3 minutes)
1. Go to https://app.netlify.com
2. Click **"New site from Git"**
3. Select **GitHub** → **retail-ai-fe**
4. Build settings auto-detect (just click deploy)
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```
6. Click **"Deploy site"**

### 3. Done! 🎉
Your site is live at: `https://your-site-name.netlify.app`

---

## 📋 Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created
- [ ] Build successful (green checkmark)
- [ ] Environment variables added
- [ ] Site accessible and working

---

## 🔗 Important Links

| Task | Link |
|------|------|
| GitHub Repo | https://github.com/0Anshu1/retail-ai-fe |
| Netlify Dashboard | https://app.netlify.com |
| Your Site | https://your-site-name.netlify.app |
| Deployment Logs | Netlify Dashboard → Deploys |

---

## ⚠️ Don't Forget

- ✅ `.gitignore` excludes `.env.local`
- ✅ Only push source code, not `node_modules` or `.next`
- ✅ Add `NEXT_PUBLIC_*` variables in Netlify
- ✅ Backend secrets stay in `.env.local` (not pushed)

---

## 🆘 If Something Goes Wrong

| Issue | Solution |
|-------|----------|
| Build fails | Check Netlify logs → Fix locally → Push again |
| API calls fail | Verify `NEXT_PUBLIC_API_URL` environment variable |
| Site shows 404 | Check publish directory is `.next` |
| Slow performance | Clear Netlify cache → Redeploy |

---

## 📞 Need Help?

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Docs**: https://docs.github.com

---

**That's it! Your app is now live on Netlify with automatic deployments on every push to main branch.** 🚀