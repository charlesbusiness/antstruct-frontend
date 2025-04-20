import * as React from "react";
import {
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import HighlightedCard from "./BusinessDashboardComponents/HighlightedCard";
import PageViewsBarChart from "./BusinessDashboardComponents/PageViewsBarChart";
import SessionsChart from "./BusinessDashboardComponents/SessionsChart";
import StatCard from "./BusinessDashboardComponents/StatCard";

export default function BusinessDashboard() {
  const { submitData, isLoading } = useSubmitData();
  const [businessUserprofile, setBusinessUserProfile] = React.useState(null);
  const mockData = [
    {
      title: "Employees",
      value: "1,200",
      interval: "Last 30 days",
      trend: "up",
      data: [
        200, 240, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360,
        340, 380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600,
        880, 920,
      ],
    },
    {
      title: "Departments",
      value: "15",
      interval: "Last 30 days",
      trend: "down",
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840,
        600, 820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400,
        360, 300, 220,
      ],
    },
    {
      title: "Resources",
      value: "15",
      interval: "Last 30 days",
      trend: "neutral",
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620,
        510, 530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430,
        520, 510,
      ],
    },
  ];

  const getBusinessUserProfile = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.businessProfile,
      method: "get",
    });

    if (!response?.error) {
      setBusinessUserProfile(response?.data);
    }
  };

  React.useEffect(() => {
    getBusinessUserProfile();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Welcome to the Admin Portal
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Manage your departments, roles, and business operations efficiently.
        </Typography>
      </Paper>

      {/* Overview Section */}
      <Box>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Overview
        </Typography>
        <Grid container spacing={3}>
          {mockData.map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <StatCard {...card} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <HighlightedCard businessUserprofile={businessUserprofile}/>
          </Grid>
        </Grid>
      </Box>

      {/* Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <SessionsChart />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <PageViewsBarChart />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
