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
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import ButtonLoader from "@src/common/Loader/button-loader";
import { validate } from "@src/services/validation/validate";
import { CreateRoleSchema } from "@src/validations/business/create-role-schema";
import { useQueryClient } from "@tanstack/react-query";

export default function RoleCreation({ openCreateRole }) {
  const [errors, setErrors] = React.useState({})
  const queryClient = useQueryClient()
  const { submitData, isLoading } = useSubmitData();
  const [formData, setFormData] = React.useState({
    name: "",
  });

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
    const validationErrors = validate(formData, CreateRoleSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.business.createRoles,
      reload: false,
    })
    if (response?.success) {
      queryClient.invalidateQueries(['roles'])
      setFormData({ name: '' })
      openCreateRole()
    }
  }


  return (

    <Container maxWidth="md">
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

      </Card>
    </Container>
  );
}
