import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
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
import { REQUISITION_TYPES, formatDate } from '../../utils/general';
import { RequisitionDetailCollapsable } from './requisition-detail';
import useSubmitData from '../../hooks/useSubmitData';
import { ApiRoutes } from '../../utils/ApiRoutes';

export const RequisitionTable = ({ requisitions }) => {
  const [openRow, setOpenRow] = useState(null);
  const { submitData, isLoading } = useSubmitData()

  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }
  const statusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success.light';
      case 'Cancelled':
        return 'error.light';
      default:
        return 'warning.light';
    }
  };

  // Handle actions
  const handleApprove = async (id, status) => {
    await submitData({
      data: { comment: 'Good to go', status },
      endpoint: ApiRoutes.requisitions.approve(id)
    })
  };

  const handleCancel = (id) => {
    setRequisitions(requisitions.map(req =>
      req.id === id ? { ...req, status: 'Cancelled' } : req
    ));
    showNotification('Requisition cancelled');
  };

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
                      <IconButton color="error" onClick={() => handleCancel(req.id)} title="Reject">
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
