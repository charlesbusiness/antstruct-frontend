// CreateObjectiveFlow.jsx

import React, { useState } from 'react';
import {
  Box, Typography, Select, MenuItem, Button, FormControl, InputLabel
} from '@mui/material';

import EmployeeDropdown from './EmployeeDropdown';
import DepartmentDropdown from './DepartmentDropdown';
import CreateObjectiveLogic from './CreateObjectiveLogic';
import { isAdmin as adminRole, isGeneralUser, isLineManager, isManager as managerRole } from '../../../utils/general';
import useSubmitData from '../../../hooks/useSubmitData';
import { useQuery } from '@tanstack/react-query';
import { lineManagerData } from '../../../hooks';
import useGeneralData from '../../../hooks/useGeneralData';

const CreateObjectiveFlow = ({ user }) => {
  const [level, setLevel] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { departments, isLoading, error:isError } = useGeneralData()

  const isAdmin = adminRole(user)
  const isManager = managerRole(user)
  const isEmployee = isGeneralUser(user)
  const lineManager = isLineManager(user)
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

  const {submitData} = useSubmitData()
  const { data: lineManagerRelated, isError: dataError, isLoading:loadingData } = useQuery({
      queryKey: ['lineManager'],
      queryFn: () => lineManagerData(submitData),
      keepPreviousData: true,
      enabled: !!lineManager || isManager
  })

  const data = (lineManager || isManager) ? lineManagerRelated?.departments : departments

  return (
    <Box sx={{ mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Performance Objective
      </Typography>

      {user && (isAdmin || isManager || lineManager) && (
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

      {level === 'department' && (isAdmin || lineManager | isManager) && (
        <DepartmentDropdown
          value={selectedDept}
          onChange={setSelectedDept}
          data={data}
          isError={dataError || isError}
          isLoading={loadingData || isLoading}
        />
      )}

      {level === 'employee' && isAdmin && (
        <EmployeeDropdown label="Select Employee"
          value={selectedEmployee}
          onChange={setSelectedEmployee} />
      )}

      {level === 'employee' && (isManager || lineManager) && (
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
              createdBy={user._id}
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
