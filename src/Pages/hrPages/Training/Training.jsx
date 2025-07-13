import React, { useState } from "react";
import { dummyEmployees, dummyTrainings, departments } from "../Payroll/data";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Badge
} from "@mui/material";
import {
  Upload as UploadIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Description as DocumentIcon,
  Work as DepartmentIcon,
  Person as PersonIcon,
  Event as DeadlineIcon,
  Close as CloseIcon,
  CheckCircle as CompletedIcon,
  Pending as PendingIcon
} from "@mui/icons-material";

const TrainingPage = () => {
  const [trainings, setTrainings] = useState(dummyTrainings);
  const [employees] = useState(dummyEmployees);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [deadline, setDeadline] = useState("");
  const [material, setMaterial] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("trainings");

  const handleTrainingUpload = () => {
    if (!title || !department || !deadline || !material) return;
    
    const newTraining = {
      id: Date.now(),
      title,
      department,
      deadline,
      material,
      createdAt: new Date().toISOString()
    };
    
    setTrainings([...trainings, newTraining]);
    setTitle("");
    setDepartment("");
    setDeadline("");
    setMaterial(null);
  };

  const getTrainingStatus = (employee) => {
    const completed = employee.trainings?.length || 0;
    const pending = trainings.length - completed;
    return { completed, pending };
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Training Management
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant={activeTab === "trainings" ? "contained" : "outlined"}
          onClick={() => setActiveTab("trainings")}
          startIcon={<DocumentIcon />}
        >
          Available Trainings
        </Button>
        <Button
          variant={activeTab === "status" ? "contained" : "outlined"}
          onClick={() => setActiveTab("status")}
          startIcon={<PersonIcon />}
        >
          Employee Status
        </Button>
        <Button
          variant={activeTab === "add" ? "contained" : "outlined"}
          onClick={() => setActiveTab("add")}
          startIcon={<AddIcon />}
        >
          Add Training
        </Button>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {activeTab === "trainings" && (
        <Card elevation={2}>
          <CardHeader
            title="Available Training Programs"
            action={
              <Typography variant="body2" color="textSecondary">
                {trainings.length} training{trainings.length !== 1 ? 's' : ''} available
              </Typography>
            }
          />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Deadline</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainings.map((training) => (
                  <TableRow key={training.id} hover>
                    <TableCell>
                      <Typography fontWeight="medium">{training.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={training.department}
                        icon={<DepartmentIcon fontSize="small" />}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DeadlineIcon color="action" fontSize="small" />
                        <Typography>{new Date(training.deadline).toLocaleDateString()}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View material">
                        <IconButton
                          onClick={() => {
                            setDialogOpen(true);
                            setSelectedDoc(training.material);
                          }}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "status" && (
        <Card elevation={2}>
          <CardHeader
            title="Employee Training Status"
            subheader={`${employees.length} employees`}
          />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Completed</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Pending</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => {
                  const { completed, pending } = getTrainingStatus(employee);
                  const progress = Math.round((completed / trainings.length) * 100);
                  
                  return (
                    <TableRow key={employee.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {employee.name.charAt(0)}
                          </Avatar>
                          <Typography>{employee.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<CompletedIcon />}
                          label={completed}
                          color="success"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<PendingIcon />}
                          label={pending}
                          color="warning"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <progress
                              value={progress}
                              max="100"
                              style={{ width: '100%', height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            {progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "add" && (
        <Card elevation={2}>
          <CardHeader title="Add New Training Program" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Training Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
              
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  label="Department"
                  variant="outlined"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DepartmentIcon fontSize="small" />
                        <span>{dept}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                type="date"
                label="Completion Deadline"
                InputLabelProps={{ shrink: true }}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
              />
              
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload Material
                  <input type="file" hidden onChange={(e) => setMaterial(e.target.files[0])} />
                </Button>
                {material && (
                  <Chip
                    label={material.name}
                    onDelete={() => setMaterial(null)}
                    deleteIcon={<CloseIcon />}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleTrainingUpload}
                  disabled={!title || !department || !deadline || !material}
                  startIcon={<AddIcon />}
                  size="large"
                >
                  Add Training Program
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { height: '80vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Training Material</span>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDoc && (
            <iframe
              src={URL.createObjectURL(selectedDoc)}
              title="Training Document"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingPage;