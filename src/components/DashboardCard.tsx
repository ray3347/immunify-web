'use client';

import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
  onClick?: () => void; 
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  color = '#1890ff',
  icon,
  onClick, 
}) => {
  return (
    <Card
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined, 
      }}
      onClick={onClick} 
      hoverable={!!onClick}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary">{title}</Text>
          <Title level={3} style={{ margin: '8px 0', color }}>{value}</Title>
          {description && <Text type="secondary">{description}</Text>}
        </div>
        {icon && <div style={{ fontSize: '24px', color }}>{icon}</div>}
      </div>
    </Card>
  );
};

export default DashboardCard;