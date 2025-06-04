import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Typography,
  Box,
  Divider,
  Chip
} from '@mui/material';
import {
  History,
  Delete,
  Clear,
  GitHub,
  AccessTime
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory } from '../utils/storage';

function SearchHistory({ open, onClose, onSelectRepo }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = () => {
    const searchHistory = getSearchHistory();
    setHistory(searchHistory);
  };

  const handleSelectRepo = (item) => {
    onSelectRepo(item.url);
    onClose();
  };

  const handleRemoveItem = (event, owner, repo) => {
    event.stopPropagation();
    removeFromSearchHistory(owner, repo);
    loadHistory();
  };

  const handleClearAll = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <History />
        <Typography variant="h6">Search History</Typography>
        {history.length > 0 && (
          <Chip 
            label={`${history.length} items`} 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
        {history.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <History sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No search history yet
            </Typography>
            <Typography variant="body2">
              Repositories you analyze will appear here for quick access
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {history.map((item, index) => (
              <React.Fragment key={`${item.owner}-${item.repo}-${index}`}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectRepo(item)}
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
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {item.displayName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {formatTimeAgo(item.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleRemoveItem(e, item.owner, item.repo)}
                        size="small"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main',
                            bgcolor: isDarkMode ? 'error.dark' : 'error.light'
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ 
        p: 2, 
        bgcolor: 'background.paper',
        justifyContent: 'space-between'
      }}>
        {history.length > 0 && (
          <Button
            startIcon={<Clear />}
            onClick={handleClearAll}
            color="error"
            variant="outlined"
            size="small"
          >
            Clear All
          </Button>
        )}
        <Box sx={{ ml: 'auto' }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default SearchHistory;