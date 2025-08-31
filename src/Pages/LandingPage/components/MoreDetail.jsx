import React from 'react';
import { Box, Container, Typography, styled, Grid, useTheme, useMediaQuery } from "@mui/material";
import {
  TrendingUp as GrowthIcon,
  Group as UsersIcon,
  BarChart as StatsIcon,
} from "@mui/icons-material";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { Link } from 'react-router-dom';

// Styled Components
const CustomBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(6),
  alignItems: "center",
  marginBottom: theme.spacing(8),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column-reverse",
    textAlign: "center",
    gap: theme.spacing(4),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
}));

const Divider = styled("div")(({ theme }) => ({
  width: "80px",
  height: "4px",
  backgroundColor: "#3b82f6",
  borderRadius: "2px",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    margin: "0 auto",
    marginBottom: theme.spacing(3),
  },
}));

const StatsGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(6),
  padding: theme.spacing(4, 0),
  backgroundColor: "#f8fafc",
  borderRadius: "16px",
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
}));

const LargeText = styled(Typography)(({ theme }) => ({
  fontSize: "3.5rem",
  color: "#3b82f6",
  fontWeight: "800",
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  backgroundClip: "text",
  textFillColor: "transparent",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
}));

const SmallText = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  color: "#64748b",
  fontWeight: "500",
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    fontSize: "1rem",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "60px",
  height: "60px",
  borderRadius: "12px",
  backgroundColor: "#dbeafe",
  color: "#3b82f6",
  marginBottom: theme.spacing(2),
  fontSize: "1.8rem",
}));

export default function MoreDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container sx={{ py: 8 }}>
      <CustomBox>
        <ContentBox>
          <Divider />
          <Typography
            variant="h2"
            sx={{
              fontSize: "2.5rem",
              color: "#1e293b",
              fontWeight: "700",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Simplify Your Business Operations with AntStruct
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: "1.1rem",
              color: "#64748b",
              lineHeight: "1.7",
              mb: 4,
            }}
          >
            AntStruct is an all-encompassing, efficient management tool that cuts across 
            the key life-cycle of your business. Our platform is specifically designed 
            to drive productivity, enable seamless collaboration, and ensure long-term 
            sustainability for your organization.
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <RocketLaunchIcon sx={{ color: "#3b82f6", fontSize: "2rem" }} />
            <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: "600" }} >
              <Link to="https://www.antstruct.com" style={{ textDecoration: "none", color: "#3b82f6" }}>Join our waiting list to be among the first to experience AntStruct</Link>
            </Typography>
          </Box>
        </ContentBox>
        
        <ImageContainer>
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Business team collaborating"
            style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "400px" }}
          />
        </ImageContainer>
      </CustomBox>

      <StatsGrid container>
        <Grid item xs={12} sm={6} md={3}>
          <StatBox>
            <IconWrapper>
              <UsersIcon fontSize="large" />
            </IconWrapper>
            <LargeText>500+</LargeText>
            <SmallText>Businesses Waiting</SmallText>
          </StatBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatBox>
            <IconWrapper>
              <StatsIcon fontSize="large" />
            </IconWrapper>
            <LargeText>87%</LargeText>
            <SmallText>Projected Efficiency Gain</SmallText>
          </StatBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatBox>
            <IconWrapper>
              <GrowthIcon fontSize="large" />
            </IconWrapper>
            <LargeText>40%</LargeText>
            <SmallText>Faster Operations</SmallText>
          </StatBox>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatBox>
            <IconWrapper>
              <RocketLaunchIcon fontSize="large" />
            </IconWrapper>
            <LargeText>2025</LargeText>
            <SmallText>Launch Year</SmallText>
          </StatBox>
        </Grid>
      </StatsGrid>
    </Container>
  );
}