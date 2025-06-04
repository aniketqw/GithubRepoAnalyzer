import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';
const API_VERSION = '2022-11-28';

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': API_VERSION
    }
});

// Helper function to handle API errors consistently
const handleApiError = (error, action) => {
    console.error(`Error ${action}:`, error);
    if (error.response) {
        throw new Error(`Error ${action}: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
        throw new Error(`Error ${action}: No response received. Check your network connection.`);
    } else {
        throw new Error(`Error ${action}: ${error.message}`);
    }
};


export const getRepoData = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}`);
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
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching commits');
    }
};

export const getLanguages = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/languages`);
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
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching releases');
    }
};

export const getWeeklyCommitActivity = async (owner, repo) => {
    try {
        const response = await githubApi.get(`/repos/${owner}/${repo}/stats/commit_activity`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'fetching weekly commit activity');
    }
};

