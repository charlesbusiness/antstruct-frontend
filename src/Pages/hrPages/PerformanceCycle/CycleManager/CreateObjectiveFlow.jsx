

import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, FormControl, InputLabel
} from '@mui/material';

import EmployeeDropdown from './EmployeeDropdown';
import DepartmentDropdown from './DepartmentDropdown';
import CreateObjectiveLogic from './CreateObjectiveLogic';
import { isAdmin as adminRole, isGeneralUser, isManager as managerRole } from '@src/utils/general';
import useSubmitData from '@src/hooks/useSubmitData';
import { useQuery } from '@tanstack/react-query';
import useBusinessProfile from '../../../../hooks/useBusinessProfile';
import { departmentData } from '../../../../hooks';

const CreateObjectiveFlow = ({ user }) => {
  const [level, setLevel] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { departments, isLoading, error: isError } = useBusinessProfile()
  const isAdmin = adminRole(user)
  const isManager = managerRole(user)
  const isEmployee = isGeneralUser(user)

  const handleScopeChange = (e) => {
    setLevel(e.target.value);
    setSelectedDept('');
    setSelectedEmployee('');
    setShowForm(false);
  };

  const canShowFormDirectly = (
    (isAdmin && level === 'organization') ||
    (isManager && level === 'department') ||
    (isEmployee)
  );

  const handleProceed = () => {
    setShowForm(true);
  }

  const { submitData } = useSubmitData()
  const { data: lineManagerRelated, isError: dataError, isLoading: loadingData } = useQuery({
    queryKey: ['departmentDataQuery'],
    queryFn: () => departmentData(submitData, user?.department?.id),
    keepPreviousData: true,
    enabled: !!isManager
  })


  const data = isAdmin ? departments : [user?.department]

  return (
    <Box sx={{ mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Performance Objective
      </Typography>

      {user && (isAdmin || isManager) && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Objective Level</InputLabel>
          <Select value={level} onChange={handleScopeChange} label="Objective Level">
            {
              isAdmin &&
              <MenuItem value="organization">Organization</MenuItem>
            }
            <MenuItem value="department">Department</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </Select>
        </FormControl>
      )
      }

      {level === 'department' && (isAdmin || isManager) && (
        <DepartmentDropdown
          value={selectedDept}
          onChange={setSelectedDept}
          data={data}
        />
      )}

      {level === 'employee' && isAdmin && (
        <EmployeeDropdown label="Select Employee"
          value={selectedEmployee}
          onChange={setSelectedEmployee} />
      )}

      {level === 'employee' && (isManager && !isAdmin) && (
        <EmployeeDropdown
          label="Select Subordinate"
          value={selectedEmployee}
          onChange={setSelectedEmployee}
          managerData={lineManagerRelated?.employees}
        />
      )}

      {(canShowFormDirectly || selectedDept || selectedEmployee) && (
        <Box mt={2}>
          {!showForm ? (
            <Button variant="contained" onClick={handleProceed}>
              Proceed
            </Button>
          ) : (
            <CreateObjectiveLogic
              createdBy={user.id}
              targetLevel={level}
              selectedDept={selectedDept}
              selectedEmp={selectedEmployee}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default CreateObjectiveFlow;
