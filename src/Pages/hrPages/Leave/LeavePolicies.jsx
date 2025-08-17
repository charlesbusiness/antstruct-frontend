import React, { useState } from "react";
import {
  Box, Typography, Card, CardHeader, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Checkbox, FormControlLabel, useMediaQuery,
  useTheme, Stack, Paper, Chip, Divider, IconButton, MenuItem
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import useBusinessProfile from "../../../hooks/useBusinessProfile";
import { ENDPOINTS, LeaveType } from "../../../utils/consts";
import useSubmitData from "../../../hooks/useSubmitData";
import { ApiRoutes } from "../../../utils/ApiRoutes";
import { toast } from "react-toastify";
import { confirmToast } from "../../../components/confirmToast";
import Can from "../../../components/Can";

const LeavePolicies = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient()
  const { submitData } = useSubmitData()
  const { leaveCategory: policies } = useBusinessProfile();

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



  const renderCarryOver = (carryOver) => (
    <Chip
      label={carryOver ? 'yes' : 'no'}
      color={carryOver ? "success" : "default"}
      size="small"
    />
  )

  const createLeaveCategory = async (e) => {
    e.preventDefault();

    const response = await submitData({
      data: newPolicy,
      endpoint: ApiRoutes.hrManager.leave.category.create
    })

    if (response?.success) {
      setNewPolicy({ ...newPolicy })
      setOpen(false)
      queryClient.invalidateQueries(['leaveCategory'])
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPolicy((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }


  const deleteCategory = async (policy) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.hrManager.leave.category.delete(policy.id),
      method: 'delete'
    })
    if (response?.success) {
      queryClient.invalidateQueries(['leaveCategory'])
      toast.success('Leave policy deleted successfully');
    } else {
      toast.error('Failed to delete category');
    }
  }

  const handleDeleteCategory = (id) => {
    confirmToast({
      message: 'Are you sure you want to delete this category?',
      onConfirm: async () => await deleteCategory(id),
    });
  }
  // Calculated data for summary
  const totalPolicies = policies?.length;
  const totalDays = policies?.reduce((sum, p) => sum + (parseFloat(p.defaultDays) || 0), 0);

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Leave Policies</Typography>
        <Can endpoint={ENDPOINTS.CREATE_LEAVE_CATEGORY}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
          >
            Add Leave Policy
          </Button>
        </Can>
      </Stack>

      <Card>
        <TableContainer component={isMobile ? Paper : undefined}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                {!isMobile && <TableCell>Default Days</TableCell>}
                <TableCell>Carry Over</TableCell>
                {!isMobile && <TableCell>Description</TableCell>}
                <Can endpoint={ENDPOINTS.CREATE_CATEGORY || ENDPOINTS.DELETE_LEAVE_CATEGORY}>
                  <TableCell>Actions</TableCell>
                </Can>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies?.map((p) => (
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
                  <Can endpoint={ENDPOINTS.CREATE_CATEGORY || ENDPOINTS.DELETE_LEAVE_CATEGORY}>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(p)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCategory(p)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </Can>
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
            label="Leave Type"
            name="type"
            value={newPolicy.type}
            onChange={handleChange}
            required
            select
            margin="normal"
          >
            {Object.entries(LeaveType).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key.toUpperCase().replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Default Days"
            type="number"
            margin="dense"
            name="defaultDays"
            value={newPolicy.defaultDays}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newPolicy.carryOver}
                onChange={handleChange}
                name="carryOver"
              />
            }
            label="Carry Over Allowed"
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            name="description"
            rows={isMobile ? 2 : 3}
            margin="dense"
            value={newPolicy.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} size={isMobile ? "medium" : "large"}>Cancel</Button>
          <Button variant="contained" onClick={createLeaveCategory} size={isMobile ? "medium" : "large"}>
            {editingId ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeavePolicies;