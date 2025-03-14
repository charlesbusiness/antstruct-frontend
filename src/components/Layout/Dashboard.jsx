import * as React from "react";
import { Outlet } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./sub_components/AppNavbar";
import Header from "./sub_components/Header";
import SideMenu from "./sub_components/SideMenu";

export default function Dashboard(props) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu />
      <AppNavbar />
      {/* Main content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
            <Outlet />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
