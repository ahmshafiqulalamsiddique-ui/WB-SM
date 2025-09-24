# WB-SM GitHub Sync Script
Write-Host "🔄 Syncing WB-SM project to GitHub..." -ForegroundColor Green
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not in a git repository. Please run this from the project root." -ForegroundColor Red
    exit 1
}

# Add all changes
Write-Host "📁 Adding all changes..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "ℹ️  No changes to commit." -ForegroundColor Blue
    exit 0
}

# Commit changes
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Auto-sync: $timestamp"

# Push to GitHub
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Sync completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Repository: https://github.com/ahmshafiqulalamsiddique-ui/WB-SM" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Sync failed. Please check the error messages above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
