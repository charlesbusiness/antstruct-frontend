import * as React from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Chip,
  Avatar,
  LinearProgress,
  Badge,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { TabPanel, a11yProps, getPriorityIcon, getStatusIcon, priorityCounts } from "../../common/tasks-utils";


import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { TaskStatus, formatDate } from "../../utils/general";

import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CustomModal from "../../common/CustomModal";
import { DeliverableRemark } from "./Deliverable-Remark";
import { Remark } from "./Remarks";

export default function TaskDetails() {
  const { id } = useParams();

  const [open, setOpen] = React.useState(false);
  const [viewRemark, setViewRemark] = React.useState(false);
  const [taskData, setTaskData] = React.useState(null);

  const [deliverableId, setId] = React.useState(null)
  const [remarks, setRemakrs] = React.useState(null)
  const [type, setType] = React.useState('')

  const handleOpen = (id) => {
    setId(id)
    setOpen(true)
  }

  const handleOpenTaskRemarkModal = (id) => {
    setOpen(true)
    setType('task')
  }

  const handleOpenRemark = (remark) => {
    setRemakrs(remark)
    setViewRemark(true)
  }

  const handleClose = () => setOpen(false);

  const handleCloseRemark = () => setViewRemark(false);

  const [status, setStatus] = React.useState("")
  const [deliverableStatuses, setDeliverableStatuses] = React.useState({});
  const { submitData } = useSubmitData();


  const changeStatus = async (event) => {
    await submitData({
      endpoint: ApiRoutes.tasks.taskUpdate(id),
      data: { status: event.target.value },
      method: "post",
      reload: false
    })
  }

  const changeDeliverableStatus = async (event, id) => {
    await submitData({
      endpoint: ApiRoutes.tasks.deliverableUpdate,
      data: { status: event.target.value, id },
      method: "post",
      reload: false
    })
  }


  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task'],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.tasks.task(id),
        method: 'get',
      });
      if (response?.error) throw new Error('Failed to fetch API resources');
      const { data } = response
      setStatus(data?.status || "");
      const statusMap = {};
      data.deliverables.forEach(d => {
        statusMap[d.id] = d.deliverable_status;
      });
      setDeliverableStatuses(statusMap);
      setTaskData(data)
      return data;
    },
  })


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {task?.title} |{" "}
          <FormControl>
            <Select
              value={status}
              displayEmpty
              disabled={!task}
              onChange={(e) => setStatus(e.target.value)}
              name="status"
              sx={{ minWidth: 200 }}
              onBlur={changeStatus}
            >
              <MenuItem disabled value={''}>
                <em>{"Select status"}</em>
              </MenuItem>
              {TaskStatus.map((statusOption) => (
                <MenuItem value={statusOption} key={statusOption}>
                  {statusOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          |
          <Link
            type="button"
            style={{ textDecoration: "none" }}
            variant="contained"
            to="/task/dashboard"
          >
            Dashboard
          </Link>
        </Typography>
      </Box>
      <hr />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button onClick={handleOpenTaskRemarkModal}>Comment</Button>
        <p>Task Remarks</p>
        {
          task?.task_remarks?.map(remark => (
            <>
              <Typography key={remark?.id} variant="p" component="p" fontWeight="bold">
                <b>Task Remarks:</b> {remark?.remarks}
              </Typography>
            </>
          ))
        }

      </Box>
      <hr />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="p" component="p" fontWeight="bold">
          <b>Task Details:</b> {task?.task_description}
        </Typography>
        <Divider />

        <hr />
      </Box>
      <hr />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h4" fontWeight="bold">
          <b>Task Deliverables Count:</b> {task?.deliverables?.length} |
          <Link to={`/admin/create/task/deliverable?id=${id}`}>
            Add Deliverables
          </Link>
        </Typography>
      </Box>


      {/* <TabPanel value={value} index={1}> */}
      {/* <Paper elevation={2} sx={{ p: 2 }}> */}
      <Grid container spacing={1} sx={{ mb: 2, fontWeight: 'bold' }}>
        <Grid item xs={2}>Title</Grid>
        <Grid item xs={2}>Details</Grid>
        <Grid item xs={2}>Status</Grid>
        <Grid item xs={2}>Date Created</Grid>
        <Grid item xs={2}>Remark</Grid>
        <Grid item xs={2}>Remark</Grid>
        <Grid item xs={2}>See Remarks</Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      {task?.deliverables?.map(deliverable => (
        <React.Fragment key={deliverable.id}>
          <Grid container spacing={1} alignItems="center" sx={{ py: 1 }}>
            <Grid item xs={2}>
              <Typography>{deliverable.deliverable_title}</Typography>
            </Grid>

            <Grid item xs={3} sx={{ px: 1 }}>
              <Typography>{deliverable.deliverable_description}</Typography>
            </Grid>

            <Grid item xs={2}>
              <FormControl variant="standard" size="small" sx={{ '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInput-underline:after': { borderBottom: 'none' } }}>
                {/* <InputLabel>Assignee</InputLabel> */}
                <Select
                  displayEmpty
                  disabled={!task}
                  value={deliverableStatuses[deliverable.id] || ""}
                  onChange={(e) =>
                    setDeliverableStatuses(prev => ({
                      ...prev,
                      [deliverable.id]: e.target.value,
                    }))
                  }
                  name="deliverable_status"
                  sx={{ minWidth: 200 }}
                  onBlur={(e) => changeDeliverableStatus(e, deliverable.id)}
                >
                  {TaskStatus.map(status => (
                    <MenuItem key={status} value={status}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {status}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Typography>{formatDate(deliverable.created_at)}</Typography>
            </Grid>

            <Grid item xs={3}>
              <Button variant="contained"
                onClick={() => handleOpen(deliverable?.id)}
              >Add Comment</Button>
            </Grid>

            <Grid item xs={3}>
              <Button variant="contained"
                onClick={() => handleOpenRemark(deliverable?.remarks)}
              >Counts: {deliverable?.remarks?.length}</Button>
            </Grid>

          </Grid>
          <Divider sx={{ my: 1 }} />
        </React.Fragment>
      ))}
      {/* </Paper> */}
      <CustomModal
        open={open}
        onClose={handleClose}
        title="Make remark"
      >
        <DeliverableRemark
          taskId={id}
          deliverableId={deliverableId}
          closeModal={handleClose}
          type={type}
        />

      </CustomModal>

      <CustomModal
        open={viewRemark}
        onClose={handleCloseRemark}
        title="View remark"
      >
        <Remark
          remarks={remarks}
        />
      </CustomModal>
    </Container>
  );
}
