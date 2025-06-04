// server/agent-server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../build')));

// Check for required environment variables
if (!process.env.OPENAI_API_KEY || !process.env.TAVILY_API_KEY) {
  console.warn('⚠️  Missing required API keys. Please set OPENAI_API_KEY and TAVILY_API_KEY environment variables');
  console.warn('   The server will start but AI features will not work until API keys are provided');
}

// Simplified agent without LangGraph for now
const initializeAgent = () => {
  try {
    // Create a model
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
    });

    // Create search tool
    const searchTool = new TavilySearchResults({ 
      maxResults: 5,
      searchDepth: "basic"
    });

    return { model, searchTool };
  } catch (error) {
    console.error('Error initializing agent:', error);
    throw error;
  }
};

// Initialize the agent
let agent;
try {
  if (process.env.OPENAI_API_KEY && process.env.TAVILY_API_KEY) {
    agent = initializeAgent();
    console.log('✅ AI agent initialized successfully');
  } else {
    console.log('⚠️  AI agent not initialized due to missing API keys');
    agent = null;
  }
} catch (error) {
  console.error('❌ Failed to initialize agent:', error.message);
  console.log('🚀 Server will continue without AI features');
  agent = null;
}

// API endpoint for searching repositories
app.post('/api/search-repos', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    if (!agent) {
      return res.status(503).json({ 
        error: 'AI agent not available', 
        details: 'Please configure OPENAI_API_KEY and TAVILY_API_KEY environment variables' 
      });
    }

    console.log('🔍 Searching for repositories with query:', query);

    // Step 1: Use Tavily to search for repositories
    const searchQuery = `GitHub repositories ${query} site:github.com`;
    const searchResults = await agent.searchTool.invoke(searchQuery);

    // Step 2: Use OpenAI to process and format the results
    const searchPrompt = `Based on these search results about GitHub repositories for "${query}", 
    please extract and list the most relevant GitHub repository URLs along with their descriptions.
    
    Search Results:
    ${JSON.stringify(searchResults, null, 2)}
    
    Please format your response as a clear list with:
    - Repository URL (full GitHub URL)
    - Brief description of what the repository does
    - Why it matches the search query
    
    Focus only on actual GitHub repositories that match: ${query}`;

    const aiResponse = await agent.model.invoke([new HumanMessage(searchPrompt)]);
    const content = aiResponse.content;

    console.log('✅ Search completed successfully');

    res.json({ 
      success: true, 
      results: content,
      timestamp: new Date().toISOString(),
      searchResults: searchResults // Optional: include raw search results
    });
  } catch (error) {
    console.error('❌ Error in search:', error);
    res.status(500).json({ 
      error: 'Failed to search repositories', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    aiAgent: agent ? 'initialized' : 'not_available',
    hasApiKeys: !!(process.env.OPENAI_API_KEY && process.env.TAVILY_API_KEY)
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'GitHub Analyzer Agent API',
    version: '1.0.0',
    endpoints: [
      'POST /api/search-repos - Search repositories with natural language',
      'GET /health - Health check',
      'GET /api/info - API information'
    ]
  });
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Use Render's PORT environment variable
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API info: http://localhost:${PORT}/api/info`);
  console.log(`🌐 Frontend served from: http://localhost:${PORT}`);
});