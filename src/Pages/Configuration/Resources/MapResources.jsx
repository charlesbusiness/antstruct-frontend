import * as React from "react";
import { Card } from "@src/common/Card";
import useSubmitData from "@src/hooks/useSubmitData";
import { ApiRoutes } from "@src/utils/ApiRoutes";
import { validate } from "@src/services/validation/validate";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Checkbox,
  FormControlLabel,
  Divider,
  CircularProgress,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MapRoleAndResourceSchema } from "@src/validations/business/mapp-resource-to-roles";
import useBusinessProfile from "@src/hooks/useBusinessProfile";

export default function ResourceToRoleMapping() {
  const [errors, setErrors] = React.useState({});
  const { roles, modules } = useBusinessProfile();
  const [resources, setResources] = React.useState(null);
  const [mappedResource, setMappedResource] = React.useState(null);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { submitData, isLoading } = useSubmitData();

  const [formData, setFormData] = React.useState({
    api_resource: [],
    business_role_id: '',
    moduleName: '',
  });

  const handleInputChange = (e) => {
    setErrors('');
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    if (name === 'business_role_id') {
      setLoading(true);
      getMappedResource(value).finally(() => setLoading(false));
    }

    if (name === 'moduleName') {
      setLoading(true);
      getApiResource(value).finally(() => setLoading(false));
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked && resources) {
      setFormData(prev => ({
        ...prev,
        api_resource: resources.map(res => res.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        api_resource: []
      }));
    }
  };

  const handleResourceSelection = (selected) => {
    setFormData(prev => ({
      ...prev,
      api_resource: selected
    }));
    setSelectAll(selected.length === resources?.length);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, MapRoleAndResourceSchema);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    submitData({
      data: formData,
      endpoint: ApiRoutes.employeeResourceMap.map,
      reload: true,
    }).finally(() => {
      setLoading(false);
      if (formData.business_role_id) {
        getMappedResource(formData.business_role_id);
      }
    });
  };

  const getApiResource = async (moduleName) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.business.apiResources.moduleResources}?moduleName=${moduleName}`,
      method: 'get'
    });
    if (response?.error === false) {
      setResources(response?.data);
      setSelectAll(false);
    }
  };

  const getMappedResource = async (business_role_id) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeResourceMap.getMapped + `/${business_role_id}`,
      method: 'get'
    });
    if (response?.error === false) {
      setMappedResource(response?.data);
    } else {
      setMappedResource([]);
    }
  };

  const unmapResource = async (businessRoleId, resourceId) => {
    setLoading(true);
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeResourceMap.unmapResource + `?business_role_id=${businessRoleId}&resource_id=${resourceId}`,
      method: 'delete'
    });
    if (response?.error === false) {
      await getMappedResource(businessRoleId);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Resource to Role Mapping
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Left Section - Form */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ p: 3 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Business Role</InputLabel>
                <Select
                  value={formData.business_role_id}
                  onChange={handleInputChange}
                  label="Business Role"
                  name="business_role_id"
                  error={!!errors.business_role_id}
                  color={errors.business_role_id ? 'error' : 'primary'}
                >
                  {roles?.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Module</InputLabel>
                <Select
                  value={formData.moduleName}
                  onChange={handleInputChange}
                  label="Module"
                  name="moduleName"
                >
                  {modules?.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : resources ? (
                <>
                  <FormControl fullWidth margin="normal">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      }
                      label="Select All Resources"
                    />
                    <Select
                      multiple
                      value={formData.api_resource}
                      onChange={(e) => handleResourceSelection(e.target.value)}
                      renderValue={(selected) => `${selected.length} selected`}
                      fullWidth
                    >
                      {resources.map((resource) => (
                        <MenuItem key={resource.id} value={resource.id}>
                          <Checkbox checked={formData.api_resource.includes(resource.id)} />
                          <ListItemText primary={resource.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button 
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    disabled={isLoading || loading}
                  >
                    {isLoading || loading ? <CircularProgress size={24} /> : 'Link Selected Resources'}
                  </Button>
                </>
              ) : null}
            </Box>
          </Card>
        </Grid>

        {/* Right Section - Mapped Resources */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Currently Mapped Resources
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : mappedResource ? (
                mappedResource.length > 0 ? (
                  <Paper elevation={1}>
                    <List dense>
                      {mappedResource.map((mapped) => (
                        <ListItem
                          key={mapped.id}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="unmap"
                              onClick={() => unmapResource(formData.business_role_id, mapped.id)}
                              sx={{ color: "error.main" }}
                              disabled={loading}
                            >
                              {loading ? <CircularProgress size={24} /> : <CloseIcon />}
                            </IconButton>
                          }
                        >
                          <ListItemText primary={mapped.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No resources currently mapped to this role
                  </Typography>
                )
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a role to view mapped resources
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}