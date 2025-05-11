import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Add, Delete, Check, Close } from '@mui/icons-material';
import { CreateRequisition } from '../components/requisitions/requisition-form';
import { RequisitionList } from '../components/requisitions/requisition-list';

const RequisitionPage = () => {
  // Sample initial data


  // State for new requisition dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequisition, setNewRequisition] = useState({
    purpose: '',
    approval_officer: '',
    requesting_department: '',
    description: '',
    budget: '',
    quantity: 1,
    department: '',
    date: new Date().toISOString().split('T')[0]
  });


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });



  // New requisition handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition({ ...newRequisition, [name]: value });
  };


  // Notification handler
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Requisition Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Requisition
        </Button>
      </Box>

      <RequisitionList />

      {/* New Requisition Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Requisition</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <CreateRequisition />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequisitionPage;