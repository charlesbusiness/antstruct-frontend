import * as React from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function UserUpdateDeliverable() {
  const [assignedDeliverables, setAssignedDeliverables] = React.useState([]);
  const [formData, setFormData] = React.useState({
    deliverable_id: "",
    deliverable_description: ""
  });

  const { submitData } = useSubmitData();

  const getAssignedDeliverables = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.user.getAssignedDeliverables,
      method: "get"
    });
    if (!response?.error) {
      setAssignedDeliverables(response?.data);
    }
  };

  React.useEffect(() => {
    getAssignedDeliverables();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.user.updateDeliverable,
      method: "patch"
    });
    if (!response?.error) {
      setFormData({ deliverable_id: "", deliverable_description: "" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Assigned Deliverable
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Deliverable</InputLabel>
            <Select
              name="deliverable_id"
              value={formData.deliverable_id}
              onChange={handleChange}
              required
            >
              {assignedDeliverables.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.deliverable_title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            name="deliverable_description"
            label="Update Description"
            value={formData.deliverable_description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Update Deliverable
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
