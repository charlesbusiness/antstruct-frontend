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
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { validate } from "@src/services/validation/validate";
import { MultipleSelectWithFilter } from "@src/common/MultipleSelectWithFilter";
import { EmployeeDepartmentManager } from "@src/validations/business/employee-department-managers";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import UnmapDepartment from "./UnassignDepartmentManager";

export default function DepartmentManager() {
  const [errors, setErrors] = React.useState({});
  const { departments: dept, employees } = useBusinessProfile();
  const [mappedDept, setMappedDept] = React.useState([]);
  const [employeeDeptMap, setEmployeeDeptMap] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [createDept, setCreateDept] = React.useState(false);
  const openCreateDept = () => {
    setCreateDept(!createDept);
  };

  const [unmapManagers, setUnmapManager] = React.useState(false);
  const openUmapManager = () => {
    setUnmapManager(!unmapManagers);
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, EmployeeDepartmentManager);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    const response = await submitData({
      data: {
        department_id: formData.department_id,
        employee_id: formData.employee,
      },
      endpoint: ApiRoutes.employeeDeptMap.map,
      reload: false,
    });
    if (response.success) {
      buildEmployeeDeptMap();
      setMappedDept([]);
      openCreateDept(!createDept);
      setFormData({
        department_id: [],
        employee: "",
      });
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

  const buildEmployeeDeptMap = async () => {
    setLoading(true);
    if (!employees || employees.length === 0) {
      setLoading(false);
      return;
    }
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
    setLoading(false);
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
    if (employees?.length) buildEmployeeDeptMap();
  }, [employees]);

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {employeeDeptMap?.length > 0 ? (
            <Box sx={{ mt: 5 }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={openUmapManager}
                  sx={{ mr: 2 }}
                >
                  Unmap Managers
                </Button>

                <Button variant="outlined" onClick={openCreateDept}>
                  Map New Managers
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>Employee</TableCell>
                      <TableCell>Departments</TableCell>
                      <TableCell>Departments Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeeDeptMap.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell>
                          {emp.firstname} {emp.lastname}
                        </TableCell>
                        <TableCell>
                          {emp.departments
                            ?.map((d) => d.department_name)
                            .join(", ") || "—"}
                        </TableCell>
                        <TableCell>
                          {emp.departments
                            ?.map((d) => d.department_detail)
                            .join(", ") || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
              {" "}
              No Employee created at the moment{" "}
            </Typography>
          )}
        </>
      )}
      <Dialog onClose={openCreateDept} open={createDept} fullWidth>
        <DialogTitle>
          <Typography variant="h6" component={"h1"}>
            Department/Managers
          </Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <Container maxWidth="sm">
            <Card variant="outlined">
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
                          onClick={() =>
                            unmapDept(mapped.id, formData.employee)
                          }
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
            </Card>
          </Container>
        </DialogContent>
      </Dialog>

      <Dialog onClose={openUmapManager} open={unmapManagers} fullWidth>
        <DialogTitle>
          <Typography variant="h6" component={"h1"}>
            Department/Managers
          </Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <UnmapDepartment />
        </DialogContent>
      </Dialog>
    </>
  );
}
