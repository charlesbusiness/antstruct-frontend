import * as React from "react";
import { Container, Typography, Grid, CardContent, Box, Button, TextField } from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import ButtonLoader from "../../common/Loader/button-loader";
import { validate } from "../../services/validation/validate";
import { CreateDepartmentSchema } from "../../validations/business/create-department-schema";

export default function DepartmentCreation() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()
  const [departments, setDepartments] = React.useState(null)

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

    const getDepartments = async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.business.getDepartments,
        method: 'get'
      })
  
      if (!response?.error) {
        setDepartments(response?.data)
      }
    }
  
    React.useEffect(() => {
      getDepartments()
    }, [])

  return (
    <>
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
              color={errors.department_name ? 'error' : 'primary'}
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
      <Box sx={{ mt: 2 }}>
      <Typography variant="h6" component="h1" gutterBottom sx={{ mt: 4 }}>
        Created Departments
      </Typography>
      <Grid container spacing={2}>
        {departments?.map((department) => (
          <Grid item xs={12} sm={6} md={4} key={department.id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary"> Name: {department.department_name}</Typography>
                <Typography variant="body2">Details: {department.department_detail}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
}