import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Container,
    Box,
    Grid,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'; // circle with minus
import { useQueryClient } from '@tanstack/react-query';
import { ApiRoutes } from '../../utils/ApiRoutes';

export default function DeliverableDialog({ open, onClose, submitData }) {
    const [deliverables, setDeliverables] = useState([
        { deliverable: '', submitted: false }
    ]);
    const queryClient = useQueryClient()
    // Handle input change
    const handleChange = (index, e) => {
        const newDeliverables = [...deliverables];
        newDeliverables[index].deliverable = e.target.value;
        setDeliverables(newDeliverables);
    };

    // Add a new input
    const handleAddMore = () => {
        setDeliverables([...deliverables, { deliverable: '', submitted: false }]);
    };

    // Remove an input (except the first one)
    const handleRemove = (index) => {
        const newDeliverables = [...deliverables];
        newDeliverables.splice(index, 1);
        setDeliverables(newDeliverables);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const deliverableArray = deliverables
            .map(d => d.deliverable.trim())
            .filter(Boolean); // removes empty strings

        const response = await submitData({
            data: { deliverables: deliverableArray },
            endpoint: ApiRoutes.hrManager.deliverables.create,
        });

        if (response?.success) {
            queryClient.invalidateQueries(['dailyDeliverable']);
            onClose();
        }

    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" component={'form'} onSubmit={handleSubmit}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IconButton onClick={handleAddMore} size="small" color="primary">
                    <AddIcon />
                </IconButton>
                <Button type='submit'>Send</Button>
            </DialogTitle>

            <DialogContent>
                <Container>
                    <Box sx={{ mt: 2 }}>
                        {deliverables.map((deliverable, index) => (
                            <Grid
                                key={index}
                                container
                                spacing={2}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        name="deliverable"
                                        label={`Deliverable ${index + 1}`}
                                        value={deliverable.deliverable}
                                        onChange={(e) => handleChange(index, e)}
                                        disabled={deliverable.submitted}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                    {index > 0 && (
                                        <IconButton
                                            onClick={() => handleRemove(index)}
                                            color="error"
                                            size="small"
                                            sx={{ py: 1 }}
                                        >
                                            <RemoveCircleIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                </Container>
            </DialogContent>
        </Dialog>
    )
}
