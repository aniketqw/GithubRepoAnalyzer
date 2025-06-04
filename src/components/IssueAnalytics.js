import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BugReport,
  CheckCircle,
  Schedule,
  TrendingUp,
  Person
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getIssues } from '../services/githubService';
import { ChartSkeleton } from './Skeleton';

function IssueAnalytics({ owner, repo }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        const issuesData = await getIssues(owner, repo, 100, 'all');
        processIssueAnalytics(issuesData);
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [owner, repo]);

  const processIssueAnalytics = (issuesData) => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter out pull requests (GitHub API includes PRs in issues)
    const actualIssues = issuesData.filter(issue => !issue.pull_request);

    const openIssues = actualIssues.filter(issue => issue.state === 'open');
    const closedIssues = actualIssues.filter(issue => issue.state === 'closed');

    // Recent issues (last 30 days)
    const recentIssues = actualIssues.filter(issue => 
      new Date(issue.created_at) >= oneMonthAgo
    );

    // Issue resolution time for closed issues
    const closedWithTimes = closedIssues
      .filter(issue => issue.closed_at)
      .map(issue => {
        const created = new Date(issue.created_at);
        const closed = new Date(issue.closed_at);
        const daysOpen = (closed - created) / (1000 * 60 * 60 * 24);
        return { ...issue, daysOpen };
      });

    const avgResolutionTime = closedWithTimes.length > 0
      ? closedWithTimes.reduce((sum, issue) => sum + issue.daysOpen, 0) / closedWithTimes.length
      : 0;

    // Most active contributors
    const contributorActivity = {};
    actualIssues.forEach(issue => {
      const author = issue.user.login;
      contributorActivity[author] = (contributorActivity[author] || 0) + 1;
    });

    const topContributors = Object.entries(contributorActivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([login, count]) => ({
        login,
        count,
        user: actualIssues.find(issue => issue.user.login === login)?.user
      }));

    // Labels analysis
    const labelCount = {};
    actualIssues.forEach(issue => {
      issue.labels.forEach(label => {
        labelCount[label.name] = (labelCount[label.name] || 0) + 1;
      });
    });

    const topLabels = Object.entries(labelCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8);

    setAnalytics({
      total: actualIssues.length,
      open: openIssues.length,
      closed: closedIssues.length,
      recent: recentIssues.length,
      avgResolutionTime: Math.round(avgResolutionTime),
      topContributors,
      topLabels,
      recentIssues: recentIssues.slice(0, 5)
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  if (loading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">
            Error loading issue analytics: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!analytics.total) {
    return (
      <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
        <CardHeader title="Issue Analytics" />
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No issues found for this repository
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const closedPercentage = analytics.total > 0 ? (analytics.closed / analytics.total) * 100 : 0;

  return (
    <Card sx={{ mb: 4, boxShadow: isDarkMode ? 2 : 4 }}>
      <CardHeader 
        title="Issue Analytics" 
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      />
      <CardContent>
        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <BugReport sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {analytics.total}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Issues
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <Schedule sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {analytics.open}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Open Issues
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {analytics.closed}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Closed Issues
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <TrendingUp sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {analytics.avgResolutionTime}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg Resolution (days)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Issue Resolution Progress</Typography>
            <Typography variant="body2" color="text.secondary">
              {closedPercentage.toFixed(1)}% resolved
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={closedPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Top Contributors */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1 }} />
              Top Issue Contributors
            </Typography>
            <List sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
              {analytics.topContributors.map((contributor, index) => (
                <React.Fragment key={contributor.login}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar 
                        src={contributor.user?.avatar_url}
                        sx={{ width: 32, height: 32 }}
                      >
                        {contributor.login[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={contributor.login}
                      secondary={`${contributor.count} issues`}
                    />
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </ListItem>
                  {index < analytics.topContributors.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          {/* Recent Issues */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Issues (Last 30 days: {analytics.recent})
            </Typography>
            <List sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
              {analytics.recentIssues.map((issue, index) => (
                <React.Fragment key={issue.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          #{issue.number}: {issue.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={issue.state}
                            size="small"
                            color={issue.state === 'open' ? 'warning' : 'success'}
                            sx={{ fontSize: '0.7rem', height: 18 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(issue.created_at)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < analytics.recentIssues.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Grid>

          {/* Top Labels */}
          {analytics.topLabels.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Most Used Labels
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analytics.topLabels.map(([label, count]) => (
                  <Chip
                    key={label}
                    label={`${label} (${count})`}
                    variant="outlined"
                    size="small"
                    sx={{ 
                      bgcolor: 'background.default',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  />
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default IssueAnalytics;