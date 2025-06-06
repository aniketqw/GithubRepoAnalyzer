import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Box, Container, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { Home } from '@mui/icons-material';
import CssBaseline from '@mui/material/CssBaseline';
import MainAnalyzer from './components/MainAnalyzer';
import RepoCard from './components/RepoCard';
import RepoStatistics from './components/RepoStatistics';
import LanguageChart from './components/LanguageChart';
import ContributorsList from './components/ContributorsList';
import CommitActivityChart from './components/CommitActivityChart';
import IssueAnalytics from './components/IssueAnalytics';
import ErrorBoundary from './components/ErrorBoundary';
import ThemeToggle from './components/ThemeToggle';
import ExportButton from './components/ExportButton';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import { getRepoData } from './services/githubService';
import { useTheme } from '@mui/material/styles';

function App() {
  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}>
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: 'background.paper'
            }}
          >
            <Routes>
              <Route path="/" element={<ErrorBoundary><MainAnalyzer /></ErrorBoundary>} />
              <Route path="/repo/:owner/:repo" element={
                <ErrorBoundary>
                  <RepositoryDetails />
                </ErrorBoundary>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProviderWrapper>
  );
}

// RepositoryDetails component to handle data fetching and display
function RepositoryDetails() {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true);
        const data = await getRepoData(owner, repo);
        setRepoData(data);
      } catch (err) {
        console.error('Error fetching repository data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [owner, repo]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Error loading repository: {error}
        </Typography>
      </Box>
    );
  }

  if (!repoData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No repository data available</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Home Button and Theme Toggle */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tooltip title="Back to Home">
          <IconButton
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: isDarkMode ? 'white' : 'primary.main',
              color: isDarkMode ? 'black' : 'white',
              '&:hover': {
                backgroundColor: isDarkMode ? '#f5f5f5' : 'primary.dark',
              },
              borderRadius: 2,
              px: 2,
              py: 1
            }}
          >
            <Home sx={{ mr: 1 }} />
            <Typography variant="button" sx={{ color: 'inherit' }}>
              Home
            </Typography>
          </IconButton>
        </Tooltip>
        <ThemeToggle />
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <RepoCard repoData={repoData} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <ExportButton 
            repoData={repoData}
            filename={`${owner}_${repo}_analysis`}
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <RepoStatistics repoData={repoData} />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <LanguageChart owner={owner} repo={repo} />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <ContributorsList owner={owner} repo={repo} />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <CommitActivityChart owner={owner} repo={repo} />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <IssueAnalytics owner={owner} repo={repo} />
      </Box>
    </Container>
  );
}

export default App;
