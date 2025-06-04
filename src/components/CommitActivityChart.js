import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ChartSkeleton } from './Skeleton';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { getWeeklyCommitActivity } from '../services/githubService';

// Register the required chart components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

function CommitActivityChart({ owner, repo }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const processCommitActivity = React.useCallback((activityData) => {
    if (!activityData || !Array.isArray(activityData) || activityData.length === 0) {
      return;
    }
    
    // Sort activity data by week timestamp to ensure correct date order
    const sortedData = [...activityData].sort((a, b) => a.week - b.week);
    
    // Extract weeks and commit counts with year information
    const labels = sortedData.map(week => {
      const date = new Date(week.week * 1000); // Convert Unix timestamp to Date
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    });
    
    const commitCounts = sortedData.map(week => week.total);
    
    // Configure chart data
    const data = {
      labels,
      datasets: [
        {
          label: 'Commits',
          data: commitCounts,
          borderColor: theme.palette.primary.main,
          backgroundColor: isDarkMode 
            ? 'rgba(25, 118, 210, 0.2)' // Blue with transparency for dark mode
            : 'rgba(66, 165, 245, 0.2)', // Lighter blue with transparency for light mode
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: theme.palette.primary.main,
          pointBorderColor: isDarkMode ? '#121212' : '#ffffff',
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    };
    
    setChartData(data);
  }, [theme.palette.primary.main, isDarkMode]);

  useEffect(() => {
    async function fetchCommitActivity() {
      try {
        setLoading(true);
        const data = await getWeeklyCommitActivity(owner, repo);
        
        // GitHub's stats API sometimes returns 202 with empty array initially
        // or returns null/undefined while stats are being computed
        if (data === null || data === undefined) {
          setError('Commit activity data is being computed. Please try again in a moment.');
          return;
        }
        
        if (!Array.isArray(data)) {
          console.warn('Unexpected data format for commit activity:', data);
          // Show a fallback message instead of error for repositories without activity
          setChartData(null);
          return;
        }
        
        processCommitActivity(data);
      } catch (err) {
        console.error('Error fetching commit activity:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCommitActivity();
  }, [owner, repo, processCommitActivity]);
  
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
          // Show every 6th label to prevent overcrowding with year data
          callback: function(value, index) {
            return index % 6 === 0 ? this.getLabelForValue(value) : '';
          }
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily
          }
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: theme.palette.divider,
        borderWidth: 1,
        callbacks: {
          title: (tooltipItems) => {
            return `Week of ${tooltipItems[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.raw} commits`;
          }
        }
      },
    },
  };
  
  if (loading) {
    return <ChartSkeleton />;
  }
  
  if (error) {
    return (
      <Card sx={{ 
        mb: 4, 
        bgcolor: 'background.paper',
        boxShadow: isDarkMode ? 2 : 4 
      }}>
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Typography color="error">
            Error loading commit activity: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (!chartData) {
    return (
      <Card sx={{ 
        mb: 4, 
        bgcolor: 'background.paper',
        boxShadow: isDarkMode ? 2 : 4 
      }}>
        <CardHeader 
          title="Weekly Commit Activity" 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            color: 'text.primary'
          }}
        />
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No commit activity data available for this repository
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This may be a new repository or statistics are still being computed
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ 
      mb: 4, 
      bgcolor: 'background.paper',
      boxShadow: isDarkMode ? 2 : 4 
    }}>
      <CardHeader 
        title="Weekly Commit Activity" 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          color: 'text.primary'
        }}
      />
      <CardContent>
        <Box sx={{ height: 300, p: 1 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommitActivityChart;
