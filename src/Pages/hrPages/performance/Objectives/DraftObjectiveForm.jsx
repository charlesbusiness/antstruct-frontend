import { Box, Button, MenuItem, TextField } from "@mui/material";
import { OBJECTIVESTATUS } from "../../../../utils/consts";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ApiRoutes } from "../../../../utils/ApiRoutes";
import useSubmitData from "../../../../hooks/useSubmitData";

export const DraftObjectiveForm = ({ objective }) => {
    const queryClient = useQueryClient()
    const { submitData } = useSubmitData()
    const [status, setStatus] = useState({
        status: objective.status,
        comment: ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStatus((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const handleStatusChange = async (e) => {
        e.preventDefault()
        const response = await submitData({
            endpoint: ApiRoutes.performanceManager.objectives.changeStatus(objective.id),
            data: { ...status },
            method: 'patch',
            reload: false
        })
        if (response?.success) {
            queryClient.invalidateQueries(['objectiveData'])
        }
    }

    return (
        <Box sx={{ minWidth: 450, display: 'flex', justifyContent: 'space-between' }}
            component={'form'} onSubmit={handleStatusChange}>
            <Box sx={{ minWidth: 150 }}>
                <TextField
                    size="small"
                    select
                    fullWidth
                    label="select status"
                    required
                    name="status"
                    value={status.status}
                    onChange={handleInputChange}
                >
                    {Object.entries(OBJECTIVESTATUS).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                            {key.toLowerCase()}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box sx={{ minWidth: 150, mx: 2 }}>
                <TextField
                    size="small"
                    fullWidth
                    label="add a comment"
                    value={status.comment}
                    name="comment"
                    onChange={handleInputChange}
                />
            </Box>

            <Box sx={{ minWidth: 100 }}>
                <Button
                    variant="contained"
                    type="submit"
                >Save Changes</Button>
            </Box>
        </Box>
    )
}

export default DraftObjectiveForm;

