import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Stack, Paper } from '@mui/material';
import AddBusinessRoundedIcon from '@mui/icons-material/AddBusinessRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import AddHomeWorkRoundedIcon from '@mui/icons-material/AddHomeWorkRounded';
import { VerifiedUser, VerifiedUserTwoTone } from '@mui/icons-material';
import useSubmitData from '../../hooks/useSubmitData';
import { ApiRoutes } from '../../utils/ApiRoutes';

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { submitData, isLoading } = useSubmitData()
  const [businessUserprofile, setBusinessUserProfile] = React.useState(null)
  
  const getBusinessUserProfile = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.businessProfile,
      method: 'get'
    })

    if (!response?.error) {
      setBusinessUserProfile(response?.data)
    }
  }

  React.useEffect(() => {
    getBusinessUserProfile()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to the Admin Portal
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4 }}>
          Manage your departments, roles, and business operations efficiently.
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddBusinessRoundedIcon />}
            onClick={() => navigate('/create-department')}
            fullWidth
          >
            Create Department
          </Button>
          {
            businessUserprofile == null &&
            <Button
              variant="contained"
              size="large"
              startIcon={<AddHomeWorkRoundedIcon />}
              onClick={() => navigate('/create-business')}
              fullWidth
            >
              Create Business
            </Button>
          }
          <Button
            variant="contained"
            size="large"
            startIcon={<GroupAddRoundedIcon />}
            onClick={() => navigate('/create-employee')}
            fullWidth
          >
            Create Employee
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<VerifiedUserTwoTone />}
            onClick={() => navigate('/create-role')}
            fullWidth
          >
            Create Role
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<VerifiedUser />}
            onClick={() => navigate('/assign-role')}
            fullWidth
          >
            Assign Employee Role
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}