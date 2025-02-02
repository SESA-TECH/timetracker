'use client';

import { Inter } from 'next/font/google';
import { App as AntdApp } from 'antd';
import { AuthProvider } from '@/lib/auth/context';
import { NotificationProvider } from '@/lib/providers/notification';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <AntdApp>
            <NotificationProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </NotificationProvider>
          </AntdApp>
        </AntdRegistry>
      </body>
    </html>
  );
}
