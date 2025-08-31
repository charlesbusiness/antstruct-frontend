import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Link, useNavigate, useParams } from 'react-router-dom';
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

export default function VerifyPasswordOtpForm() {
  const [errors, setErrors] = React.useState({});
  const { submitData, isLoading } = useSubmitData()
  const navigate = useNavigate()
  const { contextData } = useAuth()
  const { id } = useParams()
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, VerifyAcccountSchema);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.authentication.verifyAccountRecoveryOtp,
      reload: false
    })
    if (response.success) {
      navigate(`/password/reset/${response?.data.code}`)
    }
  }

  const handleRsend = () => {
    submitData({
      data: { email: id },
      endpoint: ApiRoutes.authentication.sendForgotPassword,
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default', // optional background color
        p: 2,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          p: 4,
        }}
      >
        <SitemarkIcon />

        <Typography
          component="h6"
          variant="h6"
        >
          OTP Verification
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >
          <TextField
            id="code"
            type="text"
            label='OTP'
            name="code"
            placeholder="123456"
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

          <Button
            type="submit"
            disabled={isLoading ?? false}
            fullWidth
            variant="contained"
          >
            {isLoading ? <ButtonLoader /> : 'Verify OTP'}
          </Button>

          <Button
            type="button"
            disabled={isLoading ?? false}
            fullWidth
            variant="contained"
            onClick={handleRsend}
          >
            {isLoading ? <ButtonLoader /> : 'Resend Code'}
          </Button>

          <Typography sx={{ textAlign: 'center' }}>
            <Link to="/">Back To Signin</Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );

}