import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Chip, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import { Key, Close, Check, Warning } from '@mui/icons-material';
import { hasApiKey, getRateLimitInfo, setApiKey } from '../services/githubService';

const ApiKeyStatus = () => {
    const [hasKey, setHasKey] = useState(false);
    const [rateLimitInfo, setRateLimitInfo] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateStatus = () => {
        const keyExists = hasApiKey();
        const limitInfo = getRateLimitInfo();
        setHasKey(keyExists);
        setRateLimitInfo(limitInfo);
    };

    useEffect(() => {
        updateStatus();
    }, []);

    const handleOpenDialog = () => {
        setDialogOpen(true);
        setError('');
        setApiKeyInput('');
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setError('');
        setApiKeyInput('');
    };

    const handleSaveApiKey = async () => {
        if (!apiKeyInput.trim()) {
            setError('Please enter a valid API key');
            return;
        }

        setLoading(true);
        setError('');

        try {
            setApiKey(apiKeyInput.trim());
            updateStatus();
            handleCloseDialog();
        } catch (err) {
            setError('Failed to save API key. Please check the key and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveApiKey = () => {
        setApiKey(null);
        updateStatus();
        handleCloseDialog();
    };

    const getStatusColor = () => {
        return hasKey ? 'success' : 'warning';
    };

    const getStatusIcon = () => {
        return hasKey ? <Check sx={{ fontSize: 16 }} /> : <Warning sx={{ fontSize: 16 }} />;
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Click to manage GitHub API key">
                    <Chip
                        icon={getStatusIcon()}
                        label={rateLimitInfo?.type || 'Loading...'}
                        color={getStatusColor()}
                        variant="outlined"
                        clickable
                        onClick={handleOpenDialog}
                        sx={{ 
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: hasKey ? 'success.50' : 'warning.50'
                            }
                        }}
                    />
                </Tooltip>
                <Typography variant="caption" color="text.secondary">
                    {rateLimitInfo ? `${rateLimitInfo.limit} req/hour` : ''}
                </Typography>
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Key />
                        GitHub API Key Management
                    </Box>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Public API:</strong> 60 requests per hour (no key required)<br/>
                                <strong>Private API:</strong> 5,000 requests per hour (requires GitHub personal access token)
                            </Typography>
                        </Alert>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Current Status: <strong>{rateLimitInfo?.type}</strong> ({rateLimitInfo?.limit} req/hour)
                            </Typography>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="GitHub Personal Access Token"
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder={hasKey ? "Enter new API key to replace current one" : "Enter your GitHub API key"}
                        helperText={
                            <Box component="span">
                                Get your token from {' '}
                                <Button 
                                    variant="text" 
                                    size="small" 
                                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                                    onClick={() => window.open('https://github.com/settings/tokens', '_blank')}
                                >
                                    GitHub Settings → Personal Access Tokens
                                </Button>
                            </Box>
                        }
                        sx={{ mb: 2 }}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Box>
                            {hasKey && (
                                <Button 
                                    onClick={handleRemoveApiKey}
                                    color="error"
                                    variant="outlined"
                                >
                                    Remove Key
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button onClick={handleCloseDialog}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSaveApiKey}
                                variant="contained"
                                disabled={loading || !apiKeyInput.trim()}
                            >
                                {loading ? 'Saving...' : hasKey ? 'Update Key' : 'Save Key'}
                            </Button>
                        </Box>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ApiKeyStatus;