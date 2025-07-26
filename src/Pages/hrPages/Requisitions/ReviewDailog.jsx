import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, MenuItem, TextField } from "@mui/material";
import { REQUISITION_TYPES } from "@src/utils/general";


export const ReviewDialog = ({ open, onClose, data, onChange, onSubmit, isLoading, requisitionType }) => {
    let placeholder
    let label
    let type = 'number'
    if (requisitionType == REQUISITION_TYPES.MONEY) {
        placeholder = 'enter your new budget here'
        label = 'New Budget'
    } else if (requisitionType == REQUISITION_TYPES.EQUIPMENT) {
        placeholder = 'enter new quantities here'
        label = 'New Quantities'
    } else if (requisitionType == REQUISITION_TYPES.HR) {
        placeholder = 'enter new job role here'
        label = 'New job role'
        type = 'text'
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Review Requisition</DialogTitle>
            <DialogContent sx={{ minWidth: 400 }}>
                <Box component="form" onSubmit={onSubmit}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="contained" type="submit" disabled={isLoading}>
                            Review
                        </Button>
                    </Box>
                    <TextField
                        fullWidth
                        name="review"
                        label="review comment"
                        placeholder="Enter your review comment here"
                        value={data.review}
                        onChange={onChange}
                        required
                    />
                    <Divider sx={{ my: 2 }} />
                    <TextField
                        fullWidth
                        type={type}
                        label={label}
                        name="reviewed"
                        placeholder={placeholder}
                        value={data.reviewed}
                        onChange={onChange}
                        required
                    />
                    {
                        requisitionType == REQUISITION_TYPES.HR &&
                        <>
                            <Divider sx={{ my: 2 }} />
                            <TextField
                                fullWidth
                                label={label}
                                name="contract_type"
                                value={data.contract_type}
                                onChange={onChange}
                                required
                                select
                            >
                                {
                                    ['contract', 'full-time', 'part-time'].map(contr => (
                                        <MenuItem key={contr} value={contr}>{contr}</MenuItem>
                                    ))
                                }
                            </TextField>
                        </>
                    }

                </Box>
            </DialogContent>
        </Dialog>
    )
}