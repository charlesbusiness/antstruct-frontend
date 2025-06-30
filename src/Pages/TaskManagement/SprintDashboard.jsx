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
  Divider,
  CircularProgress,
  CardActionArea,
  CardActions
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../../utils/general";

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

  const { data, isLoading } = useQuery({
    queryKey: ['sprints', id],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.projects.sprints(id),
        method: 'get',
      });
      if (response?.error) throw new Error('Failed to fetch sprints');
      return response.data;
    },
    enabled: !!id,
    keepPreviousData: true,
  });

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Stack>
              <Typography variant="h5">Project: {data?.[0]?.project?.project_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {data?.[0]?.project?.project_description}
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {data?.map((sprint) => (
              <Grid item xs={12} sm={6} md={4} key={sprint.id}>
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                    <CardContent>
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {sprint.sprint_name}
                        </Typography>
                        <Chip
                          label={sprint.project.status}
                          color={
                            sprint.project.status === 'active' ? 'success' : 
                            sprint.project.status === 'completed' ? 'primary' : 'default'
                          }
                          size="small"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Start:</strong> {formatDate(sprint.start_date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>End:</strong> {formatDate(sprint.end_date)}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2
                      }}>
                        <Badge
                          badgeContent={sprint.tasks?.length || 0}
                          color="primary"
                          sx={{ 
                            '& .MuiBadge-badge': {
                              right: -5,
                              top: -5,
                              fontSize: '0.75rem'
                            }
                          }}
                        >
                          <Typography variant="body2">Tasks</Typography>
                        </Badge>
                      </Box>
                    </CardContent>

                  <CardActions sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                    pt: 0
                  }}>
                    <Button 
                      size="small" 
                      component={Link} 
                      to={`/admin/create/task/${sprint.id}?project=${id}`}
                      sx={{ textTransform: 'none' }}
                    >
                      Add Task
                    </Button>
                    {sprint.tasks?.length > 0 && (
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/tasks/${sprint.id}`)}
                        sx={{ textTransform: 'none' }}
                      >
                        View Tasks
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Create Sprint Modal */}
      <Dialog
        open={sprintModal}
        onClose={() => showSprintModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Create New Sprint</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={createSprint} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              required
              margin="normal"
              name="sprint_name"
              label="Sprint Name"
              fullWidth
              value={formData.sprint_name}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                margin="normal"
                name="start_date"
                label="Start Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.start_date}
                onChange={handleChange}
              />
              <TextField
                required
                margin="normal"
                name="end_date"
                label="End Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.end_date}
                onChange={handleChange}
              />
            </Box>
            <DialogActions sx={{ px: 0, mt: 3 }}>
              <Button onClick={() => showSprintModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create Sprint
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}