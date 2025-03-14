# Docker Workflow Guide

This guide provides instructions for using Docker with PNID App in different environments.

## Docker Configuration Files

The project includes three Docker Compose configurations:

1. **docker-compose.yml** - Standard configuration for general use
2. **docker-compose.dev.yml** - Development configuration with hot reloading
3. **docker-compose.prod.yml** - Production configuration with optimizations

## Development Environment with Docker

### Prerequisites

- Docker and Docker Compose
- Supabase CLI (for local development)
- A valid `.env.local` file with environment variables

### Starting Development Environment

For local development with hot reloading:

```bash
# Start Supabase first
supabase start

# Start all services with development configuration
docker compose -f docker-compose.dev.yml up
```

This configuration:
- Mounts local directories as volumes for live code updates
- Enables development mode for all services
- Configures hot reloading for faster development

### Building and Rebuilding

After making changes to Dockerfiles:

```bash
# Rebuild images
docker compose -f docker-compose.dev.yml build

# Restart with rebuilt images
docker compose -f docker-compose.dev.yml up --build
```

### Environment Variables

In development:
- Copy `.env.example` to `.env.local` and fill in your values
- The docker-compose.dev.yml file uses `.env.local` for configuration

## Testing Production Configuration Locally

To test the production configuration locally:

```bash
# Copy example production environment file
cp .env.production.example .env.production

# Edit the file with your production values
nano .env.production

# Start using production configuration
docker compose -f docker-compose.prod.yml up
```

This uses the production Docker configuration with:
- Optimized container settings
- Resource limits
- Longer health check intervals
- Production-mode application settings

## Production Deployment

For deploying to a production server:

```bash
# On your production server
git clone https://github.com/cronwell-ai/pnid-app.git
cd pnidapp

# Configure environment
cp .env.production.example .env.production
# Edit .env.production with your production values

# Start services in detached mode
docker compose -f docker-compose.prod.yml up -d
```

### Production Environment Variables

Important production variables:
- `DOCKERHUB_USERNAME` - Your Docker Hub username for image pulling
- `NEXT_PUBLIC_EXTERNAL_IP` - Your production domain
- `NEXT_PUBLIC_SITE_URL` - Full URL with https
- API keys for OpenAI and Resend
- Supabase connection details

## Container Management

### Viewing Logs

```bash
# View logs from all services
docker compose logs

# View logs from a specific service
docker compose logs pnid-app
docker compose logs metadata-parser
docker compose logs pdf-export

# Follow logs in real-time
docker compose logs -f
```

### Accessing Containers

```bash
# Get a shell in a running container
docker compose exec pnid-app sh
docker compose exec metadata-parser sh
docker compose exec pdf-export sh
```

### Container Status and Health

```bash
# Check container status
docker compose ps

# View container health
docker compose ps --format "table {{.Name}}\t{{.Status}}"
```

### Stopping and Cleaning Up

```bash
# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Stop and remove everything including images
docker compose down --rmi all -v
```

## Updating Containers

When new versions are available:

```bash
# Pull latest images
docker compose -f docker-compose.prod.yml pull

# Restart with new images
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

# Clean up old images
docker system prune -af
```

## Troubleshooting

### Container Startup Issues

If containers fail to start:
1. Check logs: `docker compose logs`
2. Verify environment variables in `.env.local` or `.env.production`
3. Check if ports are already in use: `netstat -tuln` or `lsof -i -P | grep LISTEN`
4. Ensure Supabase is running: `supabase status`
5. Verify package dependencies are installed: `pnpm install`

### Port Conflicts

Common port conflicts and resolutions:
1. **Port 5000**: On macOS, AirPlay Receiver uses port 5000 by default
   - Solution: Either disable AirPlay Receiver in System Preferences -> Sharing
   - Or modify the service to use a different port like 6123 or 7123
   
2. **Port 3000**: May be in use by other Node.js applications
   - Solution: Use `PORT=3001 pnpm dev` to start on a different port

3. In Docker Compose files, check the port mappings in your configuration:
   ```yaml
   ports:
     - "7123:5000"  # Maps host port 7123 to container port 5000
   ```

### Environment Variable Issues

If environment variables aren't being correctly passed to containers:
1. Verify values in your `.env.local` file
2. For Docker Compose, check if variables are properly referenced in the compose file
3. Sometimes Docker Compose doesn't expand variables: hardcode critical values or use env_file

### Health Check Failures

If health checks fail:
1. Check service-specific logs
2. Ensure all services can talk to each other
3. Verify environment variables for connecting services
4. Check if health endpoints are implemented and responding

### Command Not Found Issues

If you see errors like "command not found":
1. For Node.js: Ensure dependencies are installed with `pnpm install`
2. For Python: Set up a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Performance Issues

If containers are running slow:
1. Check resource usage: `docker stats`
2. Consider adjusting resource limits in `docker-compose.prod.yml`
3. Ensure volumes aren't causing I/O bottlenecks in development

## Best Practices

1. **Use development mode** for active development (docker-compose.dev.yml)
2. **Test production setup** locally before deploying
3. **Keep environment files secure** and never commit them
4. **Use resource limits** in production to prevent container overload
5. **Monitor container health** regularly on production servers
6. **Use CI/CD pipeline** for automated deployments (see .github/workflows/ci.yml)

---

For more details on Docker configurations, see the [docker-compose.yml](../docker-compose.yml), [docker-compose.dev.yml](../docker-compose.dev.yml), and [docker-compose.prod.yml](../docker-compose.prod.yml) files.