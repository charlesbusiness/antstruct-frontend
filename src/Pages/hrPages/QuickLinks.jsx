import {
  Paper,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';

const QuickLinks = () => {
  const quickLinks = [
    { name: 'Add New Employee', icon: '👤', url: '/employees/add' },
    { name: 'Process Payroll', icon: '💰', url: '/payroll' },
    { name: 'Performance Reviews', icon: '📊', url: '/reviews' },
    { name: 'Time Off Requests', icon: '⏱️', url: '/time-off' },
    { name: 'Training Programs', icon: '🎓', url: '/training' },
    { name: 'Company Policies', icon: '📜', url: '/policies' },
    { name: 'Org Chart', icon: '🏢', url: '/org-chart' },
    { name: 'Reports', icon: '📈', url: '/reports' },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Quick Links
      </Typography>
      <Grid container spacing={2}>
        {quickLinks.map((link, index) => (
          <Grid item xs={6} key={index}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              href={link.url}
            >
              <Typography variant="h5" sx={{ mb: 1 }}>
                {link.icon}
              </Typography>
              <Typography variant="body2">
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
      <List>
        <ListItem sx={{ bgcolor: 'primary.light', borderRadius: 1, mb: 1 }}>
          <ListItemIcon>📅</ListItemIcon>
          <ListItemText primary="Quarterly Reviews - June 30" />
        </ListItem>
        <ListItem sx={{ bgcolor: 'success.light', borderRadius: 1, mb: 1 }}>
          <ListItemIcon>🎉</ListItemIcon>
          <ListItemText primary="Company Picnic - July 15" />
        </ListItem>
        <ListItem sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
          <ListItemIcon>🎓</ListItemIcon>
          <ListItemText primary="Leadership Training - August 5" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default QuickLinks;