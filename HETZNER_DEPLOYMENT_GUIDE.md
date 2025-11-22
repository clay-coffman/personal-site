# Hetzner Server Deployment Guide - Docker Version

## Overview

This guide covers deploying your Flask personal site using Docker on your Hetzner Fedora server, alongside your existing services (Nextcloud, Calibre-web).

## Prerequisites

- Hetzner server running Fedora
- SSH access to the server
- Docker and Docker Compose installed
- Existing services (Nextcloud, Calibre-web) running

## Directory Structure

```
/opt/personal-site/
├── app.py                 # Main Flask application
├── config.py             # Configuration
├── extensions.py         # Flask extensions
├── docker-compose.yml    # Docker orchestration
├── Dockerfile           # Container definition
├── nginx.conf           # Nginx configuration
├── pyproject.toml       # Python dependencies (UV)
├── .env                 # Environment variables (create this)
├── data/                # Persistent data
│   └── database.db      # SQLite database
├── static/              # Static files (CSS, JS, images)
├── templates/           # HTML templates
├── routes/              # Flask blueprints
├── models/              # Database models
└── migrations/          # Database migration scripts
```

## Step 1: Server Preparation

### 1.1 Connect to your server
```bash
ssh root@YOUR_SERVER_IP
# or if using non-root user
ssh your_user@YOUR_SERVER_IP
```

### 1.2 Install Docker on Fedora (if not installed)
```bash
# Update system
sudo dnf update -y

# Install Docker
sudo dnf install docker docker-compose -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, for non-root)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

### 1.3 Configure firewall (if using firewalld)
```bash
# Check if firewalld is running
sudo systemctl status firewalld

# If running, allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Step 2: Deploy the Application

### 2.1 Create application directory
```bash
sudo mkdir -p /opt/personal-site
cd /opt/personal-site
```

### 2.2 Clone the repository
```bash
# Clone your repository
git clone https://github.com/clay-coffman/personal-site.git .

# Or if already cloned, pull latest changes
git pull origin main
```

### 2.3 Create environment configuration
```bash
# Create .env file with production values
cat > .env << 'EOF'
SECRET_KEY=your-very-secure-production-secret-key-here
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
DATABASE_URL=sqlite:////app/data/database.db
FLASK_ENV=production
EOF

# Secure the file
chmod 600 .env
```

### 2.4 Create data directory
```bash
mkdir -p data
# Set appropriate permissions
chmod 755 data
```

## Step 3: Configure for Existing Services

Since you have Nextcloud and Calibre-web already running, we need to configure ports appropriately.

### Option A: Use Different Ports (Recommended for Testing)

Edit `docker-compose.yml`:
```yaml
services:
  web:
    ports:
      - "127.0.0.1:5001:5000"  # Only accessible locally
  nginx:
    ports:
      - "8080:80"  # Different port to avoid conflicts
```

### Option B: Integrate with Existing Nginx/Apache

If you have nginx or Apache already serving Nextcloud/Calibre-web:

1. **Modify docker-compose.yml** to only expose Flask internally:
```yaml
services:
  web:
    ports:
      - "127.0.0.1:5001:5000"
  # Comment out or remove the nginx service entirely
  # nginx:
  #   ...
```

2. **Configure your main nginx/Apache** to proxy to the Flask container:

For nginx, add to `/etc/nginx/sites-available/personal-site`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Serve static files directly (optional, for better performance)
    location /static {
        alias /opt/personal-site/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/personal-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: Build and Run with Docker

### 4.1 Build the Docker image
```bash
cd /opt/personal-site
docker compose build
```

### 4.2 Start the containers
```bash
# Start in detached mode
docker compose up -d

# Or to see logs during startup
docker compose up
```

### 4.3 Verify deployment
```bash
# Check container status
docker compose ps

# Check logs
docker compose logs -f

# Test locally
curl http://localhost:5001/api/health

# If using port 8080 for nginx container
curl http://localhost:8080
```

## Step 5: SSL Configuration (Production)

### 5.1 Using Certbot with existing nginx
```bash
# Install certbot on Fedora
sudo dnf install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
sudo systemctl status certbot-renew.timer
```

### 5.2 Update nginx config for SSL
Certbot will automatically update your nginx configuration. Verify with:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Set Up Auto-start

### 6.1 Ensure containers restart on reboot
The `docker-compose.yml` already includes `restart: unless-stopped` for services.

### 6.2 Create systemd service (optional, for better control)
```bash
# Create service file
sudo tee /etc/systemd/system/personal-site.service << 'EOF'
[Unit]
Description=Personal Site Docker Compose Application
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/personal-site
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable personal-site.service
sudo systemctl start personal-site.service
```

## Step 7: Database Management

### 7.1 Initial database setup
The database is created automatically on first run. Location: `/opt/personal-site/data/database.db`

### 7.2 Backup database
```bash
# Create backup
cp /opt/personal-site/data/database.db /opt/personal-site/data/database.db.backup-$(date +%Y%m%d)

# Or from within container
docker compose exec web cp /app/data/database.db /app/data/database.db.backup
```

### 7.3 Restore database
```bash
# Stop containers
docker compose down

# Restore backup
cp /opt/personal-site/data/database.db.backup /opt/personal-site/data/database.db

# Start containers
docker compose up -d
```

## Maintenance Commands

### Update application
```bash
cd /opt/personal-site
git pull origin main
docker compose build
docker compose up -d
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f web

# Last 100 lines
docker compose logs --tail=100 web
```

### Restart services
```bash
docker compose restart

# Or specific service
docker compose restart web
```

### Enter container shell
```bash
docker compose exec web /bin/sh
```

### Check resource usage
```bash
docker stats personal-site
```

### Clean up unused Docker resources
```bash
docker system prune -a --volumes
```

## Monitoring & Health Checks

### Check application health
```bash
# From server
curl http://localhost:5001/api/health

# From outside (if configured)
curl https://yourdomain.com/api/health
```

### Monitor with systemctl (if using systemd service)
```bash
sudo systemctl status personal-site
sudo journalctl -u personal-site -f
```

## Troubleshooting

### Port conflicts
```bash
# Check what's using a port
sudo ss -tulpn | grep :80
sudo lsof -i :5001
```

### SELinux issues (Fedora specific)
```bash
# Check SELinux status
getenforce

# If issues, temporarily set to permissive to test
sudo setenforce 0

# For permanent fix, create appropriate contexts
sudo chcon -R -t container_file_t /opt/personal-site
```

### Firewall issues
```bash
# Check firewall status
sudo firewall-cmd --list-all

# Add specific port if needed
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### Container won't start
```bash
# Check detailed logs
docker compose logs web --tail=50

# Check Docker daemon
sudo systemctl status docker

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Permission issues with database
```bash
# Fix permissions
sudo chown -R 1000:1000 /opt/personal-site/data
```

## Integration with Existing Services

Your server structure might look like:
```
/opt/
├── nextcloud/          # Existing Nextcloud
├── calibre-web/        # Existing Calibre-web
└── personal-site/      # New Flask site

/etc/nginx/sites-enabled/
├── nextcloud           # Proxy to Nextcloud
├── calibre             # Proxy to Calibre-web
└── personal-site       # Proxy to Flask app
```

Each service runs in its own Docker container or process, with nginx routing traffic based on domain/subdomain.

## Security Recommendations

1. **Use strong passwords** in .env file
2. **Regular updates**:
   ```bash
   sudo dnf update -y
   docker compose pull
   docker compose up -d
   ```
3. **Backup regularly**: Set up automated backups of `/opt/personal-site/data/`
4. **Monitor logs**: Check logs regularly for suspicious activity
5. **Use fail2ban**: Consider installing fail2ban for brute force protection
6. **Restrict SSH**: Use key-based authentication only

## Quick Deployment Script

Create `/opt/personal-site/deploy.sh`:
```bash
#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull origin main

echo "Building Docker images..."
docker compose build

echo "Stopping old containers..."
docker compose down

echo "Starting new containers..."
docker compose up -d

echo "Checking health..."
sleep 5
curl -f http://localhost:5001/api/health || exit 1

echo "Deployment complete!"
docker compose ps
```

Make it executable:
```bash
chmod +x /opt/personal-site/deploy.sh
```

## Support Resources

- Docker documentation: https://docs.docker.com/
- Flask documentation: https://flask.palletsprojects.com/
- Fedora documentation: https://docs.fedoraproject.org/
- Your repository: https://github.com/clay-coffman/personal-site

## Notes

- The application uses SQLite for simplicity. For high traffic, consider PostgreSQL.
- Static files are served by nginx in production for better performance.
- The UV package manager is used for faster Python dependency installation.
- Health check endpoint: `/api/health` for monitoring tools.