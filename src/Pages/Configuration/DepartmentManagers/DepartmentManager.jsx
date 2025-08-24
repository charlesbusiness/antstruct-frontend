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
  Chip,
  Alert,
  IconButton,
  Card,
  Divider,
  Tooltip,
  Grid
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AssignmentInd as AssignmentIndIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { validate } from "@src/services/validation/validate";
import { MultipleSelectWithFilter } from "@src/common/MultipleSelectWithFilter";
import { EmployeeDepartmentManager } from "@src/validations/business/employee-department-managers";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import UnmapDepartment from "./UnassignDepartmentManager";
import Can from "../../../components/Can";
import { ENDPOINTS } from "../../../utils/consts";

export default function DepartmentManager() {
  const [errors, setErrors] = React.useState({});
  const { departments: dept, employees } = useBusinessProfile();
  const [mappedDept, setMappedDept] = React.useState([]);
  const [employeeDeptMap, setEmployeeDeptMap] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [createDept, setCreateDept] = React.useState(false);
  const [unmapManagers, setUnmapManager] = React.useState(false);
  const { submitData } = useSubmitData();

  const [formData, setFormData] = React.useState({
    department_id: [],
    employee: "",
  });

  const openCreateDept = () => {
    setCreateDept(!createDept);
  };

  const openUmapManager = () => {
    setUnmapManager(!unmapManagers);
  };

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
      openCreateDept();
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

  const managers = employeeDeptMap.filter(emp => emp.departments.length > 0);
  const nonManagers = employeeDeptMap.filter(emp => emp.departments.length === 0);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Assign and manage department leadership roles
          </Typography>
        </Box>
        <Box>
          <Can endpoint={ENDPOINTS.UNMAPPED_DEPT}>
            <Button
              variant="outlined"
              onClick={openUmapManager}
              sx={{ mr: 2 }}
              startIcon={<CancelIcon />}
            >
              Unassign Managers
            </Button>
          </Can>
          <Can endpoint={ENDPOINTS.MAP_DEPARTMENT_TO_EMPLOYEE_MANAGERS}>
            <Button 
              variant="contained" 
              onClick={openCreateDept}
              startIcon={<AddIcon />}
            >
              Assign Manager
            </Button>
          </Can>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

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
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {employees?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employees
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <AssignmentIndIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {managers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Department Managers
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                <BusinessIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight="bold">
                  {dept?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departments
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Managers Table */}
          {managers.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIndIcon sx={{ mr: 1 }} /> Department Managers
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead sx={{ backgroundColor: 'primary.main' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Departments</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {managers.map((emp) => (
                      <TableRow key={emp.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                            <Typography>
                              {emp.firstname} {emp.lastname}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {emp.departments.map((dept) => (
                              <Chip
                                key={dept.id}
                                label={dept.department_name}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View details">
                            <IconButton size="small" onClick={() => {
                              setFormData({ employee: emp.id, department_id: [] });
                              getMapped(emp.id);
                              openCreateDept();
                            }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              No department managers assigned yet. Use the "Assign Manager" button to get started.
            </Alert>
          )}

          {/* Non-Managers Section */}
          {nonManagers.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Employees Without Department Management Roles
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                {nonManagers.length} employee(s) are not assigned to manage any departments.
              </Alert>
            </Box>
          )}
        </>
      )}

      {/* Assign Manager Dialog */}
      <Dialog onClose={openCreateDept} open={createDept} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h1">
            <AssignmentIndIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Assign Department Manager
          </Typography>
          <IconButton onClick={openCreateDept} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box component="form" noValidate onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Select Employee</InputLabel>
                <Select
                  value={formData.employee}
                  onChange={handleInputChange}
                  label="Select Employee"
                  name="employee"
                  error={!!errors.employee}
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.firstname} {employee.lastname} ({employee.email})
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
                label="Select Departments"
              />

              {mappedDept && mappedDept.length > 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Currently assigned departments:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {mappedDept.map((mapped) => (
                      <Chip
                        key={mapped.id}
                        label={mapped.department_name}
                        onDelete={() => unmapDept(mapped.id, formData.employee)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={!formData.employee || formData.department_id.length === 0}
              >
                Assign Department Manager
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Unassign Manager Dialog */}
      <Dialog onClose={openUmapManager} open={unmapManagers} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h1">
            <CancelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Unassign Department Managers
          </Typography>
          <IconButton onClick={openUmapManager} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UnmapDepartment onSuccess={buildEmployeeDeptMap} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}