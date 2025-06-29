import * as React from 'react';
import Stack from '@mui/material/Stack';
import SignInForm from './SignInForm';
import Content from '../../components/Content';
import { CustomStack } from '../../common/Custom-Stack';
import VerifyEmailAddressForm from './VerifyEmailAddressForm';


export default function VerifyEmailAddress() {
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
          <VerifyEmailAddressForm />
        </Stack>
      </Stack>
    </CustomStack>
  );
}