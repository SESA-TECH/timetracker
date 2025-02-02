'use client';

import { Button, Card, Form, Input, Typography, Space } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password
      });
      router.push('/dashboard');
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>TimeTrack</Title>
          <Text type="secondary">Sign in to continue</Text>
        </Space>

        <Form
          name="login"
          layout="vertical"
          style={{ marginTop: 24 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { 
                required: true, 
                message: 'Please input your email' 
              },
              { 
                type: 'email', 
                message: 'Please enter a valid email' 
              }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter your email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ 
              required: true, 
              message: 'Please input your password' 
            }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Enter your password" 
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>

          <div style={{ 
            textAlign: 'center', 
            marginTop: 16 
          }}>
            <Text>
              Don't have an account? {' '}
              <Link href="/register" style={{ color: '#1890ff' }}>
                Register here
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
