'use client';

import React from 'react';
import Link from 'next/link';
import { Layout, Menu, Typography } from 'antd';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  UserRound,
  ListCheckIcon
} from 'lucide-react';
import { MenuItemType } from '@/type';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;
const { Title } = Typography;

interface SidebarProps {
  collapsed: boolean;
  selectedKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed,
  selectedKey,
}) => {
  const pathname = usePathname();

  // Tentukan key aktif berdasarkan path
  const activeKey = React.useMemo(() => {
    if (pathname?.startsWith('/dashboard/calendar')) return 'calendar';
    if (pathname?.startsWith('/dashboard/appointments')) return 'appointments';
    if (pathname?.startsWith('/dashboard/vaccine-inventory')) return 'vaccine inventory';
    if (pathname?.startsWith('/dashboard')) return 'dashboard';
    return '';
  }, [pathname]);

  const menuItems: MenuItemType[] = [
    {
      key: 'dashboard',
      icon: <LayoutDashboard size={16} />,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: 'calendar',
      icon: <Calendar size={16} />,
      label: 'Calendar',
      path: '/dashboard/calendar'
    },
    {
      key: 'appointments',
      icon: <ListCheckIcon size={16} />,
      label: 'Appointments',
      path: '/dashboard/appointments'
    },
    {
      key: 'vaccine inventory',
      icon: <UserRound size={16} />,
      label: 'Vaccine Inventory',
      path: '/dashboard/vaccine-inventory'
    }
  ];

  const items = menuItems.map(item => ({
    key: item.key,
    icon: item.icon,
    label: (
      <Link href={item.path}>
        {item.label}
      </Link>
    ),
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 1,
      }}
      theme="light"
      width={250}
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[activeKey]}
        items={items}
        style={{ padding: '16px' }}
      />
    </Sider>
  );
};

export default Sidebar;