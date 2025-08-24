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
  CircularProgress,
  Chip,
  Badge,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Alert,
  Fade,
  Slide,
} from "@mui/material";
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  CalendarToday,
  Description,
  RocketLaunch,
  TrendingUp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@src/utils/general";
import SprintDashboard from "./SprintDashboard";
import Can from "../../components/Can";
import { ENDPOINTS } from "../../utils/consts";

export default function ProjectDashboard() {
  const [projectModal, setProjectModal] = React.useState(false);
  const [projectId, setProjectId] = React.useState("");
  const [sprintModal, setSprintModal] = React.useState(false);
  const [successAlert, setSuccessAlert] = React.useState(false);

  const client = useQueryClient();
  const [formData, setFormData] = React.useState({
    project_name: "",
    project_description: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { submitData } = useSubmitData();
  const { projects, isLoading: loadingStatus } = useBusinessProfile();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await submitData({
      data: formData,
      endpoint: ApiRoutes.projects.create,
    });
    setIsLoading(false);
    if (response.success) {
      setProjectModal(false);
      setSuccessAlert(true);
      client.invalidateQueries(["projects"]);
      setFormData({ project_name: "", project_description: "" });
      setTimeout(() => setSuccessAlert(false), 3000);
    }
  };

  const showProjectModal = () => {
    setProjectModal(!projectModal);
  };

  const showSprintModal = (projectId) => {
    setSprintModal(!sprintModal);
    setProjectId(projectId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "completed":
        return "primary";
      case "paused":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <TrendingUp fontSize="small" />;
      case "completed":
        return <RocketLaunch fontSize="small" />;
      default:
        return <DashboardIcon fontSize="small" />;
    }
  };

  return (
    <>
      <Fade in={successAlert}>
        <Alert
          severity="success"
          sx={{ mb: 3, position: "sticky", top: 80, zIndex: 1000 }}
          onClose={() => setSuccessAlert(false)}
        >
          Project created successfully!
        </Alert>
      </Fade>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              Project Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your projects and track progress efficiently
            </Typography>
          </Box>
          <Can endpoint={ENDPOINTS?.CREATE_PROJECT}>
            <Button
              variant="contained"
              onClick={showProjectModal}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              New Project
            </Button>
          </Can>
        </Box>
      </Paper>

      {loadingStatus ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 8, minHeight: 200 }}
        >
          <Box textAlign="center">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading projects...
            </Typography>
          </Box>
        </Box>
      ) : projects?.length > 0 ? (
        <Grid container spacing={3}>
          {projects?.map((project) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <Slide direction="up" in timeout={500}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <DashboardIcon fontSize="small" />
                          {project.project_name}
                        </Typography>
                      </Box>
                      <Badge
                        badgeContent={project.sprints?.length || 0}
                        color="primary"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            borderRadius: 12,
                          },
                        }}
                      >
                        <Typography variant="caption" fontWeight={500}>
                          Sprints
                        </Typography>
                      </Badge>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: "text.secondary",
                        lineHeight: 1.6,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Description
                        fontSize="small"
                        sx={{ color: "text.disabled", mt: 0.2 }}
                      />
                      {project.project_description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarToday fontSize="small" color="disabled" />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(project.created_at)}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(project.status)}
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/sprints/${project.id}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        View Sprints
                      </Button>
                      <Can endpoint={ENDPOINTS.CREATE_SPRINT}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => showSprintModal(project.id)}
                          startIcon={<AddIcon />}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 500,
                          }}
                        >
                          Add Sprint
                        </Button>
                      </Can>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
              {sprintModal && projectId === project.id && (
                <SprintDashboard
                  sprintModal={sprintModal}
                  showSprintModal={() => showSprintModal(projectId)}
                  project_id={projectId}
                />
              )}
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 6,
            mt: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto" }}>
            <Avatar
              sx={{
                bgcolor: "primary.light",
                width: 80,
                height: 80,
                mx: "auto",
                mb: 3,
              }}
            >
              <DashboardIcon fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom color="text.primary">
              No Projects Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by creating your first project to organize your goals and sprints
            </Typography>
            <Button
              variant="contained"
              onClick={showProjectModal}
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                fontWeight: 600,
              }}
            >
              Create First Project
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog
        open={projectModal}
        onClose={showProjectModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 600,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Create New Project
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <form onSubmit={createProject}>
            <TextField
              autoFocus
              required
              margin="normal"
              id="project_name"
              name="project_name"
              label="Project Name"
              placeholder="Enter project name"
              fullWidth
              value={formData.project_name}
              onChange={handleChange}
              helperText={!formData.project_name && "Project name is required"}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
            <TextField
              required
              margin="normal"
              id="project_description"
              name="project_description"
              label="Project Description"
              placeholder="Describe your project goals and objectives"
              fullWidth
              multiline
              rows={4}
              value={formData.project_description}
              onChange={handleChange}
              helperText={
                !formData.project_description && "Project description is required"
              }
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />

            <DialogActions sx={{ px: 0, pt: 3, gap: 2 }}>
              <Button
                onClick={showProjectModal}
                disabled={isLoading}
                variant="outlined"
                sx={{ borderRadius: 2, minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{ borderRadius: 2, minWidth: 140 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}