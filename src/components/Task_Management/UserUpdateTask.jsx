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

export default function UserUpdateTask() {
  const [assignedTasks, setAssignedTasks] = React.useState([]);
  const [formData, setFormData] = React.useState({
    task_id: "",
    task_description: ""
  });

  const { submitData } = useSubmitData();

  const getAssignedTasks = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.user.getAssignedTasks,
      method: "get"
    });
    if (!response?.error) {
      setAssignedTasks(response?.data);
    }
  };

  React.useEffect(() => {
    getAssignedTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.user.updateTask,
      method: "patch"
    });
    if (!response?.error) {
      setFormData({ task_id: "", task_description: "" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Update Assigned Task
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Task</InputLabel>
            <Select
              name="task_id"
              value={formData.task_id}
              onChange={handleChange}
              required
            >
              {assignedTasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            name="task_description"
            label="Update Description"
            value={formData.task_description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Update Task
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
