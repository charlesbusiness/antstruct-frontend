import { Box } from "@mui/material";

export const TabPanel = ({ children, value, index }) => {
    return (
      <section role="tabpanel" hidden={value !== index}>
        {value === index && (
          <Box sx={{ px: 2, mt: 2 }}>
            {children}
          </Box>
        )}
      </section>
    );
  };