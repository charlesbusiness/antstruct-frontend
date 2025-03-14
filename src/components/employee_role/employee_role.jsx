import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));
export default function CreateRole() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const role = formData.get("role");
    console.log("Role:", role);
    // You can handle form submission here (e.g., send data to an API)
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Role
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Role"
              name="role"
              required
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Create Role
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}