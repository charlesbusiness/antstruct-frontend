import React, { useCallback, useState, useRef } from 'react';
import { CloudUpload, InsertDriveFile, Cancel } from '@mui/icons-material';
import { Box, Typography, Button, IconButton, CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/system';

const FileUpload = ({ onFileSelect, loading = false, maxSizeMB = 5 }) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const UploadContainer = styled(Box)(({ $dragging }) => ({
    border: '2px dashed',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    backgroundColor: $dragging ? theme.palette.primary.light : theme.palette.grey[50],
    borderColor: $dragging ? theme.palette.primary.main : theme.palette.grey[400],
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.lighter,
    },
    cursor: 'pointer',
  }));

  const validateFile = (file) => {
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
    const maxSize = maxSizeMB * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an SVG, PNG, JPG, or GIF.');
      return false;
    }
    
    if (file.size > maxSize) {
      setError(`File too large. Max size is ${maxSizeMB}MB.`);
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
        setFile(files[0]);
      }
    }
  }, [onFileSelect, maxSizeMB]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (validateFile(files[0])) {
        onFileSelect(files[0]);
        setFile(files[0]);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    fileInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Completely hidden file input - required for actual file selection */}
      <input
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.gif"
        ref={fileInputRef}
        onChange={handleFileSelect}
        disabled={loading}
        style={{ display: 'none' }}
      />
      
      {file ? (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InsertDriveFile color="primary" />
            <Typography variant="body1">{file.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <IconButton onClick={handleRemoveFile} color="error">
              <Cancel />
            </IconButton>
          )}
        </Box>
      ) : (
        <UploadContainer 
          $dragging={dragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          {loading ? (
            <CircularProgress size={48} />
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Drag & drop files here
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or click to browse
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Supported formats: SVG, PNG, JPG, GIF (max {maxSizeMB}MB)
              </Typography>
              <Button
                variant="contained"
                component="span"
                sx={{ mt: 2 }}
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the container click
                  triggerFileInput();
                }}
              >
                SELECT FILE
              </Button>
            </>
          )}
        </UploadContainer>
      )}
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;