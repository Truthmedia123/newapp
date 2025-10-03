@echo off
echo Checking if Docker is installed...
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo Docker found. Starting Meilisearch in Docker container with correct master key...
    docker run -d -p 7700:7700 -e MEILI_MASTER_KEY=sp7MZNSdzPOgs_LJi9xux51hJfnX2RMtjt10B8b9qSY --name meilisearch-container getmeili/meilisearch:v1.10
    echo Meilisearch is starting in the background...
    echo Access the dashboard at: http://localhost:7700
    echo Use this master key when prompted: sp7MZNSdzPOgs_LJi9xux51hJfnX2RMtjt10B8b9qSY
) else (
    echo Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo After installing Docker, run this script again to start Meilisearch.
    pause
)