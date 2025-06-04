import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  CircularProgress, 
  useTheme 
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getLanguages } from '../services/githubService';

// Register the required chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Color palette for language chart
const LANGUAGE_COLORS = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Yellow
  '#9b59b6', // Purple
  '#1abc9c', // Turquoise
  '#d35400', // Orange
  '#34495e', // Dark Blue
  '#7f8c8d', // Gray
  '#27ae60', // Dark Green
  '#c0392b', // Dark Red
  '#8e44ad', // Dark Purple
];

function LanguageChart({ owner, repo }) {
  const [languages, setLanguages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Fetch languages data
  useEffect(() => {
    const fetchLanguages = async () => {
      if (!owner || !repo) return;
      
      try {
        setLoading(true);
        const data = await getLanguages(owner, repo);
        setLanguages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError('Failed to load language data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLanguages();
  }, [owner, repo]);
  
  // Format bytes to human-readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / (k ** i)).toFixed(2))} ${sizes[i]}`;
  };
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!languages || Object.keys(languages).length === 0) return null;
    
    const total = Object.values(languages).reduce((sum, value) => sum + value, 0);
    const languageData = Object.entries(languages)
      .map(([name, value]) => ({
        name,
        value,
        percentage: ((value / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
    
    // Take top 10 languages, group others
    const topLanguages = languageData.slice(0, 10);
    
    // If there are more than 10 languages, add an "Others" category
    if (languageData.length > 10) {
      const othersValue = languageData
        .slice(10)
        .reduce((sum, lang) => sum + lang.value, 0);
      
      if (othersValue > 0) {
        topLanguages.push({
          name: 'Others',
          value: othersValue,
          percentage: ((othersValue / total) * 100).toFixed(1)
        });
      }
    }
    
    return {
      labels: topLanguages.map(lang => lang.name),
      datasets: [{
        data: topLanguages.map(lang => lang.value),
        backgroundColor: LANGUAGE_COLORS.slice(0, topLanguages.length),
        borderColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      }]
    };
  }, [languages, isDarkMode]);
  
  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: theme.palette.text.primary,
          usePointStyle: true,
          padding: 15,
          font: {
            family: theme.typography.fontFamily,
            size: 11
          },
          generateLabels: (chart) => {
            const { data } = chart;
            if (data.labels.length && data.datasets.length) {
              const { labels } = data;
              const { data: values, backgroundColor } = data.datasets[0];
              
              const total = values.reduce((acc, val) => acc + val, 0);
              
              return labels.map((label, i) => ({
                text: `${label} (${((values[i] / total) * 100).toFixed(1)}%)`,
                fillStyle: backgroundColor[i],
                strokeStyle: backgroundColor[i],
                lineWidth: 0,
                index: i
              }));
            }
            return [];
          }
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatBytes(value)} (${percentage}%)`;
          }
        },
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: theme.palette.divider,
        borderWidth: 1
      }
    }
  }), [isDarkMode, theme]);
  
  // Loading state
  if (loading) {
    return (
      <Card sx={{ mb: 4, bgcolor: 'background.paper', boxShadow: isDarkMode ? 2 : 4 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Card sx={{ mb: 4, bgcolor: 'background.paper', boxShadow: isDarkMode ? 2 : 4 }}>
        <CardContent>
          <Typography color="error">
            {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  // No data state
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <Card sx={{ mb: 4, bgcolor: 'background.paper', boxShadow: isDarkMode ? 2 : 4 }}>
        <CardContent>
          <Typography color="text.secondary">
            No language data available for this repository.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  
  // Main chart render
  return (
    <Card sx={{ 
      mb: 4, 
      bgcolor: 'background.paper',
      boxShadow: isDarkMode ? 2 : 4 
    }}>
      <CardHeader 
        title="Language Distribution" 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          color: 'text.primary',
          pb: 1
        }}
      />
      <CardContent>
        <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
          {chartData && <Doughnut data={chartData} options={chartOptions} />}
        </Box>
      </CardContent>
    </Card>
  );
}

export default LanguageChart;
