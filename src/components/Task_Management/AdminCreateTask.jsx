import * as React from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function AdminCreateTask() {
  const [formData, setFormData] = React.useState({
    title: "",
    task_description: "",
    priority: "",
    start_date: "",
    expected_date_of_delivery: "",
    assignee: [],
    assignor: ""
  });

  const [users, setUsers] = React.useState([]);
  const { submitData } = useSubmitData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.admin.createTask,
      method: "post"
    });
    if (!response?.error) {
      setFormData({
        title: "",
        task_description: "",
        priority: "",
        start_date: "",
        expected_date_of_delivery: "",
        assignee: [],
        assignor: ""
      });
    }
  };

  const getUsers = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getEmployees,
      method: "get"
    });
    if (!response?.error) {
      setUsers(response?.data);
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Task
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            name="title"
            label="Task Title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            name="task_description"
            label="Task Description"
            value={formData.task_description}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              input={<OutlinedInput label="Priority" />}
              required
            >
              {['Low', 'Normal', 'Moderate', 'High'].map((priority) => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            name="start_date"
            type="datetime-local"
            label="Start Date"
            value={formData.start_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            fullWidth
            name="expected_date_of_delivery"
            type="datetime-local"
            label="Expected Delivery Date"
            value={formData.expected_date_of_delivery}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Assignee(s)</InputLabel>
            <Select
              multiple
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              input={<OutlinedInput label="Assignee(s)" />}
              renderValue={(selected) => selected.map(
                id => users.find(user => user.id === id)?.firstname
              ).join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstname} {user.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Assignor</InputLabel>
            <Select
              name="assignor"
              value={formData.assignor}
              onChange={handleChange}
              input={<OutlinedInput label="Assignor" />}
              required
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstname} {user.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
            Create Task
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
