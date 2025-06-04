const ERROR_MESSAGES = {
  NOT_FOUND: "Repository not found. Please check the URL and try again.",
  RATE_LIMIT: "Rate limit exceeded. Please try again later or use a GitHub token.",
  NETWORK: "Network error occurred. Please check your internet connection.",
  INVALID_URL: "Invalid repository URL. Please enter a valid GitHub repository URL.",
  PRIVATE_REPO: "This repository is private. Please use a GitHub token with proper permissions.",
  UNKNOWN: "An unexpected error occurred. Please try again later."
};

export const formatErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.UNKNOWN;
  
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 403:
        return error.response.data.message?.includes('rate limit') 
          ? ERROR_MESSAGES.RATE_LIMIT 
          : ERROR_MESSAGES.PRIVATE_REPO;
      default:
        return error.response.data.message || ERROR_MESSAGES.UNKNOWN;
    }
  }
  
  return error.message || ERROR_MESSAGES.NETWORK;
};

export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      return await fn();
    } catch (error) {
      if (retries === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (retries + 1)));
    }
  }
};

export const validateGitHubUrl = (url) => {
  if (!url) return false;
  
  const patterns = [
    /^https?:\/\/github\.com\/(.+?)\/(.+?)(?:\.git)?(?:\/.*)?$/,
    /^github\.com\/(.+?)\/(.+?)(?:\.git)?(?:\/.*)?$/,
    /^(.+?)\/(.+?)(?:\.git)?$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        valid: true,
        owner: match[1],
        repo: match[2]
      };
    }
  }
  return { valid: false };
};

export default ERROR_MESSAGES;
