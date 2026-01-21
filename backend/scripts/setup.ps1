# Setup Script cho Backend (Windows PowerShell)
# Chạy: .\scripts\setup.ps1

Write-Host "🚀 Starting Backend Setup..." -ForegroundColor Green
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js chưa được cài. Vui lòng cài Node.js >= 18.x" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install multer if not exists
$multerInstalled = npm list multer 2>$null
if (-not $multerInstalled) {
    Write-Host "📦 Installing multer..." -ForegroundColor Yellow
    npm install multer
}

# Create .env if not exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "⚠️  Vui lòng edit file .env và điền MONGODB_URI và JWT_SECRET" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file đã tồn tại" -ForegroundColor Green
}

# Create uploads directory
Write-Host "📁 Creating uploads directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads\avatars" | Out-Null

Write-Host ""
Write-Host "✅ Setup hoàn tất!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Edit file .env với MONGODB_URI và JWT_SECRET"
Write-Host "   2. Chạy: npm run seed (để seed data)"
Write-Host "   3. Chạy: npm run dev (để start server)"
Write-Host ""

