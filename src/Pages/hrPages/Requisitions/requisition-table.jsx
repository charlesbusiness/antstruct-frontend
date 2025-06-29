import {
  IconButton,
  TableCell,
  TableRow,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,

} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Check,
  Close,
  MoreHoriz,
  MoreVert,
  Feedback
} from '@mui/icons-material';
import React, { useState } from 'react';
import { formatDate } from '@src/utils/general';
import { RequisitionDetailCollapsable } from './requisition-detail';
import useSubmitData from '@src/hooks/useSubmitData';
import { ApiRoutes } from '@src/utils/ApiRoutes';
import { useQueryClient } from '@tanstack/react-query';

export const RequisitionTable = ({ requisitions }) => {
  const queryClient = useQueryClient()
  const [openRow, setOpenRow] = useState(null);
  const { submitData, isLoading } = useSubmitData()
  const [reviewData, setReviewData] = useState({
    reviewed_budget: '',
    review: ''
  })
  const [showReviewDialog, setShowReviewDialog] = useState(false)

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }
  const statusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success.light';
      case 'declined':
        return 'error.light';
      case 'reviewed':
        return 'info.light';
      default:
        return 'warning.light';
    }
  };

  const handleApprove = async (id, status) => {
    const response = await submitData({
      data: { comment: 'Good to go', status },
      endpoint: ApiRoutes.requisitions.approve(id)
    })

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] })

    }
  }

  const handleReview = async (id, status) => {
    const response = await submitData({
      data: { comment: 'Good to go', status },
      endpoint: ApiRoutes.requisitions.approve(id)
    })
    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] })

    }
  }

  const handleDelete = (id) => {
    setRequisitions(requisitions.filter(req => req.id !== id));
    showNotification('Requisition deleted');
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell />
            <TableCell>Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Date Requested</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requisitions?.map((req) => (
            <React.Fragment key={req.id}>
              <TableRow>
                <TableCell>
                  <IconButton onClick={() => toggleRow(req.id)} size="small">
                    {openRow === req.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>

                <TableCell>{req.type}</TableCell>
                <TableCell>{req.department_name || '—'}</TableCell>
                <TableCell>{formatDate(req.created_at) || '—'}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: statusColor(req.status),
                      color: 'white',
                    }}
                  >
                    {req.status}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {req.status === 'pending' && (
                    <>
                      <IconButton color="success" onClick={() => handleApprove(req.id, 'approved')} title="Approve">
                        <Check />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleApprove(req.id, 'declined')} title="Reject">
                        <Close />
                      </IconButton>
                    </>
                  )}
                  <IconButton color="error" onClick={() => handleDelete(req.id)} title="Review">
                    <Feedback />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => toggleRow(req.id)}
                    title="View Details"
                  >
                    {openRow === req.id ? <MoreVert /> : <MoreHoriz />}
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Collapsible row */}
              <RequisitionDetailCollapsable requisition={req} openRow={openRow} />
            </React.Fragment>
          ))}

          {requisitions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No requisitions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
