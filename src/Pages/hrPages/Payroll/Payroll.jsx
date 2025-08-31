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
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Stack,
  Chip,
  styled,
  Avatar,
  Divider,
  Card,
  CardContent
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  DateRange as DateIcon,
  Event as CalendarIcon,
  Work as JobIcon,
  Business as DepartmentIcon,
  Person as PersonIcon,
  CheckCircle as ProcessIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import dummyEmployees from "./data";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.highlight': {
    backgroundColor: theme.palette.success.light,
  }
}));

const payrollTypes = [
  { value: "monthly", label: "Monthly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom Period" }
];

const PayRoll = () => {
  const [payrollType, setPayrollType] = useState("monthly");
  const [payrollDate, setPayrollDate] = useState("");
  const [employees] = useState(dummyEmployees);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Payroll processed successfully!",
        severity: "success"
      });
    }, 1500);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotal = (field) => {
    return filteredEmployees
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .reduce((sum, emp) => {
        const regularPay = emp.payRate * emp.regularHours;
        const overtimePay = emp.payRate * 1.5 * emp.overtimeHours;
        const total = regularPay + overtimePay + emp.bonuses;
        
        if (field === "regular") return sum + regularPay;
        if (field === "overtime") return sum + overtimePay;
        if (field === "bonuses") return sum + emp.bonuses;
        return sum + total;
      }, 0);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Payroll Processing
      </Typography>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Payroll Parameters
          </Typography>
          
          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
            <TextField
              select
              fullWidth
              label="Payroll Type"
              value={payrollType}
              onChange={(e) => setPayrollType(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />
              }}
            >
              {payrollTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Payroll Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={payrollDate}
              onChange={(e) => setPayrollDate(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: <DateIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Stack>

          <Stack direction="row" spacing={3} alignItems="center">
            <Chip
              icon={<CalendarIcon />}
              label={`Type: ${payrollTypes.find(t => t.value === payrollType)?.label || 'Not selected'}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<DateIcon />}
              label={`Date: ${payrollDate || 'Not selected'}`}
              color={payrollDate ? "primary" : "default"}
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardContent>
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
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh">
                <IconButton>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print Payroll">
                <IconButton>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to CSV">
                <IconButton>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: (theme) => theme.palette.primary.main }}>
                  <TableCell sx={{ color: "white" }}>Employee</TableCell>
                  <TableCell sx={{ color: "white" }}>Job Title</TableCell>
                  <TableCell sx={{ color: "white" }}>Department</TableCell>
                  <TableCell sx={{ color: "white" }} align="right">Pay Rate</TableCell>
                  <TableCell sx={{ color: "white" }} align="right">Regular Hours</TableCell>
                  <TableCell sx={{ color: "white" }} align="right">Overtime Hours</TableCell>
                  <TableCell sx={{ color: "white" }} align="right">Bonuses</TableCell>
                  <TableCell sx={{ color: "white" }} align="right">Total Earnings</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((emp) => {
                      const regularPay = emp.payRate * emp.regularHours;
                      const overtimePay = emp.payRate * 1.5 * emp.overtimeHours;
                      const total = regularPay + overtimePay + emp.bonuses;

                      return (
                        <StyledTableRow key={emp.id}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
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
                              <JobIcon color="action" fontSize="small" />
                              <Typography>{emp.role}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <DepartmentIcon color="action" fontSize="small" />
                              <Typography>{emp.department}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">${emp.payRate.toFixed(2)}</TableCell>
                          <TableCell align="right">{emp.regularHours}</TableCell>
                          <TableCell align="right">{emp.overtimeHours}</TableCell>
                          <TableCell align="right">${emp.bonuses.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              ${total.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </StyledTableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="flex-end" spacing={4} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="body2" color="textSecondary">Regular Pay Total:</Typography>
              <Typography variant="h6">${calculateTotal("regular").toFixed(2)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Overtime Total:</Typography>
              <Typography variant="h6">${calculateTotal("overtime").toFixed(2)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Bonuses Total:</Typography>
              <Typography variant="h6">${calculateTotal("bonuses").toFixed(2)}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Grand Total:</Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ${calculateTotal("total").toFixed(2)}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcess}
          disabled={loading || !payrollDate}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ProcessIcon />}
          size="large"
          sx={{ minWidth: 200 }}
        >
          {loading ? "Processing..." : "Process Payroll"}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default PayRoll;