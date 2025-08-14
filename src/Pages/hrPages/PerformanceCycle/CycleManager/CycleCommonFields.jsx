import { Grid, MenuItem, TextField } from "@mui/material"
import { LabelBox } from "./LabelBox"
import { CyclesYearFilter } from "@src/Components/CyclesYearFilter"
import React from "react";



export const CycleCommonFields = ({
    yearFilter,
    setYearFilter,
    cycleData,
    formData,
    handleInputChange
}) => {
    const filteredCycles = cycleData?.filter(
        (cycle) => cycle.year === yearFilter // Change to your actual year field
    ) || [];

    React.useEffect(() => {
        // If selected cycle no longer matches the year, clear it
        if (!filteredCycles.find(c => c.id === formData?.cycles)) {
            handleInputChange({ target: { name: "cycles", value: "" } });
        }
    }, [yearFilter, cycleData]);

    return (
        <>
            {/* Year Filter */}
            <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4} md={3} lg={3}>
                    <LabelBox>Cycles Years</LabelBox>
                </Grid>
                <Grid item xs={8} md={9} lg={8}>
                    <CyclesYearFilter yearFilter={yearFilter} setYearFilter={setYearFilter} />
                </Grid>
            </Grid>

            {/* Cycles */}
            <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4} md={3} lg={3}>
                    <LabelBox>Appraisal Cycles</LabelBox>
                </Grid>
                <Grid item xs={8} md={9} lg={8}>
                    <TextField
                        fullWidth
                        size="small"
                        value={formData?.cycles}
                        select
                        onChange={handleInputChange}
                        name="cycles"
                    >
                        <MenuItem value="">Select</MenuItem>
                        {filteredCycles.map((cycle) => (
                            <MenuItem key={cycle.id} value={cycle.id}>
                                {cycle.cycle_name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            {/* Active Cycle */}
            <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={4} md={3} lg={3}>
                    <LabelBox>
                        Active Cycle <span style={{ color: 'red' }}>*</span>
                    </LabelBox>
                </Grid>
                <Grid item xs={8} md={9} lg={8}>
                    <TextField
                        fullWidth
                        size="small"
                        value={

                            filteredCycles.find(c => c.id === formData?.cycles)?.cycle_name || ''

                        }
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>
        </>
    );
}