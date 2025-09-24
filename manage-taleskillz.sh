#!/bin/bash

# 🎛️ Management Script for taleskillz.com
cd /var/www/taleskillz.com

case "$1" in
    start)
        echo "🚀 Starting application..."
        pm2 start ecosystem.config.js
        echo "✅ Application started"
        ;;
    stop)
        echo "⏹️ Stopping application..."
        pm2 stop taleskillz
        echo "✅ Application stopped"
        ;;
    restart)
        echo "🔄 Restarting application..."
        pm2 restart taleskillz
        echo "✅ Application restarted"
        ;;
    status)
        echo "📊 Application status:"
        pm2 status
        ;;
    logs)
        echo "📝 Application logs:"
        pm2 logs taleskillz
        ;;
    update)
        echo "🔄 Updating application..."
        git pull origin main
        npm install --production
        npm run build
        pm2 restart taleskillz
        echo "✅ Application updated"
        ;;
    monitor)
        echo "📊 System monitoring:"
        echo "CPU Usage:"
        top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
        echo ""
        echo "Memory Usage:"
        free -h
        echo ""
        echo "Disk Usage:"
        df -h
        echo ""
        echo "Application Status:"
        pm2 status
        ;;
    *)
        echo "🎛️ taleskillz.com Management Script"
        echo "=================================="
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs|update|monitor}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show application status"
        echo "  logs    - Show application logs"
        echo "  update  - Update and restart application"
        echo "  monitor - Show system monitoring"
        echo ""
        echo "Examples:"
        echo "  ./manage-taleskillz.sh start"
        echo "  ./manage-taleskillz.sh status"
        echo "  ./manage-taleskillz.sh logs"
        ;;
esac
