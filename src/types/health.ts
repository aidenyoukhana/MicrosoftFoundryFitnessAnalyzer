// Health data types
export interface Workout {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in minutes
  calories: number;
  distance?: number; // in km
  heartRate?: {
    min: number;
    max: number;
    avg: number;
  };
}

export interface SleepData {
  id: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number;
  lightSleep: number;
  remSleep: number;
  awake: number;
}

export interface HeartRateData {
  timestamp: Date;
  value: number;
}

export interface CalorieData {
  date: Date;
  active: number;
  resting: number;
  total: number;
}

export interface TrendData {
  date: string;
  value: number;
  label?: string;
}

export interface WorkoutLoadData {
  date: string;
  load: number;
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
}

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'sleep' | 'nutrition' | 'recovery' | 'general';
  priority: 'low' | 'medium' | 'high';
  date: Date;
}

export interface DashboardMetrics {
  todayCalories: number;
  weeklyWorkouts: number;
  avgHeartRate: number;
  lastNightSleep: number;
  workoutStreak: number;
  weeklyWorkoutLoad: number;
}
