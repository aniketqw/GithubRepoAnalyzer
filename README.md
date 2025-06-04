# 🚀 GitHub Repository Analyzer

A comprehensive React application for analyzing GitHub repositories with AI-powered natural language search capabilities. Built with React, Material-UI, and LangChain for an enhanced developer experience. Now fully containerized with Docker for easy deployment.

![GitHub Repo Analyzer](https://img.shields.io/badge/React-18.2.0-blue)
![Material-UI](https://img.shields.io/badge/MUI-5.15.6-blue)
![LangChain](https://img.shields.io/badge/LangChain-AI%20Powered-green)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔍 **Dual Search Modes**
- **URL Search**: Direct repository analysis via GitHub URLs
- **Natural Language Search**: AI-powered repository discovery using plain English descriptions

### 📊 **Comprehensive Analytics**
- Repository statistics and metadata
- Contributor analysis with activity metrics
- Programming language breakdown with visual charts
- Commit activity patterns over time
- Issue analytics (open/closed/resolution times)
- Weekly commit activity visualization

### 💾 **Data Management**
- **Search History**: Automatic saving and quick access to previously analyzed repositories
- **Bookmarks**: Save favorite repositories for later analysis
- **Export Functionality**: Download analysis results in JSON/CSV formats
- **Local Storage**: All data persisted locally for privacy

### 🎨 **User Experience**
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Loading Skeletons**: Professional loading states during data fetching
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful error recovery with helpful messages

### 🔑 **GitHub API Management**
- **Public API Mode**: 60 requests per hour (no authentication required)
- **Private API Mode**: 5,000 requests per hour (requires GitHub personal access token)
- **API Key Management**: Easy-to-use interface for adding/removing API keys
- **Rate Limit Monitoring**: Real-time tracking of API usage and remaining requests
- **Status Indicator**: Visual display of current API mode and limits

## 🏗️ Architecture

```
├── Frontend (React + Material-UI)
│   ├── URL Search Mode (Direct GitHub API)
│   └── Natural Language Mode (Backend API)
├── Backend (Express + LangChain)
│   ├── OpenAI GPT-4o-mini for processing
│   └── Tavily Search for repository discovery
├── Data Storage (localStorage)
└── Docker Container (Production Ready)
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose
- OpenAI API Key ([Get here](https://platform.openai.com/api-keys))
- Tavily Search API Key ([Get here](https://tavily.com/))

#### Installation

1. **Clone the Repository**
```bash
git clone <repository-url>
cd GithubRepoAnalyzer
```

2. **Configure Environment Variables**
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=3001
```

3. **Build and Run with Docker**
```bash
# Build the Docker image
docker build -t github-analyzer .

# Run the container
docker run -p 3000:3000 -p 3001:3001 --env-file server/.env github-analyzer
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Option 2: Local Development

#### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

#### Quick Setup
```bash
# Install dependencies
npm run install-all

# Start development mode
npm run dev
```

Visit `http://localhost:3000` and use **URL Search** mode for immediate repository analysis.

## 🐳 Docker Commands

### Development
```bash
# Build development image
docker build -t github-analyzer:dev .

# Run with volume mounting for development
docker run -p 3000:3000 -p 3001:3001 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/server:/app/server \
  --env-file server/.env \
  github-analyzer:dev
```

### Production
```bash
# Build production image
docker build -t github-analyzer:prod --target production .

# Run production container
docker run -d -p 3000:3000 -p 3001:3001 \
  --name github-analyzer \
  --env-file server/.env \
  github-analyzer:prod
```

### Docker Compose (Alternative)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📖 Usage Guide

### URL Search Mode
1. Select **"URL Search"** toggle
2. Paste any GitHub repository URL
3. Click **"Analyze Repository"**
4. View comprehensive analytics

**Example URLs:**
- `https://github.com/facebook/react`
- `https://github.com/microsoft/vscode`
- `github.com/nodejs/node` (also works)

### Natural Language Search Mode
1. Select **"Natural Language"** toggle
2. Describe the type of repository you're looking for
3. Click **"Search Repositories"**
4. Browse AI-curated results and select one to analyze

**Example Queries:**
- "React dashboard with charts and tables"
- "Python machine learning library for beginners"
- "Node.js REST API with authentication"
- "Vue.js e-commerce application template"

### Features Overview

#### 📊 Analytics Dashboard
- **Repository Overview**: Stars, forks, language, license
- **Statistics**: Issues, contributors, creation date, last update
- **Language Breakdown**: Visual pie chart of code distribution
- **Contributors**: Top contributors with commit counts
- **Commit Activity**: Weekly commit patterns over time
- **Issue Analysis**: Open/closed issues, resolution times, top contributors

#### 💾 Data Management
- **History Icon** (🕒): Access previously analyzed repositories
- **Bookmark Icon** (🔖): Save repositories to favorites
- **Export Button**: Download analysis as JSON or CSV
- **Search Results**: Click any result to analyze that repository

## 🛠️ Development

### Available Scripts

```bash
# Local Development
npm start              # Start React development server
npm run build          # Build for production
npm test               # Run tests
npm run server         # Start backend server
npm run server-dev     # Start backend with auto-reload
npm run dev            # Start both frontend and backend
npm run install-all    # Install all dependencies
npm run check-env      # Verify API configuration

# Docker Development
docker build -t github-analyzer .                    # Build image
docker run -p 3000:3000 -p 3001:3001 github-analyzer # Run container
```

### Project Structure

```
GithubRepoAnalyzer/
├── src/
│   ├── components/          # React components
│   │   ├── MainAnalyzer.js     # Main search interface
│   │   ├── RepoCard.js         # Repository overview
│   │   ├── RepoStatistics.js   # Statistics display
│   │   ├── LanguageChart.js    # Language breakdown
│   │   ├── ContributorsList.js # Contributors analysis
│   │   ├── CommitActivityChart.js # Commit patterns
│   │   ├── IssueAnalytics.js   # Issue analysis
│   │   ├── SearchHistory.js    # Search history dialog
│   │   ├── BookmarksList.js    # Bookmarks management
│   │   ├── ExportButton.js     # Data export functionality
│   │   └── Skeleton.js         # Loading components
│   ├── services/            # API services
│   │   ├── githubService.js    # GitHub API integration
│   │   └── agentService.js     # AI search service
│   ├── utils/              # Utility functions
│   │   ├── storage.js          # Local storage management
│   │   ├── exportUtils.js      # Data export utilities
│   │   └── errorHandler.js     # Error handling
│   └── contexts/           # React contexts
│       └── ThemeContext.js     # Theme management
├── server/                 # Backend API
│   ├── agent-server.js         # Express server with AI
│   ├── package.json            # Backend dependencies
│   └── .env                    # API keys (not committed)
├── public/                 # Static assets
├── Dockerfile              # Docker container configuration
├── .dockerignore          # Docker ignore patterns
├── windsurf_deployment.yaml # Deployment configuration
└── package.json           # Frontend dependencies
```

## 🔧 Configuration

### Environment Variables

#### Backend (`server/.env`)
```env
OPENAI_API_KEY=your_openai_api_key    # Required for AI search
TAVILY_API_KEY=your_tavily_api_key    # Required for AI search  
PORT=3001                             # Backend server port
NODE_ENV=production                   # Environment mode
```

#### Docker Environment
```bash
# Pass environment variables to container
docker run -p 3000:3000 -p 3001:3001 \
  -e OPENAI_API_KEY=your_key \
  -e TAVILY_API_KEY=your_key \
  github-analyzer
```

### API Keys Setup

1. **OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create account and generate API key
   - Ensure you have credits available

2. **Tavily Search API Key**:
   - Visit [Tavily](https://tavily.com/)
   - Sign up for free account
   - Get API key from dashboard

## 🚨 Troubleshooting

### Docker Issues

#### "Container fails to start"
- **Cause**: Missing environment variables or port conflicts
- **Solution**: 
  ```bash
  # Check container logs
  docker logs <container-id>
  
  # Verify environment file
  cat server/.env
  
  # Check port availability
  netstat -tulpn | grep :3000
  ```

#### "Cannot connect to backend API"
- **Cause**: Backend service not accessible within container
- **Solution**: 
  ```bash
  # Check if both ports are exposed
  docker run -p 3000:3000 -p 3001:3001 github-analyzer
  
  # Test backend health
  curl http://localhost:3001/health
  ```

#### "Natural Language button is disabled"
- **Cause**: API keys not properly passed to container
- **Solution**: 
  ```bash
  # Check environment variables in container
  docker exec <container-id> env | grep API_KEY
  
  # Restart with explicit env vars
  docker run -e OPENAI_API_KEY=your_key -e TAVILY_API_KEY=your_key github-analyzer
  ```

### Local Development Issues

#### "Backend server is not running"
- **Cause**: Backend server not started
- **Solution**: Run `npm run server-dev` in separate terminal

#### "Proxy error: Could not proxy request"
- **Cause**: Backend not accessible on port 3001
- **Solution**: Ensure backend is running and port 3001 is available

#### "Rate limit exceeded"
- **Cause**: API rate limits reached
- **Solution**: 
  - OpenAI: Check billing and usage limits
  - GitHub: Wait for rate limit reset or add GitHub token
  - Tavily: Check free tier limits

### Debug Steps

1. **Check Docker Container Health**:
```bash
docker ps                           # List running containers
docker logs <container-id>          # Check container logs
docker exec -it <container-id> bash # Access container shell
```

2. **Verify API Configuration**:
```bash
# In container
docker exec <container-id> cat /app/server/.env

# Local development
npm run check-env
```

3. **Test Backend Health**:
```bash
# Docker
curl http://localhost:3001/health

# Local
curl http://localhost:3001/health
```

## 🌐 Deployment

### Docker Hub Deployment

#### Build and Push to Docker Hub
```bash
# Build the Docker image with correct platform for deployment (Render compatibility)
docker build --platform linux/amd64 -t github-repo-analyzer .

# Tag the image for Docker Hub (replace 'username' with your Docker Hub username here for example username is aniket024)
docker tag github-repo-analyzer:latest aniket024/github-repo-analyzer1:latest
docker tag github-repo-analyzer:latest aniket024/github-repo-analyzer1:v1.9

# Login to Docker Hub (if not already logged in)
docker login

# Push to Docker Hub
docker push aniket024/github-repo-analyzer1:latest
docker push aniket024/github-repo-analyzer1:v1.9
```

#### Pull and Run from Docker Hub
```bash
# Pull the latest image from Docker Hub
docker pull aniket024/github-repo-analyzer1:latest

# Run the container
docker run -d -p 3000:3000 -p 3001:3001 \
  --name github-analyzer \
  --env-file server/.env \
  aniket024/github-repo-analyzer1:latest
```

### Container Registry
```bash
# Tag for registry
docker tag github-analyzer:latest your-registry/github-analyzer:latest

# Push to registry
docker push your-registry/github-analyzer:latest
```

### Cloud Deployment
```bash
# Deploy to cloud platform (example for generic cloud)
docker run -d -p 80:3000 -p 3001:3001 \
  --name github-analyzer-prod \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e TAVILY_API_KEY=$TAVILY_API_KEY \
  your-registry/github-analyzer:latest
```

### Environment Variables for Production
- Set all required API keys in your hosting platform
- Configure health checks on ports 3000 and 3001
- Set up SSL termination for HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test locally:
   ```bash
   npm run dev  # Local testing
   docker build -t github-analyzer:test .  # Docker testing
   ```
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for repository data
- [OpenAI](https://openai.com/) for AI-powered search capabilities
- [Tavily](https://tavily.com/) for web search functionality
- [Material-UI](https://mui.com/) for the beautiful component library
- [Chart.js](https://www.chartjs.org/) for data visualizations
- [LangChain](https://langchain.com/) for AI agent framework
- [Docker](https://docker.com/) for containerization

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review Docker logs: `docker logs <container-id>`
3. Search existing GitHub Issues
4. Create a new issue with:
   - Operating system and Docker version
   - Container logs and error messages
   - Steps to reproduce the problem
   - Environment variables (without sensitive values)

---

**Quick Commands Reference:**
```bash
# Docker Quick Start
docker build -t github-analyzer . && docker run -p 3000:3000 -p 3001:3001 --env-file server/.env github-analyzer

# Local Quick Start  
npm run install-all && npm run dev

# Health Check
curl http://localhost:3001/health
```
