import { Grid, Paper, Typography, Avatar, Box } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Engineering as EngineeringIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { dummyEmployees, departments } from "../HrPages/Payroll/data";
const StatsOverview = () => {
  const totalEmployees = dummyEmployees.length;
const today = new Date();
const activeEmployees = dummyEmployees.filter(e => {
  const onLeave = e.leaveRequests?.some(req => {
    const start = new Date(req.startDate);
    const end = new Date(req.endDate);
    return req.status === "Approved" && start <= today && end >= today;
  });
  return !onLeave;
}).length;

const leaveEmployees = dummyEmployees.length - activeEmployees;
  const depts = departments.length;
  // Percentages
const activePercent = ((activeEmployees / totalEmployees) * 100).toFixed(0) + "%";
const leavePercent = ((leaveEmployees / totalEmployees) * 100).toFixed(0) + "%";

const newHires = 2; 

const stats = [
  {
    name: "Total Employees",
    value: totalEmployees,
    change: `+${newHires} new`,
    icon: <PeopleIcon fontSize="large" />,
    color: "primary",
  },
  {
    name: "Active Employees",
    value: activeEmployees,
    change: activePercent, 
    icon: <CheckCircleIcon fontSize="large" />,
    color: "success",
  },
  {
    name: "Employees on Leave",
    value: leaveEmployees,
    change: leavePercent,
    icon: <EngineeringIcon fontSize="large" />,
    color: "warning",
  },
  {
    name: "Departments",
    value: depts,
    change: "",
    icon: <WorkIcon fontSize="large" />,
    color: "info",
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
                borderLeftColor: `${stat.color}.main`,
              }}
            >
              <Box display="flex" justifyContent="space-between">
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}.light`,
                    color: `${stat.color}.dark`,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography color={`${stat.color}.main`} fontWeight="bold">
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
    </Paper>
  );
};

export default StatsOverview;
