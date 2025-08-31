import {
    Box,
    Collapse,
    Divider,
    Stack,
    TableCell,
    TableRow,
    Typography,
    Paper,
} from "@mui/material";
import { REQUISITION_TYPES, formatDate } from "@src/utils/general";

export const RequisitionDetailCollapsable = ({ requisition, openRow }) => {
    if (!requisition) return null;

    const { detail, comments = [] } = requisition;

    return (
        <TableRow>
            <TableCell colSpan={7} sx={{ p: 0, backgroundColor: "#fafafa" }}>
                <Collapse in={openRow === requisition.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Details: {requisition?.description}
                        </Typography>

                        {/* Dynamic Requisition Type Details */}
                        <Stack spacing={1} sx={{ mb: 3 }}>
                            {requisition.type === REQUISITION_TYPES.MONEY && (
                                <>
                                    <Typography>
                                        <strong>Budget:</strong> N{detail?.budget}
                                    </Typography>
                                    <Typography>
                                        <strong>Expected Disbursement Date:</strong>{" "}
                                        {formatDate(detail?.expected_disbursement_date)}
                                    </Typography>
                                    <Typography>
                                        <strong>Purpose:</strong> {requisition.purpose}
                                    </Typography>
                                </>
                            )}

                            {requisition.type === REQUISITION_TYPES.EQUIPMENT && (
                                <>
                                    <Typography>
                                        <strong>Quantity:</strong> {detail?.quantity}
                                    </Typography>
                                    <Typography>
                                        <strong>Purpose:</strong> {requisition.purpose}
                                    </Typography>
                                </>
                            )}

                            {requisition.type === REQUISITION_TYPES.HR && (
                                <>
                                    <Typography>
                                        <strong>Requested Role:</strong> {detail?.requested_role}
                                    </Typography>
                                    <Typography>
                                        <strong>Employment Type:</strong> {detail?.employment_type}
                                    </Typography>
                                    <Typography>
                                        <strong>Start Date:</strong>{" "}
                                        {formatDate(detail?.desired_start_date)}
                                    </Typography>
                                    <Typography>
                                        <strong>Justification:</strong> {detail?.justification}
                                    </Typography>
                                </>
                            )}
                        </Stack>

                        {/* Comments Section */}
                        {comments.length > 0 && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>
                                    Comments
                                </Typography>

                                <Stack spacing={2}>
                                    {comments.map((comment, index) => (
                                        <Paper
                                            variant="outlined"
                                            key={comment.id || index}
                                            sx={{ p: 2, backgroundColor: "#fff" }}
                                        >
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2">
                                                    <strong>{comment.created_by_name || "User"}:</strong>{" "}
                                                    {comment.remark}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(comment.created_at)}
                                                </Typography>
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
};
