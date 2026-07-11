# LakMarket - Start Script
Write-Host "Starting LakMarket..." -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# IP барои телефон (ҳамон Wi-Fi)
$lanIp = (
  Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
  Where-Object { $_.IPAddress -notmatch '^127\.' -and $_.IPAddress -notmatch '^169\.254\.' } |
  Select-Object -First 1
).IPAddress
if (-not $lanIp) { $lanIp = "192.168.x.x" }

foreach ($port in 3000, 3001, 3002) {
    $conn = netstat -ano | Select-String ":$port.*LISTENING"
    if ($conn) {
        $processId = ($conn -replace '\s+', ' ').Split(' ')[-1]
        if ($processId -match '^\d+$') {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped old process on port $port" -ForegroundColor Yellow
        }
    }
}

Start-Sleep -Seconds 1

Write-Host "Starting Backend (port 3001, LAN)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; npm run start:dev"

Start-Sleep -Seconds 5

Write-Host "Starting Frontend (port 3000, LAN)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Start-Sleep -Seconds 3

Write-Host "Starting Admin Panel (port 3002, LAN)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\admin-panel'; npm run dev"

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  LakMarket is starting!" -ForegroundColor White
Write-Host "  Marketplace: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  Admin Panel: http://localhost:3002" -ForegroundColor Magenta
Write-Host "  Phone:       http://${lanIp}:3000" -ForegroundColor Green
Write-Host "  API:         http://${lanIp}:3001/api" -ForegroundColor Yellow
Write-Host "  Admin login: admin@marketplace.com" -ForegroundColor Gray
Write-Host "  Pass:        password123" -ForegroundColor Gray
Write-Host "======================================" -ForegroundColor Cyan
