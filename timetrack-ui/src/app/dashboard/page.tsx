"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout, Row, Col, message, Input, Card, Typography, Space, Radio } from 'antd';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/context';
import { TimeLogService } from '@/lib/services/timeLogs';
import { TimeLog, TimeLogStatus } from '@/lib/types/timeLogs';
import { ActiveTimerForm } from './components/ActiveTimerForm';
import { TimerDisplay } from './components/TimerDisplay';
import { TimeLogsTable } from './components/TimeLogsTable';
import { UserHeader } from './components/UserHeader';
import { ManualLogForm } from './components/ManualLogForm';
import { Dayjs } from 'dayjs';

const { Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'timer' | 'manual'>('timer');
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [activeTimer, setActiveTimer] = useState<TimeLog | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const fetchPaginatedLogs = useCallback(async (page: number = 1, pageSize: number = 10, search: string = '') => {
    try {
      const response = await TimeLogService.getPaginatedLogs(page, pageSize, search);
      setTimeLogs(response.results);
      setTotalLogs(response.count);
      setCurrentPage(page);
      setPageSize(pageSize);
    } catch (error) {
      message.error('Failed to fetch time logs');
      console.error(error);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchPaginatedLogs(1, pageSize, value);
    }, 300);
  };

  useEffect(() => {
    fetchPaginatedLogs(1, 10);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [fetchPaginatedLogs]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (timerRunning && activeTimer) {
      if (elapsedTime === 0) {
        setTotalPausedTime(0);
      }
      
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerRunning, activeTimer]);

  const startTimer = async (values: { description: string }) => {
    try {
      const newTimeLog = await TimeLogService.createLog({ 
        description: values.description
      });
      
      setActiveTimer(newTimeLog);
      setTimeLogs(prev => [newTimeLog, ...prev]);
      setTimerRunning(true);
      message.success('Timer started');
    } catch (error) {
      message.error('Failed to start timer');
      console.error(error);
    }
  };

  const pauseTimer = async () => {
    if (!activeTimer) return;

    try {
      setPauseStartTime(Date.now());
      setTimerRunning(false);
      message.info('Timer paused');
    } catch (error) {
      message.error('Failed to pause timer');
      console.error(error);
    }
  };

  const resumeTimer = async () => {
    if (!activeTimer || pauseStartTime === null) return;

    try {
      const pausedDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
      setTotalPausedTime(prev => prev + pausedDuration);
      
      setPauseStartTime(null);
      setTimerRunning(true);
      message.success('Timer resumed');
    } catch (error) {
      message.error('Failed to resume timer');
      console.error(error);
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;

    try {
      if (pauseStartTime !== null) {
        const pausedDuration = Math.floor((Date.now() - pauseStartTime) / 1000);
        setTotalPausedTime(prev => prev + pausedDuration);
      }

      const completedLog = await TimeLogService.completeTimer(activeTimer.id!);

      setTimeLogs(prev => 
        prev.map(log => log.id === completedLog.id ? completedLog : log)
      );
      setActiveTimer(null);
      setTimerRunning(false);
      setElapsedTime(0);
      setTotalPausedTime(0);
      setPauseStartTime(null);
      message.success('Timer stopped');
    } catch (error) {
      message.error('Failed to stop timer');
      console.error(error);
    }
  };

  const submitManualLog = async (values: { 
    description: string, 
    start_date: Dayjs, 
    start_time: Dayjs, 
    duration: Dayjs 
  }) => {
    try {
      const startDateTime = values.start_date
        .set('hour', values.start_time.hour())
        .set('minute', values.start_time.minute());

      const durationString = values.duration 
        ? `${values.duration.hour().toString().padStart(2, '0')}:${values.duration.minute().toString().padStart(2, '0')}:00`
        : '00:00:00';

      const manualLog = await TimeLogService.createLog({
        description: values.description,
        start_time: startDateTime.toISOString(),
        duration: durationString
      });

      setTimeLogs(prev => [manualLog, ...prev]);
      message.success('Manual time log added');
    } catch (error) {
      message.error('Failed to add manual time log');
      console.error(error);
    }
  };

  const deleteLog = async (id: string) => {
    try {
      await TimeLogService.deleteLog(id);
      
      await fetchPaginatedLogs(currentPage, pageSize, searchTerm);
      
      message.success('Log deleted successfully');
    } catch (error) {
      message.error('Failed to delete log');
      console.error(error);
    }
  };

  return (
    <ProtectedRoute>
      <Layout style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <UserHeader username={user?.username} onLogout={logout} />
        
        <Content style={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          overflow: 'auto' 
        }}>
          <Row gutter={[16, 16]} style={{ flex: 1 }}>
            <Col xs={24} sm={24} md={8} lg={6} xl={6} style={{ 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <Card 
                title="Time Tracking" 
                style={{ 
                  marginBottom: '16px', 
                  width: '100%' 
                }}
              >
                <Radio.Group 
                  value={activeTab} 
                  onChange={(e) => setActiveTab(e.target.value)}
                >
                  <Radio.Button value="timer">Active Timer</Radio.Button>
                  <Radio.Button value="manual">Manual Log</Radio.Button>
                </Radio.Group>
                {activeTab === 'timer' && (
                  <>
                    <ActiveTimerForm onStartTimer={startTimer} />
                    <TimerDisplay 
                      activeTimer={activeTimer}
                      timerRunning={timerRunning}
                      elapsedTime={elapsedTime}
                      formatElapsedTime={formatElapsedTime}
                      onPause={pauseTimer}
                      onResume={resumeTimer}
                      onStop={stopTimer}
                    />
                  </>
                )}
                {activeTab === 'manual' && (
                  <ManualLogForm onSubmitManualLog={submitManualLog} />
                )}
              </Card>
            </Col>
            
            <Col xs={24} sm={24} md={16} lg={18} xl={18} style={{ 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <Card 
                title="Time Logs" 
                style={{ 
                  marginBottom: '16px', 
                  width: '100%' 
              }}>
                <Input 
                  placeholder="Search time logs by description" 
                  allowClear
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ 
                    marginBottom: '16px', 
                    width: '100%' 
                  }}
                />
                <TimeLogsTable
                  timeLogs={timeLogs}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={totalLogs}
                  onPageChange={(page, pageSize) => {
                    fetchPaginatedLogs(page, pageSize, searchTerm);
                  }}
                  onDeleteLog={deleteLog}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </ProtectedRoute>
  );
}
