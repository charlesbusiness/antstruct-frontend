import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {

  Add as AddIcon,
} from '@mui/icons-material';
import CreateCycleForm from './CreateCycleForm';
// import { getCycles, getRemarks } from '../../../hooks';
import { useQuery } from '@tanstack/react-query';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PerformanceRemarkManager from './PerformanceRemark';

import useSubmitData from '../../../../hooks/useSubmitData';
import { formatDate, formatDateOnly, getYearOptions } from '../../../../utils/general';
import CreateQuarterForm from './CreateQuarterForm';
import { CyclesYearFilter } from '../../../../components/CyclesYearFilter';
import { ApiRoutes } from '../../../../utils/ApiRoutes';
import { getCycles } from '../../../../hooks';


const CycleManager = () => {
  const { submitData } = useSubmitData()
  const theme = useTheme();
  const [yearFilter, setYearFilter] = useState('');
  const [quarterFilter, setQuarterFilter] = useState('Q1');
  const [selectedCycle, setSelectedCycle] = useState(null)

  const { data: cycleData, error, isLoading } = useQuery({
    queryKey: ['cyclesData', yearFilter],
    queryFn: async () => await getCycles(submitData, yearFilter),
    keepPreviousData: true,
  })




  // const { data: remarkResult } = useQuery({
  //   queryKey: ['remarkData'],
  //   // queryFn: async () => await getRemarks(submitData),
  //   keepPreviousData: true,
  // });


  const yearOptions = getYearOptions();


  const cycles = cycleData || []

  const [cycleModal, setCycleModal] = React.useState(false)
  const [quarterModal, setQuarterModal] = React.useState(false)

  const openCycleModal = () => {
    setSelectedCycle(null)
    setCycleModal(!cycleModal)
  }

  const openQuarterModal = () => {
    setSelectedCycle(null)
    setQuarterModal(!quarterModal)
  }

  const toggleCycle = (cycle) => {
    openCycleModal()
    setSelectedCycle(cycle)
  }
  const toggleQuarter = (cycle) => {
    openQuarterModal()
    setSelectedCycle(cycle)
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Cycle Management"
              action={
                <Button variant="contained" startIcon={<AddIcon />}
                  onClick={openCycleModal}>
                  New Cycle
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <CyclesYearFilter yearFilter={yearFilter} setYearFilter={setYearFilter} />
                  </Grid>

                </Grid>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cycle Name</TableCell>
                      <TableCell>Start Date</TableCell>
                      <TableCell>End Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Quarters</TableCell>
                      <TableCell>Year</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cycles?.map((cycle) => (
                      <TableRow key={cycle.id}>
                        <TableCell>{cycle.cycle_name}</TableCell>
                        <TableCell>{formatDateOnly(cycle.start_month)}</TableCell>
                        <TableCell>{formatDateOnly(cycle.end_month)}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor:
                                cycle.status === 'completed'
                                  ? theme.palette.success.light
                                  : cycle.status === 'active'
                                    ? theme.palette.primary.light
                                    : theme.palette.warning.light,
                              color:
                                cycle.status === 'completed'
                                  ? theme.palette.success.dark
                                  : cycle.status === 'active'
                                    ? theme.palette.primary.dark
                                    : theme.palette.warning.dark,
                            }}
                          >
                            {cycle.status}
                          </Box>
                        </TableCell>
                        <TableCell>{cycle.quarters?.length || 0}</TableCell>
                        <TableCell>{cycle.year}</TableCell>
                        <TableCell>
                          <Button size="small"
                            onClick={() => toggleCycle(cycle)}>
                            <EditIcon color='primary' />
                          </Button>
                          <Button size="small"
                            onClick={() => toggleQuarter(cycle)}
                          >
                            <VisibilityIcon /> Quarters
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* <PerformanceRemarkManager remarks={remarkResult?.data?.data} /> */}

      {/*create Cycle Dialog */}

      <Dialog
        open={cycleModal}
        onClose={openCycleModal}
        maxWidth={false}
      >
        <DialogTitle>
          <Typography variant="h6" gutterBottom>
            Create KPI Cycle
          </Typography>
          <Divider />
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 4 }}>
          <CreateCycleForm
            openModal={openCycleModal}
            cycleData={selectedCycle}
            yearOptions={yearOptions}
          />
        </DialogContent>
      </Dialog>

      {/* Quarter dialog */}
      <Dialog
        open={quarterModal}
        onClose={openQuarterModal}
        maxWidth={false}
      >
        <DialogTitle>
          <Typography variant="h6" gutterBottom>
            Quarters Manager
          </Typography>
          <Divider />
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 4 }}>
          <CreateQuarterForm
            openModal={openQuarterModal}
            cycleData={selectedCycle}
          />
        </DialogContent>
      </Dialog>
    </>

  );
};

export default CycleManager;