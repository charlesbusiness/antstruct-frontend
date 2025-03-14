import * as React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { Container, Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

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
export default function CreateEmployee() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const employeeData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      address: formData.get("address"),
      department: formData.get("department"),
      gender: formData.get("gender"),
    };
    console.log("Employee Data:", employeeData);
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Employee
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              type="tel"
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              multiline
              rows={2}
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Department</InputLabel>
              <Select name="department" label="Department">
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select name="gender" label="Gender">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}