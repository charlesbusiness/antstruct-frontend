// assign-role.jsx (modified)
import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  DialogActions
} from "@mui/material";
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { validate } from "@src/services/validation/validate";
import { AssignRoleSchema } from "@src/validations/business/assign-role-schema";
import { MultipleSelectWithFilter } from "@src/common/MultipleSelectWithFilter";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import Can from "../../components/Can";
import { ENDPOINTS } from "../../utils/consts";

export default function AssignRole({ onSuccess }) {
  const { submitData, isLoading } = useSubmitData();
  const { employees, roles } = useBusinessProfile();
  const [formData, setFormData] = React.useState({
    employee: "",
    business_role_id: [],
  });
  const [errors, setErrors] = React.useState({});
  const [assignedRoles, setAssignedRoles] = React.useState([]);

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
      navigationPath: "/config/roles",
    });

    // Call the onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
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
    }
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h1" gutterBottom>
            Assign Role to Employee
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Employee</InputLabel>
              <Select
                value={formData.employee}
                onChange={handleInputChange}
                label="Employee"
                name="employee"
                error={!!errors.employee}
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
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Currently assigned roles:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {assignedRoles.map((role) => (
                    <Chip
                      key={role.id}
                      label={role.name}
                      onDelete={() => removeAssignedRole(formData.employee, role.id)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <DialogActions>
              <Button onClick={onSuccess} color="inherit">
                Cancel
              </Button>
              <Can endpoint={ENDPOINTS.ASSIGN_ROLE_TO_EMPLOYEE}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="contained"
                >
                  Assign Role
                </Button>
              </Can>
            </DialogActions>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}