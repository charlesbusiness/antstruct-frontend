// Enhanced Employees.jsx with table and modal view
import * as React from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import CreateEmployee from "./EmployeeCreation";

export default function Employees() {
  const { employees } = useBusinessProfile();
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openEmployeeForm, setOpenEmployeeForm] = React.useState(false);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleCloseEmployeeForm = () => {
    setOpenEmployeeForm(!openEmployeeForm);
  }

  return (
    <>
      <Container>
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid >
            <Typography variant="h6" component="h1" gutterBottom >
              Records
            </Typography>
          </Grid>
          <Grid >
            <Button onClick={handleCloseEmployeeForm}>Add New</Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.firstname} {employee.lastname}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.department.department_name}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleViewDetails(employee)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for employee details */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent dividers>
            {selectedEmployee && (
              <Grid container spacing={2}>
                <Grid item xs={6}><strong>Name:</strong> {selectedEmployee.firstname} {selectedEmployee.lastname}</Grid>
                <Grid item xs={6}><strong>Email:</strong> {selectedEmployee.email}</Grid>
                <Grid item xs={6}><strong>Phone:</strong> {selectedEmployee.phone}</Grid>
                <Grid item xs={6}><strong>Gender:</strong> {selectedEmployee.gender}</Grid>
                <Grid item xs={6}><strong>Date of Birth:</strong> {selectedEmployee.dob}</Grid>
                <Grid item xs={6}><strong>Department:</strong> {selectedEmployee.department?.department_name}</Grid>
                <Grid item xs={6}><strong>Role:</strong> {selectedEmployee.role}</Grid>
                <Grid item xs={12}><strong>Address:</strong> {selectedEmployee.address}</Grid>
                <Grid item xs={12}><strong>Joined On:</strong> {selectedEmployee.created_at}</Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Modal to create new employee */}
      </Container>
      <Dialog open={openEmployeeForm} onClose={handleCloseEmployeeForm} maxWidth='lg'>
        <DialogContent>
          <CreateEmployee handleCloseEmployeeForm={handleCloseEmployeeForm} />
        </DialogContent>
      </Dialog>
    </>
  );
}
