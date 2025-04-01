import * as React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function Roles() {
  const { submitData, isLoading } = useSubmitData()
  const [roles, setRoles] = React.useState(null)

  const getroles = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.roles,
      method: 'get'
    })

    if (!response?.error) {
      setRoles(response?.data)
    }
  }

  React.useEffect(() => {
    getroles()
  }, [])

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        roles
      </Typography>
      <Grid container spacing={3}>
        {roles?.map((role) => (
          <Grid item xs={12} sm={6} md={4} key={role.id}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary"> Name: {role.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
