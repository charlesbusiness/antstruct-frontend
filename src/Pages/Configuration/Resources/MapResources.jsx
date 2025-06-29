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
  Button, FormControl, InputLabel, Select, MenuItem, Container, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { MapRoleAndResourceSchema } from "@src/validations/business/mapp-resource-to-roles";
import { MultipleSelectWithFilter } from "@src/common/MultipleSelectWithFilter";
import useBusinessProfile from "@src/hooks/useBusinessProfile";
import UnmapResources from "./UnMapResources";

export default function ResourceToRoleMapping() {
  const [errors, setErrors] = React.useState({});
  const { roles, error: roleError, modules } = useBusinessProfile()
  const [resources, setResource] = React.useState(null)
  const [mappedResource, setMappedResource] = React.useState(null)

  const [mapResource, setapResource] = React.useState(false)
  const openMapResource = () => {
    setapResource(!mapResource)
  }

  const [unMapResource, setUnMapResource] = React.useState(false)
  const openUnMapResource = () => {
    setUnMapResource(!unMapResource)
  }

  const { submitData, isLoading } = useSubmitData()

  const [formData, setFormData] = React.useState({
    api_resource: [],
    business_role_id: '',
    moduleName: '',
  })

  const handleInputChange = (e) => {
    setErrors('')
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    if (name == 'business_role_id') {
      getMappedResource(value)
    }

    if (name == 'moduleName') {
      getApiResource(value)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData, MapRoleAndResourceSchema)
    if (validationErrors) {
      console.log(validationErrors)
      setErrors(validationErrors)
      return;
    }
    submitData({
      data: formData,
      endpoint: ApiRoutes.employeeResourceMap.map,
      reload: true,
    })
  }


  const getApiResource = async (moduleName) => {
    const response = await submitData({
      data: {},
      endpoint: `${ApiRoutes.business.apiResources.moduleResources}?moduleName=${moduleName}`,
      method: 'get'
    })
    if (response?.error == false) {
      setResource(response?.data)
    }
  }

  const getMappedResource = async (business_role_id) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeResourceMap.getMapped + `/${business_role_id}`,
      method: 'get'
    })
    if (response?.error == false) {
      setMappedResource(response?.data)
    } else {
      setMappedResource([])
    }
  }

  const unmapResource = async (businessRoleId, resourceId) => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.employeeResourceMap.unmapResource + `?business_role_id=${businessRoleId}&resource_id=${resourceId}`,
      method: 'delete'
    })
    if (response?.error == false) {
      getMappedResource(businessRoleId)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" onClick={openMapResource}>Link Resources</Button>
        <Button variant="outlined" onClick={openUnMapResource}>Unlink Resources</Button>
      </Box>


      {/* Map resource */}

      <Dialog onClose={openMapResource} open={mapResource} fullWidth>

        <DialogContent fullWidth>

          <Card variant="outlined">
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Business Roles</InputLabel>
                <Select
                  value={formData.business_role_id}
                  onChange={handleInputChange}
                  label="Business Role"
                  name="business_role_id"
                  error={!!errors.business_role_id}
                  helperText={errors.business_role_id || ''}
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
                <InputLabel> Module Name</InputLabel>
                <Select
                  value={formData.moduleName}
                  onChange={handleInputChange}
                  label="Module Name"
                  name="moduleName"
                >
                  {modules?.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <MultipleSelectWithFilter
                fieldName={'api_resource'}
                errors={errors}
                formData={formData}
                setFormData={setFormData}
                inputs={resources}
                required={true}
                dbField={'name'}
                helperText={''}
                comparedResult={mappedResource}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                Link
              </Button>
            </Box>
          </Card>
          {mappedResource && mappedResource.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Mapped Resources
              </Typography>
              <Paper elevation={1}>
                <List dense>
                  {mappedResource.map((mapped) => (
                    <ListItem
                      key={mapped.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="unmap"
                          onClick={() =>
                            unmapResource(formData.business_role_id, mapped.id)
                          }
                          sx={{ color: "error.main" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={mapped.name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </DialogContent>
      </Dialog>


      {/* UnMap resource */}
      <Dialog onClose={openUnMapResource} open={unMapResource} fullWidth>
        <DialogTitle>
          <Typography variant="h6" component={'h1'}>Create Department</Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <UnmapResources />
        </DialogContent>
      </Dialog>
    </Container>
  );
}