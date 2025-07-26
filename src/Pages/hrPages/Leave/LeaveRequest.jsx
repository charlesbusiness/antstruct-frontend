import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  Card,
  CardHeader,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as DeclineIcon,
  Person as PersonIcon,
  Event as CalendarIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import allEmployees from "../Payroll/data";

const LeaveRequest = () => {
  const [employees, setEmployees] = useState(allEmployees);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const navigate = useNavigate();

  const handleApprove = (empId, requestId) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === empId
          ? {
              ...emp,
              leaveRequests: emp.leaveRequests.map(req =>
                req.id === requestId 
                  ? { ...req, status: "Approved", note } 
                  : req
              ),
            }
          : emp
      )
    );
    setDialogOpen(false);
    setNote("");
  };

  const handleDecline = (empId, requestId) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === empId
          ? {
              ...emp,
              leaveRequests: emp.leaveRequests.map(req =>
                req.id === requestId 
                  ? { ...req, status: "Declined", note } 
                  : req
              ),
            }
          : emp
      )
    );
    setDialogOpen(false);
    setNote("");
  };

  const openActionDialog = (empId, requestId, action) => {
    setSelectedRequest({ empId, requestId, action });
    setDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "success";
      case "Declined": return "error";
      case "Pending": return "warning";
      default: return "default";
    }
  };

  const filteredEmployees = employees
    .map(emp => ({
      ...emp,
      leaveRequests: filterStatus === "all" 
        ? emp.leaveRequests 
        : emp.leaveRequests?.filter(req => req.status === filterStatus)
    }))
    .filter(emp => emp.leaveRequests?.length > 0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Leave Request Management
      </Typography>

<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => navigate("/hr/leave-policies")}
  >
    Manage Leave Policies
  </Button>
  <Button
    variant="contained"
    color="secondary"
    onClick={() => navigate("/hr/grades")}
  >
    Manage Grades
  </Button>
</Stack>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardHeader
          title="Leave Requests"
          action={
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by status"
                >
                  <MenuItem value="all">All Requests</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Declined">Declined</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Refresh">
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Entitled</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Taken</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Remaining</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Requests</TableCell>
                <TableCell sx={{ fontWeight: 600 }} width="120px">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {emp.name.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="medium">{emp.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={emp.leaveEntitlement} variant="outlined" />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={emp.leaveTaken} 
                          color="primary" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={emp.leaveEntitlement - emp.leaveTaken}
                          color={
                            (emp.leaveEntitlement - emp.leaveTaken) > 5 
                              ? "success" 
                              : "warning"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          {emp.leaveRequests?.map((req) => (
                            <Paper 
                              key={req.id} 
                              variant="outlined" 
                              sx={{ p: 2, position: 'relative' }}
                            >
                              <Stack 
                                direction="row" 
                                justifyContent="space-between" 
                                alignItems="center"
                              >
                                <Box>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarIcon color="action" fontSize="small" />
                                    <Typography variant="body1" fontWeight="medium">
                                      {req.type}
                                    </Typography>
                                    <Chip 
                                      label={req.status}
                                      size="small"
                                      color={getStatusColor(req.status)}
                                      variant="outlined"
                                    />
                                  </Stack>
                                  <Typography variant="body2" color="textSecondary">
                                    {req.startDate} to {req.endDate} • {req.duration} days
                                  </Typography>
                                  {req.reason && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                      <strong>Reason:</strong> {req.reason}
                                    </Typography>
                                  )}
                                </Box>
                                {req.status === "Pending" && (
                                  <Stack direction="row" spacing={0.5}>
                                    <Tooltip title="Approve">
                                      <IconButton
                                        size="small"
                                        color="success"
                                        onClick={() => openActionDialog(emp.id, req.id, "approve")}
                                      >
                                        <ApproveIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Decline">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => openActionDialog(emp.id, req.id, "decline")}
                                      >
                                        <DeclineIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                )}
                              </Stack>
                            </Paper>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {/* This cell remains for any employee-level actions if needed */}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No leave requests found matching your criteria
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
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {selectedRequest?.action === "approve" ? "Approve Leave Request" : "Decline Leave Request"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You are about to {selectedRequest?.action} this leave request.
          </Typography>
          <TextField
            label="Add a note (optional)"
            multiline
            rows={3}
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            color={selectedRequest?.action === "approve" ? "success" : "error"}
            variant="contained"
            onClick={() => {
              selectedRequest?.action === "approve"
                ? handleApprove(selectedRequest.empId, selectedRequest.requestId)
                : handleDecline(selectedRequest.empId, selectedRequest.requestId);
            }}
            startIcon={
              selectedRequest?.action === "approve" ? <ApproveIcon /> : <DeclineIcon />
            }
          >
            {selectedRequest?.action === "approve" ? "Approve" : "Decline"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequest;