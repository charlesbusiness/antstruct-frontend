import React from 'react';
import { Box, Container, Typography, styled, Button, useTheme } from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";

// Styled Components
const CtaContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#1e40af",
  background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
  borderRadius: "20px",
  padding: theme.spacing(6, 4),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(8),
  boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    textAlign: "center",
    padding: theme.spacing(4, 3),
    gap: theme.spacing(4),
  },
}));

const TextContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  color: "white",
  [theme.breakpoints.down("md")]: {
    textAlign: "center",
  },
}));

const IllustrationContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    width: "100%",
  },
}));

const CtaButton = styled(Button)(({ theme }) => ({
  backgroundColor: "white",
  color: "#1e40af",
  padding: theme.spacing(1.5, 4),
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "1rem",
  textTransform: "none",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#f8fafc",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
}));

export default function Featured() {
  const theme = useTheme(); // Add this line to get the theme object
  
  return (
    <Box sx={{ py: 8, px: 2 }}>
      <CtaContainer>
        <TextContainer>
          <Typography
            variant="h3"
            sx={{ 
              fontSize: "2.5rem", 
              fontWeight: "700", 
              mb: 2,
              [theme.breakpoints.down("md")]: { // Now theme is defined
                fontSize: "2rem",
              },
            }}
          >
            Ready to Transform Your Business?
          </Typography>
          <Typography
            variant="body1"
            sx={{ 
              fontSize: "1.1rem", 
              fontWeight: "400", 
              mb: 3,
              opacity: 0.9,
              [theme.breakpoints.down("md")]: { // Now theme is defined
                fontSize: "1rem",
              },
            }}
          >
            Join our waiting list and be among the first to experience how AntStruct can streamline your operations, boost productivity, and drive growth.
          </Typography>

          <CtaButton
            startIcon={<RocketLaunch />}
            size="large"
          >
            Join Waiting List
          </CtaButton>
        </TextContainer>

        <IllustrationContainer>
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
            alt="Business team collaboration"
            style={{ 
              maxWidth: "100%", 
              height: "auto", 
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              maxHeight: "300px"
            }}
          />
        </IllustrationContainer>
      </CtaContainer>
    </Box>
  );
}