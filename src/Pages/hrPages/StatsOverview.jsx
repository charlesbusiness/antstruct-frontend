import {
  Grid,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Engineering as EngineeringIcon,
  Work as WorkIcon
} from '@mui/icons-material';

const StatsOverview = ({ employees }) => {
  // Calculate some stats from employee data
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const leaveEmployees = employees.filter(e => e.status === 'Leave').length;
  const depts = employees.length;

  const stats = [
    { 
      name: 'Total Employees', 
      value: totalEmployees, 
      change: '+2 new', 
      icon: <PeopleIcon fontSize="large" />,
      color: 'primary'
    },
    { 
      name: 'Active Employees', 
      value: activeEmployees, 
      change: '50%', 
      icon: <CheckCircleIcon fontSize="large" />,
      color: 'success'
    },
    { 
      name: 'Employees on Leave', 
      value: leaveEmployees, 
      change: '50%', 
      icon: <EngineeringIcon fontSize="large" />,
      color: 'warning'
    },
    { 
      name: 'Departments', 
      value: depts,
      change: ' ', 
      icon: <WorkIcon fontSize="large" />,
      color: 'info'
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Overview
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3,
                borderLeft: `4px solid`,
                borderLeftColor: `${stat.color}.main`
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.dark` }}>
                  {stat.icon}
                </Avatar>
                <Typography 
                  color={`${stat.color}.main`} 
                  fontWeight="bold"
                >
                  {stat.change}
                </Typography>
              </Box>
              <Typography variant="h5" mt={1} fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Recent Activity */}
      <Typography variant="h6" component="h3" mt={4} mb={2}>
        Recent Activity
      </Typography>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.light' }}>👤</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="New hire onboarding"
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Jane Smith completed onboarding for new marketing specialist
                </Typography>
                <br />
                {"2 hours ago"}
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'success.light' }}>💰</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Payroll processed"
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  June payroll completed for 42 employees
                </Typography>
                <br />
                {"1 day ago"}
              </>
            }
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default StatsOverview;