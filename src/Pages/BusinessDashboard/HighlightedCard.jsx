import * as React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function HighlightedCard({ businessUserprofile }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <InsightsRoundedIcon />
          <Typography
            component="h2"
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "600" }}
          >
            Quick Links
          </Typography>
          <Typography sx={{ color: "text.secondary", mb: "8px" }}>
            Ensure to enter the right Business Credentials.
          </Typography>
          {businessUserprofile == null && (
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{ mb: "4px" }}
              startIcon={<AddHomeWorkRoundedIcon />}
              endIcon={<ChevronRightRoundedIcon />}
              fullWidth={isSmallScreen}
              onClick={() => navigate("/create-business")}
            >
              Create Business
            </Button>
          )}
          {
            businessUserprofile &&
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              endIcon={<ChevronRightRoundedIcon />}
              fullWidth={isSmallScreen}
              onClick={() => navigate("/make/requisition")}
            >
              Requisitions
            </Button>
          }
        </CardContent>

      </Card>
    </>
  );
}
