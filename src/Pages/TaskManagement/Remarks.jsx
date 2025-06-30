import { Box, Typography, Divider } from "@mui/material";
import React from "react";

export const Remark = ({ remarks }) => {
  return (
    <Box component="div">
      {remarks?.length > 0
        ? remarks.map((remark, idx) => (
            <React.Fragment key={remark?.id}>
              <Box sx={{ width: "100%", mb: 1, p: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  {remark.remarks}
                </Typography>
              </Box>
              {idx < remarks.length - 1 && <Divider />}
            </React.Fragment>
          ))
        : null}
      {/* </TabPanel> */}
    </Box>
  );
};
