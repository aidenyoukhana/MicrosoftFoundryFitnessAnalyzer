import {Platform} from 'react-native';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import {
  Workout,
  SleepData,
  HeartRateData,
  CalorieData,
  WorkoutLoadData,
} from '../types/health';

// Mock data generator for development and Android
class MockHealthService {
  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async getWorkouts(days: number = 7): Promise<Workout[]> {
    const workouts: Workout[] = [];
    const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Strength'];
    
    for (let i = 0; i < days * 2; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(i / 2));
      date.setHours(Math.floor(Math.random() * 12) + 6);
      
      const duration = Math.floor(Math.random() * 60) + 20;
      const endDate = new Date(date);
      endDate.setMinutes(endDate.getMinutes() + duration);
      
      workouts.push({
        id: `workout-${i}`,
        type: workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
        startDate: date,
        endDate: endDate,
        duration,
        calories: Math.floor(Math.random() * 400) + 150,
        distance: Math.random() * 10 + 2,
        heartRate: {
          min: Math.floor(Math.random() * 30) + 60,
          max: Math.floor(Math.random() * 40) + 140,
          avg: Math.floor(Math.random() * 35) + 120,
        },
      });
    }
    
    return workouts.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async getSleepData(days: number = 7): Promise<SleepData[]> {
    const sleepData: SleepData[] = [];
    const qualities: Array<'poor' | 'fair' | 'good' | 'excellent'> = ['poor', 'fair', 'good', 'excellent'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(22, 0, 0, 0);
      
      const duration = Math.random() * 3 + 6; // 6-9 hours
      const endDate = new Date(date);
      endDate.setHours(endDate.getHours() + duration);
      
      const deepSleep = duration * 0.2;
      const remSleep = duration * 0.25;
      const lightSleep = duration * 0.5;
      const awake = duration * 0.05;
      
      sleepData.push({
        id: `sleep-${i}`,
        startDate: date,
        endDate: endDate,
        duration,
        quality: qualities[Math.floor(Math.random() * qualities.length)],
        deepSleep,
        lightSleep,
        remSleep,
        awake,
      });
    }
    
    return sleepData;
  }

  async getHeartRateData(hours: number = 24): Promise<HeartRateData[]> {
    const data: HeartRateData[] = [];
    const now = new Date();
    
    for (let i = 0; i < hours * 4; i++) {
      const timestamp = new Date(now);
      timestamp.setMinutes(timestamp.getMinutes() - i * 15);
      
      data.push({
        timestamp,
        value: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
      });
    }
    
    return data.reverse();
  }

  async getCalorieData(days: number = 7): Promise<CalorieData[]> {
    const data: CalorieData[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const active = Math.floor(Math.random() * 500) + 300;
      const resting = Math.floor(Math.random() * 500) + 1500;
      
      data.push({
        date,
        active,
        resting,
        total: active + resting,
      });
    }
    
    return data.reverse();
  }

  async getWorkoutLoad(days: number = 7): Promise<WorkoutLoadData[]> {
    const data: WorkoutLoadData[] = [];
    const intensities: Array<'low' | 'moderate' | 'high' | 'extreme'> = [
      'low',
      'moderate',
      'high',
      'extreme',
    ];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        load: Math.floor(Math.random() * 100) + 50,
        intensity: intensities[Math.floor(Math.random() * intensities.length)],
      });
    }
    
    return data.reverse();
  }
}

class IOSHealthService extends MockHealthService {
  private permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.BasalEnergyBurned,
        AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        AppleHealthKit.Constants.Permissions.Steps,
      ],
      write: [],
    },
  };

  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      AppleHealthKit.initHealthKit(this.permissions, (error: string) => {
        if (error) {
          console.log('[HealthKit] Permission Error:', error);
          resolve(false);
        } else {
          console.log('[HealthKit] Permissions granted');
          resolve(true);
        }
      });
    });
  }

  // iOS implementation would use AppleHealthKit methods
  // For now, using mock data as fallback
}

// Export appropriate service based on platform
export const HealthService = Platform.OS === 'ios'
  ? new IOSHealthService()
  : new MockHealthService();
