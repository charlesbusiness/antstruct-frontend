import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { SitemarkIcon } from '../../components/CustomIcons';
import { Card } from '../../common/Card';
import { validate } from '../../services/validation/validate';
import useSubmitData from '../../hooks/useSubmitData';
import { ApiRoutes } from '../../utils/ApiRoutes';
import { VerifyAcccountSchema } from '../../validations/authentication/verify-account-schema';
import ButtonLoader from '../../common/Loader/button-loader';
import { useAuth } from '../../contexts/authContext';

export default function VerifyEmailAddressForm() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()
  const { contextData } = useAuth()
  const [formData, setFormData] = React.useState({
    code: '',
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
    const validationErrors = validate(formData, VerifyAcccountSchema);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const response = submitData({
      data: formData,
      endpoint: ApiRoutes.authentication.verifyAccount,
      navigationPath: '/'
    })
  }

  const handleRsend = (event) => {
    const { email, phone } = contextData
    submitData({
      data: { phone: phone, email: email },
      endpoint: ApiRoutes.authentication.resendVerificationCode,
      navigationPath: '/verify'
    })
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
        Account Verification
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="email">OTP</FormLabel>
          <TextField

            id="code"
            type="text"
            name="code"
            placeholder="1234"
            autoComplete="code"
            autoFocus
            required
            fullWidth
            variant="outlined"
            error={!!errors.code}
            helperText={errors.code}
            color={errors.code ? 'error' : 'primary'}
            value={formData.code}
            onChange={handleInputChange}
          />
        </FormControl>

        <Button type="submit"
          disabled={isLoading ?? false}
          fullWidth variant="contained">
          {isLoading ? <ButtonLoader /> : 'Verify Account'}
        </Button>

        <Button type="button"
          disabled={isLoading ?? false}
          fullWidth variant="contained"
          onClick={handleRsend}
        >
          {isLoading ? <ButtonLoader /> : 'Resend Code'}
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          <Link
            to="/"
            sx={{ alignSelf: 'center' }}
          >
            Back To Signin
          </Link>

        </Typography>
      </Box>

    </Card>
  );
}