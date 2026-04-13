#!/bin/bash
# Star Chart API Server - Deployment Script
# For Tencent Cloud Server (CentOS 7 / Ubuntu)

set -e

echo "========================================"
echo "  Star Chart API - Server Setup"
echo "========================================"

# Detect OS
if [ -f /etc/redhat-release ]; then
    OS="centos"
elif [ -f /etc/debian_version ]; then
    OS="debian"
else
    echo "[ERROR] Unsupported OS"
    exit 1
fi

echo "[INFO] Detected OS: $OS"

# Install Python 3
if ! command -v python3 &> /dev/null; then
    echo "[INFO] Installing Python 3..."
    if [ "$OS" = "centos" ]; then
        yum install -y python3 python3-pip
    else
        apt update && apt install -y python3 python3-pip
    fi
fi

# Create virtual environment
echo "[INFO] Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "[INFO] Installing dependencies..."
pip install --upgrade pip
pip install flask flask-cors ephem gunicorn

# Create systemd service
echo "[INFO] Creating systemd service..."
sudo tee /etc/systemd/system/starchart-api.service > /dev/null <<EOF
[Unit]
Description=Star Chart API Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 pse_server:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "[INFO] Starting service..."
sudo systemctl daemon-reload
sudo systemctl enable starchart-api
sudo systemctl start starchart-api

# Check status
echo ""
echo "[INFO] Server status:"
sudo systemctl status starchart-api --no-pager

echo ""
echo "========================================"
echo "  Server deployed successfully!"
echo "========================================"
echo ""
echo "API Endpoints:"
echo "  - Health: http://YOUR_SERVER_IP:5000/api/health"
echo "  - Natal: http://YOUR_SERVER_IP:5000/api/natal"
echo ""
echo "Commands:"
echo "  sudo systemctl stop starchart-api   # Stop"
echo "  sudo systemctl restart starchart-api # Restart"
echo "  sudo journalctl -u starchart-api    # View logs"
echo ""
