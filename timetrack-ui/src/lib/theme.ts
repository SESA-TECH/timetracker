import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    // Colors
    colorPrimary: '#3B82F6', // Vibrant blue
    colorSuccess: '#10B981', // Rich green
    colorError: '#EF4444',   // Bright red
    colorWarning: '#F59E0B', // Warm amber
    colorInfo: '#6366F1',    // Indigo

    // Base colors
    colorBgContainer: '#FFFFFF',
    colorText: '#111827',    // Almost black for better readability
    colorTextSecondary: '#374151', // Darker secondary text
    colorPrimaryText: '#FFFFFF',    // White text for primary backgrounds

    // Border radius
    borderRadius: 8,

    // Font
    fontFamily: 'var(--font-sans)',
    fontSize: 16,

    // Spacing
    padding: 16,
    margin: 16,
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingContentHorizontal: 24,
      borderRadius: 8,
      primaryColor: '#3B82F6',
      colorPrimaryText: '#FFFFFF',
    },
    Input: {
      controlHeight: 40,
      paddingContentHorizontal: 16,
      borderRadius: 8,
      activeShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
    Card: {
      padding: 24,
      borderRadius: 12,
    },
    Typography: {
      colorText: '#111827',          // Almost black
      colorTextSecondary: '#374151', // Darker gray
      colorTextTertiary: '#4B5563',  // Medium gray
    },
  },
};
