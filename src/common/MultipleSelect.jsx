import { Autocomplete, TextField } from "@mui/material"

export const MultipleSelectFiled = ({ inputs = [], formData, setFormData, errors, fieldName, required = false , dbField}) => {
   return ( <Autocomplete
        multiple
        options={inputs || []} // Ensure roles is an array
        getOptionLabel={(option) => option[dbField]} // Display role names
        value={inputs?.filter((resource) => formData[fieldName]?.includes(resource.id)) || []} // Ensure value is an array
        onChange={(event, newValue) =>
            setFormData((prevData) => ({
                ...prevData,
                [fieldName]: newValue.map((data) => data.id),
            }))
        }
        renderInput={(params) => (
            <TextField {...params} required={required} name={fieldName} label="Select" variant="outlined"
                error={!!errors[fieldName]}
                helperText={errors[fieldName]}
                color={errors[fieldName] ? 'error' : 'primary'}
            />
        )}
    />
   )
}