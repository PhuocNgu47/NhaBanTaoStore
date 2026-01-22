#!/bin/bash

echo "========================================"
echo "   NHA BAN TAO STORE - Docker Helper"
echo "========================================"
echo ""

case "$1" in
  build)
    echo "[*] Building Docker images..."
    docker-compose build
    echo "[OK] Build completed!"
    ;;
    
  start)
    echo "[*] Starting containers..."
    docker-compose up -d
    echo ""
    echo "[OK] Containers started!"
    echo ""
    echo "  Frontend: http://localhost"
    echo "  Backend:  http://localhost:5001/api"
    echo ""
    ;;
    
  stop)
    echo "[*] Stopping containers..."
    docker-compose down
    echo "[OK] Containers stopped!"
    ;;
    
  restart)
    echo "[*] Restarting containers..."
    docker-compose restart
    echo "[OK] Containers restarted!"
    ;;
    
  logs)
    if [ -z "$2" ]; then
      echo "[*] Showing all logs..."
      docker-compose logs -f
    else
      echo "[*] Showing $2 logs..."
      docker-compose logs -f "$2"
    fi
    ;;
    
  seed)
    echo "[*] Running seed script..."
    docker-compose exec backend node seed.js
    echo "[OK] Seed completed!"
    ;;
    
  clean)
    echo "[*] Cleaning up..."
    docker-compose down -v --rmi all
    echo "[OK] Cleanup completed!"
    ;;
    
  status)
    echo "[*] Container status:"
    docker-compose ps
    ;;
    
  *)
    echo "Usage: ./docker-helper.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build     Build Docker images"
    echo "  start     Start all containers"
    echo "  stop      Stop all containers"
    echo "  restart   Restart all containers"
    echo "  logs      Show logs (add service name for specific logs)"
    echo "  seed      Run database seed script"
    echo "  status    Show container status"
    echo "  clean     Remove all containers, volumes, and images"
    echo ""
    echo "Examples:"
    echo "  ./docker-helper.sh build"
    echo "  ./docker-helper.sh start"
    echo "  ./docker-helper.sh logs backend"
    echo ""
    ;;
esac
