import React from 'react';
import { Typography, Button, Space, Row, Col } from 'antd';
import { 
  PauseOutlined, 
  PlayCircleOutlined, 
  StopOutlined 
} from '@ant-design/icons';
import { TimeLog } from '@/lib/types/timeLogs';

interface TimerDisplayProps {
  activeTimer: TimeLog | null;
  timerRunning: boolean;
  elapsedTime: number;
  formatElapsedTime: (seconds: number) => string;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  activeTimer,
  timerRunning,
  elapsedTime,
  formatElapsedTime,
  onPause,
  onResume,
  onStop
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px', 
        backgroundColor: activeTimer && timerRunning ? '#f6ffed' : '#f0f0f0', 
        borderRadius: '8px', 
        marginBottom: '16px',
        border: `2px solid ${activeTimer && timerRunning ? '#52c41a' : '#d9d9d9'}`,
        transition: 'all 0.3s ease',
        width: '100%'
      }}
    >
      <Typography.Title 
        level={2} 
        style={{ 
          margin: 0, 
          marginBottom: '16px', 
          color: activeTimer && timerRunning ? '#52c41a' : '#8c8c8c',
          textAlign: 'center',
          fontSize: '2rem'
        }}
      >
        {formatElapsedTime(elapsedTime)}
      </Typography.Title>
      <Typography.Text 
        strong 
        style={{ 
          fontSize: '1rem', 
          marginBottom: '16px', 
          textAlign: 'center',
          color: activeTimer ? 'inherit' : '#8c8c8c',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {activeTimer ? activeTimer.description : 'No active timer'}
      </Typography.Text>
      <Row gutter={[8, 8]} justify="center" style={{ width: '100%' }}>
        {activeTimer && timerRunning ? (
          <Col xs={12} sm={6}>
            <Button 
              type="default" 
              icon={<PauseOutlined />} 
              onClick={onPause}
              block
            >
              Pause
            </Button>
          </Col>
        ) : activeTimer && !timerRunning ? (
          <Col xs={12} sm={6}>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />} 
              onClick={onResume}
              block
            >
              Resume
            </Button>
          </Col>
        ) : null}
        {activeTimer && (
          <Col xs={12} sm={6}>
            <Button 
              type="default" 
              danger 
              icon={<StopOutlined />} 
              onClick={onStop}
              block
            >
              Save
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};
