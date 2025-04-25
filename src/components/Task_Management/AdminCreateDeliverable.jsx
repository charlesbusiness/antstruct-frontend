import * as React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function AdminCreateDeliverable() {
  const [formData, setFormData] = React.useState({
    task_id: "",
    deliverable_title: "",
    deliverable_description: "",
    deliverable_count: ""
  });

  const [tasks, setTasks] = React.useState([]);
  const { submitData } = useSubmitData();

  const getTasks = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.admin.getAllTasks,
      method: "get"
    });
    if (!response?.error) {
      setTasks(response?.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.admin.createDeliverable,
      method: "post"
    });
    if (!response?.error) {
      setFormData({
        task_id: "",
        deliverable_title: "",
        deliverable_description: "",
        deliverable_count: ""
      });
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Task Deliverable
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Task</InputLabel>
            <Select
              name="task_id"
              value={formData.task_id}
              onChange={handleChange}
              required
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="deliverable_title"
            label="Deliverable Title"
            value={formData.deliverable_title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            name="deliverable_description"
            label="Deliverable Description"
            value={formData.deliverable_description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            name="deliverable_count"
            label="Deliverable Count"
            value={formData.deliverable_count}
            onChange={handleChange}
            type="number"
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Create Deliverable
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
