const STORAGE_KEYS = {
  SEARCH_HISTORY: 'github_analyzer_search_history',
  BOOKMARKS: 'github_analyzer_bookmarks',
  SETTINGS: 'github_analyzer_settings'
};

const MAX_HISTORY_ITEMS = 20;

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

export const addToSearchHistory = (repoUrl, owner, repo) => {
  const history = getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
  
  const newEntry = {
    url: repoUrl,
    owner,
    repo,
    timestamp: Date.now(),
    displayName: `${owner}/${repo}`
  };
  
  // Remove duplicate if exists
  const filteredHistory = history.filter(item => 
    !(item.owner === owner && item.repo === repo)
  );
  
  // Add new entry at the beginning
  const updatedHistory = [newEntry, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
  
  return saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
};

export const getSearchHistory = () => {
  return getFromStorage(STORAGE_KEYS.SEARCH_HISTORY, []);
};

export const clearSearchHistory = () => {
  return removeFromStorage(STORAGE_KEYS.SEARCH_HISTORY);
};

export const removeFromSearchHistory = (owner, repo) => {
  const history = getSearchHistory();
  const updatedHistory = history.filter(item => 
    !(item.owner === owner && item.repo === repo)
  );
  return saveToStorage(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
};

export const addToBookmarks = (repoData) => {
  const bookmarks = getFromStorage(STORAGE_KEYS.BOOKMARKS, []);
  
  const newBookmark = {
    id: repoData.id,
    name: repoData.name,
    full_name: repoData.full_name,
    owner: repoData.owner.login,
    repo: repoData.name,
    description: repoData.description,
    stars: repoData.stargazers_count,
    language: repoData.language,
    url: repoData.html_url,
    timestamp: Date.now()
  };
  
  // Remove duplicate if exists
  const filteredBookmarks = bookmarks.filter(item => item.id !== repoData.id);
  
  // Add new bookmark at the beginning
  const updatedBookmarks = [newBookmark, ...filteredBookmarks];
  
  return saveToStorage(STORAGE_KEYS.BOOKMARKS, updatedBookmarks);
};

export const getBookmarks = () => {
  return getFromStorage(STORAGE_KEYS.BOOKMARKS, []);
};

export const removeFromBookmarks = (repoId) => {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.filter(item => item.id !== repoId);
  return saveToStorage(STORAGE_KEYS.BOOKMARKS, updatedBookmarks);
};

export const isBookmarked = (repoId) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(item => item.id === repoId);
};

export const clearBookmarks = () => {
  return removeFromStorage(STORAGE_KEYS.BOOKMARKS);
};

const storage = {
  STORAGE_KEYS,
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  addToSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
  addToBookmarks,
  getBookmarks,
  removeFromBookmarks,
  isBookmarked,
  clearBookmarks
};

export default storage;