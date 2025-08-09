import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Card, CardContent } from '@mui/material';

import 'react-circular-progressbar/dist/styles.css';
import { TabPanel } from '../../../Components/TabPanel';
import CycleManager from './CycleManager';
import CreateObjectiveFlow from './CreateObjectiveFlow';
import useGeneralData from '../../../hooks/useGeneralData';
import { isAdmin } from '../../../utils/general';


export const AppraisalTabs = () => {
    const [value, setValue] = useState(0)
    const { profile } = useGeneralData()
    const adminRole = isAdmin(profile)
    const handleChange = (event, newValue) => setValue(newValue)
    return (
        <>
            <Card sx={{ mt: 2 }}>

                <CardContent>
                    <Tabs value={value} onChange={handleChange} aria-label="Leave Tabs">
                        <Tab label="Objective Manager" />
                        {
                            adminRole &&
                            <Tab label="Cycle manager" />
                        }
                    </Tabs>
                    {
                        adminRole &&
                        <TabPanel value={value} index={1}>
                            <CycleManager />
                        </TabPanel>
                    }
                    <TabPanel value={value} index={0}>
                        <CreateObjectiveFlow user={profile} />
                    </TabPanel>


                </CardContent>
            </Card>
        </>
    );
};

export default AppraisalTabs;
