export enum TimeLogStatus {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface TimeLog {
  id: string;
  description: string;
  status: TimeLogStatus;
  start_time: string | null;
  end_time: string | null;
  duration: string;
  paused_duration: string;
  duration_minutes: number;
  formatted_duration: string;
  total_duration: string;
  status_display: string;
  created_at: string;
  new_duration?: string;
  new_status?: string;
}

export interface TimeLogCreateData {
  description: string;
  status?: TimeLogStatus;
  start_time?: string;
  duration?: string;
  end_time?: string;
}
