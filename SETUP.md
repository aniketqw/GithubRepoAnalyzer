# GitHub Repository Analyzer - Setup Guide

This application includes **Natural Language Search** powered by LangGraph agents and is fully containerized with Docker for easy deployment! 🤖🐳

## 🚀 Quick Start Options

### Option 1: Docker Deployment (Recommended) 🐳
Perfect for production and consistent environments across different systems.

### Option 2: Local Development 💻
Great for development and when you want to modify the code.

---

## 🐳 Docker Setup (Recommended)

### Prerequisites
1. **Docker** - [Install Docker](https://docs.docker.com/get-docker/)
2. **Docker Compose** (optional) - Usually included with Docker Desktop
3. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Tavily Search API Key** - Get from [Tavily](https://tavily.com/)

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd GithubRepoAnalyzer
```

#### 2. Configure API Keys
```bash
# Copy the environment template
cp server/.env.example server/.env
```

Edit `server/.env` with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=3001
NODE_ENV=production
```

#### 3. Build and Run the Container

**Quick Start (Single Command):**
```bash
# Build and run in one command
docker build -t github-analyzer . && \
docker run -p 3000:3000 -p 3001:3001 --env-file server/.env github-analyzer
```

**Step by Step:**
```bash
# Build the Docker image
docker build -t github-analyzer .

# Run the container
docker run -p 3000:3000 -p 3001:3001 --env-file server/.env github-analyzer
```

**With Docker Compose:**
```bash
# Create docker-compose.yml first (see below), then:
docker-compose up -d
```

#### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Docker Compose Setup (Alternative)

Create a `docker-compose.yml` file in the project root:
```yaml
version: '3.8'

services:
  github-analyzer:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    env_file:
      - server/.env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      # Optional: Mount for development
      - ./src:/app/src
      - ./server:/app/server
```

Then run:
```bash
docker-compose up -d
```

---

## 💻 Local Development Setup

### Prerequisites
1. **Node.js** (v16 or higher) - [Download Node.js](https://nodejs.org/)
2. **npm** or **yarn**
3. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Tavily Search API Key** - Get from [Tavily](https://tavily.com/)

### Step-by-Step Installation

#### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd GithubRepoAnalyzer

# Install all dependencies (frontend + backend)
npm run install-all
```

#### 2. Configure Environment Variables
```bash
# Copy the environment template
cp server/.env.example server/.env
```

Edit `server/.env` with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=3001
```

#### 3. Test Configuration
```bash
# Check if your API keys are working
npm run check-env
```

#### 4. Start the Application

**Development Mode (Both services):**
```bash
npm run dev
```

**Separate Terminals:**
```bash
# Terminal 1: Start backend server
npm run server-dev

# Terminal 2: Start frontend
npm start
```

#### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## 🎯 Features Overview

### URL Search Mode (Works Immediately)
- Paste any GitHub repository URL
- Instant analysis with comprehensive metrics
- No API keys required for basic functionality

### Natural Language Search Mode ✨
- Describe repositories in plain English
- AI-powered search using LangGraph agents
- Requires OpenAI and Tavily API keys

**Example Queries:**
- "React dashboard with charts and data tables"
- "Python machine learning library for beginners"
- "Node.js REST API with authentication and JWT"
- "Vue.js e-commerce application with payment integration"

---

## 🔧 Configuration Options

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI search | For AI features | - |
| `TAVILY_API_KEY` | Tavily API key for web search | For AI features | - |
| `PORT` | Backend server port | No | 3001 |
| `NODE_ENV` | Environment mode | No | development |

### Docker Environment Variables

You can pass environment variables directly to Docker:
```bash
docker run -p 3000:3000 -p 3001:3001 \
  -e OPENAI_API_KEY=your_openai_key \
  -e TAVILY_API_KEY=your_tavily_key \
  -e NODE_ENV=production \
  github-analyzer
```

### API Keys Setup Guide

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create new secret key
5. Copy the key (starts with `sk-`)
6. **Important**: Ensure you have credits in your OpenAI account

#### Tavily Search API Key
1. Visit [Tavily](https://tavily.com/)
2. Sign up for a free account
3. Go to the dashboard
4. Copy your API key
5. **Note**: Free tier has rate limits

---

## 🚨 Troubleshooting

### Docker Issues

#### Container Won't Start
```bash
# Check container logs
docker logs <container-name-or-id>

# List all containers
docker ps -a

# Remove problematic container and rebuild
docker rm <container-id>
docker build -t github-analyzer . --no-cache
```

#### Can't Access Application
```bash
# Verify ports are mapped correctly
docker ps

# Check if ports are already in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Try different ports
docker run -p 3001:3000 -p 3002:3001 --env-file server/.env github-analyzer
```

#### Environment Variables Not Working
```bash
# Check if .env file exists
ls -la server/.env

# Verify environment variables in container
docker exec -it <container-id> env | grep API_KEY

# Alternative: Pass env vars directly
docker run -p 3000:3000 -p 3001:3001 \
  -e OPENAI_API_KEY=sk-your-key \
  -e TAVILY_API_KEY=tvly-your-key \
  github-analyzer
```

### Local Development Issues

#### "Backend server is not running"
```bash
# Check if backend is running
curl http://localhost:3001/health

# Start backend manually
cd server
npm start

# Or use the npm script
npm run server-dev
```

#### "Natural Language button is disabled"
```bash
# Test API configuration
npm run check-env

# Check .env file exists
cat server/.env

# Verify API keys format
# OpenAI key should start with "sk-"
# Tavily key should start with "tvly-"
```

#### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different ports
PORT=3002 npm run server-dev
```

### Common Error Messages

#### "Server error. Please check if API keys are configured correctly"
- Verify your `.env` file exists in `server/` directory
- Check API key format (OpenAI: `sk-...`, Tavily: `tvly-...`)
- Run `npm run check-env` to test connectivity

#### "Proxy connection failed"
- Backend server not running
- Port 3001 is blocked or in use
- Firewall blocking the connection

#### "Rate limit exceeded"
- **OpenAI**: Check billing and usage at platform.openai.com
- **Tavily**: Free tier limits reached, wait or upgrade
- **GitHub**: API rate limit, wait for reset

---

## 📊 Verification Steps

### Health Checks

#### Docker
```bash
# Check container is running
docker ps

# Test frontend
curl http://localhost:3000

# Test backend health
curl http://localhost:3001/health

# Test AI search endpoint (if API keys configured)
curl -X POST http://localhost:3001/api/search-repos \
  -H "Content-Type: application/json" \
  -d '{"query": "react dashboard"}'
```

#### Local Development
```bash
# Test backend health
npm run check-env

# Manual backend test
curl http://localhost:3001/health

# Check if both services are running
ps aux | grep node
```

### Test the Application

1. **Open Frontend**: http://localhost:3000
2. **Try URL Search**: Paste `https://github.com/facebook/react`
3. **Try Natural Language Search**: Type "React UI component library"
4. **Check Features**: History, bookmarks, export functionality

---

## 🎛️ Available Scripts

### Docker Commands
```bash
# Build image
docker build -t github-analyzer .

# Run container
docker run -p 3000:3000 -p 3001:3001 --env-file server/.env github-analyzer

# Run in background
docker run -d -p 3000:3000 -p 3001:3001 --name github-analyzer --env-file server/.env github-analyzer

# Stop container
docker stop github-analyzer

# Remove container
docker rm github-analyzer

# View logs
docker logs github-analyzer

# Access container shell
docker exec -it github-analyzer bash
```

### NPM Scripts
```bash
npm start              # Start frontend only
npm run build          # Build for production
npm test               # Run tests
npm run server         # Start backend only
npm run server-dev     # Start backend with auto-reload
npm run dev            # Start both frontend and backend
npm run install-all    # Install all dependencies
npm run check-env      # Verify API configuration
```

---

## 🌐 Production Deployment

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_openai_key
TAVILY_API_KEY=your_production_tavily_key
PORT=3001
NODE_ENV=production
```

### Container Registry Deployment
```bash
# Tag for registry
docker tag github-analyzer:latest your-registry.com/github-analyzer:latest

# Push to registry
docker push your-registry.com/github-analyzer:latest

# Deploy on production server
docker pull your-registry.com/github-analyzer:latest
docker run -d -p 80:3000 -p 3001:3001 \
  --name github-analyzer-prod \
  --restart unless-stopped \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e TAVILY_API_KEY=$TAVILY_API_KEY \
  your-registry.com/github-analyzer:latest
```

---

## 💡 Usage Tips

1. **Start Simple**: Use URL Search mode first to verify setup
2. **API Keys**: Natural Language search requires both OpenAI and Tavily keys
3. **Search Quality**: Be specific in natural language queries
4. **History**: Access previous searches via the history icon (🕒)
5. **Bookmarks**: Save interesting repositories with the bookmark icon (🔖)
6. **Export**: Download analysis results in JSON/CSV format
7. **Mobile**: Application is fully responsive for mobile use

---

## 🆘 Getting Help

If you're still having issues:

1. **Check the logs**:
   - Docker: `docker logs <container-id>`
   - Local: Check terminal output where you ran `npm run dev`

2. **Verify prerequisites**:
   - Docker version: `docker --version`
   - Node.js version: `node --version`
   - API keys format and validity

3. **Test step by step**:
   - Health check: `curl http://localhost:3001/health`
   - Environment: `npm run check-env`
   - Frontend access: Open http://localhost:3000

4. **Common fixes**:
   - Restart Docker: `docker restart <container-id>`
   - Rebuild image: `docker build -t github-analyzer . --no-cache`
   - Clear npm cache: `npm cache clean --force`

5. **Create an issue** with:
   - Your operating system
   - Docker/Node.js versions
   - Complete error messages
   - Steps you've already tried

---

**🎉 You're all set! Start analyzing repositories with AI-powered natural language search!**
