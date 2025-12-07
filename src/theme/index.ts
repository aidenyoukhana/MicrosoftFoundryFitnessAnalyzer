// Dark theme colors and styles
export const colors = {
  // Dark mode colors
  background: '#000000',
  surface: '#1C1C1E',
  card: '#2C2C2E',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#BF5AF2',
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  
  // Chart colors
  chartBlue: '#0A84FF',
  chartPurple: '#BF5AF2',
  chartPink: '#FF2D55',
  chartOrange: '#FF9F0A',
  chartGreen: '#32D74B',
  chartYellow: '#FFD60A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: colors.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 8,
  },
};
