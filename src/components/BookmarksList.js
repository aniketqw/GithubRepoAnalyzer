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
  Chip,
  Avatar
} from '@mui/material';
import {
  Bookmark,
  Delete,
  Clear,
  GitHub,
  Star,
  Code
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getBookmarks, removeFromBookmarks, clearBookmarks } from '../utils/storage';

function BookmarksList({ open, onClose }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (open) {
      loadBookmarks();
    }
  }, [open]);

  const loadBookmarks = () => {
    const savedBookmarks = getBookmarks();
    setBookmarks(savedBookmarks);
  };

  const handleSelectRepo = (bookmark) => {
    navigate(`/repo/${bookmark.owner}/${bookmark.repo}`);
    onClose();
  };

  const handleRemoveBookmark = (event, repoId) => {
    event.stopPropagation();
    removeFromBookmarks(repoId);
    loadBookmarks();
  };

  const handleClearAll = () => {
    clearBookmarks();
    setBookmarks([]);
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
        <Bookmark sx={{ color: 'warning.main' }} />
        <Typography variant="h6">Bookmarked Repositories</Typography>
        {bookmarks.length > 0 && (
          <Chip 
            label={`${bookmarks.length} bookmarks`} 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        )}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0, bgcolor: 'background.default' }}>
        {bookmarks.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            color: 'text.secondary'
          }}>
            <Bookmark sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No bookmarks yet
            </Typography>
            <Typography variant="body2">
              Bookmark repositories to quickly access them later
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {bookmarks.map((bookmark, index) => (
              <React.Fragment key={`${bookmark.id}-${index}`}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectRepo(bookmark)}
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      >
                        <GitHub />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {bookmark.full_name}
                          </Typography>
                          {bookmark.language && (
                            <Chip
                              icon={<Code />}
                              label={bookmark.language}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {bookmark.description || 'No description'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ fontSize: 14, color: 'warning.main' }} />
                              <Typography variant="caption">
                                {bookmark.stars?.toLocaleString() || 0}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              Bookmarked {formatTimeAgo(bookmark.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleRemoveBookmark(e, bookmark.id)}
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
                {index < bookmarks.length - 1 && <Divider />}
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
        {bookmarks.length > 0 && (
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

export default BookmarksList;