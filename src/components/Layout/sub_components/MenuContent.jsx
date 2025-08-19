import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Collapse,
} from '@mui/material';

import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InventoryIcon from '@mui/icons-material/Inventory';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBusinessProfileContext } from '../../../contexts/profileContext';
import { DashboardRounded } from '@mui/icons-material';

const mainListItems = [
  { text: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' },

];

const projectModules = {

  'Projects/Goals': [

    {
      description: "Project/Goals",
      endpoint: "/project/dashboard"
    },

    {
      description: "Back Logs",
      endpoint: "/projects"
    },

    {
      description: "Archives",
      endpoint: "/archives"
    },

  ],


  'Business Configuration': [

    {
      description: "Departments",
      endpoint: "/config/departments"
    },
    {
      description: "Departments Managers",
      endpoint: "/config/departments/managers"
    },

    {
      description: "Roles",
      endpoint: "/config/roles"
    },

    {
      description: "Resources",
      endpoint: "/config/api/resources"
    },

  ],

  "HR Manager": [

    {
      description: "Dashboard",
      endpoint: "/hrDashboard"
    },
    {
      description: 'Requisition',
      endpoint: '/make/requisition'
    },

    {
      description: "Employees",
      endpoint: "/hr/employees"
    }
  ]
};



const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback' },
];

// Optional: Map specific icons to known module names
const moduleIcons = {
  'Business Configuration': <SettingsRoundedIcon />,
  'HR Manager': <PeopleRoundedIcon />,
  'Business': <BusinessCenterRoundedIcon />,
  'Category': <CategoryRoundedIcon />,
  'Projects/Goals': <AssignmentIcon />,
  'default': <FolderRoundedIcon />,
};


export default function MenuContent() {
  const { expandedModules, toggleModule, businessUserProfile: profile } = useBusinessProfileContext()
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardMenu, setDashboardMenu] = useState(mainListItems)
  useEffect(() => {
    const inventoryMenu = { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' }
    if (profile && !dashboardMenu.includes(inventoryMenu)) {
      setDashboardMenu([...dashboardMenu, inventoryMenu])
    }
  }, [profile])

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      {/* Top Menu */}
      <List dense>
        {dashboardMenu.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Project Menus */}
        {
          profile &&
          projectModules && (
            <List dense subheader={<li />}>
              {Object.entries(projectModules).map(([moduleName, routes]) => {
                const isActiveModule = routes.some(
                  (route) => route.endpoint === location.pathname
                );

                return (
                  <React.Fragment key={moduleName}>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                      <ListItemButton
                        onClick={() => toggleModule(moduleName)}
                        selected={isActiveModule} // <-- This highlights the module if it's active
                        sx={{
                          bgcolor: isActiveModule ? 'action.selected' : 'inherit',
                        }}
                      >
                        <ListItemIcon>
                          {moduleIcons[moduleName] || moduleIcons.default}
                        </ListItemIcon>
                        <ListItemText primary={moduleName} />
                      </ListItemButton>
                    </ListItem>

                    <Collapse in={expandedModules[moduleName]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {routes.map((route, idx) => (
                          <ListItem key={idx} disablePadding sx={{ pl: 5 }}>
                            <ListItemButton onClick={() => navigate(route.endpoint)}>
                              <ListItemText
                                primary={
                                  <span
                                    style={{
                                      fontWeight:
                                        location.pathname === route.endpoint ? 'bold' : 'normal',
                                      color:
                                        location.pathname === route.endpoint
                                          ? '#1976d2'
                                          : 'inherit',
                                    }}
                                  >
                                    {route.description || 'Unnamed'}
                                  </span>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </List>
          )
        }




        {/* Dynamic Modules */}
        {/* {profile && (
          <List dense subheader={<li />}>
            {Object.entries(profile).map(([moduleName, routes]) => (
              <React.Fragment key={moduleName}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton onClick={() => toggleModule(moduleName)}>
                    <ListItemIcon>
                      {moduleIcons[moduleName] || moduleIcons.default}
                    </ListItemIcon>
                    <ListItemText primary={moduleName} />
                  </ListItemButton>
                </ListItem>

                <Collapse in={expandedModules[moduleName]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {routes.map((route, idx) => (
                      <ListItem key={idx} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                          onClick={() => navigate(formatRoute(route.endpoint))}
                        >
                          <ListItemText primary={route.description || route.description || 'Unnamed'} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        )} */}
      </List>

      {/* Bottom Menu */}
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
