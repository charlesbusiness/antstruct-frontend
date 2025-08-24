import {
  Paper,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuickLinks = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const quickLinks = [
    { name: 'Manage Employees', icon: '👤', url: '/hr/employees' },
    { name: 'Process Payroll', icon: '💰', url: '/payroll' },
    { name: 'Performance Reviews', icon: '📊', url: '/performace' },
    { name: 'Leave Requests', icon: '⏱️', url: '/leave' },
    { name: 'Training Programs', icon: '🎓', url: '/training' },
    { name: 'Company Policies', icon: '📜', url: '/policies' },
    { name: 'Org Chart', icon: '🏢', url: '/org-chart' },
    { name: 'Create Daily Deliverables', icon: '📈', url: '/hr/daily/deliverables' },
  ];
  
  const navigate = useNavigate();

  const getGridSize = () => {
    if (isMobile) return 6; // 2 items per row on mobile
    if (isTablet) return 4; // 3 items per row on tablet
    return 3; // 4 items per row on desktop
  };

  return (
    <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Quick Links
      </Typography>
      <Grid container spacing={isMobile ? 1 : 2}>
        {quickLinks.map((link, index) => (
          <Grid item xs={getGridSize()} key={index}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                p: isMobile ? 1 : 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: isMobile ? 80 : 100
              }}
              onClick={() => navigate(link.url, { push: true })}
            >
              <Typography variant="h5" sx={{ mb: 1 }}>
                {link.icon}
              </Typography>
              <Typography variant={isMobile ? "caption" : "body2"} align="center">
                {link.name}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Events Section */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" component="h3" gutterBottom>
        Upcoming Events
      </Typography>
      <List dense={isMobile}>
        <ListItem sx={{ 
          bgcolor: 'primary.light', 
          borderRadius: 1, 
          mb: 1,
          py: isMobile ? 1 : 2
        }}>
          <ListItemIcon>📅</ListItemIcon>
          <ListItemText 
            primary="Quarterly Reviews - June 30" 
            primaryTypographyProps={{ variant: isMobile ? "body2" : "body1" }}
          />
        </ListItem>
        <ListItem sx={{ 
          bgcolor: 'success.light', 
          borderRadius: 1, 
          mb: 1,
          py: isMobile ? 1 : 2
        }}>
          <ListItemIcon>🎉</ListItemIcon>
          <ListItemText 
            primary="Company Picnic - July 15" 
            primaryTypographyProps={{ variant: isMobile ? "body2" : "body1" }}
          />
        </ListItem>
        <ListItem sx={{ 
          bgcolor: 'warning.light', 
          borderRadius: 1,
          py: isMobile ? 1 : 2
        }}>
          <ListItemIcon>🎓</ListItemIcon>
          <ListItemText 
            primary="Leadership Training - August 5" 
            primaryTypographyProps={{ variant: isMobile ? "body2" : "body1" }}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default QuickLinks;