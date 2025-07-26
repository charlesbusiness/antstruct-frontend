import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

export default function ToastConfirmBox({
    message,
    onConfirm,
    closeToast,
    confirmText = 'Yes',
    cancelText = 'No',
}) {
    return (
        <Box sx={{ p: 1 }}>
            <Typography sx={{ mb: 1 }}>{message}</Typography>
            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={async () => {
                        await onConfirm();
                        closeToast();
                    }}
                >
                    {confirmText}
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={closeToast}
                >
                    {cancelText}
                </Button>
            </Stack>
        </Box>
    );
}
