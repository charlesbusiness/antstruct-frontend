// unmap-resources.jsx
import * as React from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";

export default function UnmapResources() {
  const [roles, setRoles] = React.useState([]);
  const [selectedRoleId, setSelectedRoleId] = React.useState("");
  const [mappedResources, setMappedResources] = React.useState([]);
  const { submitData } = useSubmitData();

  const getRoles = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.roles,
      method: "get"
    });
    if (!response?.error) {
      setRoles(response?.data);
    }
  };

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

  React.useEffect(() => {
    getRoles();
  }, []);

  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    setSelectedRoleId(roleId);
    getMappedResources(roleId);
  };

  return (
    <Container maxWidth="sm">
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Unmap Resources from Role
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRoleId}
              onChange={handleRoleChange}
              label="Select Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {mappedResources.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Mapped Resources:</Typography>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {mappedResources.map((resource) => (
                  <li
                    key={resource.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
                  >
                    {resource.name}
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => unmapResource(selectedRoleId, resource.id)}
                    >
                      Unmap
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          ) : (
            selectedRoleId && <Typography variant="body2" sx={{ mt: 2 }}>No resources mapped to this role.</Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}
