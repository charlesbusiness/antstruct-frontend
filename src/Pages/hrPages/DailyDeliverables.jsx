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
    DialogContent,
    DialogTitle,
    Dialog,
    Grid,
    MenuItem,
} from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DeliverableDialog from "./DeliverableDialog";
import { formatDateOnly } from "../../utils/general";
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';


const getTask = async (submitData, search) => {
    const response = await submitData({
        endpoint: ApiRoutes.hrManager.deliverables.get(search),
        method: "get"
    });
    return response;
};

const STATUSES = ['completed', 'pending', 'incomplete']

export default function DailyDeliverables() {
    const { submitData } = useSubmitData();
    const queryClient = useQueryClient()
    const [deliverableModal, setDeliverableModal] = React.useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [filter, setFilter] = React.useState({
        status: '',
        start_date: '',
        end_date: ''
    })

    const [appliedFilter, setAppliedFilter] = React.useState({
        status: '',
        start_date: '',
        end_date: ''
    })

    const [selected, setSelected] = React.useState(null);
    const [updateData, setUpdateData] = React.useState({ status: '' })
    const showDeliverableModal = () => {
        setDeliverableModal(!deliverableModal);
    }

    const handleOpenUpdateDialog = (id) => {
        setOpenUpdateDialog(!openUpdateDialog)
        setSelected(id)
    }

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilter((prev) => ({ ...prev, [name]: value }))
    }

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["dailyDeliverable", appliedFilter],
        queryFn: async () => {
            const filterData = `status=${appliedFilter.status}&start_date=${appliedFilter.start_date}&end_date=${appliedFilter.end_date}`
            const response = await getTask(submitData, filterData)
            if (response?.error) throw new Error("Failed to fetch API resources");
            return response.data;
        },
    });



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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await submitData({
            data: updateData,
            endpoint: ApiRoutes.hrManager.deliverables.update(selected),
        });

        if (response?.success) {
            queryClient.invalidateQueries(['dailyDeliverable'])
            setOpenUpdateDialog(!openUpdateDialog)
            setUpdateData({ status: '' })
        }

    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUpdateData(prev => ({ ...prev, [name]: value }))
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setAppliedFilter(filter);
        console.log(appliedFilter)
    };

    return (
        <>
            <Container>
                <Box
                    component={'form'}
                    onSubmit={handleSearch}
                    sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
                >
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            label="Status Filter"
                            onChange={handleFilterChange}
                            value={filter.status}
                            select
                            name="status"
                            fullWidth // ✅ makes it expand to Grid width
                        >
                            <MenuItem value=''>Select</MenuItem>
                            {STATUSES.map(data => (
                                <MenuItem key={data} value={data}>{data}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            label="date from "
                            type="date"
                            name="start_date"
                            onChange={handleFilterChange}
                            value={filter.start_date}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            size="small"
                            label="date to "
                            type="date"
                            name="end_date"
                            onChange={handleFilterChange}
                            value={filter.end_date}

                        />

                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" type="submit">
                            <SearchIcon />
                        </Button>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="contained" onClick={showDeliverableModal}>
                            Create Deliverables
                        </Button>
                    </Grid>

                </Box>

                <Paper sx={{ overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SN</TableCell>
                                <TableCell>Deliverable</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
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
                                            {formatDateOnly(task.created_at)}
                                        </TableCell>

                                        <TableCell>
                                            <EditIcon
                                                color="warning"
                                                sx={{ cursor: 'pointer' }}
                                                onClick={() => handleOpenUpdateDialog(task.id)} />
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

            <Dialog open={openUpdateDialog} onClose={() => handleOpenUpdateDialog(selected)} fullWidth maxWidth="sm" component={'form'} onSubmit={handleSubmit}>
                <DialogContent>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Update Status
                    </DialogTitle>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            name="status"
                            label={`Status Update`}
                            value={updateData.status}
                            onChange={(e) => handleChange(e)}
                            required
                            select
                        >
                            {
                                STATUSES.map(data => (
                                    <MenuItem key={data} value={data}>{data}</MenuItem>

                                ))
                            }
                        </TextField>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit">Update Status</Button>
                        </Box>
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
