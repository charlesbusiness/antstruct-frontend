import * as React from "react";
import { Container, Typography, Paper, Grid, Box } from "@mui/material";
import HighlightedCard from "./BusinessDashboard/HighlightedCard";
import PageViewsBarChart from "./BusinessDashboard/PageViewsBarChart";
import SessionsChart from "./BusinessDashboard/SessionsChart";
import StatCard from "./BusinessDashboard/StatCard";
import useBusinessProfile from "../hooks/useBusinessProfile";

export default function BusinessDashboard() {
  const { employees, resources, businessUserProfile, departments } =
    useBusinessProfile();

  const data = [
    {
      title: "Employees",
      value: employees?.length || 0,
    },
    {
      title: "Departments",
      value: departments?.length || 0,
    },
    {
      title: "Resources",
      value: resources?.length || 0,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Overview
        </Typography>
        <Grid container spacing={3}>
          {data.map((card, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <StatCard {...card} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <HighlightedCard businessUserprofile={businessUserProfile} />
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
