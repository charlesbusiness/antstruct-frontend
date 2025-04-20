import { Container } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import ButtonLoader from "../../common/Loader/button-loader";
import { validate } from "../../services/validation/validate";
import { CreateRoleSchema } from "../../validations/business/create-role-schema";

export default function RoleCreation() {

  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    name: '',
  })

  const handleInputChange = (e) => {
    setErrors('')
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, CreateRoleSchema)
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.business.createRoles,
      navigationPath: '/dashboard'
    })
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
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
            color={errors.name ? 'error' : 'primary'}
            value={formData.name}
            onChange={handleInputChange}
          />

          <Button type="submit"
            disabled={isLoading ?? false}
            fullWidth variant="contained">
            {isLoading ? <ButtonLoader /> : 'Create Role'}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}