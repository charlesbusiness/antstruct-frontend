import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useNavigate } from 'react-router-dom';
import { PeopleAltTwoTone } from '@mui/icons-material';
import useSubmitData from '../../../hooks/useSubmitData';
import { ApiRoutes } from '../../../utils/ApiRoutes';
import { Collapse } from '@mui/material';

const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: '/dashboard' },
];



const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
  { text: 'About', icon: <InfoRoundedIcon />, path: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/feedback' },
];

export default function MenuContent() {
  const [dynamicMenu, setDynamicMenu] = React.useState([]);
const [expandedModules, setExpandedModules] = React.useState({});

  const navigate = useNavigate();
  const { submitData, isLoading } = useSubmitData()
  const [apiResources, setApiResources] = React.useState(null)
  const [profile, setProfile] = React.useState(null)

  const toggleModule = (moduleName) => {
  setExpandedModules(prev => ({
    ...prev,
    [moduleName]: !prev[moduleName],
  }));
};


  const getApiResource = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.apiResources.publicApis,
      method: 'get'
    })
    if (response?.error == false) {
      const { data } = response
      console.log(data)
      setApiResources(response?.data)
    }
  }

  const getProfile = async () => {
    const response = await submitData({
      data: {},
      endpoint: ApiRoutes.business.businessProfile,
      method: 'get'
    })

    if (!response?.error) {
      const { data } = response

      // const uniqueModuleName = [...new Set(filteredData.map(item => item.module))];
      // setProfile({ routes: filteredData, modules: uniqueModuleName })

      const filteredData = data?.resources?.filter(resource => resource.isActionBase) || [];

      const groupedRoutes = filteredData.reduce((acc, curr) => {
        if (!acc[curr.module]) {
          acc[curr.module] = [];
        }
        acc[curr.module].push(curr);
        return acc;
      }, {});

      setProfile(groupedRoutes)
    }
  }

  React.useEffect(() => {
    getApiResource()
    getProfile()
  }, [])
  React.useEffect(() => {
    if (profile) {
      const generatedMenu = Object.keys(profile).map(moduleName => ({
        text: moduleName,
        path: `/modules/${moduleName.toLowerCase()}`,
      }));

      setDynamicMenu(generatedMenu);
    }
  }, [profile]);

  console.log(profile)
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {[...mainListItems, ...dynamicMenu].map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {profile &&
          Object.entries(profile).map(([moduleName, routes]) => (
            <React.Fragment key={moduleName}>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton onClick={() => toggleModule(moduleName)}>
                  <ListItemText primary={moduleName} />
                </ListItemButton>
              </ListItem>
              <Collapse in={expandedModules[moduleName]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {routes.map((route, index) => (
                    <ListItem
                      key={index}
                      sx={{ pl: 4 }}
                      disablePadding
                    >
                      <ListItemButton
                        onClick={() => console.log(`Route clicked: ${route.name || route.route}`)}
                      >
                        <ListItemText primary={route.name || route.route} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}

      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => navigate(item.path)}> {/* Add onClick handler */}
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}