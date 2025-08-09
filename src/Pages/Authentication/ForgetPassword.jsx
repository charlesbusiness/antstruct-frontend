import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import useSubmitData from '../../hooks/useSubmitData';
import { useState } from 'react';
import { ApiRoutes } from '../../utils/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';

function ForgotPassword({ open, handleClose }) {
  const { submitData } = useSubmitData()
  const { setContextData } = useAuth()
  const navigate = useNavigate();

  const [email, setEmail] = useState('')

  const handleSendMail = async (e) => {
    try {
      e.preventDefault()
      const response = await submitData({
        endpoint: ApiRoutes.authentication.sendForgotPassword,
        data: { email }
      })
      if (response.success) {
        handleClose()
        setContextData({ email })
        navigate(`/verify-password/otp/${email}`)
      }
    } catch (error) {
      const data = e?.response?.data
      if (data?.data && data.data?.email_isVerified == false) {
        setContextData({ email: email })
        navigate('/verify')
      }
    }

  }
  return (
    <Dialog
      component='form'
      onSubmit={handleSendMail}
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent

        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a link to
          reset your password.
        </DialogContentText>

        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Send Mail
        </Button>

      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;