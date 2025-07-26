import React, { useState } from "react";
import {
  Box, Typography, Card, CardHeader, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Checkbox, FormControlLabel, useMediaQuery,
  useTheme, Stack, Paper, Chip, Divider, IconButton
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { dummyLeavePolicies } from "../Payroll/data";

const LeavePolicies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [policies, setPolicies] = useState(dummyLeavePolicies);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    type: "",
    defaultDays: "",
    carryOver: false,
    description: "",
  });

  const handleOpenDialog = (policy = null) => {
    if (policy) {
      // Edit mode
      setEditingId(policy.id);
      setNewPolicy({
        type: policy.type,
        defaultDays: policy.defaultDays,
        carryOver: policy.carryOver,
        description: policy.description,
      });
    } else {
      // Add mode
      setEditingId(null);
      setNewPolicy({ type: "", defaultDays: "", carryOver: false, description: "" });
    }
    setOpen(true);
  };

  const handleSavePolicy = () => {
    if (editingId) {
      // Update existing
      setPolicies(prev =>
        prev.map(p => p.id === editingId ? { ...p, ...newPolicy, defaultDays: parseInt(newPolicy.defaultDays, 10) } : p)
      );
    } else {
      // Add new
      setPolicies([
        ...policies,
        { ...newPolicy, id: Date.now(), defaultDays: parseInt(newPolicy.defaultDays, 10) },
      ]);
    }
    setNewPolicy({ type: "", defaultDays: "", carryOver: false, description: "" });
    setEditingId(null);
    setOpen(false);
  };

  const renderCarryOver = (carryOver) => (
    <Chip 
      label={carryOver ? "Yes" : "No"} 
      color={carryOver ? "success" : "default"} 
      size="small"
    />
  );

  // Calculated data for summary
  const totalPolicies = policies.length;
  const totalDays = policies.reduce((sum, p) => sum + (p.defaultDays || 0), 0);

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Leave Policies</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          fullWidth={isMobile}
          size={isMobile ? "medium" : "large"}
        >
          Add Leave Policy
        </Button>
      </Stack>

      <Card>
        <CardHeader title="Leave Policies" />
        <TableContainer component={isMobile ? Paper : undefined}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                {!isMobile && <TableCell>Default Days</TableCell>}
                <TableCell>Carry Over</TableCell>
                {!isMobile && <TableCell>Description</TableCell>}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.type}</TableCell>
                  {!isMobile && <TableCell>{p.defaultDays}</TableCell>}
                  <TableCell>
                    {isMobile ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        {renderCarryOver(p.carryOver)}
                        <Typography variant="caption">{p.defaultDays} days</Typography>
                      </Stack>
                    ) : (
                      renderCarryOver(p.carryOver)
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
                        {p.description}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(p)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* New Info Section */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: "#f9fafb", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Policy Overview</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Policies:</strong> {totalPolicies}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Allocated Leave Days:</strong> {totalDays} days
        </Typography>
        <Typography variant="body2" color="textSecondary">
          These policies define the types of leaves available to employees, their default duration,
          and whether unused days can be carried over. Use this section to review and adjust policies
          to align with company regulations and employee agreements.
        </Typography>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingId ? "Edit Leave Policy" : "Add Leave Policy"}</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Type" 
            margin="dense"
            value={newPolicy.type} 
            onChange={(e) => setNewPolicy({ ...newPolicy, type: e.target.value })}
            sx={{ mt: 1 }}
          />
          <TextField 
            fullWidth 
            label="Default Days" 
            type="number" 
            margin="dense"
            value={newPolicy.defaultDays} 
            onChange={(e) => setNewPolicy({ ...newPolicy, defaultDays: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={newPolicy.carryOver} 
                onChange={(e) => setNewPolicy({ ...newPolicy, carryOver: e.target.checked })} 
              />
            }
            label="Carry Over Allowed"
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth 
            label="Description" 
            multiline 
            rows={isMobile ? 2 : 3} 
            margin="dense"
            value={newPolicy.description} 
            onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} size={isMobile ? "medium" : "large"}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePolicy} size={isMobile ? "medium" : "large"}>
            {editingId ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeavePolicies;