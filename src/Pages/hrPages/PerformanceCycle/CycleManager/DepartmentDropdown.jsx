import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';


const DepartmentDropdown = ({ value, onChange, label = "Select Department", data, isError, isLoading }) => {

    if (isLoading) return <CircularProgress size={24} />;
    if (isError) return <div>Error loading departments</div>

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                label={label}
            >
                {data?.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                        {dept?.department_name?.toUpperCase()}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default DepartmentDropdown;
