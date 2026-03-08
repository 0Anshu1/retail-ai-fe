# Deployment script for Netlify (Windows PowerShell)
# Usage: .\scripts\deploy.ps1

Write-Host "🚀 Preparing for Netlify Deployment..." -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not initialized" -ForegroundColor Red
    Write-Host "Run: git init"
    exit 1
}

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "❌ .gitignore not found" -ForegroundColor Red
    exit 1
}

# Clean up
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

# Check build success
if (-not (Test-Path ".next")) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Git operations
Write-Host "📝 Preparing git commit..." -ForegroundColor Yellow

# Check for uncommitted changes
$gitStatus = git status --porcelain
if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Host "ℹ️  No changes to commit" -ForegroundColor Cyan
} else {
    Write-Host "📋 Changes detected:" -ForegroundColor Cyan
    Write-Host $gitStatus
    Write-Host ""
    
    $response = Read-Host "Commit these changes? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        git add .
        $commitMsg = Read-Host "Enter commit message"
        git commit -m $commitMsg
        
        $pushResponse = Read-Host "Push to remote? (y/n)"
        if ($pushResponse -eq "y" -or $pushResponse -eq "Y") {
            git push origin main
            Write-Host "✅ Pushed to GitHub" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://app.netlify.com"
Write-Host "2. Click 'New site from Git'"
Write-Host "3. Select your GitHub repository"
Write-Host "4. Configure build settings (should auto-detect)"
Write-Host "5. Add environment variables"
Write-Host "6. Deploy!"
Write-Host ""
Write-Host "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan