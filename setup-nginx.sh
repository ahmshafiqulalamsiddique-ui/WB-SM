#!/bin/bash

# 🌐 Nginx Configuration Script for taleskillz.com

echo "🌐 Setting up Nginx for taleskillz.com"
echo "====================================="

# Create Nginx configuration
echo "📝 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/taleskillz.com << 'EOF'
server {
    listen 80;
    server_name taleskillz.com www.taleskillz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
echo "🔗 Enabling site..."
ln -sf /etc/nginx/sites-available/taleskillz.com /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    systemctl restart nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Nginx configuration error"
    exit 1
fi

echo ""
echo "✅ Nginx setup completed!"
echo ""
echo "📋 Next step: Get SSL certificate"
echo "Run: certbot --nginx -d taleskillz.com -d www.taleskillz.com"
