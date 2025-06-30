import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { validate } from "@src/services/validation/validate";
import { AssignRoleSchema } from "@src/validations/business/assign-role-schema";
import { MultipleSelectWithFilter } from "@src/common/MultipleSelectWithFilter";
import useBusinessProfile from "@src/hooks/useBusinessProfile";

export default function AssignRole() {
  const { submitData, isLoading } = useSubmitData();

  // Get shared data from business context
  const { employees, roles } = useBusinessProfile();

  const [formData, setFormData] = React.useState({
    employee: "",
    business_role_id: [],
  });
  const [errors, setErrors] = React.useState({});
  const [assignedRoles, setAssignedRoles] = React.useState([]);
  const [employeeRoleMap, setEmployeeRoleMap] = React.useState([]);
  const [loadingMap, setLoadingMap] = React.useState(true);

  const handleInputChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "employee") {
      getAssignedRole(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, AssignRoleSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    submitData({
      data: formData,
      endpoint: ApiRoutes.employees.assignRole,
      navigationPath: "/dashboard",
    });
  };

  const getAssignedRole = async (employeeId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employees.getAssignedRole}/${employeeId}`,
      method: "get",
    });
    setAssignedRoles(response?.error ? [] : response?.data);
  };

  const removeAssignedRole = async (employeeId, roleId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employees.removeAssignRole}/${employeeId}/${roleId}`,
      method: "delete",
    });
    if (!response?.error) {
      getAssignedRole(employeeId);
      buildEmployeeRoleMap();
    }
  };

  const buildEmployeeRoleMap = async () => {
    setLoadingMap(true);
    if (!employees || employees.length === 0) {
      setLoadingMap(false);
      return;
    }

    const mapped = await Promise.all(
      employees.map(async (emp) => {
        const response = await submitData({
          data: {},
          endpoint: `${ApiRoutes.employees.getAssignedRole}/${emp.id}`,
          method: "get",
        });

        const roles = response?.error ? [] : response?.data || [];

        return {
          ...emp,
          roles,
        };
      })
    );

    setEmployeeRoleMap(mapped);
    setLoadingMap(false);
  };

  React.useEffect(() => {
    if (employees && employees.length > 0) {
      buildEmployeeRoleMap();
    }
  }, [employees]);

  return (
    <>
      <Container maxWidth="sm">
        <Card variant="outlined">
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" component="h1" gutterBottom>
              Assign Department Role
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={formData.employee}
                  onChange={handleInputChange}
                  label="Employee"
                  name="employee"
                  error={!!errors.employee}
                  helperText={errors.employee}
                  color={errors.employee ? "error" : "primary"}
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstname} {employee.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <MultipleSelectWithFilter
                fieldName={"business_role_id"}
                errors={errors}
                formData={formData}
                setFormData={setFormData}
                inputs={roles}
                required={true}
                dbField={"name"}
                comparedResult={assignedRoles}
              />

              {assignedRoles && assignedRoles.length > 0 && (
                <ul>
                  {assignedRoles.map((role) => (
                    <li
                      key={role.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {role.name}
                      <button
                        type="button"
                        onClick={() => {
                          removeAssignedRole(formData.employee, role.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "red",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
              >
                Assign Role
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
      {loadingMap ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 5 }}
        >
          <CircularProgress />
        </Box>
      ) : employeeRoleMap?.length > 0 ? (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Employees & Assigned Roles
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>
                    Employee
                  </th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Roles</th>
                </tr>
              </thead>
              <tbody>
                {employeeRoleMap.map((emp) => (
                  <tr key={emp.id}>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {emp.firstname} {emp.lastname}
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {emp.roles?.map((role) => role.name).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No Roles assigned to any employee at the moment.
        </Typography>
      )}
    </>
  );
}
