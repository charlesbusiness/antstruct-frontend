import React, { useState } from 'react';
import {
    Box,
    Typography,
    Divider,
    Chip,
    Button,
    Paper,
    Stack,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Select,
    TableHead
} from '@mui/material';
import {
    CheckCircle,
    Error,
    Comment,
    CalendarToday,
    Lock,
    LockOpen
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import useSubmitData from '../../../hooks/useSubmitData';
import { getObjectives } from '../../../hooks';

const KeyResultRow = ({ 
    keyResult, 
    metricType, 
    startValue, 
    targetValue,
    currentValue,
    setCurrentValue,
    editable,
    setEditable
}) => {
    const handleValueChange = (e) => {
        setCurrentValue(e.target.value);
    };

    const handleSelectChange = (e) => {
        setCurrentValue(e.target.value === 'yes' ? 100 : 0);
    }

    const computeProgress = () => {
        switch (metricType.toLowerCase()) {
            case 'number':
            case 'currency':
                const range = targetValue - startValue;
                return range !== 0 ? Math.min(100, Math.max(0, ((currentValue - startValue) / range) * 100)) : 0;
            case 'percentage':
            case 'rating scale':
                return Math.min(100, Math.max(0, currentValue));
            case 'yes/no':
                return currentValue;
            default:
                return 0;
        }
    }

    const progress = computeProgress();

    const renderActualValueInput = () => {
        switch (metricType.toLowerCase()) {
            // case 'currency':
            //     return (
            //         <TextField
            //             value={currentValue}
            //             onChange={handleValueChange}
            //             disabled={!editable}
            //             size="small"
            //             type="number"
            //             InputProps={{
            //                 startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
            //             }}
            //             sx={{ width: '120px' }}
            //         />
            //     );
            case 'percentage':
            case 'rating scale':
            case 'currency':
                return (
                    <TextField
                        value={currentValue}
                        onChange={handleValueChange}
                        disabled={!editable}
                        size="small"
                        type="number"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        sx={{ width: '120px' }}
                    />
                );
            case 'number':
                return (
                    <TextField
                        value={currentValue}
                        onChange={handleValueChange}
                        disabled={!editable}
                        size="small"
                        type="number"
                        sx={{ width: '120px' }}
                    />
                );
            case 'yes/no':
                return (
                    <Select
                        value={currentValue === 100 ? 'yes' : 'no'}
                        onChange={handleSelectChange}
                        disabled={!editable}
                        size="small"
                        sx={{ width: '120px' }}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </Select>
                );
            default:
                return (
                    <TextField
                        value={currentValue}
                        onChange={handleValueChange}
                        disabled={!editable}
                        size="small"
                        sx={{ width: '120px' }}
                    />
                )
        }
    }

    const getRatingLabel = () => {
        switch (metricType.toLowerCase()) {
            case 'currency': return 'Amount';
            case 'number': return 'Count';
            case 'percentage': return 'Percentage';
            case 'rating scale': return 'Rating Score %';
            case 'yes/no': return 'Achieved?';
            default: return 'Value';
        }
    }

    return (
        <TableRow>
            <TableCell sx={{ maxWidth: 300 }}>{keyResult.title}</TableCell>
            <TableCell>{keyResult.weight}%</TableCell>
            <TableCell>
                <Typography variant="body2" color="text.secondary">
                    {getRatingLabel()}
                </Typography>
            </TableCell>
            <TableCell>
                {renderActualValueInput()}
            </TableCell>
            <TableCell>{Math.round(progress)}%</TableCell>
            <TableCell>
                <IconButton onClick={() => setEditable(!editable)} size="small">
                    {editable ? <LockOpen fontSize="small" /> : <Lock fontSize="small" />}
                </IconButton>
            </TableCell>
        </TableRow>
    )
}

const StatusChip = ({ status }) => {
    const statusMap = {
        draft: { color: 'default', label: 'Draft' },
        active: { color: 'primary', label: 'Active' },
        completed: { color: 'success', label: 'Completed' },
        archived: { color: 'secondary', label: 'Archived' },
        'at risk': { color: 'warning', label: 'At Risk' }
    }

    const { color, label } = statusMap[status.toLowerCase()] || statusMap.draft;

    return <Chip label={label} color={color} size="small" />;
}

const MetricDisplay = ({ objective }) => {
    const { metricType, startValue, targetValue, currency, yesNoTarget } = objective;

    switch (metricType.toLowerCase()) {
        case 'currency':
            return (
                <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            <Typography variant="subtitle2">Start Value</Typography>
                            <Typography variant="body1">
                                {currency} {startValue}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Target Value</Typography>
                            <Typography variant="body1">
                                {currency} {targetValue}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            );

        case 'number':
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Progress</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body1">
                            {startValue} → {targetValue}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(startValue / targetValue) * 100}
                            sx={{ width: '100px', height: '8px' }}
                        />
                    </Stack>
                </Box>
            );

        case 'percentage':
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Completion</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body1">
                            {startValue}% → {targetValue}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={startValue}
                            sx={{ width: '100px', height: '8px' }}
                        />
                    </Stack>
                </Box>
            );

        case 'yes/no':
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Target</Typography>
                    <Chip
                        label={yesNoTarget === 'yes' ? 'YES' : 'NO'}
                        color={yesNoTarget === 'yes' ? 'success' : 'error'}
                        icon={yesNoTarget === 'yes' ? <CheckCircle /> : <Error />}
                        sx={{ textTransform: 'uppercase' }}
                    />
                </Box>
            );

        case 'rating scale':
            return (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Rating Scale</Typography>
                    <Typography variant="body1">
                        {startValue || 'N/A'} out of {targetValue || 'N/A'}
                    </Typography>
                </Box>
            );

        default:
            return (
                <Typography variant="body2" color="text.secondary">
                    No metric data available
                </Typography>
            );
    }
}

const ObjectiveCard = ({ objective }) => {
    const [expanded, setExpanded] = useState(false);
    const [editable, setEditable] = useState(false);
    const [currentValue, setCurrentValue] = useState(0);
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Create a key result from the objective properties
    const keyResult = {
        id: objective._id,
        title: objective.description || objective.title,
        weight: objective.weight,
        currentValue,
        progress: 0
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="flex-start"
                sx={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {objective.title}
                </Typography>
                <StatusChip status={objective.status} />
            </Stack>

            {objective.description && !expanded && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {objective.description}
                </Typography>
            )}

            {!expanded && <MetricDisplay objective={objective} />}

            {expanded && (
                <Box sx={{ mt: 2, mb: 2 }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Key Result</TableCell>
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
                                    metricType={objective.metricType}
                                    currency={objective.currency}
                                    yesNoTarget={objective.yesNoTarget}
                                    startValue={objective.startValue}
                                    targetValue={objective.targetValue}
                                    currentValue={currentValue}
                                    setCurrentValue={setCurrentValue}
                                    editable={editable}
                                    setEditable={setEditable}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        Created: {formatDate(objective.createdAt)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary">
                        <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        Updated: {formatDate(objective.updatedAt)}
                    </Typography>
                </Box>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Chip label={`Weight: ${objective.weight}%`} size="small" />
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Comment fontSize="small" />}
                >
                    Details
                </Button>
            </Stack>
        </Paper>
    );
}

const PerformanceDashboard222 = () => {
    const { submitData } = useSubmitData()
    const { data: queryResult, error, isLoading } = useQuery({
        queryKey: ['objectiveData'],
        queryFn: async () => await getObjectives(submitData),
        keepPreviousData: true
    })
    
    const objectives = queryResult?.data || [];

    return (
        <Box sx={{  mx: 'auto', p: 2 }} maxWidth={true}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                Performance Objectives
            </Typography>

            {objectives.map((objective) => (
                <ObjectiveCard
                    key={objective._id}
                    objective={{
                        ...objective,
                        _id: objective._id,
                        cycleId: objective.cycleId,
                        employee: objective.employee,
                        createdAt: objective.createdAt,
                        updatedAt: objective.updatedAt
                    }}
                />
            ))}
        </Box>
    );
}

export default PerformanceDashboard;