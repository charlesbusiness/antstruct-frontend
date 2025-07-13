import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  styled
} from "@mui/material";
import {
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Description as DocumentIcon,
  Close as CloseIcon
} from "@mui/icons-material";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Policies = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const supportedFileTypes = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (!supportedFileTypes.includes(file.type)) {
      setSnackbar({
        open: true,
        message: "Unsupported file type. Please upload PDF, TXT, or DOC/DOCX files.",
        severity: "error"
      });
      return;
    }

    const newFile = {
      id: Date.now(),
      file,
      name: file.name,
      description: description.trim(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      size: (file.size / 1024).toFixed(2) + " KB"
    };

    setFiles([...files, newFile]);
    setDescription("");
    setSnackbar({
      open: true,
      message: "File uploaded successfully!",
      severity: "success"
    });
  };

  const handleDelete = (id) => {
    setFiles(files.filter(f => f.id !== id));
    setSnackbar({
      open: true,
      message: "File deleted successfully!",
      severity: "info"
    });
  };

  const handleView = (fileObj) => {
    setSelectedFile(fileObj);
    setDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Policy Document Management
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Upload New Policy Document
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Document Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Enter a brief description of the document"
          />
          
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadIcon />}
            sx={{ minWidth: 180 }}
          >
            Upload Document
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
              accept=".pdf,.txt,.doc,.docx"
            />
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                <TableCell sx={{ color: "white" }}>Document Name</TableCell>
                <TableCell sx={{ color: "white" }}>Description</TableCell>
                <TableCell sx={{ color: "white" }}>Date Uploaded</TableCell>
                <TableCell sx={{ color: "white" }}>File Size</TableCell>
                <TableCell sx={{ color: "white" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.length > 0 ? (
                files.map((file) => (
                  <StyledTableRow key={file.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DocumentIcon color="primary" />
                        <Typography variant="body2">{file.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {file.description || "No description provided"}
                      </Typography>
                    </TableCell>
                    <TableCell>{file.date}</TableCell>
                    <TableCell>{file.size}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View document">
                        <IconButton
                          onClick={() => handleView(file)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete document">
                        <IconButton
                          onClick={() => handleDelete(file.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No policy documents uploaded yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: "80vh" } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Viewing: {selectedFile?.name}</span>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {selectedFile && (
            <iframe
              src={URL.createObjectURL(selectedFile.file)}
              title="Document Viewer"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
          <Typography variant="caption" color="textSecondary">
            {selectedFile?.size} • Uploaded on {selectedFile?.date}
          </Typography>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Policies;