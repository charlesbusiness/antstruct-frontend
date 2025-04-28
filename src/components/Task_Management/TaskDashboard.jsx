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
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Assignment as TaskIcon,
  CheckCircle as DoneIcon,
  PendingActions as PendingIcon,
  Build as InProgressIcon,
  LowPriority as LowPriorityIcon,
  PriorityHigh as HighPriorityIcon,
  TrendingUp as ModeratePriorityIcon,
  Star as NormalPriorityIcon,
  Person as UserIcon,
  CalendarToday as DueDateIcon
} from "@mui/icons-material";
import dummyTasks from "./DummyData";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const priorityCounts = {
  Low: 4,
  Normal: 12,
  Moderate: 8,
  High: 6
};


export default function TaskDashboard() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [tasks, setTasks] = React.useState(0);
  const { submitData } = useSubmitData()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const getTasks = async (query) => {
    const response = await submitData({
      endpoint: ApiRoutes.tasks.task(id),
      method: "get"
    });

    if (response?.success) {
      const { data } = response;
      setTask(data);
    }
  }

  React.useEffect(() => {
    getTasks()
  }, []);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High": return <HighPriorityIcon color="error" />;
      case "Moderate": return <ModeratePriorityIcon color="warning" />;
      case "Normal": return <NormalPriorityIcon color="info" />;
      case "Low": return <LowPriorityIcon color="success" />;
      default: return <NormalPriorityIcon />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <PendingIcon color="action" />;
      case "In Progress": return <InProgressIcon color="info" />;
      case "Done": return <DoneIcon color="success" />;
      default: return <TaskIcon />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Agile Task Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/admin/create/task')}
            sx={{ mt: 'auto' }}
          >
            Create Task
          </Button>

          <Chip label="Active Sprint: Sprint 12" color="primary" variant="outlined" />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="dashboard tabs">
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Tasks" {...a11yProps(1)} />
          <Tab label="Analytics" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* Task overview */}
      <TabPanel value={value} index={0}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries(dummyTasks).map(([status, tasks]) => (
            <Grid item xs={12} md={4} key={status}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(status)}
                  <Typography variant="subtitle1" sx={{ ml: 1, textTransform: 'capitalize' }}>
                    {status} ({tasks.length})
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                {tasks.map(task => (
                  <Box key={task.id} sx={{ mb: 2, p: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                    <Typography variant="body1" fontWeight="medium">
                      {task.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <UserIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        {task.assignee}
                      </Typography>
                      <DueDateIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {task.dueDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {getPriorityIcon(task.priority)}
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        {task.priority} Priority
                      </Typography>
                    </Box>
                    {task.progress > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={task.progress}
                          color={task.progress === 100 ? 'success' : 'primary'}
                        />
                        <Typography variant="caption" color="text.secondary">
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
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
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
          <Grid container spacing={1} sx={{ mb: 2, fontWeight: 'bold' }}>
            <Grid item xs={3}>Task</Grid>
            <Grid item xs={2}>Assignee</Grid>
            <Grid item xs={2}>Status</Grid>
            <Grid item xs={2}>Priority</Grid>
            <Grid item xs={2}>Due Date</Grid>
            <Grid item xs={1}>Action</Grid>
          </Grid>
          <Divider sx={{ mb: 2 }} />
          {Object.values(dummyTasks).flat().map(task => (
            <React.Fragment key={task.id}>
              <Grid container spacing={1} alignItems="center" sx={{ py: 1 }}>
                <Grid item xs={3}>
                  <Typography>{task.title}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Chip avatar={<Avatar><UserIcon fontSize="small" /></Avatar>} label={task.assignee} size="small" />
                </Grid>
                <Grid item xs={2}>
                  <Chip
                    icon={getStatusIcon(task.progress === 100 ? 'Done' : task.progress > 0 ? 'In Progress' : 'Pending')}
                    label={task.progress === 100 ? 'Done' : task.progress > 0 ? 'In Progress' : 'Pending'}
                    size="small"
                    color={task.progress === 100 ? 'success' : task.progress > 0 ? 'info' : 'default'}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Chip
                    icon={getPriorityIcon(task.priority)}
                    label={task.priority}
                    size="small"
                    color={
                      task.priority === 'High' ? 'error' :
                        task.priority === 'Moderate' ? 'warning' :
                          task.priority === 'Low' ? 'success' : 'info'
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2">{task.dueDate}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button variant="contained">view</Button>
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
            <Paper elevation={2} sx={{ p: 3, height: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Status Distribution
              </Typography>
              {/* Placeholder for chart */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                bgcolor: 'grey.100',
                borderRadius: 1
              }}>
                <Typography color="text.secondary">Pie chart showing task status distribution</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '300px' }}>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              {/* Placeholder for chart */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                bgcolor: 'grey.100',
                borderRadius: 1
              }}>
                <Typography color="text.secondary">Line chart showing completion rate over time</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Team Performance
              </Typography>
              {/* Placeholder for chart */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '300px',
                bgcolor: 'grey.100',
                borderRadius: 1
              }}>
                <Typography color="text.secondary">Bar chart showing tasks completed by team member</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
}