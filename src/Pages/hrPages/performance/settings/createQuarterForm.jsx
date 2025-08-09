import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    Divider,
    Box,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Typography,
    useTheme,
    MenuItem
} from "@mui/material"
import {
    Add as AddIcon,
    Update,

} from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import useSubmitData from "../../../hooks/useSubmitData"
import { ApiRoutes } from "../../../utils/ApiRoutes"
import { formatDate, resetFormData } from "../../../utils/general"
import { useQueryClient } from "@tanstack/react-query"
import { CYCLESTATUS } from "../../../utils/consts";

export default function CreateQuarterForm({ openModal, cycleData }) {
    const queryClient = useQueryClient()
    const theme = useTheme();

    const { submitData, isLoading } = useSubmitData()
    const [selectedQuarter, setSelectedQuarter] = useState(null);

    const [quarter, setQuarter] = useState({
        name: "",
        startDate: null,
        endDate: null,
        status:''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuarter((prev) => ({ ...prev, [name]: value }));
    }

    const handleDateChange = (name) => (date) => {
        setQuarter((prev) => ({ ...prev, [name]: date }));
    }

    const createQuarter = async (e) => {
        e.preventDefault()
        if(!cycleData){delete quarter.status}
        const response = await submitData({
            endpoint: ApiRoutes.performance.createQuarter,
            data: { ...quarter, cycleId: cycleData?._id },
            reload: false
        })

        if (response?.success) {
            resetFormData(quarter)
            openModal()
            queryClient.invalidateQueries(['cyclesData'])
        }
    }


    useEffect(() => {
        if (selectedQuarter) {
            setQuarter({
                name: selectedQuarter.name || '',
                status: selectedQuarter.status || '',
                quarterId: selectedQuarter._id || '',
                startDate: selectedQuarter.startDate ? new Date(selectedQuarter.startDate) : null,
                endDate: selectedQuarter.endDate ? new Date(selectedQuarter.endDate) : null,
            });
        }
    }, [selectedQuarter]);

    return (
        <>
            {cycleData && (
                <Card sx={{ my: 3 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                                <Typography>{cycleData.name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                                <Typography sx={{
                                    display: 'inline-block',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    backgroundColor:
                                        cycleData.status === 'completed'
                                            ? 'success.light'
                                            : cycleData.status === 'active'
                                                ? 'primary.light'
                                                : 'warning.light',
                                    color:
                                        cycleData.status === 'completed'
                                            ? 'success.dark'
                                            : cycleData.status === 'active'
                                                ? 'primary.dark'
                                                : 'warning.dark',
                                }}>
                                    {cycleData.status}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                <Typography>{new Date(cycleData.startDate).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                <Typography>{new Date(cycleData.endDate).toLocaleDateString()}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                <Typography>{cycleData.description || 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* I want the cycle details here */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={4} mb={4} >
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={3} component={'form'} onSubmit={createQuarter}>

                                <Grid item xs={12}>
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                                                {selectedQuarter ? 'Update Quarter' : 'Save Quarter'}
                                            </Button>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            required
                                            label="Quarter Name"
                                            placeholder="e.g. Q1 2025"
                                            value={quarter.name}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <DatePicker
                                            label="Quarter Start Date"
                                            value={quarter.startDate}
                                            onChange={handleDateChange("startDate")}
                                            renderInput={(params) => <TextField fullWidth {...params}
                                                required
                                            />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <DatePicker
                                            label="Quarter End Date"
                                            value={quarter.endDate}
                                            onChange={handleDateChange("endDate")}
                                            renderInput={(params) => <TextField fullWidth {...params}
                                                required
                                            />}
                                        />
                                    </Grid>

                                    {
                                        selectedQuarter &&
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="status"
                                                label="Cycle Status"
                                                placeholder="2025"
                                                value={quarter.status}
                                                onChange={handleInputChange}
                                                select
                                                required
                                            >
                                                {
                                                    Object.keys(CYCLESTATUS).map((key) =>
                                                        <MenuItem key={CYCLESTATUS[key]} value={CYCLESTATUS[key]}>{CYCLESTATUS[key]}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                    }
                                 
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </LocalizationProvider>

            <Divider />
            <Grid item xs={12}>
                <Card>
                    <CardContent>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Quarter Name</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cycleData?.quarters?.map((quarter) => (
                                        <TableRow key={quarter.id}>
                                            <TableCell>{quarter.name}</TableCell>
                                            <TableCell>{formatDate(quarter.startDate)}</TableCell>
                                            <TableCell>{formatDate(quarter.endDate)}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor:
                                                            quarter.status === 'completed'
                                                                ? theme.palette.success.light
                                                                : quarter.status === 'active'
                                                                    ? theme.palette.primary.light
                                                                    : theme.palette.warning.light,
                                                        color:
                                                            quarter.status === 'completed'
                                                                ? theme.palette.success.dark
                                                                : quarter.status === 'active'
                                                                    ? theme.palette.primary.dark
                                                                    : theme.palette.warning.dark,
                                                    }}
                                                >
                                                    {quarter.status}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Button size="small"
                                                    onClick={() => setSelectedQuarter(quarter)}><Update /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
        </>
    )
}
