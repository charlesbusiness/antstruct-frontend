import * as React from "react";
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Checkbox,ListItemText  } from "@mui/material";
import { resources, roles } from "../../utils/data";
import OutlinedInput from '@mui/material/OutlinedInput';
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
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

export default function MapResources() {
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedResource, setSelectedResource] = React.useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Assigned Resource:", { employee: selectedRole, resource: selectedResource });
    // You can handle form submission here (e.g., send data to an API)
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedResource(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Map Resources to Role
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label="Role"
              >
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Resources</InputLabel>
              <Select
                value={selectedResource}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                label="Resource"
                multiple
              >
                {resources.map((resource, index) => (
                  <MenuItem key={index} value={resource}>
                     <Checkbox checked={selectedResource.includes(resource)} />
                     <ListItemText primary={resource} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Assign Role
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}