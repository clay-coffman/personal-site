# Server Deployment Quick Guide

## Your Current Setup
- **Nextcloud AIO**: Running with Apache on ports 80/443
- **Calibre-web**: Running in Docker
- **Personal Site**: Will run on port 8082

## Deployment Steps

1. **Stop any running personal-site containers:**
```bash
cd /opt/personal-site
docker compose down
docker compose -f docker-compose.prod.yml down
```

2. **Pull latest code:**
```bash
git pull origin main
```

3. **Run with the server configuration:**
```bash
docker compose -f docker-compose.server.yml up -d
```

## Access Your Site

### Direct Access (Simplest)
Your site will be available at:
- `http://YOUR_SERVER_IP:8082`

### With Domain (Using Nextcloud's Apache as Reverse Proxy)

If Nextcloud AIO is handling your domains, you can add a reverse proxy configuration.

1. **Find Nextcloud's Apache config:**
```bash
docker exec -it nextcloud-aio-apache bash
# Look for config files in /etc/apache2/sites-enabled/
```

2. **Or use a separate reverse proxy container:**
Create `docker-compose.proxy.yml`:
```yaml
services:
  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    ports:
      - "8080:80"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
```

## Port Mapping Summary

| Service | Port | URL |
|---------|------|-----|
| Nextcloud | 80/443 | https://nextcloud.yourdomain.com |
| Calibre-web | (check with `docker ps`) | http://YOUR_IP:PORT |
| Personal Site | 8082 | http://YOUR_IP:8082 |

## Checking Port Usage

```bash
# See all listening ports
sudo ss -tulpn

# Check specific port
sudo lsof -i :8082
```

## Firewall (if needed)

```bash
# Open port 8082
sudo firewall-cmd --permanent --add-port=8082/tcp
sudo firewall-cmd --reload
```

## Troubleshooting

If port 8082 is taken, edit `docker-compose.server.yml` and change to another port like 8083, 8084, etc.

## Monitor

```bash
# Check logs
docker compose -f docker-compose.server.yml logs -f

# Check health
curl http://localhost:8082/api/health
```