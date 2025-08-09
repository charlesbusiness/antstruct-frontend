import * as React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  LinearProgress,
  Badge,
  Divider,
  FormControl,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Person as UserIcon,
  CalendarToday as DueDateIcon,
} from "@mui/icons-material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { formatDate } from "../../utils/general";
import {
  TabPanel,
  a11yProps,
  getPriorityIcon,
  getStatusIcon,
  priorityCounts,
} from "../../common/tasks-utils";

export default function TaskDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = React.useState(0);
  const [tasks, setTasks] = React.useState(null);
  const [pending, setPending] = React.useState(null);
  const [inProgress, setInProgress] = React.useState(null);
  const [done, setDone] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [taskOverview, setOverview] = React.useState(null);
  const { submitData } = useSubmitData();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTasks = async (query) => {
    setLoading(true);
    const response = await submitData({
      endpoint: ApiRoutes.tasks.tasks(query, id),
      method: "get",
    });

    if (response?.success) {
      const { data } = response;
      setTasks(data);
      const pending = data.filter((t) => t.status === "pending");
      const inProgress = data.filter(
        (t) =>
          t.status === "in-progress" ||
          t.status === "reviewd" ||
          t.status === "testing" ||
          t.status === "completed"
      );
      const done = data.filter((t) => t.status === "approved");
      const taskOverview = {
        pending: pending,
        inProgress: inProgress,
        done: done,
      };
      setOverview(taskOverview);
      setDone(done);
      setInProgress(inProgress);
      setPending(pending);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Task Management
            </Typography>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Chip
                label={`Active Sprint: ${tasks ? tasks[0]?.sprint?.sprint_name : ""
                  }`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="dashboard tabs"
            >
              <Tab label="Overview" {...a11yProps(0)} />
              <Tab label="Tasks" {...a11yProps(1)} />
              <Tab label="Analytics" {...a11yProps(2)} />
            </Tabs>
          </Box>

          {/* Task overview */}
          <TabPanel value={value} index={0}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Object.entries(taskOverview ?? {}).map(([status, tasks]) => (
                <Grid item xs={12} md={4} key={status}>
                  <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {getStatusIcon(status)}
                      <Typography
                        variant="subtitle1"
                        sx={{ ml: 1, textTransform: "capitalize" }}
                      >
                        {status} ({tasks.length})
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    {tasks.slice(0, 5).map((task) => (
                      <Box
                        key={task.id}
                        sx={{
                          mb: 2,
                          p: 1,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <Typography variant="body1" fontWeight="medium">
                          {task.title}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <UserIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 1 }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mr: 2 }}
                          >
                            {task.assignees[0]?.assignee?.firstname}
                          </Typography>
                          <DueDateIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(task.expected_date_of_delivery)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          {getPriorityIcon(task.priority)}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            {task.priority} Priority
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            | Status: {task.status}
                          </Typography>
                        </Box>
                        {task.progress > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress}
                              color={
                                task.progress === 100 ? "success" : "primary"
                              }
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {task.progress}% complete
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Task Priorities
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <Grid item xs={6} sm={3} key={priority}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: "center" }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                    >
                      {getPriorityIcon(priority)}
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      {priority}
                    </Typography>
                    <Badge badgeContent={count} color="primary" />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Task Panel */}
          <TabPanel value={value} index={1}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Grid container spacing={1} sx={{ mb: 2, fontWeight: "bold" }}>
                <Grid item xs={3}>
                  Task
                </Grid>
                <Grid item xs={2}>
                  Assignee
                </Grid>
                <Grid item xs={2}>
                  Status
                </Grid>
                <Grid item xs={2}>
                  Priority
                </Grid>
                <Grid item xs={2}>
                  Due Date
                </Grid>
                <Grid item xs={1}>
                  Action
                </Grid>
              </Grid>
              <Divider sx={{ mb: 2 }} />
              {tasks?.map((task) => (
                <React.Fragment key={task.id}>
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    sx={{ py: 1 }}
                  >
                    <Grid item xs={3}>
                      <Typography>{task.title}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl
                        variant="standard"
                        size="small"
                        sx={{
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                        }}
                      >
                        {/* <InputLabel>Assignee</InputLabel> */}
                        <Select value={task.assignees[0]?.assignee?.id || ""}>
                          {task.assignees.map((user) => (
                            <MenuItem
                              key={user.assignee.id}
                              value={user.assignee.id}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                                  <UserIcon fontSize="small" />
                                </Avatar>
                                {user.assignee.firstname}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <Chip
                        icon={getStatusIcon(
                          task.progress === 100
                            ? "Done"
                            : task.progress > 0
                              ? "In Progress"
                              : "Pending"
                        )}
                        label={task.status}
                        size="small"
                        color={
                          task.progress === 100
                            ? "success"
                            : task.progress > 0
                              ? "info"
                              : "default"
                        }
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Chip
                        icon={getPriorityIcon(task.priority)}
                        label={task.priority}
                        size="small"
                        color={
                          task.priority === "high"
                            ? "error"
                            : task.priority === "moderate"
                              ? "warning"
                              : task.priority === "low"
                                ? "success"
                                : "info"
                        }
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        {formatDate(task.expected_date_of_delivery)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/task/${task.id}`)}
                      >
                        view
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                </React.Fragment>
              ))}
            </Paper>
          </TabPanel>

          {/* Analytics */}
          <TabPanel value={value} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: "300px" }}>
                  <Typography variant="h6" gutterBottom>
                    Status Distribution
                  </Typography>
                  {/* Placeholder for chart */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Pie chart showing task status distribution
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: "300px" }}>
                  <Typography variant="h6" gutterBottom>
                    Completion Rate
                  </Typography>
                  {/* Placeholder for chart */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Line chart showing completion rate over time
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Team Performance
                  </Typography>
                  {/* Placeholder for chart */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "300px",
                      bgcolor: "grey.100",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="text.secondary">
                      Bar chart showing tasks completed by team member
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Container>
      )}
    </>
  );
}
