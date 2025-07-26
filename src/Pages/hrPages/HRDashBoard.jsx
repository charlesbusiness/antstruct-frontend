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
import { dummyEmployees, dummyGrades, dummyLeavePolicies } from "../hrPages/Payroll/data";

const HRDashboard = () => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedLeave, setSelectedLeave] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  // Assume logged-in user (replace with actual user context/auth later)
  const currentUser = dummyEmployees[3]; // Example: Alice Johnson
  // const userGrade = dummyGrades.find(g => g.id == currentUser.gradeId) || null;
  const userGrade = dummyGrades.find(g => g.id === 2); 

  const allowedLeavePolicies = dummyLeavePolicies.filter(p =>
    userGrade?.leavePolicyIds.includes(p.id)
  );

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleApply = () => {
    // === Validation ===
    if (!selectedLeave) {
      showSnackbar("Please select a leave type.", "error");
      return;
    }
    if (!startDate || !endDate) {
      showSnackbar("Please select start and end dates.", "error");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      showSnackbar("Start date cannot be after end date.", "error");
      return;
    }

    // Optional: Calculate duration & validate entitlement
    const duration =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;
    const remaining = currentUser.leaveEntitlement - currentUser.leaveTaken;
    if (duration > remaining) {
      showSnackbar(`You only have ${remaining} days remaining.`, "error");
      return;
    }

    // Submit logic (for now, just log & snackbar)
    console.log({
      employee: currentUser.name,
      leaveType: selectedLeave,
      startDate,
      endDate,
      reason,
      duration,
    });

    showSnackbar("Leave application submitted!", "success");
    setOpen(false);
    setSelectedLeave("");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for Leave</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={selectedLeave}
              onChange={(e) => setSelectedLeave(e.target.value)}
            >
              {allowedLeavePolicies.map(policy => (
                <MenuItem key={policy.id} value={policy.type}>{policy.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Reason (Optional)"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Submit</Button>
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