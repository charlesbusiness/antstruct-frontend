import * as React from "react";
import { useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
  FormHelperText,
} from "@mui/material"

import {
  getPriorityIcon,
} from "../../common/tasks-utils"

import useSubmitData from "../../hooks/useSubmitData"
import { ApiRoutes } from "../../utils/ApiRoutes"
import { TaskStatus, formatDate } from "../../utils/general"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { DeliverableRemark } from "./Deliverable-Remark"
import { Remark } from "./Remarks"
import { useTitle } from "../../hooks/TitleContext"
import DataModal from "../../common/DataModal"
import { useQueryClient } from '@tanstack/react-query'

export default function TaskDetails() {
  const queryClient = useQueryClient()
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [viewRemark, setViewRemark] = React.useState(false);
  const [taskData, setTaskData] = React.useState(null);
  const [deliverableId, setId] = React.useState(null);
  const [remarks, setRemarks] = React.useState(null);
  const [type, setType] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [deliverableStatuses, setDeliverableStatuses] = React.useState({})
  const { submitData } = useSubmitData()

  const { setTitle } = useTitle()

  useEffect(() => {
    setTitle("Task Details");
  }, [setTitle])

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.tasks.task(id),
        method: 'get',
      });
      if (response?.error) throw new Error('Failed to fetch task');
      const { data } = response;
      setStatus(data?.status || "");
      const statusMap = {};
      data.deliverables.forEach(d => {
        statusMap[d.id] = d.deliverable_status;
      });
      setDeliverableStatuses(statusMap);
      setTaskData(data);
      return data;
    },
  })

  const handleOpen = (id) => {
    setId(id)
    setOpen(true)
    setType('deliverable')
  }

  const handleOpenTaskRemarkModal = () => {
    setOpen(true)
    setType('task')
  }

  const handleOpenRemark = (remark) => {
    setRemarks(remark)
    setViewRemark(true)
  }

  const handleClose = () => setOpen(false);
  const handleCloseRemark = () => setViewRemark(false);

  const changeStatus = async (event) => {
    const response = await submitData({
      endpoint: ApiRoutes.tasks.taskUpdate(id),
      data: { status: event.target.value },
      method: "post",
    })

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: ['task', id] })
    }
  }

  const changeDeliverableStatus = async (event, id) => {
    await submitData({
      endpoint: ApiRoutes.tasks.deliverableUpdate,
      data: { status: event.target.value, id },
      method: "post",
      reload: false
    });
  }

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "top", gap: 2 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task: {task?.title}
          </Typography>
          <Chip
            label={task?.priority}
            color="primary"
            icon={getPriorityIcon(task?.priority)}
            variant="outlined"
          />
          <FormControl size="small">
            <Select
              value={status}
              displayEmpty
              disabled={!task}
              onChange={(e) => setStatus(e.target.value)}
              onBlur={changeStatus}
              sx={{ minWidth: 200 }}
            >
              <MenuItem disabled value="">
                <em>Select status</em>
              </MenuItem>
              {TaskStatus.map((statusOption) => (
                <MenuItem value={statusOption} key={statusOption}>
                  {statusOption}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select to Change Status</FormHelperText>
          </FormControl>
        </Box>
        <Button
          component={Link}
          to={`/tasks/${task?.sprint?.id}`}
          variant="outlined"
          color="primary"
        >
          Back to Dashboard
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Task Remarks Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Task Remarks</Typography>
          <Button variant="contained" onClick={handleOpenTaskRemarkModal}>
            Add Comment
          </Button>
        </Box>
        {task?.task_remarks?.length > 0 ? (
          task.task_remarks.map((remark) => (
            <Box key={remark.id} sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: 1 }}>
              <Typography>{remark.remarks}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(remark.created_at)}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No remarks yet</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Task Description Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Task Details
        </Typography>
        <Typography>{task?.task_description || "No description provided"}</Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Deliverables Section */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" gutterBottom>
            Deliverables ({task?.deliverables?.length || 0})
          </Typography>
          <Button
            component={Link}
            to={`/admin/create/task/deliverable?id=${id}`}
            variant="contained"
            color="primary"
          >
            Add Deliverable
          </Button>
        </Box>
      </Box>

      <Grid container spacing={1} sx={{ mb: 2, fontWeight: 'bold' }}>
        <Grid item xs={2}>Title</Grid>
        <Grid item xs={2}>Details</Grid>
        <Grid item xs={2}>Status</Grid>
        <Grid item xs={2}>Date Created</Grid>
        <Grid item xs={2}>Actions</Grid>
        <Grid item xs={2}>Remarks</Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />

      {task?.deliverables?.length > 0 ? (
        task.deliverables.map((deliverable) => (
          <React.Fragment key={deliverable.id}>
            <Grid container spacing={1} alignItems="center" sx={{ py: 1 }}>
              <Grid item xs={2}>
                <Typography>{deliverable.deliverable_title}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>{deliverable.deliverable_description}</Typography>
              </Grid>
              <Grid item xs={2}>
                <FormControl variant="standard" size="small" fullWidth>
                  <Select
                    value={deliverableStatuses[deliverable.id] || ""}
                    onChange={(e) =>
                      setDeliverableStatuses(prev => ({
                        ...prev,
                        [deliverable.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => changeDeliverableStatus(e, deliverable.id)}
                    displayEmpty
                  >
                    {TaskStatus.map(status => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Typography>{formatDate(deliverable.created_at)}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleOpen(deliverable.id)}
                  size="small"
                >
                  Add Remark
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenRemark(deliverable.remarks)}
                  size="small"
                  disabled={!deliverable.remarks?.length}
                >
                  View Remarks ({deliverable.remarks?.length || 0})
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))
      ) : (
        <Typography sx={{ py: 3 }} color="text.secondary" textAlign="center">
          No deliverables yet
        </Typography>
      )}

      {/* Modals */}
      <DataModal
        open={open}
        size='sm'
        onClose={handleClose}
        title={type === 'task' ? "Task Remark" : "Deliverable Remark"}
        description={type === 'task' ?
          "Add a remark for the entire task" :
          `Add a remark for deliverable ${deliverableId}`}
      >
        <DeliverableRemark
          taskId={id}
          deliverableId={deliverableId}
          closeModal={handleClose}
          type={type}
        />
      </DataModal>

      <DataModal
        size='sm'
        open={viewRemark}
        onClose={handleCloseRemark}
        title="Remarks" description={`Viewing all remarks (${remarks?.length || 0})`}
      >
        <Remark remarks={remarks} />
      </DataModal>
    </Container>
  )
}