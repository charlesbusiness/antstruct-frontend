import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CircularProgress,
  CardContent,
  Dialog,
  DialogContent,
  Button,
  Divider,
  DialogTitle,
} from "@mui/material";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import AssignRole from "./assign-role";
import UnassignRole from "./unassign-role";
import RoleCreation from "./create-roles";

export default function Roles() {
  const { roles } = useBusinessProfile();
  const [loading, setLoading] = React.useState(true);
  const [assignModal, setAssignModal] = React.useState(false);
  const openAssignModal = () => {
    setAssignModal(!assignModal);
  };

  const [UnassignModal, setUnAssignModal] = React.useState(false);
  const openUnAssignModal = () => {
    setUnAssignModal(!UnassignModal);
  };

  const [createRole, setCreateRole] = React.useState(false);
  const openCreateRole = () => {
    setCreateRole(!createRole);
  };

  React.useEffect(() => {
    if (roles !== undefined) {
      setLoading(false);
    }
  }, [roles]);
  return (
    <Container>
      <Grid container sx={{ display: "flex", justifyContent: "start", gap: 2 }}>
        <Grid>
          <Button variant="contained" onClick={openAssignModal}>Assign Role</Button>
        </Grid>
        <Grid>
          <Button variant="outlined" onClick={openUnAssignModal}>Unassign Role</Button>
          {/* <Link to={'/config/unassign/role'}>Unassign Role</Link> */}
        </Grid>
        <Grid>
          <Button variant="contained" onClick={openCreateRole}>Add Role</Button>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
      {loading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: 200 }}
        >
          <CircularProgress />
        </Grid>
      ) : roles?.length > 0 ? (
        <Grid container spacing={3}>
          {roles?.map((role) => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">
                    {" "}
                    Name: {role.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No Roles created at the moment.
        </Typography>
      )}

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
          <Typography variant="h6" component={"h1"}>
            Create Role
          </Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <RoleCreation openCreateRole={openCreateRole} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
