import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom';
import routes from '../../../routes/routes';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Helper to get route titles for each path segment
function getRouteTitles(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  let accumulated = '';
  const titles = [];
  segments.forEach((segment, idx) => {
    accumulated += '/' + segment;
    // Try to match full path with params replaced by :param
    let match = routes.find(route => {
      // Convert route.path to regex for params
      const routePattern = route.path.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp('^' + routePattern + '$');
      return regex.test(accumulated);
    });
    if (match && match.title) {
      titles.push(match.title);
    }
  });
  return titles;
}

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const titles = getRouteTitles(location.pathname);

  if (!titles.length) return null;

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {titles.map((title, idx) => (
        <Typography
          key={idx}
          variant="body1"
          sx={{ color: idx === titles.length - 1 ? 'text.primary' : 'text.secondary', fontWeight: idx === titles.length - 1 ? 600 : 400 }}
        >
          {title}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}