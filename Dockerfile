FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server files and dependencies
COPY server/package*.json ./server/
COPY server/.env ./server/
COPY server/agent-server.js ./server/
COPY server/check-env.js ./server/
RUN cd server && npm install

# Copy frontend files
COPY src ./src
COPY public ./public

# Build frontend
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Start both frontend and backend
CMD ["npm", "run", "dev"]
