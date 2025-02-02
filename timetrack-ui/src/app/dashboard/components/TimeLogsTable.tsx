import React from 'react';
import { Table, Popconfirm, Button, Typography, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { TimeLog, TimeLogStatus } from '@/lib/types/timeLogs';
import { TimeLogService } from '@/lib/services/timeLogs';

interface TimeLogsTableProps {
  timeLogs: TimeLog[];
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  onDeleteLog: (id: string) => void;
}

export const TimeLogsTable: React.FC<TimeLogsTableProps> = ({
  timeLogs,
  currentPage,
  pageSize,
  total,
  onPageChange,
  onDeleteLog
}) => {
  return (
    <Table 
      columns={[
        {
          title: 'Description',
          dataIndex: 'description',
          key: 'description',
          responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
          render: (description: string) => (
            <Typography.Text 
              ellipsis={{ 
                tooltip: description 
              }}
            >
              {description}
            </Typography.Text>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          responsive: ['md', 'lg', 'xl'],
          render: (status: TimeLogStatus) => {
            const colorMap = {
              [TimeLogStatus.CREATED]: 'gray',
              [TimeLogStatus.RUNNING]: 'green',
              [TimeLogStatus.PAUSED]: 'orange',
              [TimeLogStatus.COMPLETED]: 'blue'
            };
            return <Tag color={colorMap[status]}>{status}</Tag>;
          }
        },
        {
          title: 'Start Time',
          dataIndex: 'start_time',
          key: 'start_time',
          responsive: ['lg', 'xl'],
          render: (time: string) => time ? dayjs(time).format('YYYY-MM-DD HH:mm') : '-'
        },
        {
          title: 'Duration',
          key: 'formatted_duration',
          responsive: ['sm', 'md', 'lg', 'xl'],
          render: (text: any, record: TimeLog) => {
            return record.formatted_duration || '00:00:00';
          }
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (text: any, record: TimeLog) => (
            <Popconfirm
              title="Delete this log?"
              onConfirm={() => onDeleteLog(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                size="small"
              >
                Delete
              </Button>
            </Popconfirm>
          )
        }
      ]}
      dataSource={timeLogs}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        responsive: true,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        onChange: (page, pageSize) => {
          onPageChange(page, pageSize);
        },
        onShowSizeChange: (current, size) => {
          onPageChange(current, size);
        }
      }}
    />
  );
};
