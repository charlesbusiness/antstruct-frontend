import { Box, Grid, Paper, Typography } from "@mui/material"
import React from "react"


export const Remark = ({ remarks }) => {
    return (
        <Box component="div" sx={{ mt: 2, p: 1, borderRadius: 2 }}>
            {/* <TabPanel value={value} index={0}> */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {remarks?.map((remark) => (
                    <Grid item xs={12} md={4} key={remark?.id}>
                        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>

                            <Typography variant="body1" fontWeight="medium">
                                {remark.remarks}
                            </Typography>

                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/* </TabPanel> */}
        </Box>
    )
}