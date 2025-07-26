import React, { useState } from "react";
import {
  Box, Typography, Card, CardHeader, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, 
  Chip, IconButton, useMediaQuery, useTheme, Stack, Paper
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { dummyGrades, dummyLeavePolicies, dummyEmployees } from "../Payroll/data";

const CreateGrades = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [grades, setGrades] = useState(dummyGrades);
  const [employees, setEmployees] = useState(dummyEmployees.map(e => ({ ...e, gradeId: null })));
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newGrade, setNewGrade] = useState({ name: "", leavePolicyIds: [] });

  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingId(grade.id);
      setNewGrade({ name: grade.name, leavePolicyIds: grade.leavePolicyIds });
    } else {
      setEditingId(null);
      setNewGrade({ name: "", leavePolicyIds: [] });
    }
    setOpen(true);
  };

  const handleSaveGrade = () => {
    if (editingId) {
      setGrades(prev =>
        prev.map(g => g.id === editingId ? { ...g, ...newGrade } : g)
      );
    } else {
      setGrades([...grades, { ...newGrade, id: Date.now() }]);
    }
    setNewGrade({ name: "", leavePolicyIds: [] });
    setEditingId(null);
    setOpen(false);
  };

  const handleAssignGrade = (empId, gradeId) => {
    setEmployees(prev => prev.map(emp => emp.id === empId ? { ...emp, gradeId } : emp));
  };

  const renderGradePolicies = (policyIds) => {
    if (isMobile) {
      return (
        <Typography variant="caption">
          {policyIds.length} policies
        </Typography>
      );
    }
    return (policyIds || []).map((pid) => {
      const policy = dummyLeavePolicies.find(p => p.id === pid);
      return <Chip key={pid} label={policy?.type || "Unknown"} size="small" sx={{ mr: 0.5, mb: 0.5 }} />;
    });
  };

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
        <CardHeader title="Grades" />
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
              {grades.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>{g.name}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      {renderGradePolicies(g.leavePolicyIds)}
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDialog(g)} size="small">
                      <EditIcon fontSize={isMobile ? "small" : "medium"} />
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
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  {!isMobile && <TableCell>{emp.department}</TableCell>}
                  <TableCell>
                    <Select
                      size="small"
                      value={emp.gradeId || ""}
                      onChange={(e) => handleAssignGrade(emp.id, e.target.value)}
                      fullWidth
                    >
                      <MenuItem value="">None</MenuItem>
                      {grades.map((g) => (
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
              value={newGrade.leavePolicyIds}
              onChange={(e) => setNewGrade({ ...newGrade, leavePolicyIds: e.target.value })}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((id) => {
                    const policy = dummyLeavePolicies.find(p => p.id === id);
                    return <Chip key={id} label={policy?.type || "Unknown"} size="small" />;
                  })}
                </Box>
              )}
            >
              {dummyLeavePolicies.map((p) => (
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

export default CreateGrades;