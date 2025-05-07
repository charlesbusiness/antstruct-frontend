import { TextField as MUITextField } from '@mui/material';

export const TextField = ({ type = 'text', name, formData, handleInputChange, required, label, errors, rows, margin = 'normal', lines }) => {
    return (
        <MUITextField
            id={name}
            type={type}
            margin={margin}
            name={name}
            placeholder={name}
            autoComplete={name}
            required={required}
            fullWidth
            row={rows}
            variant="outlined"
            error={!!errors[name]}
            helperText={errors[name]}
            color={errors[name] ? 'error' : 'primary'}
            value={formData[name]}
            onChange={handleInputChange}
            label={label}
        />)
}