import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ForgotPassword from '../ForgetPassword';
import { GoogleIcon, SitemarkIcon } from './CustomIcons';
import { Card } from '../../../common/Card';
import { validate } from '../../../services/validation/validate';
import useSubmitData from '../../../hooks/useSubmitData';
import { LoginSchema } from '../../../validations/authentication/login-schema';
import { ApiRoutes } from '../../../utils/ApiRoutes';
import ScreenLoader from '../../../common/Loader/scren-loader';
import ButtonLoader from '../../../common/Loader/button-loader';
import auth from '../../../services/authentication/authService';
import { PasswordField } from '../../../common/PasswordFiled';
import { useAuth } from '../../../contexts/authContext';

export default function SignInForm() {
  const [errors, setErrors] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const { submitData, error, isLoading } = useSubmitData()
  const { setSignupData } = useAuth()
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  })

  const location = useLocation()
  const navigate = useNavigate();

  const { from } = location.state || { from: { pathname: '/dashboard' } };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setErrors('')
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const validationErrors = validate(formData, LoginSchema);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      const response = await submitData({
        data: formData,
        endpoint: ApiRoutes.authentication.login,
        navigationPath: from
      })

      const data = {
        token: response?.data?.token,
        expiration: response?.data?.expire_at
      }
      auth.setJWT(JSON.stringify(data))
    } catch (e) {
      const data = e?.response?.data
      if (data?.data && data.data?.email_isVerified == false) {
      alert("Here")
        setSignupData({ email: formData.email })
        navigate('/verify')
      }
    }
  }

  return (
    <Card variant="outlined">
      <ScreenLoader status={isLoading} />
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Business Sign In
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'baseline' }}
            >
              Forgot your password?
            </Link>
          </Box>
          <PasswordField
            errors={errors}
            name={'password'}
            formData={formData}
            required={true}
            handleInputChange={handleInputChange}
          />

        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />

        <Button type="submit"
          disabled={isLoading ?? false}
          fullWidth variant="contained">
          {isLoading ? <ButtonLoader /> : 'Sign In'}
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <span>
            <Link
              to="/sign-up"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
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
          Sign in with Google
        </Button>
      </Box>
      <ForgotPassword open={open} handleClose={handleClose} />
    </Card>
  );
}
