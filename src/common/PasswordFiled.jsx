import React from "react";
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export const PasswordField = ({name, required=false, errors, formData, handleInputChange}) => {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePassword = () => setShowPassword(prev => !prev);

    return (
        <TextField
            name={name}
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id={name}
            autoComplete="current-password"
            autoFocus
            required={required}
            fullWidth
            variant="outlined"
            error={!!errors[name]}
            helperText={errors[name]}
            color={errors[name] ? 'error' : 'primary'}
            value={formData[name]}
            onChange={handleInputChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}
