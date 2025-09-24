#!/bin/bash

# 🔒 SSL Setup Script for taleskillz.com
echo "🔒 Setting up SSL certificate for taleskillz.com..."

# Get SSL certificate
certbot --nginx -d taleskillz.com -d www.taleskillz.com --non-interactive --agree-tos --email admin@taleskillz.com

echo "✅ SSL certificate setup completed!"
echo "🌐 Your site is now available at: https://taleskillz.com"
echo "🔒 HTTPS is enabled and secure!"
