import * as React from "react";
import {
  Container, Box, TextField, Button, Typography, Grid
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";



const getTask = async (submitData, id) => {
  const response = await submitData({
    endpoint: ApiRoutes.tasks.task(id),
    method: "get"
  })
  return response
}

export default function AdminCreateDeliverable() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const navigation = useNavigate()

  const [deliverables, setDeliverables] = React.useState([
    { deliverable_title: "", deliverable_description: "", submitted: false, id: '' }
  ]);

  const { submitData } = useSubmitData()

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const updated = [...deliverables]
    updated[index][name] = value
    setDeliverables(updated)
  }

  const handleSubmit = async (e, index) => {
    e.preventDefault();
    const currentDeliverable = deliverables[index]
    const payload = {
      ...currentDeliverable,
      task_id: task?.id,
    }

    if (currentDeliverable.id) {
      payload.id = currentDeliverable.id
    }

    const response = await submitData({
      data: payload,
      endpoint: ApiRoutes.deliverables.create,
    })

    if (response?.success) {
      const updated = [...deliverables];
      updated[index].submitted = true;
      const lastObject = updated[deliverables.length - 1]
      let lastIsEmpty = false
      if (lastObject.deliverable_title == '' || lastObject.deliverable_description == '') { lastIsEmpty = true }

      if (!lastIsEmpty) {
        updated.push({ deliverable_title: "", deliverable_description: "", submitted: false })
      }

      setDeliverables(updated)
      getTask(submitData, id)
    }
  }


  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task'],
    queryFn: async () => {
      const response = await getTask(submitData, id);
      if (response?.error) throw new Error('Failed to fetch API resources');
      const { data } = response

      if (data?.deliverables?.length) {
        const existingDeliverables = data.deliverables.map(d => ({
          deliverable_title: d.deliverable_title,
          deliverable_description: d.deliverable_description,
          submitted: true,
          id: d.id
        }));
        setDeliverables([
          ...existingDeliverables,
          { deliverable_title: '', deliverable_description: '', submitted: false }
        ]);
      } else {
        setDeliverables([{ deliverable_title: '', deliverable_description: '', submitted: false }]);
      }
      return data;
    },
  })


  const enableInput = (index) => {
    const updated = [...deliverables]
    updated[index] = { ...updated[index], submitted: false }
    setDeliverables(updated)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">
          {task?.title} || Deliverables
        </Typography>
        <hr />
        {deliverables.map((deliverable, index) => (
          <React.Fragment key={deliverable?.id ?? index + 1}>
            <Box key={deliverable?.id ?? index + 1} component="form" onSubmit={(e) => handleSubmit(e, index)} sx={{ mt: 2, p: 1, borderRadius: 2 }}>

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
                  {deliverable.submitted ? (
                    <div>
                      <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        onClick={() => enableInput(index)}
                      >
                        Edit
                      </Button>
                    </div>
                  ) : (
                    <Button type="submit" variant="contained" fullWidth>
                      Save
                    </Button>
                  )}
                </Grid>

              </Grid>
            </Box>
            <hr />
          </React.Fragment>
        ))}
      </Box>
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Button onClick={() => navigation('/task/dashboard')}>Go to dashboard</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
