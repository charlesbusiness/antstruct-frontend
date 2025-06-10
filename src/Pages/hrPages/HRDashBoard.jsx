import React, { useState } from 'react';
import {  
  Container, 
  Typography, 
  Grid,
  Paper,
  CssBaseline
} from '@mui/material';
import EmployeeTable from "./EmployeeTable";
import QuickLinks from "./QuickLinks";
import EmployeeDetailModal from "./EmployeeModal";
import StatsOverview from "./StatsOverview";

const HRDashboard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data
  const employees = [
    {
      id: 1,
      name: 'John Doe',
      position: 'Software Engineer',
      department: 'Engineering',
      status: 'Active',
      hireDate: '2020-05-15',
      email: 'john.doe@company.com',
      phone: '(555) 123-4567',
      salary: '$85,000',
      documents: ['Resume.pdf', 'OfferLetter.pdf'],
      paystubs: [
        { date: '2023-06-01', amount: '$3,200', download: 'paystub_0601.pdf' },
        { date: '2023-05-01', amount: '$3,200', download: 'paystub_0501.pdf' }
      ],
      appraisals: [
        { date: '2023-01-15', rating: '4.5/5', comments: 'Excellent performance' }
      ],
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'HR Manager',
      department: 'Human Resources',
      status: 'Leave',
      hireDate: '2019-03-10',
      email: 'jane.smith@company.com',
      phone: '(555) 987-6543',
      salary: '$95,000',
      documents: ['Resume.pdf', 'Degree.pdf'],
      paystubs: [
        { date: '2023-06-01', amount: '$3,650', download: 'paystub_0601.pdf' },
        { date: '2023-05-01', amount: '$3,650', download: 'paystub_0501.pdf' }
      ],
      appraisals: [
        { date: '2023-01-15', rating: '5/5', comments: 'Outstanding leadership' }
      ],
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    // Add more employees as needed
  ];

  const handleViewMore = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          HR Dashboard
        </Typography>
        
        {/* Stats Overview */}
        <StatsOverview employees={employees} />
        
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={8}>
            {/* Employee Table */}
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Employee Records
              </Typography>
              <EmployeeTable employees={employees} onViewMore={handleViewMore} />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Quick Links */}
            <QuickLinks />
          </Grid>
        </Grid>
      </Container>
      
      {/* Employee Detail Modal */}
      {isModalOpen && selectedEmployee ? (
        <EmployeeDetailModal employee={selectedEmployee} onClose={closeModal} />
      ) : null}
    </>
  );
};

export default HRDashboard;