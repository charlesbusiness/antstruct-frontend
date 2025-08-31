import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useSubmitData from '../../hooks/useSubmitData';
import { ApiRoutes } from '../../utils/ApiRoutes';

export default function Supplier() {
  const navigate = useNavigate();
  const { submitData } = useSubmitData();
  const queryClient = useQueryClient();

  // Dialog states
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', phone: '' });

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await submitData({ method: 'get', endpoint: ApiRoutes.suppliers.get });
      return res?.data ?? [];
    }
  });

  // Create/Update supplier
  const mutation = useMutation({
    mutationFn: async (supplier) => {
      if (supplier.id) {
        return await submitData({ method: 'patch', endpoint: ApiRoutes.suppliers.update(supplier.id), data: supplier });
      }
      return await submitData({ method: 'post', endpoint: ApiRoutes.suppliers.create, data: supplier });
    },
    onSuccess: () => queryClient.invalidateQueries(['suppliers'])
  });

  // Delete supplier
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await submitData({ method: 'delete', endpoint: `${ApiRoutes.suppliers.delete}/${id}` });
    },
    onSuccess: () => queryClient.invalidateQueries(['suppliers'])
  });

  const handleOpen = (supplier = null) => {
    setFormData(supplier ?? { id: null, name: '', email: '', phone: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    mutation.mutate(formData);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/inventory')}>
        Back to Inventory
      </Button>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>
        + Add Supplier
      </Button>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.phone}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(s)}><Edit /></IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(s.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Create/Update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
