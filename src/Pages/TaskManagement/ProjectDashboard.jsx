import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Badge,

} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import useBusinessProfile from "../../hooks/useBusinessProfile";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../../utils/general";
import SprintDashboard from "./SprintDashboard";

export default function ProjectDashboard() {
  const navigate = useNavigate()
  const [projectModal, setprojectModal] = React.useState(false)
  const [projectId, setProjectId] = React.useState('')
  const [sprintModal, setSprintModal] = React.useState(false)

  const client = useQueryClient()
  const [formData, setFormData] = React.useState({
    project_name: '',
    project_description: ''
  })
  const { submitData } = useSubmitData()
  const { projects } = useBusinessProfile()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    })
    )
  }

  const createProject = async (e) => {
    e.preventDefault()
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.projects.create,
    })
    if (response.success) {
      setprojectModal(false)
      client.invalidateQueries(['projects'])
      setFormData({ project_name: '', project_description: '' })
    }
  }

  const showProjectModal = () => {
    setprojectModal(!projectModal)
  }


  const showSprintModal = (projectId) => {
    setSprintModal(!sprintModal)
    setProjectId(projectId)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Projects
        </Typography>
        <Chip label="Create Project" color="primary" variant="outlined" style={{ cursor: 'pointer' }} onClick={showProjectModal} />

      </Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {projects?.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {project.project_name}
                  </Typography>
                  <Badge
                    badgeContent={project.sprints?.length || 0}
                    color="primary"
                  >
                    <Typography variant="caption">Sprints</Typography>
                  </Badge>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {project.project_description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Started: {formatDate(project.created_at)}
                  </Typography>
                  <Chip
                    label={project.status}
                    color={project.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography sx={{ mb: 1 }}>Active Sprint: </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                  <Link variant="outlined" to={`/sprints/${project.id}`}>Manage Sprints</Link>

                  <Button variant="contained" onClick={() => showSprintModal(project.id)}>Add Sprint</Button>
                </Box>

                <SprintDashboard
                  sprintModal={sprintModal}
                  showSprintModal={() => showSprintModal(projectId)}
                  project_id={projectId} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog

        open={projectModal}
        onClose={showProjectModal}
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
        <DialogTitle>Create a project</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <form onSubmit={createProject}>
            <TextField
              autoFocus
              required
              margin="normal"
              id="project"
              name="project_name"
              label="Project name"
              placeholder="Project name"
              fullWidth
              value={formData.project_name}
              onChange={handleChange}
            />
            <TextField
              autoFocus
              required
              margin="normal"
              id="project_description"
              name="project_description"
              label="Project Details"
              placeholder="Project Details"
              fullWidth
              value={formData.project_description}
              onChange={handleChange}
              multiline
              rows={4}
            />

            <DialogActions sx={{ pb: 3, px: 3 }}>
              <Button variant="contained" type="submit">Create Project</Button>
            </DialogActions>
          </form>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={showProjectModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}