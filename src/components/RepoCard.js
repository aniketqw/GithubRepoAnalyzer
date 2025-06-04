import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Avatar } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { RepoCardSkeleton } from './Skeleton';
import BookmarkButton from './BookmarkButton';

function RepoCard({ repoData }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading] = useState(!repoData);
  const [error] = useState(null);
  
  // If repoData is not provided, we'll show a loading state
  // The parent component is responsible for fetching the data

  if (loading || !repoData) {
    return <RepoCardSkeleton />;
  }

  if (error) {
    return (
      <Card 
        sx={{ 
          mb: 4,
          bgcolor: 'background.paper',
          boxShadow: isDarkMode ? 2 : 4
        }}
      >
        <CardContent>
          <Typography 
            color="error" 
            sx={{ 
              bgcolor: 'background.paper',
              p: 2,
              borderRadius: 1
            }}
          >
            Error: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        mb: 4,
        bgcolor: 'background.paper',
        boxShadow: isDarkMode ? 2 : 4
      }}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ bgcolor: 'primary.main' }}
            >
              <GitHub />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography 
              variant="h5" 
              component="h2"
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
              onClick={() => window.open(repoData.html_url, '_blank')}
            >
              {repoData.name}
            </Typography>
            <Typography 
              color="text.secondary" 
              paragraph
              sx={{ 
                color: 'text.secondary',
                opacity: isDarkMode ? 0.9 : 0.7
              }}
            >
              {repoData.description || 'No description'}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                color: 'text.secondary',
                opacity: isDarkMode ? 0.9 : 0.7
              }}
            >
              <GitHub sx={{ mr: 1, color: 'text.secondary' }} /> {repoData.stargazers_count} stars
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{ 
                color: 'text.secondary',
                opacity: isDarkMode ? 0.9 : 0.7
              }}
            >
              Forks: {repoData.forks_count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Language: {repoData.language || 'Not specified'}
            </Typography>
          </Grid>
          <Grid item>
            <BookmarkButton repoData={repoData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RepoCard;
