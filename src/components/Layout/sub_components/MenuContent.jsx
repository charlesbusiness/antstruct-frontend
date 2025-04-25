import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Collapse,
} from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { useNavigate } from 'react-router-dom';
import { formatRoute } from '../../../utils/general';
import { useBusinessProfileContext } from '../../../contexts/profileContext';

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { text: 'Tasks Dashboard', icon: <AssignmentIcon />, path: '/task/dashboard' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback' },
];

// Optional: Map specific icons to known module names
const moduleIcons = {
  Configuration: <SettingsRoundedIcon />,
  Users: <PeopleRoundedIcon />,
  Business: <BusinessCenterRoundedIcon />,
  Category: <CategoryRoundedIcon />,
  default: <FolderRoundedIcon />,
};

export default function MenuContent() {
  const { expandedModules, toggleModule, businessUserProfile: profile } = useBusinessProfileContext()
  const navigate = useNavigate();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      {/* Top Menu */}
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Dynamic Modules */}
        {profile && (
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
        )}
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
