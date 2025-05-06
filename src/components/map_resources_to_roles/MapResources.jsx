import * as React from "react";
import { Container, Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Card } from "../../common/Card";
import useSubmitData from "../../hooks/useSubmitData";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { validate } from "../../services/validation/validate";

import { MapRoleAndResourceSchema } from "../../validations/business/mapp-resource-to-roles";
import { MultipleSelectWithFilter } from "../../common/MultipleSelectWithFilter";
import useBusinessProfile from "../../hooks/useBusinessProfile";

export default function ResourceToRoleMapping() {
  const [errors, setErrors] = React.useState({});
  const { roles, error: roleError, modules } = useBusinessProfile();
  const [resources, setResource] = React.useState(null);
  const [mappedResource, setMappedResource] = React.useState(null);

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
      <Card variant="outlined">
        <Box sx={{ mt: 1 }}>
          <Typography variant="h4" component="h4" gutterBottom>
            Resources & Roles
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Business Roles</InputLabel>
              <Select
                value={formData.business_role_id}
                onChange={handleInputChange}
                label="Business Role"
                name="business_role_id"
                error={!!errors.business_role_id}
                helperText={errors.business_role_id}
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
              comparedResult={mappedResource}
            />

            {mappedResource && mappedResource.length > 0 && (
              <ul>
                {mappedResource.map((mapped) => (
                  <li key={mapped.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {mapped.name}
                    <button
                      type="button"
                      onClick={() => {
                        unmapResource(formData.business_role_id, mapped.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Link
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}