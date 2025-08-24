import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import ButtonLoader from "@src/common/Loader/button-loader";
import { validate } from "@src/services/validation/validate";
import { CreateDepartmentSchema } from "@src/validations/business/create-department-schema";
import useBusinessProfile from "../../hooks/useBusinessProfile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Can from "../../components/Can";
import { ENDPOINTS } from "../../utils/consts";

export default function Departments() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({});
  const queryClient = useQueryClient();
  const { submitData, isLoading } = useSubmitData();
  const { departments, businessUserProfile } = useBusinessProfile();
  const [formData, setFormData] = React.useState({
    department_name: "",
    department_detail: "",
  });

  const [createDept, setCreateDept] = React.useState(false);
  const openCreateDept = () => {
    if (!businessUserProfile) {
      toast.error("Please create a business profile to continue", {
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/create-business");
      }, 3500);
      return;
    }
    setCreateDept(!createDept);
  };

  const handleInputChange = (e) => {
    setErrors("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, CreateDepartmentSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.business.createDepartment,
      reload: false,
    });

    if (response.success) {
      setFormData({ department_detail: "", department_name: "" });
      queryClient.invalidateQueries(["departments"]);
      setCreateDept(!createDept);
      toast.success("Department created successfully!");
    }
  };

  return (
    <>
      <Box sx={{ mt: 2, p: 2 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" component="h1" fontWeight="bold">
            Departments
          </Typography>
          <Can endpoint={ENDPOINTS.CREATE_BUSINESS_DEPARTMENT}>
            <Button 
              variant="contained" 
              onClick={openCreateDept}
              startIcon={<AddIcon />}
            >
              Add New Department
            </Button>
          </Can>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        {departments && departments.length > 0 ? (
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{ minWidth: 650 }} aria-label="departments table">
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Department Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((department) => (
                  <TableRow
                    key={department.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                      {department.department_name}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {department.department_detail || "No description provided"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert 
            severity="info" 
            sx={{ 
              mt: 2, 
              display: 'flex', 
              alignItems: 'center',
              '& .MuiAlert-message': { flexGrow: 1 }
            }}
          >
            <Box>
              <Typography variant="body1" gutterBottom>
                No departments have been created yet.
              </Typography>
              <Typography variant="body2">
                Get started by creating your first department to organize your business structure.
              </Typography>
            </Box>
            <Can endpoint={ENDPOINTS.CREATE_BUSINESS_DEPARTMENT}>
              <Button 
                variant="contained" 
                onClick={openCreateDept}
                size="small"
                sx={{ ml: 2 }}
              >
                Create Department
              </Button>
            </Can>
          </Alert>
        )}
      </Box>

      <Dialog onClose={openCreateDept} open={createDept} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" component="h1" fontWeight="bold">
            Create New Department
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                name="department_name"
                placeholder="Enter Department Name"
                label="Department Name"
                type="text"
                id="department_name"
                autoComplete="department_name"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.department_name}
                helperText={errors.department_name}
                color={errors.department_name ? "error" : "primary"}
                value={formData.department_name}
                onChange={handleInputChange}
              />

              <TextField
                name="department_detail"
                placeholder="Enter Department Description"
                label="Department Description"
                type="text"
                id="department_detail"
                autoComplete="department_detail"
                required
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                error={!!errors.department_detail}
                helperText={errors.department_detail}
                color={errors.department_detail ? "error" : "primary"}
                value={formData.department_detail}
                onChange={handleInputChange}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={openCreateDept}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading ?? false}
                  fullWidth
                  variant="contained"
                >
                  {isLoading ? <ButtonLoader /> : "Create Department"}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}