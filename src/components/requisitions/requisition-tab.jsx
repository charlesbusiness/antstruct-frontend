import {
    Box,
    Tab,
    Tabs,
    Paper,
} from '@mui/material';
import { useState } from 'react';
import { REQUISITION_TYPES } from '../../utils/general';
import { RequisitionTable } from './requisition-table';

const TABS = [
    { label: 'Financials', type: REQUISITION_TYPES.MONEY },
    { label: 'Equipment', type: REQUISITION_TYPES.EQUIPMENT },
    { label: 'Human Resources', type: REQUISITION_TYPES.HR },
];

export const RequisitionTabs = ({ requisitions, onApprove, onCancel, onDelete }) => {
    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (_, newValue) => {
        setCurrentTab(newValue);
    };
    const filteredRequisitions = requisitions?.filter(
        (req) => req.type === TABS[currentTab].type
    );

    return (
        <Box>
            <Paper elevation={3} sx={{ mb: 2 }}>
                <Tabs value={currentTab} onChange={handleTabChange} centered>
                    {TABS.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Paper>

            <RequisitionTable
                requisitions={filteredRequisitions}
                onApprove={onApprove}
                onCancel={onCancel}
                onDelete={onDelete}
            />
        </Box>
    )
}
