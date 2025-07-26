import React, { useState } from 'react';
import {
    Box,
    Button,
    MenuItem,
    TextField,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogContent,
    Card,
    CardHeader,
    CardContent,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import useSubmitData from '@src/hooks/useSubmitData';
import { LeaveType } from '@src/utils/consts';
import useBusinessProfile from '@src/hooks/useBusinessProfile';
import { ApiRoutes } from '../../../../utils/ApiRoutes';
import { resetFormData } from '../../../../utils/general';
import { confirmToast } from '../../../../components/confirmToast';
import { toast } from 'react-toastify';


export default function LeaveCategorySettingForm() {
    const queryClient = useQueryClient();

    const { submitData } = useSubmitData();
    const { leaveCategory: leaveCategories } = useBusinessProfile();
    const [errorMessage, setErrorMessage] = useState('')
    const [formData, setForm] = React.useState({
        name: '',
    });

    const [leaveCategory, setLeaveCategory] = React.useState(false)

    const createLeaveCategory = async (e) => {
        e.preventDefault();
        if (formData?.type == '') {
            setErrorMessage("choose a valid leave category to continue")
            return
        }
        const response = await submitData({
            data: formData,
            endpoint: ApiRoutes.hrManager.leave.category.create
        })

        if (response?.success) {
            setForm({ name: '' })
            setLeaveCategory(false)
            queryClient.invalidateQueries(['leaveCategory'])
        }
    }

    const handleChange = (e) => {
        setErrorMessage('')
        setForm({ ...formData, [e.target.name]: e.target.value });
    }

    const deleteCategory = async (id) => {
        const response = await submitData({
            data: formData,
            endpoint: ApiRoutes.hrManager.leave.category.delete(id),
            method: 'delete'
        })
        if (response?.success) {
            queryClient.invalidateQueries(['leaveCategory'])
            toast.success('Category deleted successfully');
        } else {
            toast.error('Failed to delete category');
        }
    }

    const handleDeleteCategory = (id) => {
        confirmToast({
            message: 'Are you sure you want to delete this category?',
            onConfirm: async () => await deleteCategory(id),
        });
    };

    return (
        <Box >
            <Grid container spacing={4} justifyContent="center">
                <Grid item xs={12} md={10}>
                    <Card elevation={3} sx={{ borderRadius: 3 }}>
                        <CardHeader
                            title="Leave Settings"
                            action={
                                <Button variant="outlined" color="primary" onClick={setLeaveCategory}>
                                    Add Leave Category
                                </Button>
                            }
                            sx={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}
                        />

                        <CardContent>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Leave Type</strong></TableCell>
                                            <TableCell><strong>Action</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaveCategories?.map((category) => (
                                            <TableRow key={category?.id}>
                                                <TableCell>{category.name?.toUpperCase()}</TableCell>

                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        color="warning"
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                    >Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={leaveCategory}
                onClose={() => setLeaveCategory(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: '40vw',
                        maxWidth: '40vw',
                        borderRadius: 3,
                        margin: 'auto',
                    },
                }}
            >
                <DialogContent sx={{ py: 3, px: 4 }}>
                    <Box component="form" onSubmit={createLeaveCategory} noValidate>
                        <Box display="flex" justifyContent="space-between" alignItems="center" my={2} >
                            <Button variant="outlined" color="primary" type="submit" onClick={setLeaveCategory}>
                                Save
                            </Button>
                        </Box>

                        <TextField
                            fullWidth
                            label="Leave Type"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            select
                            margin="normal"
                        >
                            {Object.entries(LeaveType).map(([key, value]) => (
                                <MenuItem key={key} value={value}>
                                    {key.toUpperCase().replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                        <span className={`${errorMessage ? 'text-red-500' : ''}`}>{errorMessage}</span>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
