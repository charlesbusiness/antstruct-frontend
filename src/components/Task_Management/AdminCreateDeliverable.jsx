import * as React from "react";
import {
  Container, Box, TextField, Button, Typography, Grid
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminCreateDeliverable() {
  const [task, setTask] = React.useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigation = useNavigate()
  const [deliverables, setDeliverables] = React.useState([
    { deliverable_title: "", deliverable_description: "", submitted: false }
  ]);

  const { submitData } = useSubmitData();

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...deliverables];
    updated[index][name] = value;
    setDeliverables(updated);
  };

  const handleSubmit = async (e, index) => {
    e.preventDefault();
    const currentDeliverable = deliverables[index];
    const response = await submitData({
      data: { ...currentDeliverable, task_id: task?.id },
      endpoint: ApiRoutes.deliverables.create,
      method: "post",
      navigationPath: ''
    });

    if (response?.success) {
      const updated = [...deliverables];
      updated[index].submitted = true;
      setDeliverables([
        ...updated,
        { deliverable_title: "", deliverable_description: "", submitted: false }
      ]);
    }
  };

  const getTask = async () => {
    const response = await submitData({
      endpoint: ApiRoutes.tasks.task(id),
      method: "get"
    });

    if (response?.success) {
      const { data } = response;
      setTask(data);

      if (data?.deliverables?.length) {
        const existingDeliverables = data.deliverables.map(d => ({
          deliverable_title: d.deliverable_title,
          deliverable_description: d.deliverable_description,
          submitted: true,
        }));
        setDeliverables([
          ...existingDeliverables,
          { deliverable_title: "", deliverable_description: "", submitted: false }
        ]);
      } else {
        setDeliverables([{ deliverable_title: "", deliverable_description: "", submitted: false }]);
      }
    }
  }

  React.useEffect(() => {
    getTask();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">
          {task?.title} || Deliverables
        </Typography>
        <hr />
        {deliverables.map((deliverable, index) => (
          <>
            <Box key={index} component="form" onSubmit={(e) => handleSubmit(e, index)} sx={{ mt: 2, p: 1, borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    name="deliverable_title"
                    label="Deliverable Title"
                    value={deliverable.deliverable_title}
                    onChange={(e) => handleChange(index, e)}
                    disabled={deliverable.submitted}
                    required
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    name="deliverable_description"
                    label="Deliverable Description"
                    value={deliverable.deliverable_description}
                    onChange={(e) => handleChange(index, e)}
                    disabled={deliverable.submitted}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button type="submit" variant="contained" fullWidth>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <hr />
          </>
        ))}
      </Box>
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button onClick={() => navigation('/task/dashboard')}>Done</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
