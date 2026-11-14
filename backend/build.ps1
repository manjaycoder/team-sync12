# Build Team-Sync Java Spring Boot Backend
Write-Host "Compiling and packaging Team-Sync Backend with Maven..." -ForegroundColor Cyan

if (Get-Command mvn -ErrorAction SilentlyContinue) {
    mvn clean package -DskipTests
} else {
    Write-Host "Running Docker build..." -ForegroundColor Yellow
    docker build -t teamsync-backend:1.0.0 .
}
