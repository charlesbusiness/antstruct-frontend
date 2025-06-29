import * as React from "react";
import { Container, Typography, Grid, Card, CardContent, Dialog, DialogContent, Button, Divider, DialogTitle } from "@mui/material";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import AssignRole from "./assign-role";
import UnassignRole from "./unassign-role";
import RoleCreation from "./create-roles";

export default function Roles() {
  const { roles } = useBusinessProfile()

  const [assignModal, setAssignModal] = React.useState(false)
  const openAssignModal = () => {
    setAssignModal(!assignModal)
  }

  const [UnassignModal, setUnAssignModal] = React.useState(false)
  const openUnAssignModal = () => {
    setUnAssignModal(!UnassignModal)
  }

  const [createRole, setCreateRole] = React.useState(false)
  const openCreateRole = () => {
    setCreateRole(!createRole)
  }

  return (
    <Container>
      <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid>
          <Button onClick={openAssignModal}>Assign Role</Button>
        </Grid>
        <Grid>
          <Button onClick={openUnAssignModal}>Unassign Role</Button>
          {/* <Link to={'/config/unassign/role'}>Unassign Role</Link> */}
        </Grid>
        <Grid>
          <Button onClick={openCreateRole}>
            Add Role
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />

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

      <Dialog onClose={openAssignModal} open={assignModal} fullWidth>
        <DialogContent fullWidth>
          <AssignRole />
        </DialogContent>
      </Dialog>

      <Dialog onClose={openUnAssignModal} open={UnassignModal} fullWidth>
        <DialogContent fullWidth>
          <UnassignRole />
        </DialogContent>
      </Dialog>

      <Dialog onClose={openCreateRole} open={createRole} fullWidth>
        <DialogTitle>
          <Typography variant="h6" component={'h1'}>Create Role</Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <RoleCreation openCreateRole={openCreateRole} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
