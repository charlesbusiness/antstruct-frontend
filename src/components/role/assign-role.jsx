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
  Autocomplete,
  TextField,
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { validate } from "../../services/validation/validate";
import { AssignRoleSchema } from "../../validations/business/assign-role-schema";
import { MultipleSelectWithFilter } from "../../common/MultipleSelectWithFilter";

export default function AssignRole() {
  const [errors, setErrors] = React.useState({});
  const [roles, setRoles] = React.useState(null);
  const [employees, setEmployees] = React.useState(null);
  const [assignedRoles, setAssignedRoles] = React.useState(null);
  const { submitData, isLoading } = useSubmitData();
  const [formData, setFormData] = React.useState({
    employee: "",
    business_role_id: [],
  });
  const [employeeRoleMap, setEmployeeRoleMap] = React.useState([]);

  const handleInputChange = (e) => {
    setErrors("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "employee") {
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

  const buildEmployeeRoleMap = async () => {
    if (!employees || employees.length === 0) return;

    const promises = employees.map(async (emp) => {
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
    });

    const result = await Promise.all(promises);
    setEmployeeRoleMap(result);
  };

  const getEmployees = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getEmployees,
      method: "get",
    });
    if (response?.error == false) {
      setEmployees(response?.data);
    }
  };
  const getAssignedRole = async (employeeId) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getAssignedRole + `/${employeeId}`,
      method: "get",
    });
    if (response?.error == false) {
      setAssignedRoles(response?.data);
    } else {
      setAssignedRoles([]);
    }
  };

  const getRoles = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.roles,
      method: "get",
    });
    if (response?.error == false) {
      setRoles(response?.data);
    }
  };

  const removeAssignedRole = async (employeeId, roleId) => {
    const response = await submitData({
      data: {},
      endpoint:
        ApiRoutes.employees.removeAssignRole + `/${employeeId}/${roleId}`,
      method: "delete",
    });
    if (response?.error == false) {
      getAssignedRole(employeeId);
    }
  };

  // React.useEffect(() => {
  //   getRoles()
  //   getEmployees()
  // }, [])
  React.useEffect(() => {
    const init = async () => {
      await getRoles();
      await getEmployees();
    };
    init();
  }, []);

  React.useEffect(() => {
    if (employees) {
      buildEmployeeRoleMap();
    }
  }, [employees]);

  return (
    <>
      <Container maxWidth="sm">
        <Card variant="outlined">
          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Assign Role
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
      {employeeRoleMap?.length > 0 && (
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
      )}
    </>
  );
}
