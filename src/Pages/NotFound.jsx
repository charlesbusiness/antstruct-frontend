import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you're looking for doesn't exist or is still in construction.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Go to Homepage
      </Button>
    </Box>
  );
}