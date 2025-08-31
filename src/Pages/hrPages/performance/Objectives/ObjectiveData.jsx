import React, { useState } from 'react';
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,
    TableBody,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button
} from '@mui/material';

import { Edit, Delete } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getObjectives } from '@src/hooks';
import useSubmitData from '@src/hooks/useSubmitData';
import { ApiRoutes } from '../../../../utils/ApiRoutes';

const ObjectiveData = () => {
    const queryClient = useQueryClient()
    const { submitData } = useSubmitData();
    const { data: queryResult } = useQuery({
        queryKey: ['objectiveData'],
        queryFn: async () => await getObjectives(submitData),
        keepPreviousData: true
    });

    const [openEdit, setOpenEdit] = useState(false);
    const [selectedObjective, setSelectedObjective] = useState(null);

    const handleEditOpen = (objective) => {
        setSelectedObjective(objective);
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
        setSelectedObjective(null);
    };

    const handleEditSubmit = async () => {
        if (!selectedObjective) return;

        const response = await submitData({
            endpoint: ApiRoutes.performanceManager.objectives.update(selectedObjective.id),
            data: {
                objective_id: selectedObjective.id,
                title: selectedObjective.title,
                description: selectedObjective.description,
                weight: selectedObjective.weight,
                target_value: selectedObjective.target_value
            },
            method: 'patch'
        })
        if (response.success) {
            setSelectedObjective(null)
            queryClient.invalidateQueries(['objectiveData'])
            setOpenEdit(false)
        }
    };

    return (
        <>
            <Box sx={{ mt: 2 }}>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Key Result Title</TableCell>
                                <TableCell>Key Result Description</TableCell>
                                <TableCell>Weight</TableCell>
                                <TableCell>Target Value</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {queryResult?.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data?.title}</TableCell>
                                    <TableCell>{data?.description}</TableCell>
                                    <TableCell>{data?.weight}</TableCell>
                                    <TableCell>{data?.target_value || 0}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditOpen(data)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => console.log('Delete', data.id)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* ✅ Edit Modal */}
            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Objective</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={selectedObjective?.title || ''}
                            onChange={(e) =>
                                setSelectedObjective({ ...selectedObjective, title: e.target.value })
                            }
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={selectedObjective?.description || ''}
                            onChange={(e) =>
                                setSelectedObjective({ ...selectedObjective, description: e.target.value })
                            }
                        />
                        <TextField
                            label="Weight"
                            type="number"
                            fullWidth
                            value={selectedObjective?.weight || ''}
                            onChange={(e) =>
                                setSelectedObjective({ ...selectedObjective, weight: parseFloat(e.target.value) })
                            }
                        />
                        <TextField
                            label="Target Value"
                            type="number"
                            fullWidth
                            value={selectedObjective?.target_value || ''}
                            onChange={(e) =>
                                setSelectedObjective({ ...selectedObjective, target_value: parseFloat(e.target.value) })
                            }
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ObjectiveData;
