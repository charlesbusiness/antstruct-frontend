import { Container } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import ButtonLoader from "../../common/Loader/button-loader";
import { CreateBusinessSchema } from "../../validations/business/create-business-schema";
import { validate } from "../../services/validation/validate";

export default function BusinessCreation() {
  const [errors, setErrors] = React.useState({});
  const [businessSize, setBusinessSize] = React.useState(null);
  const [businessCategory, setBusinessCategory] = React.useState(null);
  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    business_name: '',
    business_category_id: '',
    business_size_id: '',
    email: '',
    phone: '',
    details: '',
    address: '',
    business_number: '',
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
    const validationErrors = validate(formData, CreateBusinessSchema)
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.business.create,
      reload: true,
    })
  }

  const getBusinessCategories = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.getCategory,
      method: 'get'
    })
    if (response?.error == false) {
      setBusinessCategory(response?.data)
    }
  }


  const getBusinessSize = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.size,
      method: 'get'
    })
    if (response?.error == false) {
      setBusinessSize(response?.data)
    }
  }


  React.useEffect(() => {
    getBusinessCategories()
    getBusinessSize()
  }, [])
 
  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Business Creation
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
            name="business_name"
            placeholder="business name"
            label="Business Name"
            type="text"
            id="business_name"
            autoComplete="business_name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.business_name}
            helperText={errors.business_name}
            color={errors.business_name ? 'error' : 'primary'}
            value={formData.business_name}
            onChange={handleInputChange}
          />
          <TextField
            name="email"
            placeholder="Business Email"
            label="Business Email"
            type="email"
            required
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            color={errors.email ? 'error' : 'primary'}
            value={formData.email}
            onChange={handleInputChange}
          />

          <TextField
            name="phone"
            placeholder="Phone Number"
            type="tel"
            required
            fullWidth
            variant="outlined"
            error={!!errors.phone}
            helperText={errors.phone}
            color={errors.phone ? 'error' : 'primary'}
            value={formData.phone}
            onChange={handleInputChange}
          />

          <Select
            value={formData?.business_size_id}
            name="business_size_id"
            placeholder="Business Size"
            label="Business Size"
            variant="outlined"
            required
            fullWidth
            onChange={handleInputChange}
            error={!!errors.business_size_id}
            helperText={errors.business_size_id}
            color={errors.business_size_id ? 'error' : 'primary'}
          >
            <MenuItem value="">Select</MenuItem>
            {
              businessSize?.map(size => (
                <MenuItem key={size.id} value={size.id}>{size.size_range}</MenuItem>
              ))
            }
          </Select>

          <Select
            value={formData.business_category_id}
            onChange={handleInputChange}
            placeholder="Category"
            label="Category"
            variant="outlined"
            required
            fullWidth
            name="business_category_id"
            error={!!errors.business_category_id}
            helperText={errors.business_category_id}
            color={errors.business_category_id ? 'error' : 'primary'}
          >
            <MenuItem value="">Select</MenuItem>
            {
              businessCategory?.map(cat => (
                <MenuItem key={cat.key} value={cat.id}>{cat.category_name}</MenuItem>
              ))
            }
          </Select>

          <TextField
            name="details"
            placeholder="Details"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            error={!!errors.details}
            helperText={errors.details}
            color={errors.details ? 'error' : 'primary'}
            value={formData.details}
            onChange={handleInputChange}
          />

          <TextField
            name="address"
            placeholder="Address"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            error={!!errors.address}
            helperText={errors.address}
            color={errors.address ? 'error' : 'primary'}
            value={formData.address}
            onChange={handleInputChange}
          />

          <TextField
            name="business_number"
            placeholder="Business Number"
            label="Business Number"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            error={!!errors.business_number}
            helperText={errors.business_number}
            color={errors.business_number ? 'error' : 'primary'}
            value={formData.business_number}
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