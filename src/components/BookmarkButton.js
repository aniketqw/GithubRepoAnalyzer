import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { addToBookmarks, removeFromBookmarks, isBookmarked } from '../utils/storage';

function BookmarkButton({ repoData, size = 'medium' }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (repoData?.id) {
      setBookmarked(isBookmarked(repoData.id));
    }
  }, [repoData]);

  const handleToggleBookmark = (event) => {
    event.stopPropagation();
    
    if (!repoData?.id) return;

    if (bookmarked) {
      removeFromBookmarks(repoData.id);
      setBookmarked(false);
    } else {
      addToBookmarks(repoData);
      setBookmarked(true);
    }
  };

  if (!repoData?.id) return null;

  return (
    <Tooltip title={bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}>
      <IconButton
        onClick={handleToggleBookmark}
        size={size}
        sx={{
          color: bookmarked ? 'warning.main' : 'text.secondary',
          '&:hover': {
            color: bookmarked ? 'warning.dark' : 'warning.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        {bookmarked ? <Bookmark /> : <BookmarkBorder />}
      </IconButton>
    </Tooltip>
  );
}

export default BookmarkButton;