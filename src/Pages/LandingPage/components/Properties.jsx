import React from 'react';
import { Box, Container, Typography, styled, Grid, useTheme, useMediaQuery } from "@mui/material";
import {
  Groups as HRIcon,
  TrendingUp as SalesIcon,
  AccountBalance as FinanceIcon,
  Assignment as ProjectIcon,
  SupportAgent as ServiceIcon,
  Inventory as InventoryIcon
} from "@mui/icons-material";

// Styled Components
const FeaturesBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: "#f8fafc",
  backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
  backgroundSize: "20px 20px",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  color: "#1a202c",
  textAlign: "center",
  marginBottom: theme.spacing(2),
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "60px",
    height: "4px",
    backgroundColor: "#3b82f6",
    borderRadius: "2px",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "2rem",
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 400,
  color: "#64748b",
  textAlign: "center",
  maxWidth: "800px",
  lineHeight: 1.6,
  margin: "0 auto",
  marginBottom: theme.spacing(6),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  height: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  backgroundColor: "#eff6ff",
  color: "#3b82f6",
  marginBottom: theme.spacing(3),
  fontSize: "2.5rem",
}));

const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 600,
  color: "#1e293b",
  textAlign: "center",
  marginBottom: theme.spacing(2),
}));

const FeatureDescription = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: "#64748b",
  textAlign: "center",
  lineHeight: 1.5,
}));

// Feature data
const features = [
  {
    title: "HR Management",
    icon: <HRIcon fontSize="large" />,
    description: "Streamline recruitment, onboarding, and employee management processes."
  },
  {
    title: "Sales & Marketing",
    icon: <SalesIcon fontSize="large" />,
    description: "Manage sales pipelines, run campaigns, and track marketing performance."
  },
  {
    title: "Finance & Accounting",
    icon: <FinanceIcon fontSize="large" />,
    description: "Track expenses, manage invoices, and generate financial reports with ease."
  },
  {
    title: "Project Management",
    icon: <ProjectIcon fontSize="large" />,
    description: "Plan, execute, and monitor projects with collaborative tools and timelines."
  },
  {
    title: "Customer Service",
    icon: <ServiceIcon fontSize="large" />,
    description: "Deliver exceptional customer experiences with integrated support tools."
  },
  {
    title: "Inventory Management",
    icon: <InventoryIcon fontSize="large" />,
    description: "Track stock levels, manage orders, and optimize inventory across locations."
  }
];

export default function Properties() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FeaturesBox>
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Title variant="h2">
            Key Features
          </Title>
          <Subtitle variant="body1">
            AntStruct is an all-encompassing, efficient management tool that cuts across the key life-cycle of your business, 
            geared towards productivity and sustainability.
          </Subtitle>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <FeatureTitle variant="h3">
                  {feature.title}
                </FeatureTitle>
                <FeatureDescription variant="body2">
                  {feature.description}
                </FeatureDescription>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </FeaturesBox>
  );
}