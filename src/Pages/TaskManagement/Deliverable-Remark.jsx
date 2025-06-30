import { Box, Button, Grid } from "@mui/material"
import { TextArea } from "../../common/TextArea"
import React from "react"
import useSubmitData from "../../hooks/useSubmitData"
import { ApiRoutes } from "../../utils/ApiRoutes"
import { useQueryClient } from '@tanstack/react-query';


export const DeliverableRemark = ({ taskId, deliverableId, closeModal, type }) => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = React.useState({
        remark: ''
    })
    const [errors, setErrors] = React.useState({});

    const { isLoading, submitData } = useSubmitData()
    const handleChange = (e) => {
        setFormData({ remark: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await submitData({
            data: { remarks: formData.remark, task_id: taskId, deliverable_id: deliverableId, type: type ?? 'deliverable' },
            endpoint: ApiRoutes.remarks.create
        })
        if (response?.success) {
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            closeModal()
        }
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    <TextArea
                        name="remark"
                        label="Remark"
                        value={formData.remark}
                        handleInputChange={handleChange}
                        required
                        formData={formData ?? {}}
                        errors={errors ?? {}}
                    />

                    <Button type="submit" variant="contained" fullWidth>
                        {'Remark'}
                    </Button>
                </Grid>


            </Grid>
        </Box>
    )
}