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
  MoreHoriz,
  MoreVert,
  Feedback,
} from '@mui/icons-material';
import React, { useState, useCallback } from 'react';
import { formatDate } from '@src/utils/general';
import { RequisitionDetailCollapsable } from './requisition-detail';
import useSubmitData from '@src/hooks/useSubmitData';
import { ApiRoutes } from '@src/utils/ApiRoutes';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ReviewDialog } from './ReviewDailog';
import { CommentDialog } from './CommentDialog'
import { REQUISITION_TYPES } from "@src/utils/general";


// Utils
const getStatusColor = (status) => ({
  approved: 'success.light',
  declined: 'error.light',
  reviewed: 'info.light',
}[status] || 'warning.light');

// Reusable Status Badge
const StatusBadge = ({ status }) => (
  <Box
    sx={{
      display: 'inline-block',
      px: 1,
      py: 0.5,
      borderRadius: 1,
      backgroundColor: getStatusColor(status),
      color: 'white',
      textTransform: 'capitalize',
    }}
  >
    {status}
  </Box>
);


export const RequisitionTable = ({ requisitions }) => {
  const queryClient = useQueryClient();
  const { submitData, isLoading } = useSubmitData();

  const [openRow, setOpenRow] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [comment, setComment] = useState('');
  const [reviewData, setReviewData] = useState({
    reviewed: '',
    review: '',
    contract_type: '',
  });

  const toggleRow = useCallback((id) => {
    setOpenRow((prev) => (prev === id ? null : id));
  }, []);

  const handleCommentChange = (e) => setComment(e.target.value);
  const handleReviewChange = (e) =>
    setReviewData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApprove = async (status) => {
    if (!comment.trim()) {
      toast.error('Comment field is required', { autoClose: 4000 });
      return;
    }

    const response = await submitData({
      data: { comment, status },
      endpoint: ApiRoutes.requisitions.approve(selectedReq.id),
    });

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      setOpenCommentModal(false);
      setComment('');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (selectedReq.type == REQUISITION_TYPES.HR) {
      reviewData.employment_type = reviewData.contract_type
      reviewData.requested_role = reviewData.reviewed
    }
    else if (selectedReq.type == REQUISITION_TYPES.MONEY) {
      reviewData.reviewed_budget = reviewData.reviewed
    }
    else if (selectedReq.type == REQUISITION_TYPES.EQUIPMENT) {
      reviewData.quantity = reviewData.reviewed
    }
    const response = await submitData({
      data: reviewData,
      endpoint: ApiRoutes.requisitions.review(selectedReq.id),
    });

    if (response?.success) {
      queryClient.invalidateQueries({ queryKey: ['requisitions'] });
      setOpenReviewModal(false);
      setReviewData({ reviewed_budget: '', review: '' });
    }
  };

  const openComment = (req) => {
    setSelectedReq(req);
    setOpenCommentModal(true);
  };

  const openReview = (req) => {
    setSelectedReq(req);
    setOpenReviewModal(true);
  };

  return (
    <>
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
            {requisitions?.length > 0 ? (
              requisitions.map((req) => (
                <React.Fragment key={req.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton onClick={() => toggleRow(req.id)} size="small">
                        {openRow === req.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>{req?.department?.department_name || '—'}</TableCell>
                    <TableCell>{formatDate(req.created_at) || '—'}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell align="center">
                      {(req.status === 'pending' || req.status === 'reviewed') && (
                        <>
                          <IconButton color="success" onClick={() => openComment(req)} title="Approve">
                            <Check />
                          </IconButton>
                          <IconButton color="error" onClick={() => openReview(req)} title="Review">
                            <Feedback />
                          </IconButton>
                        </>
                      )}
                      <IconButton onClick={() => toggleRow(req.id)} title="View Details">
                        {openRow === req.id ? <MoreVert /> : <MoreHoriz />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <RequisitionDetailCollapsable requisition={req} openRow={openRow} />
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No requisitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CommentDialog
        open={openCommentModal}
        onClose={() => setOpenCommentModal(false)}
        comment={comment}
        onChange={handleCommentChange}
        onApprove={handleApprove}
        isLoading={isLoading}
      />

      <ReviewDialog
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        data={reviewData}
        onChange={handleReviewChange}
        onSubmit={handleReviewSubmit}
        isLoading={isLoading}
        requisitionType={selectedReq?.type}
      />
    </>
  );
};
