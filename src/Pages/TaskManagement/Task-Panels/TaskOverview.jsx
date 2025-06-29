import {
    Grid,
    Typography,
    Box,
    Paper,
    LinearProgress,
    Badge,
    Divider
} from "@mui/material"

export const TaskOverview = ({ dummyTasks }) => {

    return (
        <TabPanel value={value} index={0}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Task Status Overview
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(dummyTasks).map(([status, tasks]) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {getStatusIcon(status)}
                                <Typography variant="subtitle1" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                    {status} ({tasks.length})
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            {tasks.map(task => (
                                <Box key={task.id} sx={{ mb: 2, p: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                                    <Typography variant="body1" fontWeight="medium">
                                        {task.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <UserIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                                            {task.assignee}
                                        </Typography>
                                        <DueDateIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {task.dueDate}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        {getPriorityIcon(task.priority)}
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            {task.priority} Priority
                                        </Typography>
                                    </Box>
                                    {task.progress > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={task.progress}
                                                color={task.progress === 100 ? 'success' : 'primary'}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {task.progress}% complete
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Task Priorities
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {Object.entries(priorityCounts).map(([priority, count]) => (
                    <Grid item xs={6} sm={3} key={priority}>
                        <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                {getPriorityIcon(priority)}
                            </Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                {priority}
                            </Typography>
                            <Badge badgeContent={count} color="primary" />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </TabPanel>
    )
}