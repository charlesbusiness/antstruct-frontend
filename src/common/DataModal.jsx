import { Modal, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: '100%', md: '90%', lg: '90%' },
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle = {
  p: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const contentStyle = {
  p: 3,
  overflowY: 'auto',
  flexGrow: 1,
};

const footerStyle = {
  p: 2,
  display: 'flex',
  justifyContent: 'flex-end',
  borderTop: '1px solid',
  borderColor: 'divider',
};

export default function DataModal({
  open,
  onClose,
  title,
  description,
  children,
  footerActions,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={headerStyle}>
          <Typography id="custom-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Description */}
        {description && (
          <Box sx={{ p: 3, pb: 0 }}>
            <Typography id="custom-modal-description" variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        )}

        {/* Content */}
        <Box sx={contentStyle}>
          {children}
        </Box>

        {/* Footer */}
        {footerActions && (
          <Box sx={footerStyle}>
            {footerActions}
          </Box>
        )}
      </Box>
    </Modal>
  );
}