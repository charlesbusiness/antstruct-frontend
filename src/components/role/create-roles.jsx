import * as React from "react";
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CardContent,
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import ButtonLoader from "../../common/Loader/button-loader";
import { validate } from "../../services/validation/validate";
import { CreateRoleSchema } from "../../validations/business/create-role-schema";

export default function RoleCreation() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData();
  const [formData, setFormData] = React.useState({
    name: "",
  });
  const [roles, setRoles] = React.useState(null);

  const handleInputChange = (e) => {
    setErrors("");
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, CreateRoleSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.business.createRoles,
      reload: true,
    });
  };
  const getroles = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.roles,
      method: "get",
    });

    if (!response?.error) {
      setRoles(response?.data);
    }
  };

  React.useEffect(() => {
    getroles();
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Card variant="outlined">
          <Box sx={{ mt:1 }}>
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
            >
              Roles Creation
            </Typography>
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
                name="name"
                placeholder="Enter Role Name"
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
                color={errors.name ? "error" : "primary"}
                value={formData.name}
                onChange={handleInputChange}
              />

              <Button
                type="submit"
                disabled={isLoading ?? false}
                fullWidth
                variant="contained"
              >
                {isLoading ? <ButtonLoader /> : "Create Role"}
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4 }}>
          Created Roles
        </Typography>
        <Grid container spacing={2}>
          {roles?.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    {" "}
                    Name: {role.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      </>
  );
}
