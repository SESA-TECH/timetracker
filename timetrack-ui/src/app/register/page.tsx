'use client';

import { Button, Form, Input, Typography, Card, Space, message } from 'antd';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MailOutlined, 
  LockOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const onFinish = async (values: { 
    email: string; 
    username: string; 
    password: string; 
    password_confirmation: string 
  }) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        password2: values.password_confirmation
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
          <Text type="secondary">Create your account</Text>
        </Space>

        <Form
          name="register"
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
            name="username"
            label="Username"
            rules={[
              { 
                required: true, 
                message: 'Please input your username' 
              },
              { 
                min: 3, 
                message: 'Username must be at least 3 characters' 
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Choose a username" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { 
                required: true, 
                message: 'Please input your password' 
              },
              { 
                min: 8, 
                message: 'Password must be at least 8 characters' 
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Create a password" 
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { 
                required: true, 
                message: 'Please confirm your password' 
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm your password" 
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Create Account
            </Button>
          </Form.Item>

          <div style={{ 
            textAlign: 'center', 
            marginTop: 16 
          }}>
            <Text>
              Already have an account? {' '}
              <Link href="/login" style={{ color: '#1890ff' }}>
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
