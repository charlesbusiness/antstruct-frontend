// src/views/dashboard/KPIDashboard.jsx

import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button
} from '@mui/material';


const kpiData = [
    { name: 'Sales Growth', value: '15%' },
    { name: 'Customer Retention', value: '89%' },
    { name: 'Employee Satisfaction', value: '76%' },
    { name: 'Net Profit Margin', value: '12%' },
];

const kpiTableData = [
    { kpi: 'Sales Growth', target: '10%', actual: '15%', status: 'Achieved' },
    { kpi: 'Customer Retention', target: '85%', actual: '89%', status: 'Achieved' },
    { kpi: 'Employee Satisfaction', target: '80%', actual: '76%', status: 'Pending' },
    { kpi: 'Net Profit Margin', target: '15%', actual: '12%', status: 'Pending' },
];

function EmployeeKpiDashboard() {
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Typography variant="h5" gutterBottom>
                KPI Overview (Coming soon........)
            </Typography>

            <Grid container spacing={2}>
                {kpiData.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="subtitle1">{item.name}</Typography>
                                <Typography variant="h5">{item.value}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>KPI</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Actual</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {kpiTableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.kpi}</TableCell>
                                    <TableCell>{row.target}</TableCell>
                                    <TableCell>{row.actual}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color={row.status === 'Achieved' ? 'success' : 'warning'}
                                        >
                                            {row.status}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default EmployeeKpiDashboard;
