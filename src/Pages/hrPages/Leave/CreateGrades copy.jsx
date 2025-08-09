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

const CreateGradesCopy = () => {
  const theme = useTheme();
  const { leaveCategory: policies, employmentGrade, employees } = useBusinessProfile();
  const { submitData } = useSubmitData()
  const queryClient = useQueryClient()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [gradeData, setGradeData] = useState({ gradeId: '' });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newGrade, setNewGrade] = useState({ name: "", leave_policy_id: [] });

  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingId(grade.id);
      const ids = Array.isArray(grade.leave_categories)
        ? grade.leave_categories.map((cat) => cat.id)
        : []; // fallback to empty array if undefined
      setNewGrade({
        name: grade.name || "",
        leave_policy_id: ids,
      });
    } else {
      setEditingId(null);
      setNewGrade({ name: "", leave_policy_id: [] });
    }
    setOpen(true);
  }

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    let url = ApiRoutes.hrManager.grades.create
    let method = 'post'
    if (editingId) {
      method = 'patch'
      url = ApiRoutes.hrManager.grades.update(editingId)
    }
    const response = await submitData({
      data: newGrade,
      endpoint: url,
      method: method
    })

    if (response?.success) {
      setNewGrade({ ...newGrade })
      setOpen(false)
      queryClient.invalidateQueries(['leaveCategory'])
    }
  }

  const handleAssignGradeInput = (e) => {
    setGradeData((prev) => ({
      ...prev,
      gradeId: e.target.value,
    }))
  }

  const assignGrade = async (id) => {
    const response = await submitData({
      data: { grade_id: gradeData.gradeId },
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


  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>

      <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2} mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"}>Grades Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} fullWidth={isMobile}>
          Add Grade
        </Button>
      </Stack>
      {/* Grades Table */}
      <Card sx={{ mb: 4 }}>

        <TableContainer component={isMobile ? Paper : undefined}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {!isMobile && <TableCell>Leave Policies</TableCell>}
                <TableCell>Actions</TableCell>
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
                    <IconButton color="primary" onClick={() => handleOpenDialog(g)} size="small">
                      <EditIcon fontSize={isMobile ? "small" : "medium"} />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCategory(g)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees?.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.firstname} {emp.lastname}</TableCell>
                  {!isMobile && <TableCell>{emp.department?.department_name}</TableCell>}

                  {!isMobile && <TableCell>{emp.grade?.name}</TableCell>}

                  <TableCell>
                    <Select
                      label="Assign Grade"
                      size="small"
                      name="gradeId"
                      value={gradeData.gradeId || ""}
                      onChange={handleAssignGradeInput}
                      onBlur={() => assignGrade(emp?.id)}
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>
                      {employmentGrade?.map((g) => (
                        <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Grade Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingId ? "Edit Grade" : "Add Grade"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Grade Name"
            margin="dense"
            value={newGrade.name}
            onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Leave Policies</InputLabel>
            <Select
              multiple
              value={newGrade.leave_policy_id}
              onChange={(e) => setNewGrade({ ...newGrade, leave_policy_id: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const policy = policies?.find(p => p.id === id);
                    return <Chip key={id} label={policy?.type || "Unknown"} size="small" />;
                  })}
                </Box>
              )}
            >
              {policies?.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveGrade}>
            {editingId ? "Save Changes" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateGradesCopy;