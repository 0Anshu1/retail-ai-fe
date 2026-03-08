#!/bin/bash

# Deployment script for Netlify
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Preparing for Netlify Deployment..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "❌ .gitignore not found"
    exit 1
fi

# Clean up
echo "🧹 Cleaning up..."
rm -rf node_modules .next dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build
echo "🔨 Building application..."
npm run build

# Check build success
if [ ! -d ".next" ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Git operations
echo "📝 Preparing git commit..."

# Check for uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  No changes to commit"
else
    echo "📋 Changes detected:"
    git status --short
    echo ""
    
    read -p "Commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        
        read -p "Push to remote? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push origin main
            echo "✅ Pushed to GitHub"
        fi
    fi
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Select your GitHub repository"
echo "4. Configure build settings (should auto-detect)"
echo "5. Add environment variables"
echo "6. Deploy!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"