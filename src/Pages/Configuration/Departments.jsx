import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  CardContent,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import ButtonLoader from "@src/common/Loader/button-loader";
import { validate } from "@src/services/validation/validate";
import { CreateDepartmentSchema } from "@src/validations/business/create-department-schema";
import useBusinessProfile from "../../hooks/useBusinessProfile";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    }
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="h1" gutterBottom>
            Departments
          </Typography>
          <Button variant="contained" onClick={openCreateDept}>
            Add New
          </Button>
        </Grid>
        <Divider sx={{ my: 1 }} />
        {departments && departments.length > 0 ? (
          <Grid container spacing={2}>
            {departments?.map((department) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={department.id}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Card variant="outlined" sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" color="textSecondary">
                      {" "}
                      Name: {department.department_name}
                    </Typography>
                    <Typography variant="body2">
                      Details: {department.department_detail}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
            No departments created.
          </Typography>
        )}
      </Box>

      <Dialog onClose={openCreateDept} open={createDept} fullWidth>
        <DialogTitle>
          <Typography variant="h6" component={"h1"}>
            Create Department
          </Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <Container maxWidth="sm" sx={{ mt: 1 }}>
            <Card variant="outlined">
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
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
                  placeholder="Enter Department Detail"
                  label="Department Detail"
                  type="text"
                  id="department_detail"
                  autoComplete="department_detail"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  error={!!errors.department_detail}
                  helperText={errors.department_detail}
                  color={errors.department_detail ? "error" : "primary"}
                  value={formData.department_detail}
                  onChange={handleInputChange}
                />

                <Button
                  type="submit"
                  disabled={isLoading ?? false}
                  fullWidth
                  variant="contained"
                >
                  {isLoading ? <ButtonLoader /> : "Create"}
                </Button>
              </Box>
            </Card>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
}
