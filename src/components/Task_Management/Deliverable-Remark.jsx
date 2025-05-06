import { Box, Button, Grid } from "@mui/material"
import { TextArea } from "../../common/TextArea"
import React from "react"
import useSubmitData from "../../hooks/useSubmitData"
import { ApiRoutes } from "../../utils/ApiRoutes"

export const DeliverableRemark = ({ taskId, deliverableId, closeModal, type }) => {
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
            endpoint: ApiRoutes.remarks.create,
            reload: true
        });
        if (response?.success) {
            closeModal()
            // getTask()
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 1, borderRadius: 2 }}>
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

                </Grid>

                <Grid item xs={2}>

                    <Button type="submit" variant="contained" fullWidth>
                        {'Remark'}
                    </Button>

                </Grid>
            </Grid>
        </Box>
    )
}