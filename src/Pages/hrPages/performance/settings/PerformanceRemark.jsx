import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { ApiRoutes } from "../../../utils/ApiRoutes";
import useSubmitData from "../../../hooks/useSubmitData";
import { useQueryClient } from "@tanstack/react-query";
import { resetFormData } from "../../../utils/general";

export default function PerformanceRemarkManager({ remarks }) {
    const [remarkData, setRemarkData] = useState({
        start: '',
        end: '',
        remark: '',
    });

    const { submitData } = useSubmitData()
    const queryClient = useQueryClient()

    const [selectedRemark, setSelectedRemark] = useState();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRemarkData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formatedData = {
            start: parseFloat(remarkData.start),
            end: parseFloat(remarkData.end),
            ...(selectedRemark ? { remarkId: selectedRemark._id } : '')
        }
        const response = await submitData({
            endpoint: ApiRoutes.performance.remarks.create,
            data: { ...formatedData, remark: remarkData.remark },
            reload: false
        })

        if (response?.success) {
            resetFormData(remarkData)
            queryClient.invalidateQueries(['remarkData'])
        }
    }

    const handleDelete = (selected) => {
    }

    useEffect(() => {
        if (selectedRemark) {
            setRemarkData({
                start: selectedRemark.start || '',
                end: selectedRemark.end || '',
                remark: selectedRemark.remark || '',
                remarkId: selectedRemark._id || '',
            })
        }
    }, [selectedRemark])

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Performance Remark Setup
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Form */}
                <Grid container spacing={2} component={'form'} onSubmit={handleSubmit}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="start"
                            label="start Value"
                            type="number"
                            fullWidth
                            required
                            value={remarkData.start}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="end"
                            label="To Value"
                            type="number"
                            fullWidth
                            required
                            value={remarkData.end}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="remark"
                            label="Remark"
                            fullWidth
                            required
                            value={remarkData.remark}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                            {selectedRemark ? 'Update Remark' : 'Save Remark'}
                        </Button>
                    </Grid>
                </Grid>

                {/* List */}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                    Defined Remarks
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Start</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Remark</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {remarks?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No remarks defined yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                remarks?.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{r.start}</TableCell>
                                        <TableCell>{r.end}</TableCell>
                                        <TableCell>{r.remark}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => setSelectedRemark(r)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(index)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}
