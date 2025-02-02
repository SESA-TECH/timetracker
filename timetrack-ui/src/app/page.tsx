'use client';

import { Button, Card, Space, Typography, Input, Tag, Divider } from 'antd';
import { ClockCircleOutlined, UserOutlined, PlayCircleOutlined, PauseCircleOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 hover:shadow-hover transition-shadow">
          <div className="gradient-primary text-white p-6 -mt-6 -mx-6 mb-6 rounded-t-lg">
            <Title level={2} className="mb-0 text-white">TimeTrack Theme Preview</Title>
          </div>
          
          <Space direction="vertical" size="large" className="w-full">
            {/* Colors Section */}
            <section>
              <Title level={4}>Color Palette</Title>
              <Space wrap>
                <Tag color="blue">Primary</Tag>
                <Tag color="green">Success</Tag>
                <Tag color="red">Error</Tag>
                <Tag color="orange">Warning</Tag>
                <Tag color="purple">Info</Tag>
              </Space>
            </section>

            <Divider />

            {/* Buttons Section */}
            <section>
              <Title level={4}>Buttons</Title>
              <Space wrap>
                <Button type="primary" size="large">Primary Button</Button>
                <Button size="large">Default Button</Button>
                <Button type="dashed" size="large">Dashed Button</Button>
                <Button type="text" size="large">Text Button</Button>
                <Button type="link" size="large">Link Button</Button>
              </Space>
            </section>

            <Divider />

            {/* Input Section */}
            <section>
              <Title level={4}>Input Fields</Title>
              <Space direction="vertical" className="w-full max-w-md">
                <Input size="large" placeholder="Default Input" />
                <Input size="large" prefix={<UserOutlined className="text-primary" />} placeholder="Input with icon" />
                <Input.Password size="large" placeholder="Password input" />
              </Space>
            </section>

            <Divider />

            {/* Timer Preview */}
            <section>
              <Title level={4}>Timer Preview</Title>
              <Card className="gradient-surface hover:shadow-hover transition-all">
                <Space direction="vertical" align="center" className="w-full">
                  <div className="text-6xl text-primary">
                    <ClockCircleOutlined />
                  </div>
                  <Text className="text-3xl font-semibold text-text">00:00:00</Text>
                  <Space size="middle">
                    <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                      Start
                    </Button>
                    <Button size="large" icon={<PauseCircleOutlined />}>
                      Pause
                    </Button>
                    <Button danger size="large" icon={<StopOutlined />}>
                      Stop
                    </Button>
                  </Space>
                </Space>
              </Card>
            </section>
          </Space>
        </Card>
      </div>
    </main>
  );
}
