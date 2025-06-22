import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useBusinessProfile from "../../hooks/useBusinessProfile";
import { MultipleSelectFiled } from "../../common/MultipleSelect";
import { TextField } from "../../common/TextField";
import { TextArea } from "../../common/TextArea";
import AdminCreateDeliverable from "./AdminCreateDeliverable";
import CustomModal from "../../common/CustomModal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function AdminCreateTask() {
  const [formData, setFormData] = React.useState({
    title: "",
    task_description: "",
    priority: "",
    start_date: "",
    start_time: "",
    expected_date_of_delivery: "",
    expected_time_of_delivery: "",
    assignee: [],
  })

  const { submitData } = useSubmitData();
  const navigation = useNavigate()
  const { employees } = useBusinessProfile()
  const [errors, setErrors] = React.useState({})
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { id } = useParams()
  const [searchParams] = useSearchParams();

  const projectId = searchParams.get('project');
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await submitData({
      data: { ...formData, sprint_id: id },
      endpoint: ApiRoutes.tasks.create,
      method: "post",
      reload: false
    })

    if (!response?.error) {
      const { data } = response
      navigation(`/admin/create/task/deliverable?id=${data.id}&project=${projectId}`)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Task
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            name="title"
            label="Task Title"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={true}
          />

          <TextArea
            name="task_description"
            label="Task Description"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={true}
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
                <MenuItem key={priority} value={priority.toLowerCase()}>{priority}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="start_date"
            type="date"
            label="Start Date"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={true}
          />
          <TextField
            name="start_time"
            type="time"
            label="Start Time"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={false}
          />

          <TextField
            name="expected_date_of_delivery"
            label='Delivery Date'
            type="date"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={true}
          />
          <TextField
            name="expected_time_of_delivery"
            label='Delivery Time'
            type="time"
            formData={formData}
            errors={errors}
            handleInputChange={handleChange}
            required={false}
          />

          <FormControl fullWidth margin="normal">
            {/* <InputLabel>Assignee(s)</InputLabel> */}
            <MultipleSelectFiled
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              dbField={'firstname'}
              fieldName={'assignee'}
              inputs={employees}
            />
          </FormControl>

          <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
            Create Task
          </Button>
        </Box>
      </Box>
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Hello Chief 👑"
      >
        <AdminCreateDeliverable />
      </CustomModal>
    </Container>
  );
}
