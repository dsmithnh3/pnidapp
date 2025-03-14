# Production Deployment Guide

This guide provides step-by-step instructions for deploying the PNID App to a production environment.

## Deployment Options

The PNID App can be deployed in two main ways:

1. **Manual Deployment**: Setting up and configuring on your own server
2. **Automated Deployment**: Using the CI/CD pipeline with GitHub Actions

## Prerequisites

- A Linux server with SSH access
- Docker and Docker Compose installed on the server
- Domain name (optional but recommended)
- Docker Hub account (for CI/CD pipeline)
- Production Supabase instance (can be self-hosted or using Supabase Cloud)
- OpenAI API key with sufficient quota
- Resend API key for email functionality

## Option 1: Manual Deployment

### 1. Server Preparation

```bash
# Update server packages
sudo apt update
sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin

# Create deployment directory
sudo mkdir -p /opt/pnidapp
sudo chown $USER:$USER /opt/pnidapp
cd /opt/pnidapp
```

### 2. Application Setup

```bash
# Clone the repository
git clone https://github.com/cronwell-ai/pnid-app.git .

# Copy production Docker Compose file
cp docker-compose.prod.yml docker-compose.yml

# Create production environment file
cp .env.production.example .env.production
```

Edit the `.env.production` file with your production values:

```bash
nano .env.production
```

Important settings to configure:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `NEXT_PUBLIC_EXTERNAL_IP`: Your server domain name
- `NEXT_PUBLIC_SITE_URL`: Full URL with https
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `SUPABASE_SERVICE_KEY`: Supabase service key
- `OPENAI_API_KEY`: Your OpenAI API key
- `RESEND_API_KEY`: Your Resend API key

### 3. Building and Starting the Application

```bash
# Build and start the application
docker compose build
docker compose up -d
```

### 4. Verify Deployment

```bash
# Check if all containers are running
docker compose ps

# Check logs for any errors
docker compose logs
```

Visit your domain or server IP to verify the application is working:
- Main application: `http://<your-server-ip>:3000`
- Metadata parser: `http://<your-server-ip>:7123`
- PDF export: `http://<your-server-ip>:6123`

## Option 2: Automated Deployment with CI/CD

### 1. Server Preparation

Follow the same server preparation steps as in Option 1 up to creating the deployment directory.

### 2. CI/CD Setup

1. **Configure GitHub Repository Secrets**:
   - Go to your repository on GitHub
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `DOCKERHUB_USERNAME`: Your Docker Hub username
     - `DOCKERHUB_TOKEN`: Your Docker Hub access token
     - `DEPLOY_HOST`: Your server IP or hostname
     - `DEPLOY_USER`: SSH username for your server
     - `DEPLOY_KEY`: SSH private key for authentication
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
     - `RESEND_API_KEY`: Your Resend API key
     - `OPENAI_API_KEY`: Your OpenAI API key

2. **Set Up SSH Access**:
   - Generate a new SSH key pair for deployment
   - Add the public key to the server's authorized_keys
   - Add the private key to GitHub secrets as `DEPLOY_KEY`

3. **Prepare Production Server**:
   ```bash
   # On the server
   cd /opt/pnidapp
   
   # Copy and configure production files
   cp .env.production.example .env.production
   nano .env.production  # Edit with your production values
   ```

4. **Push to the Main Branch**:
   ```bash
   # On your local machine
   git push origin main
   ```

5. **Verify Workflow Execution**:
   - Go to your repository on GitHub
   - Navigate to Actions tab
   - Check if the workflow is running and completes successfully

### 3. Verify Deployment

After the CI/CD pipeline completes:

```bash
# SSH into your server
ssh your-username@your-server

# Check container status
cd /opt/pnidapp
docker compose ps

# Check logs for any issues
docker compose logs
```

Visit your domain or server IP to verify the application is working as expected.

## Setting Up HTTPS with Nginx Proxy

For production deployments, it's recommended to use HTTPS. This can be accomplished with Nginx and Let's Encrypt:

### 1. Install Nginx and Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Configure Nginx

Create a configuration file:

```bash
sudo nano /etc/nginx/sites-available/pnid-app
```

Add the following configuration:

```nginx
server {
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /metadata/ {
        proxy_pass http://localhost:7123/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /pdf-export/ {
        proxy_pass http://localhost:6123/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/pnid-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Set Up HTTPS with Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com
```

Follow the prompts to complete the HTTPS setup.

## Backups and Maintenance

### Database Backups

Set up regular Supabase database backups:

```bash
# For self-hosted Supabase
cd /path/to/supabase
supabase db dump > backup-$(date +%Y%m%d).sql

# Automate with cron
echo "0 0 * * * cd /path/to/supabase && supabase db dump > /path/to/backups/backup-\$(date +\%Y\%m\%d).sql" | sudo tee -a /etc/crontab
```

### Container Updates

Set up regular updates for your containers:

```bash
# Create update script
cat > /opt/pnidapp/update.sh << 'EOF'
#!/bin/bash
cd /opt/pnidapp
docker compose pull
docker compose down
docker compose up -d
docker system prune -af
EOF

chmod +x /opt/pnidapp/update.sh

# Automate with cron for weekly updates
echo "0 2 * * 0 /opt/pnidapp/update.sh >> /opt/pnidapp/update.log 2>&1" | sudo tee -a /etc/crontab
```

## Monitoring and Logging

### Set Up Monitoring

Install and configure monitoring tools:

```bash
# Install Prometheus and Grafana
docker run -d --name prometheus -p 9090:9090 -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
docker run -d --name grafana -p 3001:3000 grafana/grafana
```

### Log Management

Configure log rotation:

```bash
sudo nano /etc/logrotate.d/docker-compose
```

Add the following:

```
/opt/pnidapp/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 640 root root
}
```

## Scaling Considerations

For high-traffic deployments:

1. **Horizontal Scaling**:
   - Deploy multiple instances behind a load balancer
   - Use Docker Swarm or Kubernetes for orchestration

2. **Vertical Scaling**:
   - Increase resources for containers in docker-compose.prod.yml
   - Optimize application code for better performance

3. **Database Scaling**:
   - Consider upgrading to a more powerful Supabase plan
   - Implement caching strategies for frequently accessed data

## Troubleshooting Production Issues

### Application Not Working

1. Check container status:
   ```bash
   docker compose ps
   ```

2. Check container logs:
   ```bash
   docker compose logs pnid-app
   ```

3. Verify environment variables:
   ```bash
   grep -v "^#" .env.production
   ```

### Database Connection Issues

1. Check Supabase status:
   ```bash
   # For self-hosted Supabase
   cd /path/to/supabase
   supabase status
   ```

2. Verify connection details in `.env.production`

### HTTPS/Domain Issues

1. Check Nginx configuration:
   ```bash
   sudo nginx -t
   ```

2. Check Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## Rolling Back Deployments

If a deployment causes issues:

```bash
# Go to the deployment directory
cd /opt/pnidapp

# Check out the previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d
```

---

For additional help, refer to the [CI/CD Guide](./ci-cd-guide.md) and [Docker Workflow Guide](./docker-workflow.md).