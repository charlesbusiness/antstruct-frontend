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
import useSubmitData from "../../../hooks/useSubmitData"
import { ApiRoutes } from "../../../utils/ApiRoutes"
import { resetFormData } from "../../../utils/general"
import { useQueryClient } from "@tanstack/react-query"
import { CYCLESTATUS } from "../../../utils/consts"

export default function CreateCycleForm({ openModal, cycleData, yearOptions }) {
    const queryClient = useQueryClient()
    const { submitData, isLoading } = useSubmitData()
    const [cycle, setCycle] = useState({
        name: cycleData ? cycleData.name : "",
        cycleYear: cycleData ? cycleData.cycleYear : "",
        startDate: cycleData ? cycleData.startDate : null,
        endDate: cycleData ? cycleData.endDate : null,
        description: cycleData ? cycleData.description : '',
        status: cycleData ? cycleData.status : '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCycle((prev) => ({ ...prev, [name]: value }));
    }

    const handleDateChange = (name) => (date) => {
        setCycle((prev) => ({ ...prev, [name]: date }));
    }

    const createCycle = async (e) => {
        e.preventDefault()
        if (!cycleData) {
            delete cycle.status
        }
        const response = await submitData({
            endpoint: ApiRoutes.performance.createCycle,
            data: {
                ...cycle,
                ...(cycleData ? { cycleId: cycleData._id } : {})
            },
            reload: false
        })

        if (response?.success) {
            resetFormData(cycle)
            openModal()
            queryClient.invalidateQueries(['cyclesData'])
        }
    }

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
                                        name="name"
                                        required
                                        label="Cycle Name"
                                        placeholder="e.g. Q1 2025"
                                        value={cycle.name}
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
                                        name="cycleYear"
                                        required
                                        label="Cycle Year"
                                        value={cycle.cycleYear}
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
                                        value={cycle.startDate}
                                        onChange={handleDateChange("startDate")}
                                        renderInput={(params) => <TextField fullWidth {...params}
                                            required
                                        />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DatePicker
                                        label="Cycle End Date"
                                        value={cycle.endDate}
                                        onChange={handleDateChange("endDate")}
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
