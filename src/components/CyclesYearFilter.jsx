import { MenuItem, TextField } from "@mui/material"
import { getYearOptions } from "../utils/general";

export const CyclesYearFilter = ({ yearFilter, setYearFilter }) => {
  const yearOptions = getYearOptions();

  return (
    <TextField
      fullWidth
      label="Select Objective Year"
      variant="outlined"
      size="small"
      select
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
    >
      {yearOptions.map((year) => (
        <MenuItem key={year.value} value={year.value}>
          {year.label}
        </MenuItem>
      ))}
    </TextField>
  )
}