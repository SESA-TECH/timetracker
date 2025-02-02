import React from 'react';
import { Typography, Button, Space } from 'antd';

interface UserHeaderProps {
  username?: string | null;
  onLogout: () => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ username, onLogout }) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <Typography.Text style={{ fontSize: 18, fontWeight: 500 }}>
          Welcome, {username}
        </Typography.Text>
        <Button onClick={onLogout} type="link" danger style={{ height: 32, padding: '0 16px' }}>
          Logout
        </Button>
      </div>
    </Space>
  );
};
