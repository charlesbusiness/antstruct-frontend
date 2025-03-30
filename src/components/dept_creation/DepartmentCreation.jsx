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
import { CreateDepartmentSchema } from "../../validations/business/create-department-schema";

export default function DepartmentCreation() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    department_name: '',
    department_detail:'',
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
    const validationErrors = validate(formData, CreateDepartmentSchema)
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.business.createDepartment,
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
          Department Creation
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
            name="department_name"
            placeholder="xyz"
            type="text"
            id="department_name"
            autoComplete="department_name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.department_name}
            helperText={errors.department_name}
            color={errors.department_name ? 'error' : 'primary'}
            value={formData.department_name}
            onChange={handleInputChange}
          />

          <TextField
            name="department_detail"
            placeholder="xyz"
            type="text"
            id="department_detail"
            autoComplete="department_detail"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.department_detail}
            helperText={errors.department_detail}
            color={errors.department_detail ? 'error' : 'primary'}
            value={formData.department_detail}
            onChange={handleInputChange}
          />

          <Button type="submit"
            disabled={isLoading ?? false}
            fullWidth variant="contained">
            {isLoading ? <ButtonLoader /> : 'Create Business'}
          </Button>

        </Box>
      </Card>
    </Container>
  );
}