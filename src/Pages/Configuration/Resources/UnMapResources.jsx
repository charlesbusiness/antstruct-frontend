
import * as React from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import useBusinessProfile from "@src/hooks/useBusinessProfile";

export default function UnmapResources() {
  const { roles } = useBusinessProfile();
  const [selectedRoleId, setSelectedRoleId] = React.useState("");
  const [mappedResources, setMappedResources] = React.useState([]);
  const { submitData } = useSubmitData();

  const getMappedResources = async (roleId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employeeResourceMap.getMapped}/${roleId}`,
      method: "get"
    });
    if (!response?.error) {
      setMappedResources(response?.data || []);
    } else {
      setMappedResources([]);
    }
  };

  const unmapResource = async (roleId, resourceId) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.employeeResourceMap.unmapResource}?business_role_id=${roleId}&resource_id=${resourceId}`,
      method: "delete"
    });
    if (!response?.error) {
      getMappedResources(roleId);
    }
  };


  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    getMappedResources(roleId);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 1 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRoleId}
            onChange={handleRoleChange}
            label="Select Role"
          >
            {roles?.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {mappedResources.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mapped Resources
          </Typography>
          <Paper elevation={1}>
            <List dense>
              {mappedResources.map((resource) => (
                <ListItem
                  key={resource.id}
                  secondaryAction={

                    <IconButton
                      edge="end"
                      aria-label="unmap"
                      onClick={() => unmapResource(selectedRoleId, resource.id)
                      }
                      sx={{ color: "error.main" }}
                    >
                      <CloseIcon />
                    </IconButton>

                  }
                >
                  <ListItemText primary={resource.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      ) : (
        selectedRoleId && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No resources mapped to this role.
          </Typography>
        )
      )}
    </Container>
  );
}
