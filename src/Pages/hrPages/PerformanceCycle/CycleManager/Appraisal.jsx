import React, { useState } from 'react';
import { Tabs, Tab, Card, CardContent, Box } from '@mui/material';

import 'react-circular-progressbar/dist/styles.css';
import { TabPanel } from '@src/Components/TabPanel';
import CycleManager from './CycleManager';
import CreateObjectiveFlow from './CreateObjectiveFlow';
import useBusinessProfile from '../../../../hooks/useBusinessProfile';
import { Link } from 'react-router-dom';


export const AppraisalTabs = () => {
    const [value, setValue] = useState(0)
    const { businessInfo } = useBusinessProfile()
    const handleChange = (event, newValue) => setValue(newValue)
    return (
        <>
            <Card sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                    <Link to={'/objectives'}>Performance Reviews</Link>
                    <Link to={'/objectives'}>Objective Data</Link>
                </Box>
                <CardContent>
                    <Tabs value={value} onChange={handleChange} aria-label="Leave Tabs">
                        <Tab label="Objective Manager" />

                        <Tab label="Cycle manager" />

                    </Tabs>

                    <TabPanel value={value} index={1}>
                        <CycleManager />
                    </TabPanel>

                    <TabPanel value={value} index={0}>
                        <CreateObjectiveFlow user={businessInfo} />
                    </TabPanel>

                </CardContent>
            </Card>
        </>
    );
};

export default AppraisalTabs;
