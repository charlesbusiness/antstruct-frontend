import React, { useState } from "react";
import {
  Box, Typography, Card, CardHeader, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl,
  Chip, IconButton, useMediaQuery, useTheme, Stack, Paper
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import useBusinessProfile from "../../../hooks/useBusinessProfile";
import { ApiRoutes } from "../../../utils/ApiRoutes";
import useSubmitData from "../../../hooks/useSubmitData";
import { useQueryClient } from "@tanstack/react-query";
import { confirmToast } from "../../../components/confirmToast";
import { toast } from "react-toastify";
import Can from "../../../components/Can";
import { ENDPOINTS } from "../../../utils/consts";

const CreateGrades = () => {


  const handleAssignGradeInput = (e) => {
    setGradeData((prev) => ({
      ...prev,
      gradeId: e.target.value,
    }))
  }

  const [grades, setGrades] = useState({});

  const handleGradeChange = (id, value) => {
    setGrades((prev) => ({
      ...prev,
      [id]: value
    }));
  };


  const assignGrade = async (id) => {
    const response = await submitData({
      data: { grade_id: grades[id] },
      endpoint: ApiRoutes.employees.assignGrade(id),
      method: 'patch'
    })

    if (response?.success) {
      queryClient.invalidateQueries(['employmentGrade'])
    }
  }

  const renderGradePolicies = (policies) => {
    if (isMobile) {
      return (
        <Typography variant="caption">
          {policies.length} policies
        </Typography>
      );
    }
    return (policies || []).map((pol) => {
      return <Chip key={pol.id} label={pol?.type ?? "Unknown"} size="small" sx={{ mr: 0.5, mb: 0.5 }} />;
    });
  }
  const renderGradePolicyDays = (policies) => {

    return (policies || []).map((pol) => {
      return <Chip key={pol.id} label={pol?.pivot.policy_days ?? 0} size="small" sx={{ mr: 0.5, mb: 0.5 }} />;
    });
  }

  const deleteCategory = async (grade) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.hrManager.grades.delete(grade.id),
      method: 'delete'
    })
    if (response?.success) {
      queryClient.invalidateQueries(['leaveCategory'])
      toast.success('grade  deleted successfully');
    } else {
      toast.error('Failed to delete grade');
    }
  }

  const handleDeleteCategory = (id) => {
    confirmToast({
      message: 'Are you sure you want to delete this record?',
      onConfirm: async () => await deleteCategory(id),
    });
  }


  const theme = useTheme();
  const { leaveCategory: policies, employmentGrade, employees } = useBusinessProfile();
  const { submitData } = useSubmitData()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [gradeData, setGradeData] = useState({ gradeId: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newGrade, setNewGrade] = useState({ name: "", policies: [] });
  console.log(gradeData)
  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingId(grade.id);

      const withDays = Array.isArray(grade.leave_categories)
        ? grade.leave_categories.map(cat => ({
          policyId: cat.id,
          policyDays: cat.pivot.policy_days ?? policies.find(p => p.id === cat.id)?.defaultDays ?? 0
        }))
        : [];

      setNewGrade({ name: grade.name || "", policies: withDays });
    } else {
      setEditingId(null);
      setNewGrade({ name: "", policies: [] });
    }
    setOpen(true);
  }


  const handlePolicyChange = (selectedIds) => {
    const updated = selectedIds.map(id => {
      const existing = newGrade.policies.find(p => p.policyId === id);
      const defaultDays = policies.find(p => p.id === id)?.defaultDays ?? 0;
      return existing || { policyId: id, policyDays: defaultDays };
    });
    setNewGrade(prev => ({ ...prev, policies: updated }));
  };


  const handlePolicyDaysChange = (id, value) => {
    setNewGrade(prev => ({
      ...prev,
      policies: prev.policies.map(p => p.policyId === id ? { ...p, policyDays: value } : p)
    }));
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    const payload = { name: newGrade.name, policies: newGrade.policies };
    let url = ApiRoutes.hrManager.grades.create;
    let method = 'post';
    if (editingId) {
      method = 'patch';
      url = ApiRoutes.hrManager.grades.update(editingId);
    }
    const response = await submitData({ data: payload, endpoint: url, method });

    if (response?.success) {
      setOpen(false);
      queryClient.invalidateQueries(['leaveCategory']);
    }
  }


  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>

      <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Grades Management</Typography>
        <Can endpoint={ENDPOINTS.CREATE_GRADES}>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} fullWidth={isMobile}>
            Add Grade
          </Button>
        </Can>
      </Stack>
      {/* Grades Table */}
      <Card sx={{ mb: 4 }}>

        <TableContainer component={isMobile ? Paper : undefined}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Leave Policies</TableCell>}
                <TableCell>Leave Days</TableCell>
                <Can endpoint={ENDPOINTS.UPDATE_GRADES || ENDPOINTS.DELETE_GRADES}>
                  <TableCell>Actions</TableCell>
                </Can>
              </TableRow>
            </TableHead>
            <TableBody>
              {employmentGrade?.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.name}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      {renderGradePolicies(g?.leave_categories)}
                    </TableCell>
                  )}

                  <TableCell>
                    {renderGradePolicyDays(g?.leave_categories)}
                  </TableCell>
                  <Can endpoint={ENDPOINTS.UPDATE_GRADES || ENDPOINTS.DELETE_GRADES}>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(g)} size="small">
                        <EditIcon fontSize={isMobile ? "small" : "medium"} />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteCategory(g)}>
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

      {/* Employees Table */}
      <Card>
        <CardHeader title="Assign Grades to Employees" />
        <TableContainer component={isMobile ? Paper : undefined}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Department</TableCell>}
                <TableCell>Grade</TableCell>
                <Can endpoint={ENDPOINTS.UPDATE_GRADES || ENDPOINTS.DELETE_GRADES}>
                  <TableCell>Action</TableCell>
                </Can>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees?.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.firstname} {emp.lastname}</TableCell>
                  {!isMobile && <TableCell>{emp.department?.department_name}</TableCell>}

                  {!isMobile && <TableCell>{emp.grade?.name}</TableCell>}
                  <Can endpoint={ENDPOINTS.UPDATE_GRADES || ENDPOINTS.DELETE_GRADES}>
                    <TableCell>
                      <Select
                        label="Assign Grade"
                        size="small"
                        name="gradeId"
                        value={grades[emp.id] || ''}
                        onChange={(e) => handleGradeChange(emp.id, e.target.value)}
                        onBlur={() => assignGrade(emp?.id)}
                        fullWidth
                      >
                        <MenuItem value="">None</MenuItem>
                        {employmentGrade?.map((g) => (
                          <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </Can>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Grade Dialog */}

      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={isMobile} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Edit Grade" : "Add Grade"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Grade Name" margin="dense"
            value={newGrade.name} onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })} />
          <FormControl fullWidth margin="dense">
            <InputLabel>Leave Policies</InputLabel>
            <Select multiple
              value={newGrade.policies.map(p => p.policyId)}
              onChange={(e) => handlePolicyChange(e.target.value)}
              renderValue={(selected) => selected.map(id => <Chip key={id} label={policies.find(p => p.id === id)?.type} size="small" />)}>
              {policies?.map(p => (<MenuItem key={p.id} value={p.id}>{p.type}</MenuItem>))}
            </Select>
          </FormControl>
          {newGrade.policies.map(p => (
            <TextField key={p.policyId}
              label={`Days for ${policies.find(pol => pol.id === p.policyId)?.type}`}
              type="number"
              value={p.policyDays}
              onChange={e => handlePolicyDaysChange(p.policyId, e.target.value)}
              fullWidth margin="dense" />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveGrade}>{editingId ? "Save Changes" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateGrades;