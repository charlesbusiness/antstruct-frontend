import { TextField } from '@mui/material';

export const TextArea = ({ type = 'text', name, formData, handleInputChange, required, label, errors, margin = 'normal' }) => {
    return (
        <TextField
            id={name}
            type={type}
            margin={margin}
            name={name}
            placeholder={name}
            autoComplete={name}
            required={required}
            fullWidth
            rows={4}
            multiline
            variant="outlined"
            error={!!errors[name]}
            helperText={errors[name]}
            color={errors[name] ? 'error' : 'primary'}
            value={formData[name]}
            onChange={handleInputChange}
            label={label}
        />)
}