import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation, Link } from 'react-router-dom';
import routes from '../../../routes/routes';
import { useTitle } from '../../../hooks/TitleContext';

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

const LinkItem = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

// Only used when route isn't found in routes.js
const generateFallbackBreadcrumbs = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  let accumulatedPath = '';
  
  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      name: segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      path: accumulatedPath,
      isLast
    });
  });
  
  return breadcrumbs;
};

export default function NavbarBreadcrumbs() {
  const { title } = useTitle();
  const location = useLocation();
  const currentRoute = routes.find(route => route.path === location.pathname);
  
  // Default simple breadcrumb (Home > Current Page)
  if (currentRoute || title) {
    return (
      <StyledBreadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextRoundedIcon fontSize="small" />}
      >
        <LinkItem to="/">
          <Typography variant="body1">Home</Typography>
        </LinkItem>
        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {title || currentRoute.title}
        </Typography>
      </StyledBreadcrumbs>
    );
  }
  
  // Fallback for undefined routes - generates path-based breadcrumbs
  const fallbackBreadcrumbs = generateFallbackBreadcrumbs(location.pathname);
  
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <LinkItem to="/">
        <Typography variant="body1">Home</Typography>
      </LinkItem>
      
      {fallbackBreadcrumbs.map((crumb, index) => (
        crumb.isLast ? (
          <Typography 
            key={index} 
            variant="body1" 
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {crumb.name}
          </Typography>
        ) : (
          <LinkItem key={index} to={crumb.path}>
            <Typography variant="body1">
              {crumb.name}
            </Typography>
          </LinkItem>
        )
      ))}
    </StyledBreadcrumbs>
  );
}