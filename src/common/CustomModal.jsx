import { Modal, Box, Typography } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 300, sm: 400 },
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
    textAlign: 'center',
};

export default function CustomModal({ open, onClose, title, description, children }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="custom-modal-title"
            aria-describedby="custom-modal-description"
        >
            <Box sx={modalStyle}>
                {title && (
                    <Typography id="custom-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                )}

                {description && (
                    <Typography id="custom-modal-description" sx={{ mt: 1 }}>
                        {description}
                    </Typography>
                )}

                {children}
            </Box>
        </Modal>
    );
}
