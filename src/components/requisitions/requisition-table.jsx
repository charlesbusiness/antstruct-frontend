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
  Delete,
  MoreHoriz,
  MoreVert
} from '@mui/icons-material';
import React, { useState } from 'react';
import { REQUISITION_TYPES } from '../../utils/general';

export const RequisitionTable = ({ requisitions, onApprove, onCancel, onDelete }) => {
  const [openRow, setOpenRow] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);


  const toggleRow = (id) => {
    setOpenRow((prev) => (prev === id ? null : id));
    setExpandedRowId((prev) => (prev === id ? null : id));
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


  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Date</TableCell>
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
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.type}</TableCell>
                <TableCell>{req.department || '—'}</TableCell>
                <TableCell>{req.date || '—'}</TableCell>
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
                  {req.status === 'Pending' && (
                    <>
                      <IconButton color="success" onClick={() => onApprove(req.id)} title="Approve">
                        <Check />
                      </IconButton>
                      <IconButton color="error" onClick={() => onCancel(req.id)} title="Cancel">
                        <Close />
                      </IconButton>
                    </>
                  )}
                  <IconButton color="error" onClick={() => onDelete(req.id)} title="Delete">
                    <Delete />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => toggleRow(req.id)}
                    title="View Details"
                  >
                    {expandedRowId === req.id ? <MoreVert /> : <MoreHoriz />}
                  </IconButton>
                </TableCell>
              </TableRow>

              {/* Collapsible row */}
              <TableRow>
                <TableCell colSpan={7} sx={{ p: 0, backgroundColor: '#fafafa' }}>
                  <Collapse in={openRow === req.id} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Details
                      </Typography>
                      {req.type === REQUISITION_TYPES.MONEY && (
                        <>
                          <div><strong>Budget:</strong> {req.budget}</div>
                          <div><strong>Expected Disbursement Date:</strong> {req.expected_disbursement_date}</div>
                          <div><strong>Purpose:</strong> {req.purpose}</div>
                        </>
                      )}
                      {req.type === REQUISITION_TYPES.EQUIPMENT && (
                        <>
                          <div><strong>Item:</strong> {req.item}</div>
                          <div><strong>Specs:</strong> {req.specs}</div>
                          <div><strong>Quantity:</strong> {req.quantity}</div>
                          <div><strong>Purpose:</strong> {req.purpose}</div>
                        </>
                      )}
                      {req.type === REQUISITION_TYPES.HR && (
                        <>
                          <div><strong>Requested Role:</strong> {req.requested_role}</div>
                          <div><strong>Employment Type:</strong> {req.employment_type}</div>
                          <div><strong>Start Date:</strong> {req.desired_start_date}</div>
                          <div><strong>Justification:</strong> {req.justification}</div>
                        </>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
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
