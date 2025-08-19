import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import { formatDateOnly } from '@src/utils/general';

export const ObjectiveDetails = ({ modalOpen, handleCloseDetails, selectedObjective }) => {
    return (
        <Dialog open={modalOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
            <DialogTitle>Objective Details</DialogTitle>
            <DialogContent dividers>
                {selectedObjective ? (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {selectedObjective.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {selectedObjective.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2"><strong>Weight:</strong> {selectedObjective.weight}%</Typography>
                        <Typography variant="body2"><strong>Status:</strong> {selectedObjective.status}</Typography>
                        <Typography variant="body2"><strong>Metric Type:</strong> {selectedObjective.metric_type}</Typography>
                        <Typography variant="body2"><strong>Start Value:</strong> {selectedObjective.start_value ?? 0}</Typography>
                        <Typography variant="body2"><strong>Target Value:</strong> {selectedObjective.target_value > 0 ? selectedObjective.target_value : selectedObjective.weight}</Typography>
                        <Typography variant="body2"><strong>Created At:</strong> {formatDateOnly(selectedObjective.created_at)}</Typography>
                        <Typography variant="body2"><strong>Updated At:</strong> {formatDateOnly(selectedObjective.updated_at)}</Typography>
                    </>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDetails} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    )
}