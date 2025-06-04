import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Download,
  DataObject,
  TableChart,
  Description
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  exportToJSON,
  exportToCSV,
  prepareRepoDataForExport
} from '../utils/exportUtils';

function ExportButton({ repoData, additionalData = {}, filename, variant = 'outlined', size = 'medium' }) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleExportJSON = async () => {
    try {
      const exportData = prepareRepoDataForExport(repoData, additionalData);
      const success = exportToJSON(exportData, filename || repoData.name);
      
      if (success) {
        showNotification('Repository data exported to JSON successfully!');
      } else {
        showNotification('Failed to export data. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification('An error occurred during export.', 'error');
    }
    handleClose();
  };

  const handleExportCSV = async () => {
    try {
      const exportData = prepareRepoDataForExport(repoData, additionalData);
      const success = exportToCSV(exportData.repository, filename || repoData.name);
      
      if (success) {
        showNotification('Repository data exported to CSV successfully!');
      } else {
        showNotification('Failed to export data. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification('An error occurred during export.', 'error');
    }
    handleClose();
  };

  const handleExportFullReport = async () => {
    try {
      const exportData = prepareRepoDataForExport(repoData, additionalData);
      const reportData = {
        ...exportData,
        report_type: 'full_analysis',
        sections: Object.keys(additionalData)
      };
      
      const success = exportToJSON(reportData, `${filename || repoData.name}_full_report`);
      
      if (success) {
        showNotification('Full analysis report exported successfully!');
      } else {
        showNotification('Failed to export report. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      showNotification('An error occurred during export.', 'error');
    }
    handleClose();
  };

  if (!repoData) {
    return null;
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={<Download />}
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          fontWeight: 500
        }}
      >
        Export Data
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={handleExportJSON}>
          <ListItemIcon>
            <DataObject fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Export as JSON"
            secondary="Complete data structure"
          />
        </MenuItem>

        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Export as CSV"
            secondary="Basic repository info"
          />
        </MenuItem>

        {Object.keys(additionalData).length > 0 && (
          <>
            <Divider />
            <MenuItem onClick={handleExportFullReport}>
              <ListItemIcon>
                <Description fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Full Analysis Report"
                secondary="Complete analysis with all data"
              />
            </MenuItem>
          </>
        )}
      </Menu>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ExportButton;