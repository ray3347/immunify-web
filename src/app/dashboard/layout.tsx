'use client';

import React, { useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import themeConfig from '../../theme/themeConfig';
import '@ant-design/v5-patch-for-react-19';

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const selectedKey = pathname ? pathname.split('/')[1] || 'dashboard' : 'dashboard';

  return (
    // <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar 
          collapsed={collapsed} 
          selectedKey={selectedKey} 
        />
        <Layout style={{ 
          marginLeft: collapsed ? 80 : 250, 
          transition: 'margin-left 0.2s',
          padding: 0 
        }}>
          <Header collapsed={collapsed} onToggle={toggleSidebar} />
          <Content
            style={{
              margin: '24px',
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    // </ConfigProvider>
  );
}