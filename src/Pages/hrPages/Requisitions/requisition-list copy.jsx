import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { REQUISITION_TYPES } from "../../utils/general";
import { RequisitionTabs } from "./requisition-tab";

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

const dummyRequisitions = [
    {
        id: 1,
        type: REQUISITION_TYPES.MONEY,
        approval_officer: "Jane Doe",
        purpose: "Event Budget",
        budget: "₦500,000",
        expected_disbursement_date: "2025-05-20",
        status: "Pending",
    },
    {
        id: 2,
        type: REQUISITION_TYPES.EQUIPMENT,
        approval_officer: "John Smith",
        purpose: "Office Setup",
        item: "Laptop",
        specs: "Intel i7, 16GB RAM",
        quantity: 3,
        status: "Approved",
    },
    {
        id: 3,
        type: REQUISITION_TYPES.HR,
        approval_officer: "Mary Johnson",
        purpose: "New Hire",
        requested_role: "Product Designer",
        employment_type: "Full-time",
        justification: "Project Expansion",
        desired_start_date: "2025-06-01",
        status: "Rejected",
    },
    {
        id: 4,
        type: REQUISITION_TYPES.HR,
        approval_officer: "Mary Johnson",
        purpose: "New Hire",
        requested_role: "Product Designer",
        employment_type: "Full-time",
        justification: "Project Expansion",
        desired_start_date: "2025-06-01",
        status: "Rejected",
    },
];

const RequisitionCard = ({ requisition, onView, onStatusChange }) => (
    <Card sx={{ minHeight: 300 }}>
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{requisition.purpose}</Typography>
                <Chip label={requisition.type.toUpperCase()} color="primary" size="small" />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                Approval Officer: {requisition.approval_officer}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {requisition.type === REQUISITION_TYPES.MONEY && (
                <>
                    <Typography>Budget: {requisition.budget}</Typography>
                    <Typography>Disbursement: {requisition.expected_disbursement_date}</Typography>
                </>
            )}
            {requisition.type === REQUISITION_TYPES.EQUIPMENT && (
                <>
                    <Typography>Item: {requisition.item}</Typography>
                    <Typography>Specs: {requisition.specs}</Typography>
                    <Typography>Quantity: {requisition.quantity}</Typography>
                </>
            )}
            {requisition.type === REQUISITION_TYPES.HR && (
                <>
                    <Typography>Role: {requisition.requested_role}</Typography>
                    <Typography>Start Date: {requisition.desired_start_date}</Typography>
                </>
            )}

            <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
                <Select
                    size="small"
                    value={requisition.status}
                    onChange={(e) => onStatusChange(requisition.id, e.target.value)}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                            {s}
                        </MenuItem>
                    ))}
                </Select>

                <Button size="small" onClick={() => onView(requisition)}>
                    View Details
                </Button>
            </Box>
        </CardContent>
    </Card>
);

const RequisitionDetailModal = ({ open, onClose, requisition }) => {
    if (!requisition) return null;
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
                    bgcolor: "background.paper",
                    p: 4,
                    mx: "auto",
                    mt: "10%",
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Requisition Details
                </Typography>
                <pre>{JSON.stringify(requisition, null, 2)}</pre>
                <Box textAlign="right" mt={2}>
                    <Button onClick={onClose}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export const RequisitionListCopy = ({ handleApprove, handleCancel, handleDelete }) => {
    const [requisitions, setRequisitions] = useState(dummyRequisitions);
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({
        type: "",
        status: "",
        approval_officer: "",
    });

    const handleStatusChange = (id, newStatus) => {
        setRequisitions((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    const handleView = (req) => setSelected(req);
    const handleCloseModal = () => setSelected(null);

    const filteredRequisitions = requisitions.filter((req) => {
        const { type, status, approval_officer } = filters;
        return (
            (!type || req.type === type) &&
            (!status || req.status === status) &&
            (!approval_officer || req.approval_officer.toLowerCase().includes(approval_officer.toLowerCase()))
        )
    })

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" mb={3}>
                    Requisition List
                </Typography>

                {/* Filters */}
                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                    <TextField
                        label="Filter by Officer"
                        size="small"
                        value={filters.approval_officer}
                        onChange={(e) => setFilters((f) => ({ ...f, approval_officer: e.target.value }))}
                    />
                    <Select
                        value={filters.type}
                        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                        size="small"
                        displayEmpty
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {Object.values(REQUISITION_TYPES).map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={filters.status}
                        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                        size="small"
                        displayEmpty
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        {STATUS_OPTIONS.map((s) => (
                            <MenuItem key={s} value={s}>
                                {s}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {/* Grid of Cards */}
                <Grid container spacing={3}>
                    {filteredRequisitions.length === 0 ? (
                        <Typography variant="body1" sx={{ m: 2 }}>
                            No requisitions match the filters.
                        </Typography>
                    ) : (
                        filteredRequisitions.map((req) => (
                            <Grid item xs={12} sm={6} md={4} key={req.id}>
                                <RequisitionCard
                                    requisition={req}
                                    onView={handleView}
                                    onStatusChange={handleStatusChange}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>

                {/* Modal for Details */}
                <RequisitionDetailModal
                    open={Boolean(selected)}
                    onClose={handleCloseModal}
                    requisition={selected}
                />
            </Box>
            <RequisitionTabs
                requisitions={dummyRequisitions}
                onApprove={handleApprove}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </>

    );
};
