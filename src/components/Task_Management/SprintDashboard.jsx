import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Badge,
  Divider
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../../utils/general";
import { MoreHoriz } from "@mui/icons-material";

export default function SprintDashboard({ showSprintModal, sprintModal = false, project_id }) {
  const client = useQueryClient()
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = React.useState({
    project_id: '',
    sprint_name: '',
    start_date: '',
    end_date: '',
  })
  const { submitData } = useSubmitData()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const createSprint = async (e) => {
    e.preventDefault()
    const response = await submitData({
      data: { ...formData, project_id },
      endpoint: ApiRoutes.projects.createSprint,
    })

    if (response.success) {
      showSprintModal(false)
      client.invalidateQueries(['projects', 'sprints'])
    }
  }

  const sprints = useQuery({
    queryKey: ['sprints', id], // include the ID!
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.projects.sprints(id), // pass ID to route
        method: 'get',
      });
      if (response?.error) throw new Error('Failed to fetch sprints');
      return response.data;
    },
    enabled: !!id, // only runs if ID is truthy
    keepPreviousData: true,
  })

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Stack>
          <Typography variant="h5">Project : {sprints?.data?.[0]?.project?.project_name}</Typography>
          <Typography variant="body2">Details : {sprints?.data?.[0]?.project?.project_description}</Typography>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {sprints?.data?.map((sprint) => (
          <Grid item xs={12} sm={6} md={4} key={sprint.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {sprint.sprint_name}
                  </Typography>
                </Box>

                <Box sx={{ my: 1, pb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Badge
                    badgeContent={sprint.tasks?.length || 0}
                    color="primary"
                    sx={{ mr: 2 }}
                  >
                    <Typography variant="caption">Tasks</Typography>
                  </Badge>
                  {
                    sprint.tasks?.length > 0 &&
                    <MoreHoriz sx={{ cursor: 'pointer' }} onClick={() => navigate(`/tasks/${sprint.id}`)} />
                  }
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Started: {formatDate(sprint.start_date)}
                  </Typography>

                  <Chip
                    label={sprint.status}
                    color={sprint.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />

                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    End Date: {formatDate(sprint.end_date)}
                  </Typography>
                </Box>



                <Link variant="contained" to={`/admin/create/task/${sprint.id}?project=${id}`}>Add Task</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal */}
      <Dialog
        open={sprintModal}
        onClose={showSprintModal}
        slotProps={{
          paper: {

            sx: {
              backgroundImage: 'none',

              width: '100%', // Full width
              m: 'auto',     // Centered
            },
          },
        }}
      >
        <DialogTitle>Create a sprint</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <form onSubmit={createSprint}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="project"
              name="sprint_name"
              label="Sprint name"
              placeholder="Sprint name"
              fullWidth
              value={formData.sprint_name}
              onChange={handleChange}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="start_date"
              name="start_date"
              label="Sprint start date "
              placeholder=" Sprint start date"
              fullWidth
              type="date"
              value={formData.start_date}
              onChange={handleChange}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="end_date"
              name="end_date"
              label="Sprint end date"
              placeholder="Sprint end date"
              fullWidth
              type="date"
              value={formData.end_date}
              onChange={handleChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={showSprintModal}>Cancel</Button>
              <Button variant="contained" type="submit">
                Create
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
        </DialogActions>
      </Dialog>
    </>
  );
}