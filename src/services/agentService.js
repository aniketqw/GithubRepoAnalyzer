// src/services/agentService.js
import axios from 'axios';

// Since we can't use API keys directly in the frontend,
// we'll create a service that calls your backend API
const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const searchRepositoriesWithNaturalLanguage = async (query) => {
  try {
    console.log('🔍 Searching repositories with query:', query);
    
    const response = await axios.post(`${BACKEND_API_URL}/api/search-repos`, {
      query,
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Search response received');
    return response.data;
  } catch (error) {
    console.error('❌ Error searching repositories:', error);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start the server with "npm run server"');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Server error. Please check if API keys are configured correctly.');
    }
    
    throw new Error(error.response?.data?.error || 'Failed to search repositories');
  }
};

// Function to parse search results and extract GitHub URLs
export const parseSearchResults = (searchResults) => {
  const githubUrls = [];
  const githubUrlRegex = /https?:\/\/github\.com\/[\w-]+\/[\w.-]+/gi;
  
  console.log('📝 Parsing search results for GitHub URLs');
  
  // Extract GitHub URLs from the search results
  if (searchResults && typeof searchResults === 'string') {
    const matches = searchResults.match(githubUrlRegex);
    if (matches) {
      // Remove duplicates and clean URLs
      const uniqueUrls = [...new Set(matches)].map(url => {
        // Remove any trailing slashes or additional paths
        return url.replace(/\/+$/, '').split('/').slice(0, 5).join('/');
      });
      githubUrls.push(...uniqueUrls);
    }
  }
  
  console.log(`🔗 Found ${githubUrls.length} GitHub URLs`);
  return githubUrls;
};

// Function to fetch basic info about multiple repositories
export const fetchRepositoriesInfo = async (urls) => {
  const repositories = [];
  
  console.log(`📊 Fetching info for ${urls.length} repositories`);
  
  for (const url of urls) {
    try {
      // Extract owner and repo from URL
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        const [, owner, repo] = match;
        
        console.log(`   Fetching: ${owner}/${repo}`);
        
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
          timeout: 10000 // 10 second timeout per request
        });
        
        repositories.push({
          url,
          name: response.data.name,
          full_name: response.data.full_name,
          description: response.data.description,
          stars: response.data.stargazers_count,
          language: response.data.language,
          owner: response.data.owner.login,
          repo: response.data.name,
          created_at: response.data.created_at,
          updated_at: response.data.updated_at,
          topics: response.data.topics || [],
          license: response.data.license?.name,
          forks: response.data.forks_count,
          open_issues: response.data.open_issues_count
        });
      }
    } catch (error) {
      console.error(`❌ Error fetching info for ${url}:`, error.message);
      
      // If it's a rate limit error, we should stop
      if (error.response?.status === 403) {
        console.warn('⚠️ GitHub API rate limit reached');
        break;
      }
      
      // For other errors (like 404), continue with next repository
      continue;
    }
  }
  
  console.log(`✅ Successfully fetched info for ${repositories.length} repositories`);
  return repositories;
};

// Function to check backend health
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/health`, {
      timeout: 5000
    });
    return { 
      healthy: true, 
      data: response.data 
    };
  } catch (error) {
    return { 
      healthy: false, 
      error: error.code === 'ECONNREFUSED' 
        ? 'Backend server is not running' 
        : error.message 
    };
  }
};

// Function to get API info
export const getApiInfo = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_URL}/api/info`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get API information');
  }
};

const agentService = {
  searchRepositoriesWithNaturalLanguage,
  parseSearchResults,
  fetchRepositoriesInfo,
  checkBackendHealth,
  getApiInfo
};

export default agentService;