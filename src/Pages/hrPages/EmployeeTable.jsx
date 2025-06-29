import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  Paper,
  Box,
  Typography,
  TablePagination
} from '@mui/material';
import useBusinessProfile from '@src/hooks/useBusinessProfile';

const EmployeeTable = ({ employees, onViewMore }) => {
  const { employees: employeeData } = useBusinessProfile();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Paginated slice of employees
  const paginatedEmployees = employeeData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={employee.profile_image ?? ''}
                      alt={employee.firstname}
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="body1">{employee.firstname}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {employee.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department.department_name}</TableCell>
                <TableCell>
                  <TableCell>{employee.phone}</TableCell>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onViewMore(employee)}
                  >
                    View More
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={employees.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default EmployeeTable;
