import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, TextField } from "@mui/material";
import {
    Check,
    Close
} from '@mui/icons-material';
export const CommentDialog = ({ open, onClose, comment, onChange, onApprove, isLoading }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
            <Box component="form">
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        color="error"
                        disabled={isLoading}
                        onClick={() => onApprove('declined')}
                        title="Reject"
                    >
                        <Close />
                    </IconButton>
                    <IconButton
                        color="success"
                        disabled={isLoading}
                        onClick={() => onApprove('approved')}
                        title="Approve"
                    >
                        <Check />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <TextField
                    fullWidth
                    name="comment"
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={onChange}
                />
            </Box>
        </DialogContent>
    </Dialog>
);