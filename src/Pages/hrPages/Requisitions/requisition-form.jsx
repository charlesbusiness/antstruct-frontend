import { useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    TextField,
} from "@mui/material";
import { REQUISITION_TYPES } from "@src/utils/general";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import ButtonLoader from "@src/common/Loader/button-loader";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import { useQueryClient } from "@tanstack/react-query";

export const CreateRequisition = ({ setOpenDialog }) => {
    const queryClient = useQueryClient()
    const { submitData, isLoading } = useSubmitData()
    const { employees, departments } = useBusinessProfile()
    const [formData, setFormData] = useState({
        type: '',
        approval_officer: '',
        requesting_department: '',
        purpose: '',
        description: '',
        remark: '',
    });

    const [monetaryType, setMonetaryType] = useState({
        budget: '',
        expected_disbursement_date: '',
    });

    const [equipmentType, setEquipmentType] = useState({
        item: '',
        specs: '',
        quantity: '',
    });

    const [hrType, setHrType] = useState({
        requested_role: '',
        employment_type: '',
        justification: '',
        desired_start_date: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeInputChange = (e) => {
        const { name, value } = e.target;

        switch (formData.type) {
            case REQUISITION_TYPES.MONEY:
                setMonetaryType((prev) => ({ ...prev, [name]: value }));
                break;
            case REQUISITION_TYPES.EQUIPMENT:
                setEquipmentType((prev) => ({ ...prev, [name]: value }));
                break;
            case REQUISITION_TYPES.HR:
                setHrType((prev) => ({ ...prev, [name]: value }));
                break;
            default:
                break;
        }
    };

    const payloadData = () => {
        let extendedData = {};
        switch (formData.type) {
            case REQUISITION_TYPES.MONEY:
                extendedData = monetaryType;
                break;
            case REQUISITION_TYPES.EQUIPMENT:
                extendedData = equipmentType;
                break;
            case REQUISITION_TYPES.HR:
                extendedData = hrType;
                break;
            default:
                break;
        }
        return {
            ...formData,
            ...extendedData,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = payloadData();
        const response = await submitData({
            data: payload,
            endpoint: ApiRoutes.requisitions.make
        })
        if (response?.success) {
            queryClient.invalidateQueries({ queryKey: ['requisitions'] })
            setOpenDialog()
        }
    }
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <ButtonLoader status={isLoading} />
            {/* Common Fields */}
            <TextField
                select
                fullWidth
                label="Requisition Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                margin="normal"
                required
            >
                <MenuItem value="">Select type</MenuItem>
                <MenuItem value={REQUISITION_TYPES.MONEY}>Monetary</MenuItem>
                <MenuItem value={REQUISITION_TYPES.EQUIPMENT}>Equipment</MenuItem>
                <MenuItem value={REQUISITION_TYPES.HR}>Human Resource</MenuItem>
            </TextField>

            <TextField
                fullWidth
                label="Approval Officer"
                name="approval_officer"
                value={formData.approval_officer}
                onChange={handleInputChange}
                margin="normal"
                select
            >
                {employees?.map((officer) => (
                    <MenuItem key={officer?.id} value={officer?.id}>
                        {officer?.firstname + " " + officer?.lastname}
                    </MenuItem>
                ))}

            </TextField>

            <TextField
                fullWidth
                label="Requesting Department"
                name="requesting_department"
                value={formData.requesting_department}
                onChange={handleInputChange}
                margin="normal"
                select
            >
                {departments?.map((dept) => (
                    <MenuItem key={dept?.id} value={dept?.id}>
                        {dept?.department_name}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                fullWidth
                label="Purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                margin="normal"
            />

            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
            />

            <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={2}
            />

            {/* Conditional Fields */}
            {formData.type === REQUISITION_TYPES.MONEY && (
                <>
                    <TextField
                        fullWidth
                        label="Budget"
                        name="budget"
                        value={monetaryType.budget}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Expected Disbursement Date"
                        name="expected_disbursement_date"
                        value={monetaryType.expected_disbursement_date}
                        onChange={handleTypeInputChange}
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                </>
            )}

            {formData.type === REQUISITION_TYPES.EQUIPMENT && (
                <>
                    <TextField
                        fullWidth
                        label="Item"
                        name="item"
                        value={equipmentType.item}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Specifications"
                        name="specs"
                        value={equipmentType.specs}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Quantity"
                        name="quantity"
                        value={equipmentType.quantity}
                        onChange={handleTypeInputChange}
                        margin="normal"
                        type="number"
                    />
                </>
            )}

            {formData.type === REQUISITION_TYPES.HR && (
                <>
                    <TextField
                        fullWidth
                        label="Requested Role"
                        name="requested_role"
                        value={hrType.requested_role}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Employment Type"
                        name="employment_type"
                        value={hrType.employment_type}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Justification"
                        name="justification"
                        value={hrType.justification}
                        onChange={handleTypeInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Desired Start Date"
                        name="desired_start_date"
                        value={hrType.desired_start_date}
                        onChange={handleTypeInputChange}
                        margin="normal"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                </>
            )}

            <Box mt={3}>
                <Button type="submit" variant="contained" fullWidth>
                    {isLoading ? 'Creating..........' : 'Create'}
                </Button>
            </Box>
        </Box>
    );
};
