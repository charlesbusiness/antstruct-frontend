import { Box, Collapse, TableCell, TableRow, Typography } from "@mui/material";
import { REQUISITION_TYPES, formatDate } from "../../utils/general";

export const RequisitionDetailCollapsable = ({ requisition, openRow }) => {
    if (!requisition) return null;
    return (
        <TableRow>
            <TableCell colSpan={7} sx={{ p: 0, backgroundColor: '#fafafa' }}>
                <Collapse in={openRow === requisition.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Details
                        </Typography>
                        {requisition.type === REQUISITION_TYPES.MONEY && (
                            <>
                                <div><strong>Budget:</strong> N{requisition?.detail.budget}</div>
                                <div><strong>Expected Disbursement Date: </strong>
                                    {formatDate(requisition?.detail.expected_disbursement_date)}
                                </div>
                                <div><strong>Purpose:</strong> {requisition.purpose}</div>
                            </>
                        )}
                        {requisition.type === REQUISITION_TYPES.EQUIPMENT && (
                            <>
                                <div><strong>Item:</strong> {requisition.item}</div>
                                <div><strong>Specs:</strong> {requisition.specs}</div>
                                <div><strong>Quantity:</strong> {requisition.quantity}</div>
                                <div><strong>Purpose:</strong> {requisition.purpose}</div>
                            </>
                        )}
                        {requisition.type === REQUISITION_TYPES.HR && (
                            <>
                                <div><strong>Requested Role:</strong> {requisition.requested_role}</div>
                                <div><strong>Employment Type:</strong> {requisition.employment_type}</div>
                                <div><strong>Start Date:</strong> {requisition.desired_start_date}</div>
                                <div><strong>Justification:</strong> {requisition.justification}</div>
                            </>
                        )}
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}