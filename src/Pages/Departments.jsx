import * as React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import useSubmitData from "../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function Departments() {
  const { submitData, isLoading } = useSubmitData()
  const [departments, setDepartments] = React.useState(null)

  const getDepartments = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.getDepartments,
      method: 'get'
    })

    if (!response?.error) {
      setDepartments(response?.data)
    }
  }

  React.useEffect(() => {
    getDepartments()
  }, [])

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Departments
      </Typography>
      <Grid container spacing={3}>
        {departments?.map((department) => (
          <Grid item xs={12} sm={6} md={4} key={department.id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>

                <Typography variant="h6" color="textSecondary"> Name: {department.department_name}</Typography>
                <Typography variant="body2">Details: {department.department_detail}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
