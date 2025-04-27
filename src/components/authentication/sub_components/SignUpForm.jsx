import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GoogleIcon, SitemarkIcon } from './CustomIcons';
import { Card } from '../../../common/Card';
import { validate } from '../../../services/validation/validate';
import { RegisterSchema } from '../../../validations/authentication/register';
import useSubmitData from '../../../hooks/useSubmitData';
import { ApiRoutes } from '../../../utils/ApiRoutes';
import ButtonLoader from '../../../common/Loader/button-loader';
import { PasswordField } from '../../../common/PasswordFiled';
import { useAuth } from '../../../contexts/authContext';


export default function SignUpForm() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()
  const { setContextData } = useAuth();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    phone: ''
  })

  const handleInputChange = (e) => {
    setErrors('')
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, RegisterSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    const response = await submitData({
      data: { ...formData, isBusinessOwner: true },
      endpoint: ApiRoutes.authentication.register,
      navigationPath: '/verify'
    })

    if (response && response.error == false) {
      setContextData({ email: formData.email, phone: formData.phone })
    }
  }


  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Business Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            color={errors.email ? 'error' : 'primary'}
            value={formData.email}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="tel">Phone</FormLabel>
          <TextField

            id="phone"
            type="tel"
            name="phone"
            placeholder="+234 123 456 7890"
            autoComplete="phone"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={formData.phone}
            error={!!errors.phone}
            helperText={errors.phone}
            color={errors.phone ? 'error' : 'primary'}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <PasswordField
            errors={errors}
            name={'password'}
            formData={formData}
            required={true}
            handleInputChange={handleInputChange}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox
            value="remember"
            color="primary"
          />}
          label="I Agree to Our Terms & Conditions"
        />
        <Button type="submit"
          disabled={isLoading ?? false}
          fullWidth variant="contained">
          {isLoading ? <ButtonLoader /> : 'Sign Up'}
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <span>
            <Link
              to="/"
              sx={{ alignSelf: 'center' }}
            >
              Sign in
            </Link>
          </span>
        </Typography>
      </Box>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => alert('Sign in with Google')}
          startIcon={<GoogleIcon />}
        >
          Sign up with Google
        </Button>
      </Box>
    </Card>
  );
}