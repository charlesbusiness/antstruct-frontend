import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button
} from '@mui/material';
import { AssignmentTurnedIn } from '@mui/icons-material';

import { ObjectiveDetails } from './ObjectiveDetails';
import { ObjectiveCard } from './ObjectiveCard';
import { ApiRoutes } from '@src/utils/ApiRoutes';
import useSubmitData from '@src/hooks/useSubmitData';
import { useQueryClient } from '@tanstack/react-query';

const DraftPerformanceObjective = ({ objectives }) => {
    const { submitData } = useSubmitData()
    const queryClient = useQueryClient()
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState({
        comment: '',
        status: ''
    })
    const handleOpenDetails = (objective) => {
        setSelectedObjective(objective);
        setModalOpen(true);
    };

    const handleCloseDetails = () => {
        setModalOpen(false);
        setSelectedObjective(null);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStatus(prev => ({ ...prev, [name]: value }))
    }

    const handleStatusChange = async (id, e) => {
        e.preventDefault()
        const response = await submitData({
            endpoint: ApiRoutes.performance.objectives.updateObjectives,
            data: { ...status, id },
            method: 'put',
            reload: false
        })
        if (response?.success) {
            queryClient.invalidateQueries(['objectiveData'])
        }
    }


    return (
        <>
            <Box sx={{ mx: 'auto', py: 2 }}>
                {objectives.length > 0 ? (
                    objectives.map((objective) => (
                        <ObjectiveCard
                            key={objective.id}
                            objective={objective}
                            onOpenDetails={handleOpenDetails}
                            status={status}
                            handleStatusChange={
                                (e) => handleStatusChange(objective.id, e)
                            }
                            handleInputChange={handleInputChange}
                        />
                    ))
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            py: 10,
                            textAlign: 'center',
                            color: 'text.secondary',
                            opacity: 0.8
                        }}
                    >
                        <AssignmentTurnedIn sx={{ fontSize: 60, mb: 2 }} color="disabled" />
                        <Typography variant="h6" fontWeight="medium">
                            No Draft Objectives Found
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            When objectives are assigned or created, they’ll appear here.
                        </Typography>
                    </Box>
                )}
            </Box>

            <ObjectiveDetails
                modalOpen={modalOpen}
                handleCloseDetails={handleCloseDetails}
                selectedObjective={selectedObjective}
            />
        </>
    );
};

export default DraftPerformanceObjective;
