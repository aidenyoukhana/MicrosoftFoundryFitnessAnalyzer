import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {colors, spacing, typography} from '../theme';
import {Card, SectionHeader} from '../components/Card';
import {HealthService} from '../services/HealthService';

const screenWidth = Dimensions.get('window').width;

const TrendsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [caloriesTrend, setCaloriesTrend] = useState<number[]>([]);
  const [workoutLoadTrend, setWorkoutLoadTrend] = useState<number[]>([]);
  const [weekLabels, setWeekLabels] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const [caloriesData, workoutLoad] = await Promise.all([
        HealthService.getCalorieData(14),
        HealthService.getWorkoutLoad(14),
      ]);

      // Process data for trends
      const calories = caloriesData.map((c) => c.active);
      const loads = workoutLoad.map((w) => w.load);

      // Generate week labels
      const labels = caloriesData
        .map((c) => {
          const date = new Date(c.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        })
        .filter((_, i) => i % 2 === 0); // Show every other day

      setCaloriesTrend(calories);
      setWorkoutLoadTrend(loads);
      setWeekLabels(labels);
    } catch (error) {
      console.error('Error loading trends:', error);
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

  // Calculate trend statistics
  const avgCalories =
    caloriesTrend.length > 0
      ? Math.round(
          caloriesTrend.reduce((sum, c) => sum + c, 0) / caloriesTrend.length
        )
      : 0;

  const avgWorkoutLoad =
    workoutLoadTrend.length > 0
      ? Math.round(
          workoutLoadTrend.reduce((sum, w) => sum + w, 0) /
            workoutLoadTrend.length
        )
      : 0;

  const maxCalories = caloriesTrend.length > 0 ? Math.max(...caloriesTrend) : 0;
  const maxWorkoutLoad =
    workoutLoadTrend.length > 0 ? Math.max(...workoutLoadTrend) : 0;

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
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg Daily Calories</Text>
          <Text style={styles.summaryValue}>{avgCalories}</Text>
          <Text style={styles.summaryUnit}>kcal/day</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg Workout Load</Text>
          <Text style={styles.summaryValue}>{avgWorkoutLoad}</Text>
          <Text style={styles.summaryUnit}>per day</Text>
        </Card>
      </View>

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Peak Calories</Text>
          <Text style={styles.summaryValue}>{maxCalories}</Text>
          <Text style={styles.summaryUnit}>kcal</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Peak Load</Text>
          <Text style={styles.summaryValue}>{maxWorkoutLoad}</Text>
          <Text style={styles.summaryUnit}>highest</Text>
        </Card>
      </View>

      {/* Calories Trend */}
      {caloriesTrend.length > 0 && (
        <>
          <SectionHeader
            title="Active Calories Trend"
            subtitle="Last 14 days"
          />
          <Card noPadding style={styles.chartCard}>
            <LineChart
              data={{
                labels: weekLabels,
                datasets: [{data: caloriesTrend}],
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
                color: (opacity = 1) => `rgba(255, 159, 10, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: colors.chartOrange,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: colors.border,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card>
        </>
      )}

      {/* Workout Load Trend */}
      {workoutLoadTrend.length > 0 && (
        <>
          <SectionHeader title="Workout Load Trend" subtitle="Last 14 days" />
          <Card noPadding style={styles.chartCard}>
            <BarChart
              data={{
                labels: weekLabels,
                datasets: [{data: workoutLoadTrend}],
              }}
              width={screenWidth - 2 * spacing.md}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(191, 90, 242, ${opacity})`,
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

      {/* Combined Trend Analysis */}
      <SectionHeader title="Trend Analysis" subtitle="Performance insights" />
      <Card style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>📊 Overall Performance</Text>
        <Text style={styles.analysisText}>
          {avgCalories > 400
            ? 'Your activity level is excellent! You\'re consistently burning calories through workouts.'
            : avgCalories > 250
            ? 'Good activity level. Consider increasing intensity for better results.'
            : 'Try to increase your daily activity to burn more calories.'}
        </Text>
      </Card>

      <Card style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>💪 Workout Intensity</Text>
        <Text style={styles.analysisText}>
          {avgWorkoutLoad > 80
            ? 'Your workout intensity is high. Great job! Make sure to include recovery days.'
            : avgWorkoutLoad > 50
            ? 'Moderate workout intensity. You can gradually increase the load for better gains.'
            : 'Consider increasing workout intensity to see better results.'}
        </Text>
      </Card>

      <Card style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>📈 Progress Trajectory</Text>
        <Text style={styles.analysisText}>
          {caloriesTrend[caloriesTrend.length - 1] >
          caloriesTrend[caloriesTrend.length - 7]
            ? 'Your recent activity is trending upward! Keep up the momentum.'
            : 'Your activity has decreased recently. Try to stay consistent with your routine.'}
        </Text>
      </Card>

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
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.title,
    fontSize: 28,
    color: colors.primary,
    marginBottom: spacing.xs / 2,
  },
  summaryUnit: {
    ...typography.small,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  analysisCard: {
    marginBottom: spacing.md,
  },
  analysisTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  analysisText: {
    ...typography.body,
    lineHeight: 22,
  },
  footer: {
    height: spacing.xl,
  },
});

export default TrendsScreen;
