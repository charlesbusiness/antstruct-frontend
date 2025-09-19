import { useState } from "react";
import { Link } from "react-router-dom";
// * Components
import CustomButton from "./CustomButton";
import logo from '../../../assets/logo.png'
// * MUI Components
import {
  Box,
  Container,
  Typography,
  styled,
} from "@mui/material";

// * Styled Components
const NavbarContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
}));

const NavbarLink = styled(Link)(({ theme }) => ({
  color: "#4F5361",
  fontWeight: "bold",
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    color: "#fff",
  },
}));

export default function Navbar() {

  return (
    <NavbarContainer>
      <Box>
        <img src={logo} alt="AntStruct Logo" style={{ height: '56px', verticalAlign: 'middle' }} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", columnGap: 2 }}>
        <NavbarLink to="/login">Sign In</NavbarLink>
        <CustomButton
          backgroundColor="#0F1B4C"
          color="#fff"
          buttonText="Register"
          to="/register"
        ></CustomButton>
      </Box>
    </NavbarContainer>
  );
}
