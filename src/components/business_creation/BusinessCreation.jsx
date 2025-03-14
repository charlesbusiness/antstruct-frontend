import { Container } from "@mui/material";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

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

export default function BusinessCreation() {
  const [businessSize, setBusinessSize] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const businessData = {
      businessName: formData.get("businessName"),
      businessEmail: formData.get("businessEmail"),
      phoneNumber: formData.get("phoneNumber"),
      businessSize: businessSize,
      category: category,
      details: formData.get("details"),
      address: formData.get("address"),
    };
    console.log("Business Data:", businessData);
    // You can handle form submission here (e.g., send data to an API)
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Business Creation
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <TextField
            name="businessName"
            placeholder="Business Name"
            required
            fullWidth
          />
          <TextField
            name="businessEmail"
            placeholder="Business Email"
            type="email"
            required
            fullWidth
          />
          <TextField
            name="phoneNumber"
            placeholder="Phone Number"
            type="tel"
            required
            fullWidth
          />
          <Select
            value={businessSize}
            onChange={(e) => setBusinessSize(e.target.value)}
            placeholder="Business Size"
            required
            fullWidth
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
            fullWidth
          >
            <MenuItem value="retail">Retail</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="healthcare">Healthcare</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          <TextField
            name="details"
            placeholder="Details"
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            name="address"
            placeholder="Address"
            multiline
            rows={2}
            fullWidth
          />
          <Button type="submit" fullWidth variant="contained">
            Submit
          </Button>
        </Box>
      </Card>
    </Container>
  );
}