import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Mock data for suppliers and stock movement
const suppliers = [
  { id: 1, name: 'Acme Supplies', contact: 'acme@email.com', phone: '123-456-7890' },
  { id: 2, name: 'Global Traders', contact: 'global@email.com', phone: '987-654-3210' },
];

const stockMovements = [
  { id: 1, item: 'Printer Paper', type: 'IN', quantity: 100, date: '2025-08-01', supplier: 'Acme Supplies' },
  { id: 2, item: 'Printer Paper', type: 'OUT', quantity: 20, date: '2025-08-10', supplier: '-' },
  { id: 3, item: 'Ink Cartridge', type: 'IN', quantity: 50, date: '2025-08-05', supplier: 'Global Traders' },
  { id: 4, item: 'Ink Cartridge', type: 'OUT', quantity: 10, date: '2025-08-12', supplier: '-' },
];

export default function SuppliersAndStock() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/inventory')}>
        Back to Inventory
      </Button>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Item Suppliers
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.contact}</TableCell>
                <TableCell>{s.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Stock Movement
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Supplier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockMovements.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.date}</TableCell>
                <TableCell>{m.item}</TableCell>
                <TableCell>{m.type}</TableCell>
                <TableCell>{m.quantity}</TableCell>
                <TableCell>{m.supplier}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
