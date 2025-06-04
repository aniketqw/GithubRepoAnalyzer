import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
const API_VERSION = '2022-11-28';

// Function to get stored API key
const getStoredApiKey = () => {
    return localStorage.getItem('github_api_key');
};

// Function to create axios instance with or without authentication
const createGithubApi = () => {
    const apiKey = getStoredApiKey();
    const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': API_VERSION
    };
    
    if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    return axios.create({
        baseURL: GITHUB_API_URL,
        headers
    });
};

// Create initial instance
let githubApi = createGithubApi();

// Helper function to handle API errors consistently
const handleApiError = (error, action) => {
    console.error(`Error ${action}:`, error.response?.data || error.message);
    if (error.response) {
        throw new Error(`Error ${action}: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
        throw new Error(`Error ${action}: No response received. Check your network connection.`);
    } else {
        throw new Error(`Error ${action}: ${error.message}`);
    }
};

// Helper function to check rate limits
const checkRateLimit = (response) => {
    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    const reset = response.headers['x-ratelimit-reset'];
    
    console.log(`📊 Rate limit: ${remaining}/${limit} remaining (resets at ${new Date(reset * 1000).toLocaleTimeString()})`);
    
    if (remaining < 100) {
        console.log('⚠️  Rate limit getting low!');
    }
};

// Function to update API key and recreate axios instance
export const setApiKey = (apiKey) => {
    if (apiKey) {
        localStorage.setItem('github_api_key', apiKey);
    } else {
        localStorage.removeItem('github_api_key');
    }
    githubApi = createGithubApi();
};

// Function to check if API key is set
export const hasApiKey = () => {
    return !!getStoredApiKey();
};

// Function to get current rate limit info
export const getRateLimitInfo = () => {
    const apiKey = getStoredApiKey();
    return {
        hasApiKey: !!apiKey,
        limit: apiKey ? 5000 : 60,
        type: apiKey ? 'Private API (Authenticated)' : 'Public API (Unauthenticated)'
    };
};


export const getRepoData = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}`);
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching repository data');
    }
};

export const getContributors = async (owner, repo, perPage = 100) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/contributors`, {
            params: {
                per_page: perPage
            }
        });
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching contributors');
    }
};

export const getCommits = async (owner, repo, perPage = 100, since = null) => {
    try {
        const params = { per_page: perPage };
        if (since) {
            params.since = since.toISOString();
        }
        
        const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, { params });
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching commits');
    }
};

export const getLanguages = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/languages`);
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching languages');
    }
};

export const getIssues = async (owner, repo, perPage = 100, state = 'all') => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/issues`, {
            params: {
                per_page: perPage,
                state: state
            }
        });
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching issues');
    }
};

export const getPullRequests = async (owner, repo, perPage = 100, state = 'all') => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/pulls`, {
            params: {
                per_page: perPage,
                state: state
            }
        });
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching pull requests');
    }
};

export const getReleases = async (owner, repo, perPage = 100) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/releases`, {
            params: {
                per_page: perPage
            }
        });
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching releases');
    }
};

export const getWeeklyCommitActivity = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/stats/commit_activity`);
        checkRateLimit(response);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching weekly commit activity');
    }
};

