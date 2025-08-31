import { useState } from "react"
import {
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    MenuItem,
    Box,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { useQueryClient } from "@tanstack/react-query"
import useSubmitData from "../../../../hooks/useSubmitData"
import { ApiRoutes } from "../../../../utils/ApiRoutes"
import { CYCLESTATUS } from "../../../../utils/consts"
import { format } from "date-fns";
import { parseISO } from "date-fns";


export default function CreateCycleForm({ openModal, cycleData, yearOptions }) {
    const queryClient = useQueryClient()
    const { submitData, isLoading } = useSubmitData()

    const [cycle, setCycle] = useState({
        cycle_name: cycleData?.cycle_name || "",
        year: cycleData?.year || "",
        start_month: cycleData?.start_month ? parseISO(cycleData.start_month) : null,
        end_month: cycleData?.end_month ? parseISO(cycleData.end_month) : null,
        description: cycleData?.description || "",
        status: cycleData?.status || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCycle((prev) => ({ ...prev, [name]: value }));
    }

    const handleDateChange = (name) => (date) => {
        setCycle((prev) => ({ ...prev, [name]: date }));
    }


    const createCycle = async (e) => {
        e.preventDefault()
        const payload = {
            ...cycle,
            start_month: format(cycle.start_month, "yyyy-MM-dd"),
            end_month: format(cycle.end_month, "yyyy-MM-dd")
        };

        const response = await submitData({
            data: { ...payload, ...(cycleData ? { cycle_id: cycleData.id } : {}) },
            endpoint: ApiRoutes.performanceManager.cycle.create,
        });

        if (response?.success) {
            queryClient.invalidateQueries(['cyclesData'])
            openModal(false)
        }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={4} padding={4} maxWidth="md" margin="auto">
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={3} component={'form'} onSubmit={createCycle}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="cycle_name"
                                        required
                                        label="Cycle Name"
                                        placeholder="e.g. Q1 2025"
                                        value={cycle.cycle_name}
                                        onChange={handleInputChange}
                                    />
                                </Grid>
                                {
                                    cycleData &&
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            name="status"
                                            label="Cycle Status"
                                            placeholder="2025"
                                            value={cycle.status}
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

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        name="year"
                                        required
                                        label="Cycle Year"
                                        value={cycle.year}
                                        onChange={handleInputChange}
                                    >
                                        {yearOptions.map((year) => (
                                            <MenuItem key={year.value} value={year.value}>
                                                {year.label}
                                            </MenuItem>
                                        ))}

                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        fullWidth
                                        rows={4}
                                        multiline
                                        name="description"
                                        label="Cycle Description"
                                        placeholder="e.g. Q1 2025"
                                        value={cycle.description}
                                        onChange={handleInputChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Cycle Start Date"
                                        value={cycle.start_month}
                                        onChange={handleDateChange("start_month")}
                                        renderInput={(params) => <TextField fullWidth {...params}
                                            required
                                        />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Cycle End Date"
                                        value={cycle.end_month}
                                        onChange={handleDateChange("end_month")}
                                        renderInput={(params) => <TextField fullWidth {...params}
                                            required
                                        />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                                            Save Cycle
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </LocalizationProvider>
    )
}
