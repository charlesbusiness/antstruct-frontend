import * as React from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Chip,
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { useQuery } from "@tanstack/react-query";
import DeliverableDialog from "./DeliverableDialog";
import { formatDate } from "../../utils/general";
import EditIcon from '@mui/icons-material/Edit';


const getTask = async (submitData) => {
    const response = await submitData({
        endpoint: ApiRoutes.hrManager.deliverables.get,
        method: "get",
    });
    return response;
};

export default function DailyDeliverables() {
    const { submitData } = useSubmitData();
    const [deliverableModal, setDeliverableModal] = React.useState(false);
    const [filter, setFilter] = React.useState("");

    const showDeliverableModal = () => {
        setDeliverableModal(!deliverableModal);
    };

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["dailDeliverable"],
        queryFn: async () => {
            const response = await getTask(submitData);
            if (response?.error) throw new Error("Failed to fetch API resources");
            return response.data;
        },
    });

    // Filter by deliverable text
    const filteredTasks = tasks.filter((task) =>
        task.deliverable?.toLowerCase().includes(filter.toLowerCase())
    );

    // Helper to pick chip color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "completed":
                return "success";
            case "incomplete":
                return "error";
            default:
                return "default";
        }
    };

    return (
        <>
            <Container>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Button variant="contained" onClick={showDeliverableModal}>
                        Create Deliverables
                    </Button>
                    <TextField
                        size="small"
                        label="Filter deliverables"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </Box>

                <Paper sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Deliverable</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task, index) => (
                                    <TableRow key={task.id || index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{task.deliverable}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={task.status}
                                                color={getStatusColor(task.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(task.created_at)}
                                        </TableCell>

                                        <TableCell>
                                            <EditIcon />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        {isLoading ? "Loading..." : "No deliverables found"}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>

            <DeliverableDialog
                onClose={showDeliverableModal}
                open={deliverableModal}
                submitData={submitData}
            />
        </>
    );
}
