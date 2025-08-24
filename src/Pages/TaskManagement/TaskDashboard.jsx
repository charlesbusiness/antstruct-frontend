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
  Card,
  CardContent,
  IconButton,
  alpha,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  Person as UserIcon,
  CalendarToday as DueDateIcon,
  TrendingUp,
  Dashboard,
  Analytics,
  Visibility,
  Add,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { formatDate } from "../../utils/general";
import {
  TabPanel,
  a11yProps,
  getPriorityIcon,
  getStatusIcon,
} from "../../common/tasks-utils";

export default function TaskDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
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

  const StatusCard = ({ status, tasks, color }) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette[color].main,
          0.1
        )} 0%, ${alpha(theme.palette[color].light, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          {getStatusIcon(status)}
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              textTransform: "capitalize",
              fontWeight: 600,
              color: theme.palette[color].main,
            }}
          >
            {status}
          </Typography>
          <Badge
            badgeContent={tasks.length}
            color={color}
            sx={{ ml: "auto" }}
          />
        </Box>
        <Divider
          sx={{ mb: 2, borderColor: alpha(theme.palette[color].main, 0.3) }}
        />
        {tasks.slice(0, 5).map((task) => (
          <Box
            key={task.id}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "action.hover",
                borderColor: alpha(theme.palette[color].main, 0.3),
              },
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              {task.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <UserIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {task.assignees[0]?.assignee?.firstname || "Unassigned"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DueDateIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(task.expected_date_of_delivery)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              {getPriorityIcon(task.priority)}
              <Typography variant="caption" color="text.secondary">
                {task.priority} Priority
              </Typography>
            </Box>
            {task.progress > 0 && (
              <Box sx={{ mt: 1.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={task.progress}
                  color={task.progress === 100 ? "success" : color}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: alpha(theme.palette[color].main, 0.2),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight="medium"
                    color={theme.palette[color].main}
                  >
                    {task.progress}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        ))}
        {tasks.length > 5 && (
          <Button
            size="small"
            color={color}
            sx={{ mt: 1, fontWeight: 500 }}
            onClick={() => setValue(1)}
          >
            View all {tasks.length} tasks
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body2" color="text.secondary">
            Loading tasks...
          </Typography>
        </Box>
      ) : (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              mb: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 3,
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  Task Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage and track your team's tasks efficiently
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Chip
                  icon={<Dashboard />}
                  label={`Active Sprint: ${
                    tasks?.[0]?.sprint?.sprint_name || "None"
                  }`}
                  color="primary"
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                  }}
                />
                <IconButton
                  onClick={getTasks}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <Refresh />
                </IconButton>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {tasks?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                  <Typography
                    variant="h4"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {done?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                  <Typography
                    variant="h4"
                    color="warning.main"
                    fontWeight="bold"
                  >
                    {inProgress?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {pending?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs Navigation */}
          <Paper elevation={0} sx={{ mb: 4, borderRadius: 3 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="dashboard tabs"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  minHeight: 60,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <Tab
                icon={<Dashboard />}
                iconPosition="start"
                label="Overview"
                {...a11yProps(0)}
              />
              <Tab
                icon={<FilterList />}
                iconPosition="start"
                label="Tasks"
                {...a11yProps(1)}
              />
            </Tabs>
          </Paper>

          {/* Task Overview Tab */}
          <TabPanel value={value} index={0}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <StatusCard
                  status="pending"
                  tasks={pending || []}
                  color="error"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatusCard
                  status="inProgress"
                  tasks={inProgress || []}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StatusCard status="done" tasks={done || []} color="success" />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Task List Tab */}
          <TabPanel value={value} index={1}>
            {!tasks || tasks?.length === 0 ? (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No tasks found
                </Typography>
              </Box>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Task
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Assignee
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Priority
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Due Date
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", fontSize: "0.875rem" }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasks?.map((task) => (
                        <TableRow
                          key={task.id}
                          sx={{
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {task.title}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={task.assignees[0]?.assignee?.id || ""}
                                sx={{
                                  borderRadius: 2,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                }}
                              >
                                {task.assignees.map((user) => (
                                  <MenuItem
                                    key={user.assignee.id}
                                    value={user.assignee.id}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 28,
                                          height: 28,
                                          mr: 1,
                                          bgcolor: "primary.main",
                                        }}
                                      >
                                        <UserIcon fontSize="small" />
                                      </Avatar>
                                      {user.assignee.firstname}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <Chip
                              icon={getStatusIcon(task.status)}
                              label={task.status}
                              size="small"
                              color={
                                task.status === "approved"
                                  ? "success"
                                  : task.status === "in-progress"
                                  ? "warning"
                                  : "default"
                              }
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>

                          <TableCell>
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
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(task.expected_date_of_delivery)}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => navigate(`/task/${task.id}`)}
                              sx={{ borderRadius: 2, textTransform: "none" }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </TabPanel>
        </Container>
      )}
    </>
  );
}
