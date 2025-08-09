import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
} from '@mui/material';

const initialKPIs = [
  { id: 1, name: 'Sales Growth', target: 10, achieved: 8, weight: 30 },
  { id: 2, name: 'Customer Retention', target: 90, achieved: 85, weight: 25 },
];

export default function AdminKpiDashboard() {
  const [kpis, setKpis] = useState(initialKPIs);
  const [editedKpis, setEditedKpis] = useState(initialKPIs);

  const handleChange = (id, field, value) => {
    setEditedKpis(prev =>
      prev.map(kpi =>
        kpi.id === id ? { ...kpi, [field]: value } : kpi
      )
    );
  };

  const handleSave = () => {
    setKpis(editedKpis);
    // Optionally: send to API
  };

  const handleCancel = () => {
    setEditedKpis(kpis);
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" mb={3}>KPI Management Dashboard (Coming soon....)</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>KPI Name</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Achieved</TableCell>
            <TableCell>Weight (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editedKpis.map(kpi => (
            <TableRow key={kpi.id}>
              <TableCell>{kpi.name}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={kpi.target}
                  onChange={e => handleChange(kpi.id, 'target', e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={kpi.achieved}
                  onChange={e => handleChange(kpi.id, 'achieved', e.target.value)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={kpi.weight}
                  onChange={e => handleChange(kpi.id, 'weight', e.target.value)}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={3} display="flex" gap={2}>
        <Button variant="contained" onClick={handleSave}>Save</Button>
        <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
      </Box>
    </Paper>
  );
}
