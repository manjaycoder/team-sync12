# Run Team-Sync Java Spring Boot Backend Locally
param(
    [string]$Port = "5001",
    [string]$MongoUri = "mongodb://localhost:27017/team-sync",
    [string]$GeminiKey = ""
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 Starting Team-Sync Java 21 Spring Boot 3 Backend" -ForegroundColor Green
Write-Host " 🌐 Port: $Port" -ForegroundColor Yellow
Write-Host " 📦 Mongo URI: $MongoUri" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$env:PORT = $Port
$env:MONGO_URI = $MongoUri
if ($GeminiKey -ne "") { $env:GEMINI_API_KEY = $GeminiKey }

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    mvn spring-boot:run
} else {
    Write-Host "Maven not found in PATH. Building and running via Docker..." -ForegroundColor Yellow
    docker compose up --build backend
}
