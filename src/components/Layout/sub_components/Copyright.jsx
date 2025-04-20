import * as React from 'react';
import { Link, Typography } from '@mui/material';

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://www.antstruct.com/">
        Anstruct
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
