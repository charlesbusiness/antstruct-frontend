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

const RequisitionPage = () => {
  // Sample initial data
  const [requisitions, setRequisitions] = useState([
    { id: 1, item: 'Laptop', quantity: 5, department: 'IT', status: 'Pending', date: '2023-05-15' },
    { id: 2, item: 'Office Chair', quantity: 10, department: 'HR', status: 'Pending', date: '2023-05-16' },
    { id: 3, item: 'Printer', quantity: 2, department: 'Finance', status: 'Approved', date: '2023-05-10' },
  ]);

  // State for new requisition dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequisition, setNewRequisition] = useState({
    item: '',
    quantity: 1,
    department: '',
    date: new Date().toISOString().split('T')[0]
  });

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle actions
  const handleApprove = (id) => {
    setRequisitions(requisitions.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
    showNotification('Requisition approved successfully');
  };

  const handleCancel = (id) => {
    setRequisitions(requisitions.map(req => 
      req.id === id ? { ...req, status: 'Cancelled' } : req
    ));
    showNotification('Requisition cancelled');
  };

  const handleDelete = (id) => {
    setRequisitions(requisitions.filter(req => req.id !== id));
    showNotification('Requisition deleted');
  };

  // New requisition handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition({ ...newRequisition, [name]: value });
  };

  const handleSubmit = () => {
    const newId = Math.max(...requisitions.map(req => req.id), 0) + 1;
    setRequisitions([
      ...requisitions,
      {
        id: newId,
        ...newRequisition,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setOpenDialog(false);
    setNewRequisition({
      item: '',
      quantity: 1,
      department: '',
      date: new Date().toISOString().split('T')[0]
    });
    showNotification('New requisition created');
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requisitions.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.item}</TableCell>
                <TableCell>{req.quantity}</TableCell>
                <TableCell>{req.department}</TableCell>
                <TableCell>{req.date}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        req.status === 'Approved'
                          ? 'success.light'
                          : req.status === 'Cancelled'
                          ? 'error.light'
                          : 'warning.light',
                      color: 'white',
                    }}
                  >
                    {req.status}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {req.status === 'Pending' && (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleApprove(req.id)}
                        title="Approve"
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleCancel(req.id)}
                        title="Cancel"
                      >
                        <Close />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(req.id)}
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Requisition Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Requisition</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Item Name"
              name="item"
              value={newRequisition.item}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={newRequisition.quantity}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Department"
              name="department"
              value={newRequisition.department}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={newRequisition.date}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newRequisition.item || !newRequisition.department}
          >
            Submit
          </Button>
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