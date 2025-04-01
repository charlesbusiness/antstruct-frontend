import { Autocomplete, TextField } from "@mui/material"



export const MultipleSelectWithFilter = ({ inputs = [], formData, setFormData, errors, fieldName, required = false, comparedResult, dbField }) => {

    return (
        <Autocomplete
            multiple
            options={inputs?.filter(
                (data) => !comparedResult?.some((result) => result.id === data.id)
            ) || []} // Filter out assigned roles
            getOptionLabel={(option) => option[dbField]} // Display role names
            value={inputs?.filter((data) => formData[fieldName]?.includes(data.id)) || []} // Ensure value is an array
            onChange={(event, newValue) =>
                setFormData((prevData) => ({
                    ...prevData,
                    [fieldName]: newValue.map((data) => data.id),
                }))
            }
            renderInput={(params) => (
                <TextField {...params}
                    name={fieldName}
                    label="Select"
                    variant="outlined"
                    required={required}
                    error={!!errors[fieldName]}
                    helperText={errors[fieldName]}
                    color={errors[fieldName] ? 'error' : 'primary'}
                />
            )}
        />
    )
}