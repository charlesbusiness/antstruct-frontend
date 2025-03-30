import * as React from "react";
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from "@mui/material";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";

export default function Employees() {
  const [employees, setEmployees] = React.useState(null)
  const { submitData, isLoading } = useSubmitData()
  const getDepartments = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employees.getEmployees,
      method: 'get'
    })

    if (!response?.error) {
      setEmployees(response?.data)
    }
  }

  React.useEffect(() => {
    getDepartments()
  }, [])

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Employees
      </Typography>
      <Grid container spacing={3}>
        {employees?.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee.id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{employee.firstName} {employee.lastName}</Typography>
                <Typography variant="body2" color="textSecondary">{employee.department}</Typography>
                <Typography variant="body2">{employee.email}</Typography>
                <Typography variant="body2">{employee.phone}</Typography>
                <Typography variant="body2">{employee.gender}</Typography>
                <Typography variant="body2">Role: {employee.role}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained">View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
