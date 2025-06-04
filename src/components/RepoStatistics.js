import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Typography, 
  CircularProgress, 
  Box, 
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Star, 
  Visibility, 
  CallSplit, 
  BugReport, 
  Code, 
  LocalOffer,
  AccountTree,
  Update,
  People
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { 
  getIssues, 
  getPullRequests, 
  getLanguages 
} from '../services/githubService';

function RepoStatistics({ repoData }) {
  // All hooks must be called at the top level
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [languages, setLanguages] = useState(null);
  const [issues, setIssues] = useState(null);
  const [pullRequests, setPullRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExtendedStats = async () => {
      if (!repoData) return;
      
      try {
        setLoading(true);
        const [languagesData, issuesData, prsData] = await Promise.all([
          getLanguages(repoData.owner.login, repoData.name),
          getIssues(repoData.owner.login, repoData.name, 100),
          getPullRequests(repoData.owner.login, repoData.name, 100)
        ]);
        
        setLanguages(languagesData);
        setIssues(issuesData);
        setPullRequests(prsData);
      } catch (err) {
        console.error('Error fetching extended stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExtendedStats();
  }, [repoData]);

  // Early return if no repoData is provided
  if (!repoData) {
    return null;
  }

  if (loading) {
    return (
      <Card sx={{ 
        mb: 4, 
        bgcolor: 'background.paper',
        boxShadow: isDarkMode ? 2 : 4 
      }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        mb: 4, 
        bgcolor: 'background.paper',
        boxShadow: isDarkMode ? 2 : 4 
      }}>
        <CardContent>
          <Typography color="error">
            Error loading repository statistics: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Calculate language percentages
  const calculateLanguagePercentages = () => {
    if (!languages) return [];
    
    const total = Object.values(languages).reduce((sum, value) => sum + value, 0);
    return Object.entries(languages).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / total) * 100).toFixed(1)
    })).sort((a, b) => b.value - a.value);
  };

  const languageData = calculateLanguagePercentages();
  
  // Calculate issue statistics
  const openIssues = issues?.filter(issue => issue.state === 'open').length || 0;
  const closedIssues = issues?.filter(issue => issue.state === 'closed').length || 0;
  
  // Calculate PR statistics
  const openPRs = pullRequests?.filter(pr => pr.state === 'open').length || 0;
  const closedPRs = pullRequests?.filter(pr => pr.state === 'closed').length || 0;

  return (
    <Card sx={{ 
      mb: 4, 
      bgcolor: 'background.paper',
      boxShadow: isDarkMode ? 2 : 4 
    }}>
      <CardHeader 
        title="Repository Statistics" 
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Core metrics */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Core Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ mr: 1, color: theme.palette.warning.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Stars: <strong>{repoData.stargazers_count.toLocaleString()}</strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Visibility sx={{ mr: 1, color: theme.palette.info.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Watchers: <strong>{repoData.subscribers_count?.toLocaleString() || repoData.watchers_count?.toLocaleString()}</strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CallSplit sx={{ mr: 1, color: theme.palette.success.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Forks: <strong>{repoData.forks_count.toLocaleString()}</strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BugReport sx={{ mr: 1, color: theme.palette.error.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Issues: <strong>{repoData.open_issues_count.toLocaleString()}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Languages section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Languages
            </Typography>
            <Grid container spacing={1}>
              {languageData.slice(0, 5).map((lang) => (
                <Grid item key={lang.name}>
                  <Tooltip title={`${lang.name}: ${lang.percentage}%`}>
                    <Chip
                      icon={<Code />}
                      label={`${lang.name} (${lang.percentage}%)`}
                      variant={isDarkMode ? "outlined" : "filled"}
                      sx={{
                        bgcolor: isDarkMode ? 'background.paper' : 'primary.light',
                        color: isDarkMode ? 'text.primary' : 'primary.contrastText',
                        '& .MuiChip-icon': {
                          color: isDarkMode ? 'text.secondary' : 'inherit'
                        }
                      }}
                    />
                  </Tooltip>
                </Grid>
              ))}
              {languageData.length > 5 && (
                <Grid item>
                  <Chip 
                    label={`+${languageData.length - 5} more`} 
                    variant="outlined"
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.secondary'
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Issues & PRs section */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Issues
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BugReport sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="body2" color="text.secondary">
                  Open: <strong>{openIssues.toLocaleString()}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BugReport sx={{ mr: 1, color: theme.palette.error.main }} />
                <Typography variant="body2" color="text.secondary">
                  Closed: <strong>{closedIssues.toLocaleString()}</strong>
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Pull Requests
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountTree sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="body2" color="text.secondary">
                  Open: <strong>{openPRs.toLocaleString()}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountTree sx={{ mr: 1, color: theme.palette.success.dark }} />
                <Typography variant="body2" color="text.secondary">
                  Merged/Closed: <strong>{closedPRs.toLocaleString()}</strong>
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Additional info */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Update sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Created: <strong>{new Date(repoData.created_at).toLocaleDateString()}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Update sx={{ mr: 1, color: theme.palette.secondary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Last updated: <strong>{new Date(repoData.updated_at).toLocaleDateString()}</strong>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalOffer sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    License: <strong>{repoData.license?.name || 'Not specified'}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <People sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="body2" color="text.secondary">
                    Default branch: <strong>{repoData.default_branch}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RepoStatistics;
