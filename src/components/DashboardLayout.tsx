'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Helper function to get the page title based on pathname
const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Home';
  
  // Convert path to title (e.g., "/dashboard" becomes "Dashboard")
  const path = pathname.split('/').filter(Boolean).pop() || '';
  return path.charAt(0).toUpperCase() + path.slice(1);
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar >
        <Toolbar>
          <IconButton
            // color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
            {pageTitle}
          </Typography> */}
        </Toolbar>
      </AppBar>
      
      <Sidebar 
        open={open} 
        onClose={handleDrawerClose} 
        variant="persistent"
      />
      
      <Main open={open}>
        <Toolbar /> 
        {children}
      </Main>
    </Box>
  );
};

export default DashboardLayout;