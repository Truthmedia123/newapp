@echo off
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker found. Starting Meilisearch in Docker container...
    docker run -it --rm -p 7700:7700 -e MEILI_MASTER_KEY=dev-key getmeili/meilisearch:v1.10
) else (
    echo Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo After installing Docker, run this script again to start Meilisearch.
    pause
)