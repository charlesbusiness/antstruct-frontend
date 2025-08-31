import { Box } from "@mui/material"

export const LabelBox = ({ children }) => {
    return (<Box
        sx={{
            backgroundColor: '#f5f5f5',
            px: 2,
            py: 1,
            borderRadius: 1,
            minWidth: '120px',
            textAlign: 'right',
            fontWeight: 'bold'
        }}
    >
        {children}
    </Box>
    )
}