// Modern Color Palette for MindScribe AI
export const colors = {
  // Primary Brand Colors - Purple & Blue Gradient Theme
  primary: {
    50: '#f0f4ff',
    100: '#e0eaff',
    200: '#c7d7fe',
    300: '#a5bcfc',
    400: '#8195f8',
    500: '#6366f1', // Main brand color
    600: '#5048e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Secondary Colors - Teal & Cyan
  secondary: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  
  // Accent Colors - Warm Gradients
  accent: {
    pink: '#f472b6',
    purple: '#a855f7',
    orange: '#fb923c',
    yellow: '#fbbf24',
  },
  
  // Semantic Colors
  success: {
    light: '#d1fae5',
    main: '#10b981',
    dark: '#047857',
  },
  
  warning: {
    light: '#fef3c7',
    main: '#f59e0b',
    dark: '#d97706',
  },
  
  error: {
    light: '#fee2e2',
    main: '#ef4444',
    dark: '#dc2626',
  },
  
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Glass Effects
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Background Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    cool: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }
};

// Updated Mood Rating Colors with better progression
export const moodRatingColors: { [key: number]: string } = {
  1: '#ef4444', // Red - Very sad
  2: '#f97316', // Orange - Sad
  3: '#eab308', // Yellow - Neutral
  4: '#22c55e', // Green - Happy
  5: '#10b981', // Emerald - Very happy
};

// Emotion Colors for better visualization
export const emotionColors = {
  joy: '#fbbf24',
  sadness: '#3b82f6',
  anger: '#ef4444',
  fear: '#8b5cf6',
  surprise: '#f59e0b',
  disgust: '#84cc16',
  anticipation: '#06b6d4',
  trust: '#10b981',
};

// Chart Colors for Analytics
export const chartColors = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#84cc16', '#f97316', '#3b82f6'
];

export default colors;