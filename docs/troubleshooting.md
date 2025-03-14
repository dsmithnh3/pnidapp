# Troubleshooting Guide

This guide helps you solve common issues when working with the PNID App codebase.

## Common Issues

### Next.js Issues

| Issue | Solution |
|-------|----------|
| "Next not found" or "Command not found" | Run `pnpm install` in the root directory to install Next.js |
| Next.js app doesn't start | Check that port 3000 is available with `lsof -i -P \| grep LISTEN \| grep 3000` |
| Hot reload not working | Ensure you're using the development server with `pnpm dev` not `pnpm start` |

### Metadata Parser Issues

| Issue | Solution |
|-------|----------|
| Port conflicts | Use explicit port: `PORT=7123 pnpm dev` |
| "Missing OpenAI API key" | Ensure your `.env.local` and `companion/metadata-parser/.env` both have valid `OPENAI_API_KEY` values |
| Connection to Supabase fails | Check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in environment variables |

### PDF Export Issues

| Issue | Solution |
|-------|----------|
| "No module named 'flask'" | Set up virtual environment and install dependencies:<br>`python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt` |
| "Address already in use" for port 5000 | On macOS: Disable AirPlay Receiver or use explicit port 6123 |
| Server doesn't start | Check that no other service is using port 6123 |

### Docker Issues

| Issue | Solution |
|-------|----------|
| Services show as unhealthy | Check logs `docker compose logs` and verify health endpoints are accessible |
| Environment variables not working | Check variable expansion in docker-compose.yml or hardcode critical values |
| Volume mounts not updating changes | Make sure volumes are correctly configured in docker-compose.dev.yml |

### macOS Specific Issues

| Issue | Solution |
|-------|----------|
| Port 5000 always in use | macOS uses port 5000 for AirPlay Receiver by default. Either:<br>- Disable in System Settings > Sharing > AirPlay Receiver<br>- Use different ports for your services (7123, 6123, etc.) |
| Python "externally-managed-environment" error | Use virtual environments for Python:<br>`python3 -m venv venv && source venv/bin/activate` |

## Checking Services

To verify that all services are running correctly:

```bash
# Check running processes
ps aux | grep -E "node|python"

# Check which ports are in use
lsof -i -P | grep LISTEN | grep -E '3000|7123|6123|5000'
```

Your services should be running on these ports:
- Next.js app: http://localhost:3000
- Metadata parser: http://localhost:7123
- PDF Export: http://localhost:6123

## Restarting Services

If you need to restart all services:

```bash
# Kill existing services
pkill -f "ts-node-dev|pnpm dev|python main.py" 

# Restart each service in separate terminals using instructions in development-workflow.md
```

## Getting Help

If you've tried the solutions in this guide and still have issues:

1. Check the [Docker Workflow Guide](./docker-workflow.md) for Docker-specific troubleshooting
2. Review logs for each service to identify specific errors
3. Create an issue on GitHub with detailed information about your problem and what you've tried

Remember: Always verify your environment setup before diving into more complex issues.