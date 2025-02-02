import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

interface ManualLogFormProps {
  onSubmitManualLog: (values: {
    description: string, 
    start_date: Dayjs, 
    start_time: Dayjs, 
    duration: Dayjs
  }) => void;
}

export const ManualLogForm: React.FC<ManualLogFormProps> = ({ onSubmitManualLog }) => {
  const [form] = Form.useForm();

  return (
    <Form 
      form={form} 
      layout="vertical"
      onFinish={onSubmitManualLog}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item 
            name="description" 
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input 
              placeholder="What did you work on?" 
              prefix={<EditOutlined />} 
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="start_date" 
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item 
            name="start_time" 
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <TimePicker 
              format="HH:mm" 
              style={{ width: '100%' }} 
              placeholder="Start Time" 
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item 
            name="duration" 
            label="Duration"
            rules={[{ required: true, message: 'Please select duration' }]}
          >
            <TimePicker 
              format="HH:mm" 
              placeholder="Select Duration" 
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
              icon={<SaveOutlined />}
            >
              Log Time
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
