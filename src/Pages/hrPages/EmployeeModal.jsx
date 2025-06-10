import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Grid,
  TableContainer,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Close } from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EmployeeDetailModal = ({ employee, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Avatar 
              src={employee.image} 
              alt={employee.name}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h5">{employee.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {employee.position} - {employee.department}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="employee details tabs">
          <Tab label="Basic Details" />
          <Tab label="Documents" />
          <Tab label="Payment Details" />
          <Tab label="Appraisals" />
        </Tabs>
        
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={employee.name}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Email" 
                    secondary={employee.email}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Phone" 
                    secondary={employee.phone}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Employment Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Position" 
                    secondary={employee.position}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Department" 
                    secondary={employee.department}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Hire Date" 
                    secondary={employee.hireDate}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={employee.status}
                        color={employee.status === 'Active' ? 'success' : 'error'}
                        size="small"
                      />
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Salary" 
                    secondary={employee.salary}
                    secondaryTypographyProps={{ color: 'text.primary' }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Employee Documents
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List>
              {employee.documents.map((doc, index) => (
                <ListItem 
                  key={index} 
                  secondaryAction={
                    <Button size="small">Download</Button>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>📄</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={doc} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Box mt={3}>
            <Button variant="contained">
              Upload New Document
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employee.paystubs.map((stub, index) => (
                  <TableRow key={index}>
                    <TableCell>{stub.date}</TableCell>
                    <TableCell>{stub.amount}</TableCell>
                    <TableCell>
                      <Button size="small">Download</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="h6" gutterBottom mt={4}>
            Salary Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Base Salary
                </Typography>
                <Typography variant="h5">{employee.salary}/year</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Method
                </Typography>
                <Typography variant="h5">Direct Deposit</Typography>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Performance Appraisals
          </Typography>
          <Grid container spacing={3}>
            {employee.appraisals.map((appraisal, index) => (
              <Grid item xs={12} key={index}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">
                      Appraisal on {appraisal.date}
                    </Typography>
                    <Chip 
                      label={appraisal.rating}
                      color="primary"
                    />
                  </Box>
                  <Typography paragraph>
                    {appraisal.comments}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Goals for Next Period:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Improve collaboration with marketing team" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Complete advanced React training" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Lead one major project initiative" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box mt={3}>
            <Button variant="contained">
              Schedule New Appraisal
            </Button>
          </Box>
        </TabPanel>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailModal;