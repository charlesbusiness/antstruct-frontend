// unassign-role.jsx
import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useBusinessProfile from "../../hooks/useBusinessProfile";

export default function UnassignRole() {
  const { employees, error } = useBusinessProfile();
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState("");
  const [assignedRoles, setAssignedRoles] = React.useState([]);
  const [loadingRoles, setLoadingRoles] = React.useState(false);
  const { submitData } = useSubmitData();

  const getAssignedRoles = async (employeeId) => {
    setLoadingRoles(true);
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employees.getAssignedRole}/${employeeId}`,
      method: "get",
    });
    if (!response?.error) {
      setAssignedRoles(response?.data || []);
    } else {
      setAssignedRoles([]);
    }
    setLoadingRoles(false);
  };

  const removeAssignedRole = async (employeeId, roleId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employees.removeAssignRole}/${employeeId}/${roleId}`,
      method: "delete",
    });
    if (!response?.error) {
      getAssignedRoles(employeeId);
    }
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);
    getAssignedRoles(empId);
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Unassign Role
          </Typography>

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

          {loadingRoles ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <CircularProgress />
            </Box>
          ) : assignedRoles.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Assigned Roles:</Typography>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {assignedRoles.map((role) => (
                  <li
                    key={role.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    {role.name}
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() =>
                        removeAssignedRole(selectedEmployeeId, role.id)
                      }
                    >
                      Unassign
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            selectedEmployeeId && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                No roles assigned.
              </Typography>
            )
          )}
        </Box>
      </Card>
    </Container>
  );
}
