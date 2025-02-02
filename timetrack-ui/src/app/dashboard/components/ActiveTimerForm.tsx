import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

interface ActiveTimerFormProps {
  onStartTimer: (values: { description: string }) => void;
}

export const ActiveTimerForm: React.FC<ActiveTimerFormProps> = ({ onStartTimer }) => {
  const [form] = Form.useForm();

  return (
    <Form 
      form={form} 
      layout="vertical"
      onFinish={onStartTimer}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input 
              placeholder="What are you working on?" 
              prefix={<ClockCircleOutlined />} 
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              icon={<PlayCircleOutlined />}
            >
              Start Timer
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
