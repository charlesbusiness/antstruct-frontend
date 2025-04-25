import * as React from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function ChangeTaskStatus() {
  const [tasks, setTasks] = React.useState([]);
  const [formData, setFormData] = React.useState({
    task_id: "",
    status: ""
  });
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

  React.useEffect(() => {
    getTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.admin.changeTaskStatus,
      method: "patch"
    });
    if (!response?.error) {
      setFormData({ task_id: "", status: "" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Change Task Status
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
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {['Pending', 'In Progress', 'Done'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Update Status
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
