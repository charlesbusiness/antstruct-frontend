import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import QuickLinks from "./QuickLinks";
import StatsOverview from "./StatsOverview";

import useBusinessProfile from '../../hooks/useBusinessProfile';
import useSubmitData from '../../hooks/useSubmitData';
import { ApiRoutes } from '../../utils/ApiRoutes';

const HRDashboard = () => {
  const [open, setOpen] = useState(false)
  const { submitData } = useSubmitData()
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const { businessInfo } = useBusinessProfile()

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const [formData, setFormData] = useState({
    leave_category_id: '',
    request_days: '',
    start_date: '',
    end_date: '',
    reason: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleApply = async (e) => {
    e.preventDefault()
    const response = await submitData({
      endpoint: ApiRoutes.hrManager.leave.applications.apply,
      data: formData,
      reload: false
    })
    if (response.success) {
      showSnackbar("Leave application submitted!", "success");
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (formData.start_date && formData.request_days) {
      const start = new Date(formData.start_date);
      const days = parseInt(formData.request_days, 10);

      if (!isNaN(start.getTime()) && !isNaN(days) && days > 0) {
        // Add request_days - 1 to the start date
        const end = new Date(start);
        end.setDate(start.getDate() + days - 1);

        setFormData(prev => ({
          ...prev,
          end_date: end.toISOString().split("T")[0] // YYYY-MM-DD
        }));
      }
    }
  }, [formData.start_date, formData.request_days]);


  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            HR Dashboard
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Apply for Leave
          </Button>
        </Grid>

        <StatsOverview />
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={12}>
            <QuickLinks />
          </Grid>
        </Grid>
      </Container>

      {/* Apply Leave Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth component={'form'} onSubmit={handleApply}>
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.leave_category_id}
              onChange={handleInputChange}
              name='leave_category_id'
            >
              {businessInfo?.leavePlans?.map(policy => (
                <MenuItem key={policy.id} value={policy.id}>{policy.leave_type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            type="date"
            name='start_date'
            value={formData.start_date}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Leave Days"
            name='request_days'
            type='number'
            value={formData.request_days}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Reason (Optional)"
            multiline
            rows={3}
            name='reason'
            value={formData.reason}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" type='submit'>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HRDashboard;