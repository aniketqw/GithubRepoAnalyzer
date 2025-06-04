import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const RepoCardSkeleton = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Skeleton variant="circular" width={56} height={56} />
          </Grid>
          <Grid item xs>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="30%" height={20} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const StatisticsSkeleton = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
      <CardHeader title={<Skeleton variant="text" width="30%" height={28} />} />
      <CardContent>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Skeleton variant="text" width="80%" height={32} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto' }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export const ChartSkeleton = ({ title = "Chart" }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
      <CardHeader title={<Skeleton variant="text" width="40%" height={28} />} />
      <CardContent>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ListSkeleton = ({ items = 5, title = "List" }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
      <CardHeader title={<Skeleton variant="text" width="30%" height={28} />} />
      <CardContent>
        {Array.from({ length: items }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
            <Skeleton variant="text" width="15%" height={20} />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <Box>
      <RepoCardSkeleton />
      <StatisticsSkeleton />
      <ChartSkeleton />
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ChartSkeleton />
        </Grid>
        <Grid item xs={12} md={6}>
          <ListSkeleton />
        </Grid>
      </Grid>
    </Box>
  );
};

const SkeletonComponent = ({ height = '200px', width = '100%' }) => {
  return <Skeleton variant="rectangular" width={width} height={height} />;
};

export default SkeletonComponent;
