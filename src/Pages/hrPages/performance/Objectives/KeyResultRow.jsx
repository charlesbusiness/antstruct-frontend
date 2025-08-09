import {
    Button,
    TableCell,
    TableRow,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
} from '@mui/material';
import {
    Edit,
    Check
} from '@mui/icons-material';
import { MetricMeaseurement } from "../../../utils/consts";

export const KeyResultRow = ({
    keyResult,
    metricType,
    startValue,
    targetValue,
    currentValue,
    setCurrentValue,
    editable,
    setEditable,
    weight
}) => {
    const handleValueChange = (e) => setCurrentValue(e.target.value);
    const handleSelectChange = (e) => setCurrentValue(e.target.value === 'yes' ? 100 : 0);

    const computeProgress = () => {
        const safeRange = (start, end) => {
            const range = end - start;
            return range !== 0 ? Math.min(100, Math.max(0, ((currentValue - start) / range) * 100)) : 0;
        };

        switch (metricType.toLowerCase()) {
            case 'number':
            case 'currency':
            case 'percentage':
                return safeRange(startValue, targetValue)

            case 'rating scale':
                return safeRange(0, weight)

            case 'yes/no':
                return currentValue

            default:
                return 0
        }
    };

    const renderActualValueInput = () => {
        const rangeOptions = () => {

            const items = [];
            let start = Math.min(startValue, targetValue)
            let end = Math.max(startValue, targetValue)
            if (metricType == MetricMeaseurement.RATINGSCALE) {
                start = 1
                end = weight
            }
            for (let i = start; i <= end; i++) {
                items.push(
                    <MenuItem key={i} value={i}>
                        {i}
                    </MenuItem>
                );
            }
            return items
        }

        switch (metricType.toLowerCase()) {
            case 'percentage':
            case 'currency':
                return (
                    <TextField
                        value={currentValue}
                        onChange={handleValueChange}
                        disabled={!editable}
                        size="small"
                        type="number"
                        InputProps={{ endAdornment: <InputAdornment position="end">{metricType.toLowerCase() === 'currency' ? '₦' : '%'}</InputAdornment> }}
                        sx={{ width: '120px' }}
                    />
                );

            case 'rating scale':
            case 'number':
                return (
                    <Select
                        value={currentValue}
                        onChange={handleValueChange}
                        disabled={!editable}
                        size="small"
                        sx={{ width: '120px' }}
                    >
                        {rangeOptions()}
                    </Select>
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
                );
        }
    };


    const progress = computeProgress();
    return (
        <TableRow>
            <TableCell sx={{ maxWidth: 300 }}>{keyResult.title}</TableCell>
            <TableCell>{keyResult.weight}%</TableCell>
            <TableCell>Actual Value</TableCell>
            <TableCell>{renderActualValueInput()}</TableCell>
            <TableCell>{Math.round(progress)}%</TableCell>
            <TableCell>
                <Button
                    variant='outlined'
                    color={editable ? 'success' : 'success'}
                    onClick={() => setEditable(!editable)}
                    size="small"
                >
                    {editable ? <Check fontSize="medium" /> : <Edit fontSize="medium" />}
                </Button>
            </TableCell>
        </TableRow>
    );
}
