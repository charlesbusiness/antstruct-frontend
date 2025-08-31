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
  Grid,
  Chip,
  Tooltip,
  Avatar,
  AvatarGroup,
  TextField,
  InputAdornment,
  CardHeader,
  CardContent,
  CardActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { MapRoleAndResourceSchema } from "@src/validations/business/mapp-resource-to-roles";
import useBusinessProfile from "@src/hooks/useBusinessProfile";

export default function ResourceToRoleMapping() {
  const [errors, setErrors] = React.useState({});
  const { roles, modules } = useBusinessProfile();
  const [resources, setResources] = React.useState(null);
  const [mappedResource, setMappedResource] = React.useState(null);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");
  const [filteredResources, setFilteredResources] = React.useState([]);
  const { submitData, isLoading } = useSubmitData();

  const [formData, setFormData] = React.useState({
    api_resource: [],
    business_role_id: '',
    moduleName: '',
  });

  // Filter resources based on search term
  React.useEffect(() => {
    if (resources && searchTerm) {
      const filtered = resources.filter(resource => 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources || []);
    }
  }, [resources, searchTerm]);

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
      setSearchTerm(""); // Reset search when module changes
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
    }).then((response) => {
      if (response?.error === false) {
        setSuccessMessage("Resources successfully mapped to role!");
        // Reset form after successful submission
        setFormData({
          api_resource: [],
          business_role_id: formData.business_role_id, // Keep role selected
          moduleName: '', // Reset module
        });
        setResources(null);
        setSelectAll(false);
      }
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
      setFilteredResources(response?.data);
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
      setSuccessMessage("Resource successfully unmapped!");
      await getMappedResource(businessRoleId);
    }
    setLoading(false);
  };

  // Get role name for display
  const getRoleName = () => {
    if (!formData.business_role_id) return "";
    const role = roles.find(r => r.id === formData.business_role_id);
    return role ? role.name : "";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Typography variant="body1" color="text.secondary">
        Map API resources to business roles to control access permissions across your application.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* Left Section - Form */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader 
              title="Map New Resources" 
              subheader="Select a role and module to assign resources"
            />
            <CardContent>
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" required error={!!errors.business_role_id}>
                  <InputLabel>Business Role</InputLabel>
                  <Select
                    value={formData.business_role_id}
                    onChange={handleInputChange}
                    label="Business Role"
                    name="business_role_id"
                  >
                    {roles?.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.business_role_id && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {errors.business_role_id}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth margin="normal" required error={!!errors.moduleName}>
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
                  {errors.moduleName && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {errors.moduleName}
                    </Typography>
                  )}
                </FormControl>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : resources ? (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TextField
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Tooltip title="Filter options">
                        <IconButton size="small">
                          <FilterListIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <FormControl fullWidth margin="normal">
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          }
                          label="Select All"
                        />
                        <Chip 
                          label={`${formData.api_resource.length} selected`} 
                          size="small" 
                          color="primary" 
                          variant={formData.api_resource.length > 0 ? "filled" : "outlined"}
                        />
                      </Box>
                      
                      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                        <List dense>
                          {filteredResources.map((resource) => (
                            <MenuItem 
                              key={resource.id} 
                              value={resource.id}
                              onClick={() => {
                                const newSelection = formData.api_resource.includes(resource.id)
                                  ? formData.api_resource.filter(id => id !== resource.id)
                                  : [...formData.api_resource, resource.id];
                                handleResourceSelection(newSelection);
                              }}
                              sx={{ py: 0.5 }}
                            >
                              <Checkbox checked={formData.api_resource.includes(resource.id)} />
                              <ListItemText 
                                primary={resource.name} 
                                secondary={resource.description || "No description available"} 
                              />
                            </MenuItem>
                          ))}
                          
                          {filteredResources.length === 0 && (
                            <ListItem>
                              <ListItemText 
                                primary="No resources found" 
                                secondary={searchTerm ? "Try a different search term" : "No resources available for this module"} 
                              />
                            </ListItem>
                          )}
                        </List>
                      </Paper>
                    </FormControl>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <FilterListIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Select a role and module to view available resources
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
              <Button 
                type="submit" 
                variant="contained" 
                onClick={handleSubmit}
                disabled={isLoading || loading || formData.api_resource.length === 0}
                startIcon={isLoading || loading ? <CircularProgress size={16} /> : <CheckIcon />}
              >
                Link Resources
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Right Section - Mapped Resources */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader 
              title="Mapped Resources" 
              subheader={formData.business_role_id ? `Resources mapped to ${getRoleName()}` : "Select a role to view mapped resources"}
              action={
                formData.business_role_id && mappedResource && mappedResource.length > 0 && (
                  <Chip 
                    label={`${mappedResource.length} resources`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                )
              }
            />
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : mappedResource ? (
                mappedResource.length > 0 ? (
                  <Paper elevation={0} variant="outlined">
                    <List dense>
                      {mappedResource.map((mapped) => (
                        <ListItem
                          key={mapped.id}
                          secondaryAction={
                            <Tooltip title="Unmap resource">
                              <IconButton
                                edge="end"
                                aria-label="unmap"
                                onClick={() => unmapResource(formData.business_role_id, mapped.id)}
                                sx={{ color: "error.main" }}
                                disabled={loading}
                                size="small"
                              >
                                {loading ? <CircularProgress size={24} /> : <CloseIcon />}
                              </IconButton>
                            </Tooltip>
                          }
                          divider
                        >
                          <ListItemText 
                            primary={mapped.name} 
                            secondary={mapped.description || "No description available"} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      No resources currently mapped to this role
                    </Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <AvatarGroup sx={{ justifyContent: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>R</Avatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 24, height: 24 }}>M</Avatar>
                  </AvatarGroup>
                  <Typography variant="body2" color="text.secondary">
                    Select a business role to view mapped resources
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}