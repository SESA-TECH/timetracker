import dayjs from 'dayjs';
import { apiClient } from './base';
import { TimeLog, TimeLogStatus, TimeLogCreateData } from '../types/timeLogs';

export const TimeLogService = {
  async getLogs(): Promise<TimeLog[]> {
    const response = await apiClient.get('/timelogs/');
    return response.data.results || response.data;
  },

  async getPaginatedLogs(page: number = 1, pageSize: number = 10, search: string = ''): Promise<{
    results: TimeLog[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    const response = await apiClient.get('/timelogs/', {
      params: {
        page,
        page_size: pageSize,
        search
      }
    });
    return response.data;
  },

  async createLog(logData: TimeLogCreateData): Promise<TimeLog> {
    const formattedData = {
      description: logData.description,
      status: logData.status || TimeLogStatus.CREATED,
      start_time: logData.start_time || this.formatDateForBackend(dayjs()),
      duration: logData.duration
    };
    const response = await apiClient.post('/timelogs/start_new/', formattedData);
    return response.data;
  },

  async startTimer(timeLogId: string): Promise<TimeLog> {
    const response = await apiClient.post(`/timelogs/${timeLogId}/start/`, {
      start_time: this.formatDateForBackend(dayjs())
    });
    return response.data;
  },

  async pauseTimer(timeLogId: string): Promise<TimeLog> {
    const response = await apiClient.post(`/timelogs/${timeLogId}/pause/`, {
      pause_time: this.formatDateForBackend(dayjs())
    });
    return response.data;
  },

  async resumeTimer(timeLogId: string): Promise<TimeLog> {
    const response = await apiClient.post(`/timelogs/${timeLogId}/resume/`, {
      resume_time: this.formatDateForBackend(dayjs())
    });
    return response.data;
  },

  async completeTimer(timeLogId: string): Promise<TimeLog> {
    const response = await apiClient.post(`/timelogs/${timeLogId}/stop/`, {
      end_time: this.formatDateForBackend(dayjs())
    });
    return response.data;
  },

  async deleteLog(id: string): Promise<void> {
    await apiClient.delete(`/timelogs/${id}/`);
  },

  // Helper method to format date for backend (timezone-naive format)
  formatDateForBackend(date: dayjs.Dayjs): string {
    // Format as 'YYYY-MM-DD HH:mm:ss' without timezone
    return date.format('YYYY-MM-DD HH:mm:ss');
  },

  formatDuration(duration: string): string {
    const parts = duration.split(':');
    return parts.length === 3 
      ? parts.map(p => p.padStart(2, '0')).join(':') 
      : '00:00:00';
  },

  calculateActiveDuration(log: TimeLog): string {
    if (!log.start_time) return '00:00:00';

    const startTime = dayjs(log.start_time);
    const endTime = log.end_time ? dayjs(log.end_time) : dayjs();
    const pausedDuration = log.paused_duration 
      ? this.parseDuration(log.paused_duration) 
      : 0;

    const totalSeconds = Math.max(0, endTime.diff(startTime, 'second') - pausedDuration);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },

  parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }
};
