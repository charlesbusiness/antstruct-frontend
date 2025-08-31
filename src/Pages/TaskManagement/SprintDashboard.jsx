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
  Badge,
  Divider,
  CircularProgress,
  Paper,
  Avatar,
  IconButton,
  Slide,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday,
  RocketLaunch,
  TrendingUp,
  Assignment,
  EmojiEvents,
} from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "../../utils/general";

export default function SprintDashboard() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [sprintModal, setSprintModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    sprint_name: "",
    start_date: "",
    end_date: "",
  });
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { submitData } = useSubmitData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const showSprintModal = (show) => {
    setSprintModal(show);
    if (!show) {
      // Reset form when closing modal
      setFormData({
        sprint_name: "",
        start_date: "",
        end_date: "",
      });
    }
  };

  const createSprint = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await submitData({
      data: {
        ...formData,
        project_id: id,
      },
      endpoint: ApiRoutes.projects.createSprint,
    });

    setIsLoading(false);

    if (response.success) {
      showSprintModal(false);
      setSuccessAlert(true);
      client.invalidateQueries(["sprints", id]);
      setTimeout(() => setSuccessAlert(false), 3000);
    }
  };

  const { data: sprints, isLoading: loadingSprints } = useQuery({
    queryKey: ["sprints", id],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.projects.sprints(id),
        method: "get",
      });
      if (response?.error) throw new Error("Failed to fetch sprints");
      return response.data;
    },
    enabled: !!id,
    keepPreviousData: true,
  });

  const { data: project } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.projects.get(id),
        method: "get",
      });
      if (response?.error) throw new Error("Failed to fetch project");
      return response.data;
    },
    enabled: !!id,
  });

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
        return <EmojiEvents fontSize="small" />;
      default:
        return <RocketLaunch fontSize="small" />;
    }
  };

  if (loadingSprints) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: 400 }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading sprints...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {sprints?.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => navigate("/project/dashboard")}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                Sprints
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {project?.project_name} - {project?.project_description}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Badge
              badgeContent={sprints?.length || 0}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 12,
                  px: 2,
                  py: 1,
                },
              }}
            >
              <Typography variant="h6" color="primary">
                Total Sprints
              </Typography>
            </Badge>

            <Button
              variant="contained"
              onClick={() => showSprintModal(true)}
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
              Add Sprint
            </Button>
          </Box>
        </Paper>
      )}

      {!sprints || sprints.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            p: 6,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              <RocketLaunch fontSize="large" />
            </Avatar>
            <Typography variant="h6" gutterBottom color="text.primary">
              No Sprints Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Start by creating your first sprint to organize tasks and track
              progress
            </Typography>
            <Button
              variant="contained"
              onClick={() => showSprintModal(true)}
              startIcon={<AddIcon />}
              size="large"
              sx={{
                borderRadius: 3,
                px: 4,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Create First Sprint
            </Button>
            <Box>
              <Button
                variant="outlined"
                onClick={() => navigate("/project/dashboard")}
                sx={{ borderRadius: 3 }}
              >
                Back to Projects
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sprints?.map((sprint) => (
            <Grid item xs={12} sm={6} md={4} key={sprint.id}>
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
                        <RocketLaunch fontSize="small" />
                        {sprint.sprint_name}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(sprint.project?.status)}
                        label={sprint.project?.status}
                        color={getStatusColor(sprint.project?.status)}
                        size="small"
                        variant="filled"
                        sx={{ fontWeight: 500, textTransform: "capitalize" }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday fontSize="small" color="disabled" />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Start:</strong>{" "}
                          {formatDate(sprint.start_date)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarToday fontSize="small" color="disabled" />
                        <Typography variant="body2" color="text.secondary">
                          <strong>End:</strong> {formatDate(sprint.end_date)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Badge
                        badgeContent={sprint.tasks?.length || 0}
                        color="primary"
                        sx={{
                          "& .MuiBadge-badge": {
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            borderRadius: 12,
                            px: 1.5,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Assignment fontSize="small" />
                          Tasks
                        </Typography>
                      </Badge>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                        mt: 3,
                      }}
                    >
                      <Button
                        size="small"
                        component={Link}
                        to={`/admin/create/task/${sprint.id}?project=${id}`}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2, textTransform: "none", flex: 1 }}
                      >
                        Add Task
                      </Button>
                      {sprint.tasks?.length > 0 && (
                        <Button
                          size="small"
                          onClick={() => navigate(`/tasks/${sprint.id}`)}
                          variant="contained"
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            flex: 1,
                          }}
                        >
                          View Tasks
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Sprint Modal */}
      <Dialog
        open={sprintModal}
        onClose={() => showSprintModal(false)}
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
            Create New Sprint
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={createSprint}>
            <TextField
              autoFocus
              required
              margin="normal"
              name="sprint_name"
              label="Sprint Name"
              placeholder="Enter sprint name"
              fullWidth
              value={formData.sprint_name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
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
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
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
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />
            </Box>
            <DialogActions sx={{ px: 0, pt: 3, gap: 2 }}>
              <Button
                onClick={() => showSprintModal(false)}
                variant="outlined"
                sx={{ borderRadius: 2, minWidth: 100 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ borderRadius: 2, minWidth: 140 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create Sprint"
                )}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
