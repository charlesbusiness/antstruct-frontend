import { Box, Button, Modal, Typography } from "@mui/material";

export const RequisitionDetailModal = ({ open, onClose, requisition }) => {
    if (!requisition) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
                    bgcolor: "background.paper",
                    p: 4,
                    mx: "auto",
                    mt: "10%",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Requisition Details
                </Typography>
                <pre>{JSON.stringify(requisition, null, 2)}</pre>
                <Box textAlign="right" mt={2}>
                    <Button onClick={onClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}