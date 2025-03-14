# Development Workflow Guide

This guide provides step-by-step instructions for contributing to the PNID App project.

## Getting Started with Development

### 1. Clone the Repository

```bash
git clone https://github.com/cronwell-ai/pnid-app.git
cd pnidapp
```

### 2. Create a Feature Branch

Always create a feature branch for your changes:

```bash
# Start from the latest main branch
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### 3. Set Up Development Environment

```bash
# Install dependencies
pnpm install

# Start Supabase locally
supabase start

# Initialize database schema and policies
./supabase/seed.sh

# Configure environment
cp .env.example .env.local
# Edit .env.local with your local settings
```

### 4. Running the Application in Development Mode

#### Option 1: Run services individually (recommended for active development)

In separate terminal windows:

```bash
# Terminal 1: Run the Next.js app
pnpm install # First time only - ensure Next.js is installed
pnpm dev

# Terminal 2: Run the metadata parser
cd companion/metadata-parser && PORT=7123 pnpm dev

# Terminal 3: Run the PDF export service
cd companion/pdf-export
python3 -m venv venv  # First time only
source venv/bin/activate
pip install -r requirements.txt  # First time only
python main.py  # Will use port 6123 by default
```

#### Common Issues and Fixes

1. **Next.js "command not found"**: Run `pnpm install` to ensure Next.js is installed
2. **Port conflicts**:
   - Port 5000: On macOS, this is used by AirPlay Receiver. Disable it in System Settings or use explicit ports.
   - Explicit ports are configured in the commands above (7123 for metadata parser, 6123 for PDF export)
3. **Python dependencies**: Always use a virtual environment for Python services to avoid system conflicts

#### Option 2: Use Docker with development volumes

```bash
# Run with hot reloading enabled
docker compose -f docker-compose.dev.yml up
```

If Docker containers fail health checks, see the [Docker Workflow Guide](./docker-workflow.md#troubleshooting) for detailed troubleshooting steps.

### 5. Code Changes and Standards

1. Follow the coding style guidelines in CLAUDE.md
2. Make sure to add tests for new features
3. Run linting before committing:
   ```bash
   pnpm lint
   ```
4. Run type-checking:
   ```bash
   pnpm typecheck
   ```

### 6. Committing Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add your feature description"
```

Follow [conventional commits](https://www.conventionalcommits.org/) format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation updates
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

### 7. Pushing Changes and Creating Pull Requests

```bash
# Push your branch to the remote repository
git push origin feature/your-feature-name
```

Then:
1. Go to GitHub repository
2. Create a Pull Request from your feature branch to main
3. Fill in the PR template with details about your changes
4. Request a review from team members
5. Address any feedback from code review

### 8. Keeping Your Branch Updated

If the main branch is updated while you're working on your feature:

```bash
# Update your local main
git checkout main
git pull origin main

# Rebase your feature branch
git checkout feature/your-feature-name
git rebase main

# If there are conflicts, resolve them and continue
git rebase --continue

# Push your updated branch (force push may be needed for rebased branch)
git push origin feature/your-feature-name --force-with-lease
```

## Testing Your Changes

### Local Testing

1. Test UI functionality in different browsers
2. Test with different screen sizes for responsive design
3. Test all API endpoints and data flows
4. Verify database migrations and schema changes

### Automated Testing

Run tests before submitting your PR:

```bash
# Run Jest tests
pnpm test

# Run E2E tests (if available)
pnpm test:e2e
```

### Docker Testing

Test your changes with Docker to ensure they work in containerized environments:

```bash
# Build and run with Docker Compose
docker compose up --build
```

## Debugging Tips

### Frontend Debugging

- Use React Developer Tools in browser
- Check browser console for errors
- Use `console.log()` statements (remove before committing)

### Backend Debugging

- Check server logs
- Use `console.log()` for Express server
- Use `print()` statements for Python Flask server

### Docker Debugging

```bash
# View logs for a specific service
docker compose logs -f pnid-app
docker compose logs -f metadata-parser
docker compose logs -f pdf-export

# Access a running container
docker compose exec pnid-app sh
```

## Best Practices

1. **Keep PRs focused**: Each PR should address a single feature or fix
2. **Write descriptive commit messages**: Explain why, not just what
3. **Document new features**: Update README or add comments as needed
4. **Handle errors gracefully**: Add proper error handling
5. **Consider performance**: Be mindful of performance implications
6. **Test thoroughly**: Ensure your changes work correctly
7. **Review your own code**: Self-review before requesting reviews
8. **Clean up**: Remove debugging code, comments, and console logs

---

For more details on setup and architecture, refer to the [README.developer.md](../README.developer.md) file.