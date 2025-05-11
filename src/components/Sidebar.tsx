'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

// Define the width of the drawer
const drawerWidth = 240;

// Define the navigation items
interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const mainNavItems: NavigationItem[] = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { text: 'About', path: '/about', icon: <InfoIcon /> },
];

const secondaryNavItems: NavigationItem[] = [
  { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
];

// Styled components
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant: "persistent";
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant }) => {
  const pathname = usePathname();

  const renderNavItems = (items: NavigationItem[]) => {
    return items.map((item) => {
      const isActive = pathname === item.path;
      
      return (
        <ListItem key={item.text} disablePadding>
          <NextLink href={item.path} passHref style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}>
            <ListItemButton
              sx={{
                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </NextLink>
        </ListItem>
      );
    });
  };

  return (
    <Drawer
      variant={variant}
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <DrawerHeader>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
          Immunify
        </Typography>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {renderNavItems(mainNavItems)}
      </List>
      <Divider />
      <List>
        {renderNavItems(secondaryNavItems)}
      </List>
    </Drawer>
  );
};

export default Sidebar;