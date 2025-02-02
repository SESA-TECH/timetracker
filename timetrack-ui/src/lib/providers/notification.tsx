'use client';

import { App } from 'antd';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <App>
      {children}
    </App>
  );
}
