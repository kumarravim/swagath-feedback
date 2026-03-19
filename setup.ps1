# Swagath Feedback App - Quick Start Setup Script (PowerShell)
# Run: .\setup.ps1 in PowerShell

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🍛 Swagath Customer Feedback App" -ForegroundColor Yellow
Write-Host "Setup & Local Development" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📦 Checking prerequisites..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js v14+" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install http-server globally if not already installed
Write-Host ""
Write-Host "🔧 Setting up development server..." -ForegroundColor Cyan
$httpServer = npm list -g http-server 2>$null | Select-String "http-server"
if ($httpServer) {
    Write-Host "✅ http-server already installed" -ForegroundColor Green
} else {
    Write-Host "📥 Installing http-server globally..." -ForegroundColor Cyan
    npm install -g http-server
    Write-Host "✅ http-server installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 To start local development:" -ForegroundColor Yellow
Write-Host "   1. cd wwwroot_static" -ForegroundColor Gray
Write-Host "   2. http-server -p 8080" -ForegroundColor Gray
Write-Host ""

Write-Host "🌐 Then open in your browser:" -ForegroundColor Yellow
Write-Host "   http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔐 Admin Credentials:" -ForegroundColor Yellow
Write-Host "   Username: supreme" -ForegroundColor Gray
Write-Host "   Password: lakshmi" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 See DEPLOYMENT_GUIDE.md for complete instructions" -ForegroundColor Yellow
Write-Host ""
