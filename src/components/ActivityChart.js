import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
} from 'chart.js';
import { getCommits } from '../services/githubService';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ActivityChart() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { owner, repo } = useParams();
  const [activityData, setActivityData] = useState({
    labels: [],
    commits: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const commits = await getCommits(owner, repo);
        
        // Process commits to get monthly activity
        const commitsByMonth = {};
        commits.forEach(commit => {
          const date = new Date(commit.commit.author.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month} ${year}`;
          commitsByMonth[key] = (commitsByMonth[key] || 0) + 1;
        });

        // Sort months and create data
        const labels = Object.keys(commitsByMonth).sort();
        const commitCounts = labels.map(label => commitsByMonth[label]);

        setActivityData({
          labels,
          commits: commitCounts
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
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

  const data = {
    labels: activityData.labels,
    datasets: [{
      label: 'Commits',
      data: activityData.commits,
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.main,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line options={options} data={data} />
    </div>
  );
}

export default ActivityChart;
