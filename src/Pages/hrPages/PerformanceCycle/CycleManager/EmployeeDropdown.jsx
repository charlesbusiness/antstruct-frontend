import React, { useState, useEffect } from 'react';
import {
    CircularProgress,
    Autocomplete,
    TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import useSubmitData from '@src/hooks/useSubmitData';
import { ApiRoutes } from '@src/utils/ApiRoutes';

const EmployeeDropdown = ({
    value,
    onChange,
    label = "Select Employee",
    filterByManagerId = null,
    managerData
}) => {
    const { submitData } = useSubmitData();
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['employees', filterByManagerId, debouncedSearch],
        queryFn: async () => {
            const result = await submitData({
                endpoint: ApiRoutes.employees.getEmployees,
                method: 'get'
            });

            return result;
        },
        keepPreviousData: true,
    })

    const employees = managerData ? managerData : data?.data || []
    const selectedEmployee = employees.find(emp => emp.id === value) || null

    return (
        <Autocomplete
            fullWidth
            size="medium"
            options={employees}
            getOptionLabel={(emp) => `${emp.firstname} ${emp.lastname}`}
            loading={isLoading}
            value={selectedEmployee}
            onChange={(e, newValue) => onChange(newValue?.id || '')}
            onInputChange={(e, newInputValue) => setSearchInput(newInputValue)}
            isOptionEqualToValue={(option, val) => option.id === val.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Search employee"
                    error={isError}
                    helperText={isError ? 'Failed to load employees' : ''}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default EmployeeDropdown;
