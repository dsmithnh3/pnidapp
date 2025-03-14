FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install required system packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    graphicsmagick \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# First, add package.json to install dependencies
WORKDIR /app
COPY package.json ./

# Add packageManager field to prevent prompts
RUN node -e "const pkg=require('./package.json'); pkg.packageManager='pnpm@10.6.3'; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"

# Install dependencies without prompts
RUN CI=true pnpm install --no-frozen-lockfile

# Now copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Expose the container port
EXPOSE 8000

CMD [ "pnpm", "start" ]
