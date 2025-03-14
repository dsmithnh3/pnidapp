# CI/CD Pipeline Guide

This guide explains the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the PNID App project.

## Overview

The CI/CD pipeline automates testing, building, and deploying the application. It's configured in the GitHub Actions workflow file at `.github/workflows/ci.yml`.

## Pipeline Stages

The pipeline consists of three main stages:

1. **Test**: Run automated tests and checks
2. **Docker Build**: Build and push Docker images to Docker Hub
3. **Deploy**: Deploy the application to the production server

## Workflow Triggers

The pipeline triggers on:
- **Push to main branch**: Runs all stages (test, build, deploy)
- **Pull requests to main**: Runs only the test stage

## Stage Details

### 1. Test Stage

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
    
    - name: Enable corepack
      run: corepack enable
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run ESLint
      run: pnpm lint
    
    - name: Build Next.js app
      run: pnpm build
      env:
        CI: true
        # Environment variables from GitHub secrets
```

This stage:
- Checks out the code
- Sets up Node.js environment
- Enables corepack for pnpm support
- Installs dependencies
- Runs code linting
- Builds the application to verify it compiles correctly

### 2. Docker Build Stage

```yaml
docker-build:
  runs-on: ubuntu-latest
  needs: test
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    # Steps to build and push each service image
```

This stage:
- Only runs if the test stage passes and the trigger is a push to main
- Sets up Docker Buildx for optimized builds
- Logs in to Docker Hub using GitHub secrets
- Builds and pushes Docker images for all three services
  - Main Next.js application
  - Metadata parser service
  - PDF export service

### 3. Deploy Stage

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: docker-build
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          cd /opt/pnidapp
          docker compose pull
          docker compose down
          docker compose up -d
          docker system prune -af
```

This stage:
- Only runs if the Docker build stage passes
- Connects to the production server via SSH
- Pulls the latest Docker images
- Restarts the application with the new images
- Cleans up old Docker resources

## Required GitHub Secrets

To use this CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### For Building and Testing
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `OPENAI_API_KEY`

### For Docker Hub
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### For Deployment
- `DEPLOY_HOST` - IP address or hostname of your production server
- `DEPLOY_USER` - SSH username
- `DEPLOY_KEY` - SSH private key for authentication

## Setting Up the Pipeline

### 1. Configure GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add all required secrets

### 2. Prepare Your Production Server

1. Create the directory structure:
   ```bash
   mkdir -p /opt/pnidapp
   ```

2. Copy docker-compose.prod.yml to /opt/pnidapp/docker-compose.yml:
   ```bash
   cp docker-compose.prod.yml /opt/pnidapp/docker-compose.yml
   ```

3. Set up your .env.production file:
   ```bash
   cp .env.production.example /opt/pnidapp/.env.production
   # Edit with your production values
   ```

4. Make sure Docker and Docker Compose are installed on the server

5. Set up SSH access for the deployment user

### 3. Manual Deployment for First Time

For the initial setup, you may want to deploy manually:

```bash
cd /opt/pnidapp
docker compose pull
docker compose up -d
```

## Testing the Pipeline

1. Make a small change to a file in the repository
2. Commit and push to a feature branch
3. Create a pull request to main
4. Verify the test stage runs and passes
5. Merge the pull request to main
6. Verify all stages run and the application is deployed

## Troubleshooting

### Pipeline Failures

1. **Test Stage Failures**:
   - Check the GitHub Actions logs
   - Look for lint errors or build failures
   - Fix issues in your code and push again

2. **Docker Build Failures**:
   - Verify Docker Hub credentials
   - Check if there are network or rate limit issues
   - Look for errors in Dockerfile syntax

3. **Deployment Failures**:
   - Verify SSH access to the production server
   - Check if docker-compose.yml exists on the server
   - Ensure Docker is running on the server
   - Check server disk space and resources

### Server Deployment Issues

If automatic deployment fails:

1. Connect to the server manually:
   ```bash
   ssh your-username@your-server
   ```

2. Check the Docker Compose logs:
   ```bash
   cd /opt/pnidapp
   docker compose logs
   ```

3. Try a manual deployment:
   ```bash
   docker compose pull
   docker compose down
   docker compose up -d
   ```

## Best Practices

1. **Never commit secrets** to the repository
2. **Test changes locally** before pushing
3. **Use pull requests** for code reviews
4. **Monitor deployments** to catch issues early
5. **Keep the pipeline configuration** up to date
6. **Regularly rotate secrets** for security
7. **Add more test steps** as the project grows

## Extending the Pipeline

To enhance the CI/CD pipeline:

1. Add unit and integration tests
2. Add code coverage reporting
3. Implement blue/green deployments
4. Add notification steps (Slack, email)
5. Add security scanning for dependencies
6. Set up monitoring alerts

---

For more information on GitHub Actions, refer to the [official documentation](https://docs.github.com/en/actions).