import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import useBusinessProfile from "@src/hooks/useBusinessProfile";

export default function UnmapDepartment() {
  const { employees } = useBusinessProfile();
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState("");
  const [assignedDepartments, setAssignedDepartments] = React.useState([]);
  const { submitData } = useSubmitData();


  const getAssignedDepartments = async (employeeId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employeeDeptMap.getMapped}?employee=${employeeId}`,
      method: "get"
    });
    if (response?.success) {
      setAssignedDepartments(response?.data || []);
    } else {
      setAssignedDepartments([])
    }
  };

  const unmapDepartment = async (deptId, employeeId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employeeDeptMap.unmapDept}/${deptId}/${employeeId}`,
      method: "delete"
    });
    if (!response?.error) {
      getAssignedDepartments(employeeId);
    }
  }

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);
    getAssignedDepartments(empId);
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
              label="Select Employee"
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstname} {emp.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {assignedDepartments.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Mapped Departments:</Typography>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {assignedDepartments.map((dept) => (
                  <li
                    key={dept.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
                  >
                    {dept.department_name}
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => unmapDepartment(dept.id, selectedEmployeeId)}
                    >
                      Unmap
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            selectedEmployeeId && <Typography variant="body2" sx={{ mt: 2 }}>No departments mapped.</Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}
