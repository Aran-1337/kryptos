#!/bin/bash
# AWS EC2 Automated Deployment Script for Mnasa Platform Backend

echo "🚀 Starting AWS EC2 Setup for Mnasa Backend..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 & Nginx & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PM2 process manager globally
sudo npm install -g pm2

# Navigate to backend directory
cd "$(dirname "$0")"

# Install backend dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Start application using PM2 Cluster mode
echo "⚙️ Starting Mnasa Backend via PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup | tail -n 1 | sudo bash

# Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx Reverse Proxy..."
sudo tee /etc/nginx/sites-available/mnasa-backend > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/mnasa-backend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl restart nginx

echo "✅ AWS EC2 Deployment Complete! Backend is live on port 80 & 5000 🚀"
