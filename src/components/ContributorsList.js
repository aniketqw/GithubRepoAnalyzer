import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, CircularProgress, Typography, Box, Button, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getContributors } from '../services/githubService';
import { useTheme } from '@mui/material/styles';

function ContributorsList() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { owner, repo } = useParams();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getContributors(owner, repo);
        setContributors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [owner, repo]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1
        }}
      >
        <Typography 
          color="error" 
          align="center"
          sx={{ 
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1
          }}
        >
          Error: {error}
        </Typography>
      </Box>
    );
  }

  // Filter contributors based on search term
  const filteredContributors = contributors.filter(contributor =>
    contributor.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine which contributors to show based on visible count
  const displayedContributors = filteredContributors.slice(0, visibleCount);
  const hasMoreContributors = filteredContributors.length > visibleCount;

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setVisibleCount(5); // Reset to show first 5 when searching
  };

  // Handle show more button click
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  // Handle show less button click
  const handleShowLess = () => {
    setVisibleCount(5);
  };

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 1,
        boxShadow: isDarkMode ? 2 : 4
      }}
    >
      <Typography 
        variant="h5" 
        component="h2"
        sx={{ 
          color: 'text.primary',
          mb: 2,
          fontWeight: 'bold'
        }}
      >
        Contributors ({contributors.length})
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search contributors..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        }}
      />
      <List 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 1
        }}
      >
        {displayedContributors.map((contributor) => (
          <ListItem key={contributor.id}>
            <ListItemAvatar>
              <Avatar 
                src={contributor.avatar_url} 
                sx={{ bgcolor: 'primary.main' }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={contributor.login}
              secondary={`${contributor.contributions} contributions`}
              sx={{
                color: 'text.secondary',
                opacity: isDarkMode ? 0.9 : 0.7
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        {hasMoreContributors && (
          <Button
            variant="outlined"
            onClick={handleShowMore}
            sx={{
              color: 'primary.main',
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText'
              }
            }}
          >
            Show More (+5)
          </Button>
        )}
        
        {visibleCount > 5 && (
          <Button
            variant="outlined"
            onClick={handleShowLess}
            sx={{
              color: 'secondary.main',
              borderColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText'
              }
            }}
          >
            Show Less
          </Button>
        )}
      </Box>
      
      {searchTerm && filteredContributors.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No contributors found matching "{searchTerm}"
          </Typography>
        </Box>
      )}
      
      {searchTerm && filteredContributors.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {displayedContributors.length} of {filteredContributors.length} contributors
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ContributorsList;
