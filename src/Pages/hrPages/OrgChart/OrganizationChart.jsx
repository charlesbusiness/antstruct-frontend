import React, { useState } from "react";
import dummyEmployees from "../Payroll/data";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  TextField,
  Chip,
  Stack,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Badge
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Business as DepartmentIcon,
  FilterList as FilterIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Group as GroupIcon
} from "@mui/icons-material";

const OrganizationChart = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const positionOptions = [...new Set(dummyEmployees.map(emp => emp.position))].filter(Boolean);

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredEmployees = dummyEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.includes(emp.position) || 
      activeFilters.includes(emp.department);
    return matchesSearch && matchesFilters;
  });

  // Group employees by department
  const departments = filteredEmployees.reduce((acc, emp) => {
    if (!acc[emp.department]) acc[emp.department] = [];
    acc[emp.department].push(emp);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          <GroupIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Organization Structure
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Print Organization Chart">
            <IconButton>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            label="Search employees"
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Tooltip title="Filter by position">
              <IconButton
                onClick={() => setActiveFilters([])}
                color={activeFilters.length === 0 ? 'primary' : 'default'}
              >
                <Badge badgeContent={activeFilters.length} color="primary">
                  <FilterIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {positionOptions.map(position => (
              <Chip
                key={position}
                label={position}
                variant={activeFilters.includes(position) ? 'filled' : 'outlined'}
                onClick={() => toggleFilter(position)}
                sx={{ mr: 1, mb: 1 }}
                color="primary"
              />
            ))}
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Showing {filteredEmployees.length} employees in {Object.keys(departments).length} departments
        </Typography>
      </Box>

      {Object.entries(departments).map(([department, employees]) => (
        <Accordion
          key={department}
          expanded={expanded === department || expanded === true}
          onChange={handleChange(expanded === department ? false : department)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: (theme) =>
                expanded === department ? theme.palette.action.selected : 'inherit'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <DepartmentIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {department}
              </Typography>
              <Chip
                label={`${employees.length} employee${employees.length !== 1 ? 's' : ''}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {employees.map((emp, index) => (
                <React.Fragment key={emp.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.action.hover
                      },
                      py: 2
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: (theme) => theme.palette.primary.main,
                          width: 48,
                          height: 48
                        }}
                      >
                        {emp.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {emp.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WorkIcon color="action" fontSize="small" />
                            <Typography variant="body2" component="span">
                              {emp.role}
                              {emp.position && ` • ${emp.position}`}
                            </Typography>
                          </Stack>
                          {emp.phone && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PhoneIcon color="action" fontSize="small" />
                              <Typography variant="body2" component="span">
                                {emp.phone}
                              </Typography>
                            </Stack>
                          )}
                          {emp.email && (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <EmailIcon color="action" fontSize="small" />
                              <Typography variant="body2" component="span">
                                {emp.email}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < employees.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {filteredEmployees.length === 0 && (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No employees found matching your criteria
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default OrganizationChart;