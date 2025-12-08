import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {BarChart, PieChart} from 'react-native-chart-kit';
import {colors, spacing, typography} from '../theme';
import {Card, SectionHeader} from '../components/Card';
import {HealthService} from '../services/HealthService';
import {Workout} from '../types/health';

const screenWidth = Dimensions.get('window').width;

const WorkoutsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weeklyCalories, setWeeklyCalories] = useState<number[]>([]);

  const loadData = async () => {
    try {
      const workoutData = await HealthService.getWorkouts(30);
      setWorkouts(workoutData);

      // Calculate weekly calories
      const last7Days = workoutData.slice(0, 7);
      const caloriesByDay: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const dayCalories = last7Days
          .filter((w) => {
            const wDate = new Date(w.startDate);
            wDate.setHours(0, 0, 0, 0);
            return wDate.getTime() === date.getTime();
          })
          .reduce((sum, w) => sum + w.calories, 0);

        caloriesByDay.push(dayCalories);
      }
      setWeeklyCalories(caloriesByDay);
    } catch (error) {
      console.error('Error loading workouts:', error);
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

  // Calculate workout type distribution
  const workoutTypeCount: {[key: string]: number} = {};
  workouts.forEach((w) => {
    workoutTypeCount[w.type] = (workoutTypeCount[w.type] || 0) + 1;
  });

  const pieChartData = Object.entries(workoutTypeCount).map(
    ([type, count], index) => ({
      name: type,
      count,
      color: [
        colors.chartBlue,
        colors.chartPurple,
        colors.chartPink,
        colors.chartOrange,
        colors.chartGreen,
        colors.chartYellow,
      ][index % 6],
      legendFontColor: colors.textSecondary,
      legendFontSize: 12,
    })
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
      {/* Weekly Calories Chart */}
      {weeklyCalories.length > 0 && weeklyCalories.some((c) => c > 0) && (
        <>
          <SectionHeader
            title="Weekly Calories Burned"
            subtitle="Last 7 days"
          />
          <Card noPadding style={styles.chartCard}>
            <BarChart
              data={{
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{data: weeklyCalories}],
              }}
              width={screenWidth - 2 * spacing.md}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" cal"
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
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: colors.border,
                },
              }}
              style={styles.chart}
            />
          </Card>
        </>
      )}

      {/* Workout Type Distribution */}
      {pieChartData.length > 0 && (
        <>
          <SectionHeader
            title="Workout Distribution"
            subtitle="By activity type"
          />
          <Card noPadding style={styles.chartCard}>
            <PieChart
              data={pieChartData}
              width={screenWidth - 2 * spacing.md}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </Card>
        </>
      )}

      {/* Workout List */}
      <SectionHeader title="Recent Workouts" subtitle={`${workouts.length} activities`} />
      {workouts.map((workout) => (
        <Card key={workout.id} style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <View style={styles.workoutTypeContainer}>
              <Text style={styles.workoutType}>{workout.type}</Text>
              <Text style={styles.workoutDate}>
                {formatDate(workout.startDate)}
              </Text>
            </View>
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>{workout.calories}</Text>
              <Text style={styles.caloriesLabel}>kcal</Text>
            </View>
          </View>

          <View style={styles.workoutStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {formatDuration(workout.duration)}
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>

            {workout.distance && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {workout.distance.toFixed(2)} km
                </Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
            )}

            {workout.heartRate && (
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {workout.heartRate.avg} bpm
                </Text>
                <Text style={styles.statLabel}>Avg Heart Rate</Text>
              </View>
            )}
          </View>

          {workout.heartRate && (
            <View style={styles.heartRateRange}>
              <Text style={styles.heartRateRangeText}>
                HR Range: {workout.heartRate.min} - {workout.heartRate.max} bpm
              </Text>
            </View>
          )}
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
    padding: spacing.md,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  workoutCard: {
    marginBottom: spacing.md,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  workoutTypeContainer: {
    flex: 1,
  },
  workoutType: {
    ...typography.subheading,
    marginBottom: spacing.xs / 2,
  },
  workoutDate: {
    ...typography.caption,
  },
  caloriesBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  caloriesText: {
    ...typography.heading,
    fontSize: 20,
  },
  caloriesLabel: {
    ...typography.small,
    fontSize: 10,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  stat: {
    flex: 1,
  },
  statValue: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  statLabel: {
    ...typography.small,
  },
  heartRateRange: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heartRateRangeText: {
    ...typography.caption,
  },
  footer: {
    height: spacing.xl,
  },
});

export default WorkoutsScreen;
