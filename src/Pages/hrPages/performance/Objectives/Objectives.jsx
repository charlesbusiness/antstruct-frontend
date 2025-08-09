import React from 'react';
import {
    Box,
    Typography,
    Divider,
    Chip,
    Button,
    Paper,
    Stack,
    LinearProgress
} from '@mui/material';
import {
    CheckCircle,
    Warning,
    Error,
    Comment,
    CalendarToday
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import useSubmitData from '../../../hooks/useSubmitData';
import { getObjectives } from '../../../hooks';

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
};

const StatusChip = ({ status }) => {
    const statusMap = {
        draft: { color: 'default', label: 'Draft' },
        active: { color: 'primary', label: 'Active' },
        completed: { color: 'success', label: 'Completed' },
        archived: { color: 'secondary', label: 'Archived' }
    }

    const { color, label } = statusMap[status.toLowerCase()] || statusMap.draft;

    return <Chip label={label} color={color} size="small" />;
};

const ObjectiveCard = ({ objective }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                    {objective.title}
                </Typography>
                <StatusChip status={objective.status} />
            </Stack>

            {objective.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {objective.description}
                </Typography>
            )}

            <MetricDisplay objective={objective} />

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
};

const PerformanceDashboard = () => {
    const { submitData } = useSubmitData()
    const { data: queryResult, error, isLoading } = useQuery({
        queryKey: ['objectiveDataDashboard'],
        queryFn: async () => await getObjectives(submitData),
        keepPreviousData: true,
    })
    const objectives = queryResult?.data || []
    return (
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                Performance Objectives
            </Typography>

            {objectives?.map((objective) => (
                <ObjectiveCard
                    key={objective._id.$oid}
                    objective={{
                        ...objective,
                        _id: objective._id.$oid,
                        cycleId: objective.cycleId.$oid,
                        employee: objective.employee.$oid,
                        createdAt: objective.createdAt.$date,
                        updatedAt: objective.updatedAt.$date
                    }}
                />
            ))}
        </Box>
    );
}

export default PerformanceDashboard;