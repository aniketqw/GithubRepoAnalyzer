FROM node:18-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server files and dependencies
COPY server/package*.json ./server/
COPY server/agent-server.js ./server/
COPY server/check-env.js ./server/
RUN cd server && npm install

# Copy frontend files
COPY src ./src
COPY public ./public

# Build frontend for production
RUN npm run build

# Expose the port
EXPOSE $PORT

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Start single server (backend serves both API and frontend)
CMD ["node", "server/agent-server.js"]
