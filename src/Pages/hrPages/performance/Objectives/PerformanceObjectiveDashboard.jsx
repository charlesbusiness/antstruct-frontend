// PerformanceDashboard.jsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Tab,
    Tabs,
    Typography
} from '@mui/material';

import { TabPanel } from '../../../Components/TabPanel';
import ActivePerformanceObjective from './ActivePerformanceObjective';
import DraftPerformanceObjective from './DraftPerformanceObjective';
import { useQuery } from '@tanstack/react-query';
import { getObjectives } from '../../../hooks';
import useSubmitData from '../../../hooks/useSubmitData';
import { useParams } from 'react-router';
import { OBJECTIVESTATUS } from '../../../utils/consts';


const PerformanceDashboard = () => {
    const { id } = useParams()
    const { submitData } = useSubmitData()
    const { data: queryResult } = useQuery({
        queryKey: ['objectiveData'],
        queryFn: async () => await getObjectives(submitData, id),
        keepPreviousData: true
    })

    const objectives = queryResult?.data || []

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => setValue(newValue);
    const activeObjectives = objectives.filter(obj => obj.status === 'active');
    const draftObjectives = objectives.filter(obj => {
        if (obj.status == OBJECTIVESTATUS.DRAFT ||
            obj.status == OBJECTIVESTATUS.REVIEW
        ) {
            return obj
        }
    })



    return (
        <>
            <Card sx={{ mt: 2 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Performance Objectives
                </Typography>

                <CardContent>
                    <Tabs value={value} onChange={handleChange} aria-label="Objectives">
                        <Tab label="Active Objectives" />
                        <Tab label="Drafts Objectives" />
                    </Tabs>

                    <TabPanel value={value} index={0}>
                        <ActivePerformanceObjective
                            objectives={activeObjectives}
                        />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <DraftPerformanceObjective
                            objectives={draftObjectives}
                        />
                    </TabPanel>


                </CardContent>
            </Card>

        </>
    )
}

export default PerformanceDashboard;
