import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { SitemarkIcon } from '../../components/CustomIcons';
import { Card } from '../../common/Card';
import { validate } from '../../services/validation/validate';
import useSubmitData from '../../hooks/useSubmitData';
import { ChangePasswordSchema } from '../../validations/authentication/login-schema';
import { ApiRoutes } from '../../utils/ApiRoutes';
import ScreenLoader from '../../common/Loader/scren-loader';
import ButtonLoader from '../../common/Loader/button-loader';
import { PasswordField } from '../../common/PasswordFiled';
import { useAuth } from '../../contexts/authContext';

export default function ResetPassword() {
  const [errors, setErrors] = React.useState({});
  const { submitData, error, isLoading } = useSubmitData()
  const { otp } = useParams()
  const [formData, setFormData] = React.useState({
    password: '',
  })
  const navigate = useNavigate();
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
      const validationErrors = validate(formData, ChangePasswordSchema);
      if (validationErrors) {
        setErrors(validationErrors);
        return;
      }

      const response = await submitData({
        data: { ...formData, code: otp },
        endpoint: ApiRoutes.authentication.resetPassword,
        navigationPath: '/'
      })

    } catch (e) {
      const data = e?.response?.data
      if (data?.data && data.data?.email_isVerified == false) {
        setContextData({ email: formData.email })
        navigate(`/verify-password/otp/${formData.email}`)
      }
    }
  }


  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <ScreenLoader status={isLoading} />
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <SitemarkIcon />
        </Box>
        <Typography
          component="h1"
          variant="h4"
        >
          Change Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
        >

          <FormControl>
            <FormLabel htmlFor="password">New Password</FormLabel>

            <PasswordField
              errors={errors}
              label="Password"
              name={'password'}
              formData={formData}
              required={true}
              handleInputChange={handleInputChange}
            />
          </FormControl>


          <Button type="submit"
            disabled={isLoading ?? false}
            fullWidth variant="contained">
            {isLoading ? <ButtonLoader /> : 'Change Password'}
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Back to login?{' '}
            <span>
              <Link
                to="/"
                sx={{ alignSelf: 'center' }}
              >
                Login
              </Link>
            </span>
          </Typography>
        </Box>

      </Card>
    </Box>
  );

}

