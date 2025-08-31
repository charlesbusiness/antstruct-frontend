import React from 'react';
import { Box, Container, Typography, styled } from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from "@mui/icons-material";

// Styled Components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8fafc",
  borderTop: "1px solid #e2e8f0",
  padding: theme.spacing(6, 0, 4, 0),
}));

const CustomContainer = styled(Container)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    textAlign: "center",
    gap: theme.spacing(4),
  },
}));

const FooterLink = styled("span")(({ theme }) => ({
  fontSize: "1rem",
  color: "#64748b",
  fontWeight: "400",
  cursor: "pointer",
  display: "block",
  marginBottom: theme.spacing(1),
  transition: "color 0.2s ease",
  "&:hover": {
    color: "#3b82f6",
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#e2e8f0",
  color: "#64748b",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#3b82f6",
    color: "white",
    transform: "translateY(-2px)",
  },
}));

const Copyright = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderTop: "1px solid #e2e8f0",
  color: "#94a3b8",
  fontSize: "0.9rem",
}));

export default function Footer() {
  return (
    <FooterContainer>
      <Container>
        <CustomContainer>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: "600",
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Product
            </Typography>

            <FooterLink>Features</FooterLink>
            <FooterLink>Solutions</FooterLink>
            <FooterLink>Pricing</FooterLink>
            <FooterLink>Demo</FooterLink>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: "600",
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Resources
            </Typography>

            <FooterLink>Blog</FooterLink>
            <FooterLink>User Guides</FooterLink>
            <FooterLink>Webinars</FooterLink>
            <FooterLink>Help Center</FooterLink>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: "600",
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Company
            </Typography>

            <FooterLink>About Us</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Press</FooterLink>
            <FooterLink>Contact</FooterLink>
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#1e293b",
                fontWeight: "600",
                mb: 2,
                fontSize: "1.25rem",
              }}
            >
              Connect With Us
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontWeight: "400",
                mb: 2,
                lineHeight: 1.5,
              }}
            >
              Follow us on social media to stay updated with the latest news and features.
            </Typography>

            <IconBox>
              <SocialIcon>
                <Facebook fontSize="small" />
              </SocialIcon>
              <SocialIcon>
                <Twitter fontSize="small" />
              </SocialIcon>
              <SocialIcon>
                <LinkedIn fontSize="small" />
              </SocialIcon>
              <SocialIcon>
                <Instagram fontSize="small" />
              </SocialIcon>
            </IconBox>
          </Box>
        </CustomContainer>

        <Copyright>
          <Typography variant="body2">
            Copyright © {new Date().getFullYear()} AntStruct. All Rights Reserved.
          </Typography>
        </Copyright>
      </Container>
    </FooterContainer>
  );
}