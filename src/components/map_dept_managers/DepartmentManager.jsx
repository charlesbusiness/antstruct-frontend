import * as React from "react";
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem,  } from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { validate } from "../../services/validation/validate";
import { MultipleSelectWithFilter } from "../../common/MultipleSelectWithFilter";
import { EmployeeDepartmentManager } from "../../validations/business/employee-department-managers";

export default function DepartmentManager() {
  const [errors, setErrors] = React.useState({});
  const [employees, setEmployees] = React.useState(null);
  const [dept, setDept] = React.useState(null);
  const [mappedDept, setMappedDept] = React.useState(null);

  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    department_id: [],
    employee: ''
  })

  const handleInputChange = (e) => {
    setErrors('')
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    if (name == 'employee') {
      getMapped(value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, EmployeeDepartmentManager)
    
    if (validationErrors) {
   
      setErrors(validationErrors)
      return;
    }
    submitData({
      data: {department_id:formData.department_id, employee_id:formData.employee},
      endpoint: ApiRoutes.employeeDeptMap.map,
      navigationPath: '/dashboard'
    })
  }


  const getDepartment = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.getDepartments,
      method: 'get'
    })
    if (response?.error == false) {
      setDept(response?.data)
    }
  }


  const getMapped = async (employee) => {

    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeDeptMap.getMapped + `?employee=${employee}`,
      method: 'get'
    })

    if (response?.error == false) {
      setMappedDept(response?.data)
    } else {
      setMappedDept([])
    }
  }


  const getEmployees = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getEmployees,
      method: 'get'
    })
    if (response?.error == false) {
      setEmployees(response?.data)
    }
  }

  const unmapDept = async (id, employee) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeDeptMap.unmapDept+`/${id}/${employee}`,
      method: 'delete'
    })
    if (response?.error == false) {
      getMapped(employee)
    }
  }

  React.useEffect(() => {
    getEmployees()
    getDepartment()
  }, [])

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
           Create Department Managers
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Employee ID</InputLabel>
              <Select
                value={formData.employee}
                onChange={handleInputChange}
                label=" Employee"
                name="employee"
                error={!!errors.employee}
                helperText={errors.employee}
                color={errors.employee ? 'error' : 'primary'}
              >
                {employees?.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <MultipleSelectWithFilter
              fieldName={'department_id'}
              errors={errors}
              formData={formData}
              setFormData={setFormData}
              inputs={dept}
              required={true}
              dbField={'department_name'}
              comparedResult={mappedDept}
            />

            {mappedDept && mappedDept.length > 0 && (
              <ul>
                {mappedDept.map((mapped) => (
                  <li key={mapped.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {mapped.department_name}
                    <button
                      type="button"
                      onClick={() => {
                        unmapDept(mapped.id, formData.employee);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Map Department
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}