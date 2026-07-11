# Deploy helper - GitHub + Vercel/Render/Neon setup
# Run: .\deploy.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  Marketplace - Deploy Setup"
Write-Host "========================================"
Write-Host ""

Set-Location $root
if (-not (Test-Path ".git")) {
    Write-Host "[1/3] Git init..."
    git init
    git branch -M main
    Write-Host "  OK: git repository created"
} else {
    Write-Host "[1/3] Git already initialized"
}

$status = git status --porcelain 2>$null
if ($status) {
    Write-Host "[2/3] Creating commit..."
    git add .
    git -c user.email="deploy@marketplace.local" -c user.name="Marketplace Deploy" commit -m "Prepare production deploy (Vercel + Render + Neon)"
    Write-Host "  OK: commit created"
} else {
    Write-Host "[2/3] No changes to commit"
}

Write-Host "[3/3] Next steps - need your accounts:"
Write-Host ""
Write-Host "  A) GitHub - create repo and push:"
Write-Host "     https://github.com/new"
Write-Host "     git remote add origin https://github.com/YOUR_USER/marketplace-app.git"
Write-Host "     git push -u origin main"
Write-Host ""
Write-Host "  B) Neon - PostgreSQL:"
Write-Host "     https://console.neon.tech"
Write-Host "     Copy DATABASE_URL"
Write-Host ""
Write-Host "  C) Render - backend API:"
Write-Host "     https://dashboard.render.com/blueprints"
Write-Host "     New Blueprint Instance -> select repo"
Write-Host "     Set DATABASE_URL and ALLOWED_ORIGINS"
Write-Host ""
Write-Host "  D) Vercel - frontend, root folder: frontend"
Write-Host "     https://vercel.com/new"
Write-Host ""
Write-Host "  E) Vercel - admin, root folder: admin-panel"
Write-Host "     https://vercel.com/new"
Write-Host ""
Write-Host "  F) Seed DB once from PC:"
Write-Host "     cd backend"
Write-Host '     $env:DB_TYPE="postgres"; $env:DATABASE_URL="NEON_URL"; npm run seed'
Write-Host ""
Write-Host "  Full guide: DEPLOY.md"
Write-Host "========================================"
Write-Host ""
