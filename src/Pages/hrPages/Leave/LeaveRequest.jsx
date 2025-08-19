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
  Event as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import useSubmitData from "../../../hooks/useSubmitData";
import { ApiRoutes } from "../../../utils/ApiRoutes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate, isAdmin, isManager, resetFormData } from "../../../utils/general";
import useBusinessProfile from "../../../hooks/useBusinessProfile";
import { APPLICATIONSTAGES, LEAVESTATUS } from "../../../utils/consts";

const LeaveRequest = () => {
  const { submitData } = useSubmitData()
  const { employees, businessInfo: profile } = useBusinessProfile()
  const [filterStatus, setFilterStatus] = useState("all");
  const lastFocusedElement = React.useRef(null);
  const queryClient = useQueryClient()
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const adminUser = isAdmin(profile)
  const isManagerUser = isManager(profile)
  const statusParam = filterStatus !== "all" ? `&status=${filterStatus}` : "";
  const employeeParams = employeeFilter !== null ? `&employee_id=${employeeFilter}` : "";

  const leaveRequest = useQuery({
    queryKey: ['leaveRequests', filterStatus, employeeFilter, rowsPerPage],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: `${ApiRoutes.hrManager.leave.applications.leaves}?per_page=${rowsPerPage}${statusParam + employeeParams}`,
        method: 'get',
      });
      if (response?.error) throw new Error('Failed to fetch employees');
      const data = response?.data;
      return {
        pageData: data?.paginated,
        leaveData: data?.grouped
      }
    },
    keepPreviousData: true,
  });


  const openActionDialog = (empId, requestId, action, event) => {
    setSelectedRequest({ empId, requestId, action });
    setDialogOpen(!dialogOpen);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "declined": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  }

  const handleStatusChange = async () => {
    const response = await submitData({
      endpoint: ApiRoutes.hrManager.leave.applications.update(selectedRequest.requestId),
      method: 'patch',
      data: { status: selectedRequest.action }
    })
    if (response.success) {
      resetFormData(selectedRequest)
      setDialogOpen(!dialogOpen);
      queryClient.invalidateQueries(['leaveRequests'])
    }
  }


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  const handleShouldBeDisabled = (req) => {
    const stage = req.stage;
    if (!adminUser && !isManagerUser) return true;
    if (stage == APPLICATIONSTAGES.MANAGER && !isManagerUser) return true;
    if (stage == APPLICATIONSTAGES.HRM && !adminUser) return true;
    if (stage == APPLICATIONSTAGES.FINAL) return true;

    return false;
  }
  console.log(profile)
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
                >
                  <MenuItem value="all">All Requests</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="declined">Declined</MenuItem>
                </Select>

              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter by Employee</InputLabel>
                <Select
                  value={employeeFilter || ''}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                >
                  {
                    employees?.map(employee => (
                      <MenuItem key={employee?.id} value={employee.id}>{employee?.firstname}</MenuItem>
                    ))
                  }
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
              {leaveRequest?.data?.pageData?.total > 0 ? leaveRequest?.data?.leaveData?.map((emp) => (
                <TableRow key={`emp-${emp.employee_id}`} hover>

                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {emp?.employee_name?.charAt(0)}
                      </Avatar>
                      <Typography fontWeight="medium">{emp.employee_name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={emp.entitled} variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={emp.taken}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={emp.remaining}
                      color={
                        (emp.taken) > 5
                          ? "success"
                          : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      {emp?.leaves?.map((req) => (
                        <Paper
                          key={`leave-${req.leave_id}`}  // Add unique key here
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
                                  {req.category_name}
                                </Typography>
                                <Chip
                                  label={req.status}
                                  size="small"
                                  color={getStatusColor(req.status)}
                                  variant="outlined"
                                />
                              </Stack>
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(req.start_date)}
                                <br />
                                {formatDate(req.end_date)
                                }
                              </Typography>
                              {req.reason && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  <strong>Reason:</strong> {req.reason}
                                </Typography>
                              )}
                            </Box>
                            {req.status === LEAVESTATUS.PENDING && (
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Approve">
                                  <span> {/* Wrap the disabled button in a span */}
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => openActionDialog(emp.employee_id, req.leave_id, LEAVESTATUS.APPROVE)}
                                      disabled={handleShouldBeDisabled(req)}
                                    >
                                      <ApproveIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                {
                                  profile?.employee?.id == emp.employee_id ?
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => openActionDialog(emp.employee_id, req.leave_id, LEAVESTATUS.CANCLED)}
                                      >
                                        <DeclineIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip> :
                                    <Tooltip title="Decline">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => openActionDialog(emp.employee_id, req.leave_id, LEAVESTATUS.DECLINED)}
                                      >
                                        <DeclineIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                }

                              </Stack>
                            )}
                            {req.status === LEAVESTATUS.APPROVE && profile.employee.id === emp?.employee_id && (
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Mark completed">
                                  <span> {/* Wrap the disabled button in a span */}
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => openActionDialog(emp.employee_id, req.leave_id, LEAVESTATUS.COMPLETED)}
                                    >
                                      <ApproveIcon fontSize="small" />
                                    </IconButton>
                                  </span>
                                </Tooltip>


                              </Stack>
                            )}
                          </Stack>
                          <Divider sx={{ my: 2 }} />
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              label={`Entitled: ${req.entitled}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`Used: ${req.used}`}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                            <Chip
                              label={`Remaining: ${req.remaining}`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {/* This cell remains for any employee-level actions if needed */}
                  </TableCell>
                </TableRow>

              )) :
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No leave requests found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leaveRequest?.data?.pageData?.total || 0}
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
            value={note || ''}
            onChange={(e) => setNote(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            color={selectedRequest?.action === "approve" ? "success" : "error"}
            variant="contained"
            onClick={handleStatusChange}
            startIcon={
              selectedRequest?.action === "approve" ? <ApproveIcon /> : <DeclineIcon />
            }
          >
            {selectedRequest?.action}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequest;