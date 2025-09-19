import React from 'react';
import {
  Drawer,
  List,
  Stack,
  Avatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Collapse
} from '@mui/material';
import OptionsMenu from './OptionsMenu';
import {
  ExpandLess,
  ExpandMore,
  DashboardRounded,
  SettingsRounded,
  PeopleRounded,
  BusinessCenterRounded,
  Assignment,
  Inventory
} from '@mui/icons-material';
import { useBusinessProfileContext } from '../../../contexts/profileContext';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const SideMenu = () => {
  const [openSubmenus, setOpenSubmenus] = React.useState({});
  const location = useLocation();
  const { businessInfo } = useBusinessProfileContext();

  const handleSubmenuToggle = (menuKey) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuIcons = {
    'Dashboard': <DashboardRounded />,
    'Business Profile': <SettingsRounded />,
    'Project/Goals': <Assignment />,
    'Back Logs': <Assignment />,
    'HR Management': <PeopleRounded />,
    'Inventory': <Inventory />,
    'Business Configuration': <BusinessCenterRounded />
  };

  const menuItems = [
    {
      subHeading: 'HOME',
      items: [
        { 
          text: 'Dashboard', 
          icon: menuIcons['Dashboard'], 
          link: '/dashboard',
          selected: location.pathname === '/dashboard'
        },
      ]
    },
    {
      subHeading: 'Business Configuration',
      items: [
        { 
          text: 'Business Profile', 
          icon: menuIcons['Business Configuration'],
          submenu: [
            { text: 'Departments', icon: null, link: '/config/departments', selected: location.pathname === '/config/departments' },
            { text: 'Departments Managers', icon: null, link: '/config/departments/managers', selected: location.pathname === '/config/departments/managers' },
            { text: 'Roles', icon: null, link: '/config/roles', selected: location.pathname === '/config/roles' },
            { text: 'Resources', icon: null, link: '/config/api/resources', selected: location.pathname === '/config/api/resources' }
          ]
        },
      ]
    },
    {
      subHeading: 'Project Management',
      items: [
        { 
          text: 'Project/Goals', 
          icon: menuIcons['Project/Goals'], 
          submenu: [
            { text: 'Project Dashboard', link: '/project/dashboard', selected: location.pathname === '/project/dashboard' },
            { text: 'Back Logs', link: '/project/backlogs', selected: location.pathname === '/project/backlogs' },
          ]
        },
      ]
    },
    {
      subHeading: 'HR Management',
      items: [
        { 
          text: 'HR Management',  
          icon: menuIcons['HR Management'],
          submenu: [
            { text: 'Dashboard', link: '/hrDashboard', selected: location.pathname === '/hrDashboard' },
            { text: 'Requisition', link: '/make/requisition', selected: location.pathname === '/make/requisition' },
            { text: 'Employees', link: '/hr/employees', selected: location.pathname === '/hr/employees' },
          ]
        },
        { 
          text: 'Inventory', 
          icon: menuIcons['Inventory'], 
          link: '/inventory',
          selected: location.pathname === '/inventory'
        },
      ]
    }
  ];

  // Recursive function to check if any child is active
  const isSubmenuActive = (items) => {
    return items.some(item => {
      if (item.submenu) {
        return isSubmenuActive(item.submenu);
      }
      return item.selected;
    });
  };

  const renderMenuItems = (items, level = 0, parentKey = '') => {
    return items.map((item, index) => {
      const itemKey = `${parentKey}_${item.text}_${level}_${index}`;
      const hasActiveChild = item.submenu ? isSubmenuActive(item.submenu) : false;
      
      return (
        <React.Fragment key={itemKey}>
          {item.submenu ? (
            <>
              <ListItemButton 
                onClick={() => handleSubmenuToggle(itemKey)}
                selected={hasActiveChild || item.selected}
                sx={{ pl: 2 + level * 2 }}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.text} />
                {openSubmenus[itemKey] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openSubmenus[itemKey]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {renderMenuItems(item.submenu, level + 1, itemKey)}
                </List>
              </Collapse>
            </>
          ) : (
            <ListItemButton
              component={Link}
              to={item.link}
              selected={item.selected}
              sx={{ pl: 2 + level * 2 }}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.text} />
            </ListItemButton>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 270,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: 270,
          boxSizing: 'border-box',
          height: '100vh',
          position: 'relative'
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <img 
          src={logo}
          alt="Anstruct Logo" 
          style={{ height: 40, marginBottom: 0 }}
        />
      </Box>
      
      <Divider />
      
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        {menuItems.map((menu, menuIndex) => (
          <React.Fragment key={menuIndex}>
            <Typography variant="subtitle2" sx={{ px: 2, pt: 2, pb: 1, color: 'text.secondary' }}>
              {menu.subHeading}
            </Typography>
            <List>
              {renderMenuItems(menu.items)}
            </List>
            <Divider />
          </React.Fragment>
        ))}
      </Box>

      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={
            businessInfo?.employee ?
              businessInfo.employee.firstname :
              businessInfo?.business_name || ' '}
          src="/static/images/avatar/9.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {
              businessInfo?.employee ?
                businessInfo.employee.firstname :
                businessInfo?.business_name || ' '}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {
              businessInfo?.employee ?
                businessInfo.employee.email :
                businessInfo?.email || ' '
            }
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
};

export default SideMenu;