import {
    Assignment as TaskIcon,
    CheckCircle as DoneIcon,
    PendingActions as PendingIcon,
    Build as InProgressIcon,
    LowPriority as LowPriorityIcon,
    PriorityHigh as HighPriorityIcon,
    TrendingUp as ModeratePriorityIcon,
    Star as NormalPriorityIcon,
} from "@mui/icons-material";
import { Box } from "@mui/material";

export const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
        case "high": return (<HighPriorityIcon color="error" />);
        case "moderate": return <ModeratePriorityIcon color="warning" />;
        case "normal": return <NormalPriorityIcon color="info" />;
        case "low": return <LowPriorityIcon color="success" />;
        default: return <NormalPriorityIcon />;
    }
}

export const getStatusIcon = (status) => {
    switch (status) {
        case "Pending": return <PendingIcon color="action" />;
        case "In Progress": return <InProgressIcon color="info" />;
        case "Done": return <DoneIcon color="success" />;
        default: return <TaskIcon />;
    }
}

export function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

