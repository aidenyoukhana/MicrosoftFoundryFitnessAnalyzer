import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {colors, spacing, typography} from '../theme';
import {Card, MetricCard, SectionHeader} from '../components/Card';
import {HealthService} from '../services/HealthService';
import {AIService} from '../services/AIService';
import {DashboardMetrics, HealthTip, Workout, SleepData} from '../types/health';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    todayCalories: 0,
    weeklyWorkouts: 0,
    avgHeartRate: 0,
    lastNightSleep: 0,
    workoutStreak: 0,
    weeklyWorkoutLoad: 0,
  });
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [heartRateData, setHeartRateData] = useState<number[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [recentSleep, setRecentSleep] = useState<SleepData[]>([]);

  const loadData = async () => {
    try {
      // Request HealthKit permissions
      await HealthService.requestPermissions();

      // Fetch data
      const [workouts, sleepData, heartRate, calories, workoutLoad] =
        await Promise.all([
          HealthService.getWorkouts(7),
          HealthService.getSleepData(7),
          HealthService.getHeartRateData(24),
          HealthService.getCalorieData(7),
          HealthService.getWorkoutLoad(7),
        ]);

      setRecentWorkouts(workouts);
      setRecentSleep(sleepData);

      // Calculate metrics
      const todayCalories = calories[calories.length - 1]?.active || 0;
      const avgHeartRate =
        heartRate.reduce((sum, hr) => sum + hr.value, 0) / heartRate.length;
      const lastNightSleep = sleepData[0]?.duration || 0;
      const weeklyWorkoutLoadTotal = workoutLoad.reduce(
        (sum, w) => sum + w.load,
        0
      );

      // Calculate workout streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const hasWorkout = workouts.some((w) => {
          const wDate = new Date(w.startDate);
          wDate.setHours(0, 0, 0, 0);
          return wDate.getTime() === checkDate.getTime();
        });
        if (hasWorkout) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }

      const dashboardMetrics: DashboardMetrics = {
        todayCalories: Math.round(todayCalories),
        weeklyWorkouts: workouts.length,
        avgHeartRate: Math.round(avgHeartRate),
        lastNightSleep,
        workoutStreak: streak,
        weeklyWorkoutLoad: Math.round(weeklyWorkoutLoadTotal / 7),
      };

      setMetrics(dashboardMetrics);

      // Set heart rate data for chart
      const recentHeartRates = heartRate
        .slice(-12)
        .map((hr) => hr.value);
      setHeartRateData(recentHeartRates);

      // Generate AI tips
      const generatedTips = await AIService.generateTips(
        dashboardMetrics,
        workouts,
        sleepData
      );
      setTips(generatedTips);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Your fitness overview</Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Today's Calories"
          value={metrics.todayCalories}
          unit="kcal"
          color={colors.chartOrange}
        />
        <MetricCard
          title="Weekly Workouts"
          value={metrics.weeklyWorkouts}
          color={colors.chartBlue}
        />
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          title="Avg Heart Rate"
          value={metrics.avgHeartRate}
          unit="bpm"
          color={colors.chartPink}
        />
        <MetricCard
          title="Last Night Sleep"
          value={metrics.lastNightSleep.toFixed(1)}
          unit="hrs"
          color={colors.chartPurple}
        />
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          title="Workout Streak"
          value={metrics.workoutStreak}
          unit="days"
          subtitle="Keep it up!"
          color={colors.chartGreen}
        />
        <MetricCard
          title="Weekly Load"
          value={metrics.weeklyWorkoutLoad}
          subtitle="Avg daily"
          color={colors.chartYellow}
        />
      </View>

      {/* Heart Rate Chart */}
      {heartRateData.length > 0 && (
        <>
          <SectionHeader title="Heart Rate" subtitle="Last 12 readings" />
          <Card noPadding>
            <LineChart
              data={{
                labels: [],
                datasets: [{data: heartRateData}],
              }}
              width={screenWidth - 2 * spacing.md}
              height={200}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: colors.primary,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        </>
      )}

      {/* AI-Generated Tips */}
      <SectionHeader title="Personalized Tips" subtitle="AI-powered insights" />
      {tips.map((tip) => (
        <Card key={tip.id} style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    tip.priority === 'high'
                      ? colors.error
                      : tip.priority === 'medium'
                      ? colors.warning
                      : colors.success,
                },
              ]}>
              <Text style={styles.priorityText}>
                {tip.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.tipDescription}>{tip.description}</Text>
          <Text style={styles.tipCategory}>
            Category: {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}
          </Text>
        </Card>
      ))}

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md - spacing.xs,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  tipCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipTitle: {
    ...typography.subheading,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
  },
  priorityText: {
    ...typography.small,
    color: colors.text,
    fontWeight: '600',
    fontSize: 10,
  },
  tipDescription: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  tipCategory: {
    ...typography.small,
  },
  footer: {
    height: spacing.xl,
  },
});

export default DashboardScreen;
