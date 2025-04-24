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
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { validate } from "../../services/validation/validate";
import { MultipleSelectWithFilter } from "../../common/MultipleSelectWithFilter";
import { EmployeeDepartmentManager } from "../../validations/business/employee-department-managers";

export default function DepartmentManager() {
  const [errors, setErrors] = React.useState({});
  const [employees, setEmployees] = React.useState([]);
  const [dept, setDept] = React.useState([]);
  const [mappedDept, setMappedDept] = React.useState([]);
  const [employeeDeptMap, setEmployeeDeptMap] = React.useState([]);

  const { submitData } = useSubmitData();

  const [formData, setFormData] = React.useState({
    department_id: [],
    employee: "",
  });

  const handleInputChange = (e) => {
    setErrors("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "employee") {
      getMapped(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, EmployeeDepartmentManager);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: {
        department_id: formData.department_id,
        employee_id: formData.employee,
      },
      endpoint: ApiRoutes.employeeDeptMap.map,
      navigationPath: "/dashboard",
    });
  };

  const getDepartment = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.getDepartments,
      method: "get",
    });
    if (!response?.error) {
      setDept(response?.data);
    }
  };

  const getMapped = async (employee) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeDeptMap.getMapped + `?employee=${employee}`,
      method: "get",
    });
    if (!response?.error) {
      setMappedDept(response?.data);
    } else {
      setMappedDept([]);
    }
  };

  const getEmployees = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getEmployees,
      method: "get",
    });
    if (!response?.error) {
      setEmployees(response?.data);
    }
  };

  const buildEmployeeDeptMap = async () => {
    if (!employees || employees.length === 0) return;
    const mapped = await Promise.all(
      employees.map(async (emp) => {
        const response = await submitData({
          data: {},
          endpoint: ApiRoutes.employeeDeptMap.getMapped + `?employee=${emp.id}`,
          method: "get",
        });
        return {
          ...emp,
          departments: response?.error ? [] : response?.data || [],
        };
      })
    );
    setEmployeeDeptMap(mapped);
  };

  const unmapDept = async (id, employee) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeDeptMap.unmapDept + `/${id}/${employee}`,
      method: "delete",
    });
    if (!response?.error) {
      getMapped(employee);
      buildEmployeeDeptMap();
    }
  };

  React.useEffect(() => {
    getEmployees();
    getDepartment();
  }, []);

  React.useEffect(() => {
    if (employees.length) buildEmployeeDeptMap();
  }, [employees]);

  return (
    <>
      <Container maxWidth="sm">
        <Card variant="outlined">
          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Department Managers
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Employee ID</InputLabel>
                <Select
                  value={formData.employee}
                  onChange={handleInputChange}
                  label=" Employee"
                  name="employee"
                  error={!!errors.employee}
                  color={errors.employee ? "error" : "primary"}
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <MultipleSelectWithFilter
                fieldName={"department_id"}
                errors={errors}
                formData={formData}
                setFormData={setFormData}
                inputs={dept}
                required={true}
                dbField={"department_name"}
                comparedResult={mappedDept}
              />

              {mappedDept && mappedDept.length > 0 && (
                <ul>
                  {mappedDept.map((mapped) => (
                    <li
                      key={mapped.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {mapped.department_name}
                      <button
                        type="button"
                        onClick={() => unmapDept(mapped.id, formData.employee)}
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
                Map Department
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
      {employeeDeptMap?.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Employees & Mapped Departments
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>
                    Employee
                  </th>
                  <th style={{ textAlign: "left", padding: "8px" }}>
                    Departments
                  </th>
                <th style={{ textAlign: "left", padding: "8px" }}>Departments Description</th>
                </tr>
              </thead>
              <tbody>
                {employeeDeptMap.map((emp) => (
                  <tr key={emp.id}>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {emp.firstname} {emp.lastname}
                    </td>
                    <td
                      style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                    >
                      {emp.departments
                        ?.map((d) => d.department_name)
                        .join(", ") || "—"}
                    </td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                      {emp.departments?.map((d) => d.department_detail).join(", ") || "—"}
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
