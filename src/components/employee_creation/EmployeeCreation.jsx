import * as React from "react";
import { Container, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText } from "@mui/material";
import { Card } from "../../common/Card";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { CreateEmployeeSchema } from "../../validations/business/create-employees-schema";
import { validate } from "../../services/validation/validate";

export default function CreateEmployee() {
  const [errors, setErrors] = React.useState({});
  const [departments, setDepartment] = React.useState(null);
  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    department_id: '',
    gender: ''
  })

  const gender = ['male', 'female', 'others']

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
    const validationErrors = validate(formData, CreateEmployeeSchema)
    if (validationErrors) {
      console.log(validationErrors)
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.employees.create,
      navigationPath: '/employees'
    })
  }

  const getDepartments = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.getDepartments,
      method: 'get'
    })
    if (response?.error == false) {
      setDepartment(response?.data)
    }
  }

  React.useEffect(() => {
    getDepartments()
  }, [])


  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Employee
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstname"
              required
              error={!!errors.firstname}
              helperText={errors.firstname}
              color={errors.firstname ? 'error' : 'primary'}
              value={formData.firstname}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastname"
              required
              error={!!errors.lastname}
              helperText={errors.lastname}
              color={errors.lastname ? 'error' : 'primary'}
              value={formData.lastname}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              required
              error={!!errors.email}
              helperText={errors.email}
              color={errors.email ? 'error' : 'primary'}
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              type="tel"
              required
              error={!!errors.phone}
              helperText={errors.phone}
              color={errors.phone ? 'error' : 'primary'}
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              name="dob"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.dob}
              helperText={errors.dob}
              color={errors.dob ? 'error' : 'primary'}
              value={formData.dob}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              multiline
              rows={2}
              required
              error={!!errors.address}
              helperText={errors.address}
              color={errors.address ? 'error' : 'primary'}
              value={formData.address}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal" required error={!!errors.department_id}>
              <InputLabel>Department</InputLabel>
              <Select
                name="department_id"
                label="Department"
                value={formData?.department_id || ''}
                onChange={handleInputChange}
                color={errors.department_id ? 'error' : 'primary'}
              >
                {departments?.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.department_id && <FormHelperText>{errors.department_id}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                label="Gender"
                value={formData?.gender}
                onChange={handleInputChange}
                error={!!errors.gender}
                helperText={errors.gender}
                color={errors.gender ? 'error' : 'primary'}
              >

                {
                  gender?.map((gender) => (
                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Create Employee
            </Button>

          </Box>
        </Box>
      </Card>
    </Container>
  );
}