import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Button,
  Divider,
  DialogTitle,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import ButtonLoader from "@src/common/Loader/button-loader";
import { validate } from "@src/services/validation/validate";
import { CreateRoleSchema } from "@src/validations/business/create-role-schema";
import AssignRole from "./assign-role";
import Can from "../../components/Can";
import { ENDPOINTS } from "../../utils/consts";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`roles-tabpanel-${index}`}
      aria-labelledby={`roles-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Roles() {
  const { roles, employees } = useBusinessProfile();
  const { submitData, isLoading } = useSubmitData();
  const [loading, setLoading] = React.useState(true);
  const [activeModal, setActiveModal] = React.useState(null); // 'create', 'assign', 'unassign'
  const [formData, setFormData] = React.useState({
    name: "",
    employee: "",
    business_role_id: [],
  });
  const [errors, setErrors] = React.useState({});
  const [employeeRoleMap, setEmployeeRoleMap] = React.useState([]);
  const [loadingMap, setLoadingMap] = React.useState(true);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState("");
  const [assignedRoles, setAssignedRoles] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => {
    setActiveModal(null);
    setFormData({ name: "", employee: "", business_role_id: [] });
    setErrors({});
    setSelectedEmployeeId("");
    setAssignedRoles([]); // Reset assigned roles when closing modal
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  React.useEffect(() => {
    if (roles !== undefined) {
      setLoading(false);
    }
    if (employees && employees.length > 0) {
      buildEmployeeRoleMap();
    }
  }, [roles, employees]);

  // Count employees with roles
  const employeesWithRoles = employeeRoleMap.filter(
    (emp) => emp.roles && emp.roles.length > 0
  ).length;

  // Create Role Functions
  const handleCreateRoleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateRoleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(
      { name: formData.name },
      CreateRoleSchema
    );
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    const response = await submitData({
      data: { name: formData.name },
      endpoint: ApiRoutes.business.createRoles,
      reload: false,
    });
    if (response?.success) {
      closeModal();
      // Refresh roles data
      window.location.reload();
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

  // Unassign Role Functions
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployeeId(empId);
    getAssignedRoles(empId);
  };

  const getAssignedRoles = async (employeeId) => {
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
  };

  const removeAssignedRoleFromEmployee = async (employeeId, roleId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employees.removeAssignRole}/${employeeId}/${roleId}`,
      method: "delete",
    });
    if (!response?.error) {
      getAssignedRoles(employeeId);
      buildEmployeeRoleMap();
    }
  };

  // Function to refresh data after role assignment (to be called from AssignRole component)
  const refreshRoleData = () => {
    buildEmployeeRoleMap();
    closeModal();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="body1" color="text.secondary">
            Create and assign roles to manage employee permissions
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
        <Can endpoint={ENDPOINTS.CREATE_BUSINESS_ROLE}>
          <Button
            variant="contained"
            onClick={() => openModal("create")}
            startIcon={<AddIcon />}
          >
            Create Role
          </Button>
        </Can>
        <Can endpoint={ENDPOINTS.ASSIGN_ROLE_TO_EMPLOYEE}>
          <Button
            variant="outlined"
            onClick={() => openModal("assign")}
            startIcon={<AssignmentIcon />}
          >
            Assign Role
          </Button>
        </Can>
        <Can endpoint={ENDPOINTS.UNASSIGN_ROLE_TO_EMPLOYEE}>
          <Button
            variant="outlined"
            onClick={() => openModal("unassign")}
            startIcon={<CancelIcon />}
            color="secondary"
          >
            Unassign Role
          </Button>
        </Can>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <GroupsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {roles?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Roles
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <PersonIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {employeesWithRoles}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Employees with Roles
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <AssignmentIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {employees?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Employees
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : roles?.length > 0 ? (
        <>
          {/* Tabs Navigation */}
          <Paper sx={{ width: "100%", mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="roles tabs"
            >
              <Tab
                icon={<GroupsIcon />}
                iconPosition="start"
                label="Available Roles"
              />
              <Tab
                icon={<PersonIcon />}
                iconPosition="start"
                label="Employee Assignments"
              />
            </Tabs>
          </Paper>

          {/* Available Roles Tab */}
          <TabPanel value={activeTab} index={0}>
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead sx={{ backgroundColor: "primary.main" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Role Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Assigned To
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.map((role) => {
                    const assignedCount = employeeRoleMap.filter((emp) =>
                      emp.roles?.some((r) => r.id === role.id)
                    ).length;

                    return (
                      <TableRow key={role.id} hover>
                        <TableCell sx={{ fontWeight: "medium" }}>
                          {role.name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${assignedCount} employees`}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Employee Assignments Tab */}
          <TabPanel value={activeTab} index={1}>
            {loadingMap ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
              >
                <CircularProgress />
              </Box>
            ) : employeeRoleMap?.length > 0 ? (
              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead sx={{ backgroundColor: "primary.main" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Employee
                      </TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                        Roles
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employeeRoleMap.map((emp) => (
                      <TableRow key={emp.id} hover>
                        <TableCell>
                          {emp.firstname} {emp.lastname}
                        </TableCell>
                        <TableCell>
                          {emp.roles?.map((role) => role.name).join(", ") ||
                            "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No roles assigned to any employee at the moment.
              </Alert>
            )}
          </TabPanel>
        </>
      ) : (
        <Alert severity="info">
          <Typography variant="body1" gutterBottom>
            No roles have been created yet.
          </Typography>
          <Typography variant="body2">
            Create your first role to start managing employee permissions.
          </Typography>
          <Can endpoint={ENDPOINTS.CREATE_BUSINESS_ROLE}>
            <Button
              variant="contained"
              onClick={() => openModal("create")}
              size="small"
              sx={{ mt: 1 }}
            >
              Create First Role
            </Button>
          </Can>
        </Alert>
      )}

      {/* Modals (same as before) */}
      <Dialog
        onClose={closeModal}
        open={activeModal === "create"}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <AddIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Create New Role
          </Typography>
          <IconButton onClick={closeModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box component="form" noValidate onSubmit={handleCreateRoleSubmit}>
              <TextField
                name="name"
                placeholder="e.g., Project Manager, HR Specialist"
                label="Role Name"
                type="text"
                id="name"
                autoComplete="name"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
                value={formData.name}
                onChange={handleCreateRoleChange}
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button onClick={closeModal} color="inherit">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} variant="contained">
                  {isLoading ? <ButtonLoader /> : "Create Role"}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={closeModal}
        open={activeModal === "assign"}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Assign Role to Employee
          </Typography>
          <IconButton onClick={closeModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AssignRole onSuccess={refreshRoleData} />
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={closeModal}
        open={activeModal === "unassign"}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            <CancelIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Unassign Role from Employee
          </Typography>
          <IconButton onClick={closeModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Employee</InputLabel>
              <Select
                value={selectedEmployeeId}
                onChange={handleEmployeeChange}
                label="Select Employee"
              >
                {employees?.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstname} {emp.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {assignedRoles.length > 0 ? (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Assigned Roles:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {assignedRoles.map((role) => (
                    <Chip
                      key={role.id}
                      label={role.name}
                      onDelete={() =>
                        removeAssignedRoleFromEmployee(
                          selectedEmployeeId,
                          role.id
                        )
                      }
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              selectedEmployeeId && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  No roles assigned to this employee.
                </Typography>
              )
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={closeModal} color="inherit">
                Close
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
