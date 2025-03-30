import * as React from 'react';
import Stack from '@mui/material/Stack';
import SignUpForm from './sub_components/SignUpForm';
import Content from './sub_components/Content';
import { CustomStack } from '../../common/Custom-Stack';
import { Navigate } from 'react-router-dom';
import auth from '../../services/authentication/authService';


export default function SignUp() {
  if (auth.getCurrentUser()) { return <Navigate to='/dashboard' /> }

  return (
    <CustomStack>
      <Stack
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{
          justifyContent: 'center',
          gap: { xs: 6, sm: 12 },
          p: 2,
          mx: 'auto',
        }}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: { xs: 2, sm: 4 },
            m: 'auto',
          }}
        >
          <Content />
          <SignUpForm />
        </Stack>
      </Stack>
    </CustomStack>

  );
}