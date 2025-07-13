import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Chip,
  styled,
  Avatar,
  LinearProgress
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Save as SaveIcon,
  CheckCircle as SubmitIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Business as DepartmentIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon
} from "@mui/icons-material";
import dummyEmployees from "../Payroll/data";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
const performanceRatings = [
  { value: "excellent", label: "Excellent", color: "success" },
  { value: "good", label: "Good", color: "primary" },
  { value: "average", label: "Average", color: "warning" },
  { value: "poor", label: "Poor", color: "error" }
];

const PerformanceReview = () => {
  const [reviews, setReviews] = useState(dummyEmployees.map(emp => ({
    ...emp,
    review: emp.performance?.rating || "",
    comments: ""
  })));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleReviewChange = (id, field, value) => {
    setReviews(prev =>
      prev.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Performance reviews submitted successfully!",
        severity: "success"
      });
      console.log("Submitted Reviews", reviews);
    }, 1500);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredReviews = reviews.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "excellent": return <StarIcon color="success" />;
      case "good": return <StarIcon color="primary" />;
      case "average": return <StarHalfIcon color="warning" />;
      case "poor": return <StarBorderIcon color="error" />;
      default: return <StarBorderIcon color="disabled" />;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Employee Performance Evaluation
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            label="Search Employees"
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SubmitIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{ minWidth: 180 }}
          >
            {loading ? "Submitting..." : "Submit All Reviews"}
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                <TableCell sx={{ color: "white" }}>Employee</TableCell>
                <TableCell sx={{ color: "white" }}>Job Title</TableCell>
                <TableCell sx={{ color: "white" }}>Department</TableCell>
                <TableCell sx={{ color: "white" }}>Performance Rating</TableCell>
                <TableCell sx={{ color: "white" }}>Comments</TableCell>
                <TableCell sx={{ color: "white" }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp) => (
                    <StyledTableRow key={emp.id} className={emp.review ? "highlight" : ""}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {emp.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight="medium">{emp.name}</Typography>
                            <Typography variant="body2" color="textSecondary">ID: {emp.id}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WorkIcon color="action" fontSize="small" />
                          <Typography>{emp.role}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DepartmentIcon color="action" fontSize="small" />
                          <Typography>{emp.department}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <TextField
                          select
                          value={emp.review}
                          onChange={(e) => handleReviewChange(emp.id, "review", e.target.value)}
                          fullWidth
                          size="small"
                          variant="outlined"
                        >
                          {performanceRatings.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                {getRatingIcon(option.value)}
                                <span>{option.label}</span>
                              </Stack>
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={emp.comments}
                          onChange={(e) => handleReviewChange(emp.id, "comments", e.target.value)}
                          fullWidth
                          size="small"
                          variant="outlined"
                          placeholder="Add comments..."
                          multiline
                          maxRows={2}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View performance details">
                            <IconButton
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setDialogOpen(true);
                              }}
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Save changes">
                            <IconButton
                              onClick={() => {
                                setSnackbar({
                                  open: true,
                                  message: `Review updated for ${emp.name}`,
                                  severity: "info"
                                });
                              }}
                              color="success"
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No employees found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
        />
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Performance Details: {selectedEmployee?.name}</span>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEmployee ? (
            <Stack spacing={3}>
              <Stack direction="row" spacing={4} alignItems="center">
                <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>
                  {selectedEmployee.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedEmployee.name}</Typography>
                  <Typography color="textSecondary">{selectedEmployee.role}</Typography>
                  <Chip
                    label={selectedEmployee.department}
                    icon={<DepartmentIcon fontSize="small" />}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Stack>

              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Current Evaluation
                </Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography minWidth={150}><strong>Rating:</strong></Typography>
                    <Chip
                      label={selectedEmployee.performance?.rating ? 
                        performanceRatings.find(r => r.value === selectedEmployee.performance.rating)?.label : 
                        "Not rated"}
                      color={selectedEmployee.performance?.rating ? 
                        performanceRatings.find(r => r.value === selectedEmployee.performance.rating)?.color : 
                        "default"}
                      icon={getRatingIcon(selectedEmployee.performance?.rating)}
                      variant="outlined"
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography minWidth={150}><strong>Last Review:</strong></Typography>
                    <Typography>{selectedEmployee.performance?.lastReviewDate || "No review date"}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography minWidth={150}><strong>Goals Progress:</strong></Typography>
                    <Box width="100%">
                      <LinearProgress
                        variant="determinate"
                        value={(selectedEmployee.performance?.goalsMet / selectedEmployee.performance?.goalsTotal) * 100 || 0}
                        color={
                          (selectedEmployee.performance?.goalsMet / selectedEmployee.performance?.goalsTotal) >= 0.8 ? "success" :
                          (selectedEmployee.performance?.goalsMet / selectedEmployee.performance?.goalsTotal) >= 0.5 ? "primary" : "error"
                        }
                        sx={{ height: 8, borderRadius: 4, mb: 1 }}
                      />
                      <Typography variant="body2">
                        {selectedEmployee.performance?.goalsMet || 0} of {selectedEmployee.performance?.goalsTotal || 0} goals met
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography minWidth={150}><strong>Comments:</strong></Typography>
                    <Typography>
                      {selectedEmployee.performance?.comments || "No comments available"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          ) : (
            <Typography>No employee data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="contained"
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PerformanceReview;