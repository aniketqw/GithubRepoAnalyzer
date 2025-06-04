import React, { useState, useCallback, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Alert, 
  CircularProgress, 
  Typography, 
  IconButton, 
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider
} from '@mui/material';
import { 
  History, 
  Bookmark, 
  Link as LinkIcon, 
  Search as SearchIcon,
  GitHub,
  Star,
  Language,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getRepoData } from '../services/githubService';
import { 
  searchRepositoriesWithNaturalLanguage, 
  parseSearchResults, 
  fetchRepositoriesInfo,
  checkBackendHealth
} from '../services/agentService';
import { validateGitHubUrl, formatErrorMessage } from '../utils/errorHandler';
import { addToSearchHistory } from '../utils/storage';
import { useTheme } from '@mui/material/styles';
import SearchHistory from './SearchHistory';
import BookmarksList from './BookmarksList';
import ThemeToggle from './ThemeToggle';

function MainAnalyzer() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchMode, setSearchMode] = useState('url'); // 'url' or 'natural'
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkBackendHealth();
      setBackendHealth(health);
    };
    
    checkHealth();
  }, []);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');
    
    // Only validate URL if in URL mode
    if (searchMode === 'url' && value) {
      const validation = validateGitHubUrl(value);
      if (!validation.valid) {
        setError('Invalid repository URL format');
      }
    }
  }, [searchMode]);

  const handleAnalyzeUrl = async () => {
    const validation = validateGitHubUrl(inputValue);
    if (!validation.valid) {
      setError('Invalid repository URL format');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await getRepoData(validation.owner, validation.repo);
      addToSearchHistory(inputValue, validation.owner, validation.repo);
      navigate(`/repo/${validation.owner}/${validation.repo}`);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaturalLanguageSearch = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a description');
      return;
    }

    // Check if backend is available
    if (backendHealth && !backendHealth.healthy) {
      setError('Backend server is not available. Please start the server or use URL search instead.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSearchResults([]);
      
      // Search using natural language
      const response = await searchRepositoriesWithNaturalLanguage(inputValue);
      const githubUrls = parseSearchResults(response.results);
      
      if (githubUrls.length === 0) {
        setError('No GitHub repositories found. Try a different description.');
        return;
      }
      
      // Fetch repository information
      const repositories = await fetchRepositoriesInfo(githubUrls);
      
      if (repositories.length === 0) {
        setError('Could not fetch repository information. Please try again.');
        return;
      }
      
      setSearchResults(repositories);
      setShowSearchResults(true);
    } catch (err) {
      setError(err.message || 'Failed to search repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (searchMode === 'url') {
      handleAnalyzeUrl();
    } else {
      handleNaturalLanguageSearch();
    }
  };

  const handleSelectRepository = (repo) => {
    setShowSearchResults(false);
    addToSearchHistory(repo.url, repo.owner, repo.repo);
    navigate(`/repo/${repo.owner}/${repo.repo}`);
  };

  const handleSearchModeChange = (event, newMode) => {
    if (newMode !== null) {
      setSearchMode(newMode);
      setInputValue('');
      setError('');
      setSearchResults([]);
    }
  };

  // Theme and dark mode are now defined at the top with other hooks

  return (
    <Container maxWidth="sm" sx={{ 
      bgcolor: 'background.paper',
      p: 4,
      borderRadius: 2,
      boxShadow: isDarkMode ? 2 : 4
    }}>
      {/* Theme Toggle in top-right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <ThemeToggle />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: 'text.primary',
            mb: 3,
            textAlign: 'center'
          }}
        >
          GitHub Repository Analyzer
        </Typography>

        {/* Backend Health Status */}
        {searchMode === 'natural' && backendHealth && !backendHealth.healthy && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info />
              Backend server is not running. Natural language search requires the backend server.
            </Box>
          </Alert>
        )}

        {/* Search Mode Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={searchMode}
            exclusive
            onChange={handleSearchModeChange}
            aria-label="search mode"
            sx={{
              bgcolor: 'background.default',
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          >
            <ToggleButton value="url" aria-label="url search">
              <LinkIcon sx={{ mr: 1 }} />
              URL Search
            </ToggleButton>
            <ToggleButton 
              value="natural" 
              aria-label="natural language search"
              disabled={backendHealth && !backendHealth.healthy}
            >
              <SearchIcon sx={{ mr: 1 }} />
              Natural Language
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              bgcolor: 'background.paper'
            }}
          >
            {error}
          </Alert>
        )}
        
        <TextField
          fullWidth
          label={searchMode === 'url' ? 'GitHub Repository URL' : 'Describe the repository you\'re looking for'}
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          error={!!error}
          helperText={
            searchMode === 'url' 
              ? (error || "Enter a GitHub repository URL (e.g., https://github.com/owner/repo)")
              : "Describe what kind of repository you're looking for (e.g., 'React dashboard with charts')"
          }
          multiline={searchMode === 'natural'}
          rows={searchMode === 'natural' ? 3 : 1}
          sx={{ 
            mb: 2,
            bgcolor: 'background.paper'
          }}
          InputProps={{
            endAdornment: searchMode === 'url' && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowBookmarks(true)}
                  sx={{ color: 'text.secondary' }}
                  title="View bookmarks"
                >
                  <Bookmark />
                </IconButton>
                <IconButton
                  onClick={() => setShowHistory(true)}
                  edge="end"
                  sx={{ color: 'text.secondary' }}
                  title="View search history"
                >
                  <History />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={!inputValue.trim() || isLoading || (searchMode === 'natural' && backendHealth && !backendHealth.healthy)}
          startIcon={isLoading ? <CircularProgress size={20} /> : (searchMode === 'url' ? <LinkIcon /> : <SearchIcon />)}
          fullWidth
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark'
            },
            color: 'primary.contrastText',
            py: 1.5
          }}
        >
          {isLoading 
            ? (searchMode === 'url' ? 'Analyzing...' : 'Searching...') 
            : (searchMode === 'url' ? 'Analyze Repository' : 'Search Repositories')}
        </Button>
      </Box>

      {/* Search Results Dialog */}
      <Dialog
        open={showSearchResults}
        onClose={() => setShowSearchResults(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            boxShadow: isDarkMode ? 8 : 24
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          bgcolor: 'background.paper'
        }}>
          <GitHub />
          <Typography variant="h6">Search Results</Typography>
          <Chip 
            label={`${searchResults.length} repositories found`} 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
          <List sx={{ p: 0 }}>
            {searchResults.map((repo, index) => (
              <React.Fragment key={`${repo.full_name}-${index}`}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectRepository(repo)}
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <GitHub sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {repo.full_name}
                          </Typography>
                          {repo.language && (
                            <Chip
                              icon={<Language />}
                              label={repo.language}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {repo.description || 'No description'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                              <Typography variant="caption">
                                {repo.stars?.toLocaleString() || 0} stars
                              </Typography>
                            </Box>
                            {repo.topics && repo.topics.length > 0 && (
                              <Typography variant="caption" color="text.secondary">
                                Topics: {repo.topics.slice(0, 3).join(', ')}
                                {repo.topics.length > 3 && '...'}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < searchResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <SearchHistory
        open={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectRepo={(url) => {
          setInputValue(url);
          setError('');
          setSearchMode('url');
        }}
      />

      <BookmarksList
        open={showBookmarks}
        onClose={() => setShowBookmarks(false)}
      />
    </Container>
  );
}

export default MainAnalyzer;
