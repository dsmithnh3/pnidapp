# Environment Setup Guide

This guide provides step-by-step instructions for setting up your environment for the PNID App project.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18.x or later)
- **pnpm** (v8.x or later)
- **Python** (v3.11 or later)
- **Docker** and **Docker Compose** (latest version)
- **Supabase CLI** (latest version)
- **Git** (latest version)

## Installation Steps for Prerequisites

### Node.js and pnpm

```bash
# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.bashrc  # or source ~/.zshrc
nvm install 20
nvm use 20

# Enable corepack for pnpm
corepack enable
```

### Python 3.11+

```bash
# macOS (using Homebrew)
brew install python@3.11

# Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip
```

### Docker and Docker Compose

```bash
# macOS
# Install Docker Desktop from https://www.docker.com/products/docker-desktop

# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo apt install docker-compose-plugin
```

### Supabase CLI

```bash
# macOS (using Homebrew)
brew install supabase/tap/supabase

# Using npm
npm install -g supabase
```

## Project Setup Process

### 1. Clone the Repository

```bash
git clone https://github.com/cronwell-ai/pnid-app.git
cd pnidapp
```

### 2. Install Project Dependencies

```bash
# Install root project dependencies
pnpm install

# Install metadata parser dependencies
cd companion/metadata-parser
pnpm install
cd ../..

# Install PDF export dependencies
cd companion/pdf-export
pip install -r requirements.txt
cd ../..
```

### 3. Set Up Supabase

```bash
# Start local Supabase instance
supabase start

# Initialize database schema and policies
./supabase/seed.sh
```

Take note of the output from the Supabase start command, as it contains the URLs and keys you'll need for your environment variables.

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file and set the following variables:

```
# Get your IP address
NEXT_PUBLIC_EXTERNAL_IP=192.168.1.147  # Replace with your actual IP address

# Supabase details from the output of 'supabase start'
NEXT_PUBLIC_SUPABASE_URL=http://192.168.1.147:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # From 'supabase start' output
SUPABASE_SERVICE_KEY=eyJhbGci...  # From 'supabase start' output

# OpenAI API key for metadata parsing
OPENAI_API_KEY=sk-...  # Your OpenAI API key

# Resend API key for emails (can be dummy for local development)
RESEND_API_KEY=re_dummy_resend_api_key_for_dev_environment
```

### 5. Set Up Microservices Environment

The microservices will use the main `.env.local` file through Docker Compose, but for direct development:

**Metadata Parser**:

```bash
cd companion/metadata-parser
cp .env.example .env
```

Edit the `.env` file with the same values from your root `.env.local` file:

```
USE_HTTPS=false
PORT=7123  # Use 7123 to avoid conflicts
SUPABASE_URL=http://192.168.1.147:54321
SUPABASE_SERVICE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```

**PDF Export**: 
Create a Python virtual environment for isolated dependencies:

```bash
cd companion/pdf-export
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

*Note: The PDF export service uses port 6123 by default to avoid conflicts with macOS AirPlay service on port 5000.*

## Running the Application

### Option 1: Running Services Individually

Run each service in a separate terminal window:

```bash
# Terminal 1: Ensure Next.js is installed and run the Next.js app
cd /path/to/pnidapp
pnpm install # First time only, to ensure Next.js is installed
pnpm dev

# Terminal 2: Run the metadata parser on port 7123
cd companion/metadata-parser && PORT=7123 pnpm dev

# Terminal 3: Run the PDF export service
cd companion/pdf-export
source venv/bin/activate  # Activate virtual environment
python main.py  # Will use port 6123 by default
```

**Important Note for macOS Users**: If you encounter port conflicts with port 5000 (commonly used by AirPlay), you can disable AirPlay Receiver in System Preferences -> Sharing, or explicitly set different ports as shown above.

### Option 2: Using Docker Compose

For development with hot reloading:

```bash
docker compose -f docker-compose.dev.yml up
```

For standard configuration:

```bash
docker compose up
```

For production-like environment:

```bash
docker compose -f docker-compose.prod.yml up
```

## Accessing the Application

Open your browser and navigate to:
- Main application: `http://localhost:3000`
- Metadata parser: `http://localhost:7123`
- PDF export service: `http://localhost:6123`

## Verifying Your Setup

### 1. Check Supabase Connection

1. Open `http://localhost:3000`
2. You should be able to sign up and log in
3. Supabase Studio should be available at `http://localhost:54323`

### 2. Verify Metadata Parser

```bash
curl http://localhost:7123/health
```

Should return:
```json
{"status":"ok","service":"metadata-parser"}
```

### 3. Verify PDF Export Service

```bash
curl http://localhost:6123/health
```

Should return:
```json
{"status":"ok","service":"pdf-export"}
```

## Troubleshooting Common Issues

### Supabase Connection Issues

If you can't connect to Supabase:

```bash
# Check if Supabase is running
supabase status

# If not running, start it
supabase start

# If running but still having issues, reset it
supabase stop
supabase start
./supabase/seed.sh
```

### Port Conflicts

If services fail to start due to port conflicts:

```bash
# Check what's using the port (macOS/Linux)
lsof -i :3000
lsof -i :7123
lsof -i :6123

# Kill the process
kill -9 <PID>
```

### Environment Variable Issues

If you see errors related to missing environment variables:

1. Check that your `.env.local` exists and has the correct values
2. Ensure Supabase is running and the keys are correctly copied
3. For Docker, try rebuilding the containers:
   ```bash
   docker compose down
   docker compose up --build
   ```

### Docker-specific Issues

If Docker containers fail to start:

```bash
# Check container logs
docker compose logs

# Check individual service logs
docker compose logs pnid-app
docker compose logs metadata-parser
docker compose logs pdf-export
```

### OpenAI API Issues

If metadata parsing fails:

1. Check that your OpenAI API key is valid and has quota
2. Verify it's correctly set in `.env.local` and `companion/metadata-parser/.env`
3. Check the metadata parser logs for API-specific errors

## Next Steps

Once your environment is set up:

1. Review the [Development Workflow Guide](./development-workflow.md)
2. Explore the [Docker Workflow Guide](./docker-workflow.md) for container management
3. Check the [CI/CD Guide](./ci-cd-guide.md) for understanding the deployment pipeline

---

If you encounter any issues not covered in this guide, please check the [README.developer.md](../README.developer.md) file or create an issue on GitHub.