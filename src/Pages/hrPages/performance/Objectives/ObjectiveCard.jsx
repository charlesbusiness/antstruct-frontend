import { useState } from "react";
import { formatDate } from "@src/utils/general";
import {
    Box,
    Typography,
    Divider,
    Chip,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    TableHead,
    Collapse,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Comment,
    CalendarToday,
} from '@mui/icons-material';
import { KeyResultRow } from "./KeyResultRow";
import { OBJECTIVESTATUS } from "@src/utils/consts";
import useSubmitData from "../../../../hooks/useSubmitData";
import useBusinessProfile from "../../../../hooks/useBusinessProfile";
import { ApiRoutes } from "../../../../utils/ApiRoutes";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


const StatusChip = ({ status }) => {
    const statusMap = {
        draft: { color: 'default', label: 'Draft' },
        active: { color: 'primary', label: 'Active' },
        reviewed: { color: 'info', label: 'Reviewed' },
        started: { color: 'info', label: 'Started' },
        completed: { color: 'success', label: 'Completed' },
        archived: { color: 'secondary', label: 'Archived' },
        'at risk': { color: 'error', label: 'At Risk' }
    };
    const { color, label } = statusMap[status.toLowerCase()] || statusMap.draft;
    return <Chip label={label} color={color} size="small" />;
}

export const ObjectiveCard = ({ objective, onOpenDetails, handleInputChange, status, handleStatusChange }) => {
    const queryClient = useQueryClient()
    const [expanded, setExpanded] = useState(false)
    const { businessInfo } = useBusinessProfile()
    const [editable, setEditable] = useState(false)
    const [adminEditable, setAdminEditable] = useState(false)
    const { submitData } = useSubmitData()
    const [currentValue, setCurrentValue] = useState(objective?.reviews?.self_score ?? 0)
    const keyResult = {
        id: objective.id,
        title: objective.description || objective.title,
        weight: objective.weight,
        currentValue,
        progress: 0
    }


    const submitManagerReview = () => {
    }

    const submitUserReview = async () => {

        let reviewId = ''
        if (currentValue == 0 || currentValue == '') {
            toast.error('Please score yourself a value', { autoClose: 4000 })
            return
        }
        if (objective?.reviews) {
            reviewId = objective.reviews?.id
        }
        const response = await submitData({
            endpoint: ApiRoutes.performanceManager.reviews.startReview,
            data: {
                performance_cycle_id: objective?.performance_cycle_id,
                performance_objective_id: objective.id,
                employee_id: objective?.employee_id,
                self_score: parseFloat(currentValue),
                ...(reviewId ? { review_id: reviewId } : '')
            },
            reload: false
        })

        if (response?.success) {
            queryClient.invalidateQueries(['objectiveData'])
        }
    }

    const percentage = objective?.reviews?.percentage_score || 0;


    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <Box sx={{ cursor: 'pointer', flexGrow: 1 }} onClick={() => setExpanded(!expanded)}>
                    <Typography variant="h6" fontWeight="bold">{objective.title}</Typography>
                </Box>

                <StatusChip status={objective.status} />

                {
                    (objective.status === OBJECTIVESTATUS.DRAFT
                        || objective.status === OBJECTIVESTATUS.REVIEW
                    )
                    && (
                        <Box sx={{ minWidth: 450, display: 'flex', justifyContent: 'space-between' }}
                            component={'form'} onSubmit={handleStatusChange}>
                            <Box sx={{ minWidth: 150 }}>
                                <TextField
                                    size="small"
                                    select
                                    fullWidth
                                    label="select status"
                                    required
                                    name="status"
                                    value={status.status}
                                    onChange={handleInputChange}
                                >
                                    {Object.entries(OBJECTIVESTATUS).map(([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {key.toLowerCase()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Box sx={{ minWidth: 150, mx: 2 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    label="add a comment"
                                    value={status.comment}
                                    name="comment"
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ minWidth: 100 }}>
                                <Button
                                    variant="contained"
                                    type="submit"
                                >Save</Button>
                            </Box>
                        </Box>
                    )}
            </Stack>


            {!expanded && (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Chip label={`Weight: ${objective.weight}%`} size="small" />
                    <Chip
                        label={`${percentage}% Complete`}
                        color={
                            percentage === 100
                                ? "success"
                                : percentage >= 50
                                    ? "primary"
                                    : percentage > 0
                                        ? "warning"
                                        : "default"
                        }
                        size="small"
                    />
                </Stack>
            )}

            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key Result Description</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Actual Value</TableCell>
                                    <TableCell>Objective Progress</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <KeyResultRow
                                    keyResult={keyResult}
                                    weight={objective.weight}
                                    metricType={objective.metric_type}
                                    startValue={objective.start_value}
                                    targetValue={objective.target_value}
                                    currentValue={currentValue}
                                    setCurrentValue={setCurrentValue}
                                    editable={editable}
                                    setEditable={setEditable}
                                    profile={businessInfo}
                                    setAdminEditable={setAdminEditable}
                                    adminEditable={adminEditable}
                                    submitManagerReview={submitManagerReview}
                                    submitUserReview={submitUserReview}
                                    reviews={objective?.reviews}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                            <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} /> Created: {formatDate(objective.created_at)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} /> Updated: {formatDate(objective.updated_at)}
                        </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                        <Chip label={`Weight: ${objective.weight}%`} size="small" />
                        <Button variant="outlined" size="small"
                            onClick={() => onOpenDetails(objective)}
                            startIcon={<Comment fontSize="small" />}>
                            Details
                        </Button>
                    </Stack>
                </Box>
            </Collapse>
        </Paper>
    )
}