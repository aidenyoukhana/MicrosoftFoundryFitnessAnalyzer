import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {LineChart, ProgressChart} from 'react-native-chart-kit';
import {colors, spacing, typography} from '../theme';
import {Card, SectionHeader} from '../components/Card';
import {HealthService} from '../services/HealthService';
import {SleepData} from '../types/health';

const screenWidth = Dimensions.get('window').width;

const SleepScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [sleepDurations, setSleepDurations] = useState<number[]>([]);
  const [weekLabels, setWeekLabels] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const data = await HealthService.getSleepData(14);
      setSleepData(data);

      const durations = data.map((s) => s.duration);
      const labels = data
        .map((s) => {
          const date = new Date(s.startDate);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        })
        .filter((_, i) => i % 2 === 0);

      setSleepDurations(durations);
      setWeekLabels(labels);
    } catch (error) {
      console.error('Error loading sleep data:', error);
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

  const avgSleepHours =
    sleepData.length > 0
      ? sleepData.reduce((sum, s) => sum + s.duration, 0) / sleepData.length
      : 0;

  const lastNightSleep = sleepData[0];

  const sleepQualityScore = lastNightSleep
    ? {
        deep: lastNightSleep.deepSleep / lastNightSleep.duration,
        rem: lastNightSleep.remSleep / lastNightSleep.duration,
        light: lastNightSleep.lightSleep / lastNightSleep.duration,
      }
    : {deep: 0, rem: 0, light: 0};

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return colors.chartGreen;
      case 'good':
        return colors.chartBlue;
      case 'fair':
        return colors.chartYellow;
      case 'poor':
        return colors.chartPink;
      default:
        return colors.textSecondary;
    }
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
      {/* Sleep Summary */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg Sleep</Text>
          <Text style={styles.summaryValue}>
            {avgSleepHours.toFixed(1)}
          </Text>
          <Text style={styles.summaryUnit}>hours/night</Text>
        </Card>
        {lastNightSleep && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Last Night</Text>
            <Text style={styles.summaryValue}>
              {lastNightSleep.duration.toFixed(1)}
            </Text>
            <Text style={styles.summaryUnit}>hours</Text>
          </Card>
        )}
      </View>

      {/* Last Night Sleep Details */}
      {lastNightSleep && (
        <>
          <SectionHeader title="Last Night's Sleep" subtitle="Sleep breakdown" />
          <Card>
            <View style={styles.sleepHeader}>
              <View>
                <Text style={styles.sleepTime}>
                  {formatTime(lastNightSleep.startDate)} -{' '}
                  {formatTime(lastNightSleep.endDate)}
                </Text>
                <Text style={styles.sleepDuration}>
                  {lastNightSleep.duration.toFixed(1)} hours
                </Text>
              </View>
              <View
                style={[
                  styles.qualityBadge,
                  {backgroundColor: getQualityColor(lastNightSleep.quality)},
                ]}>
                <Text style={styles.qualityText}>
                  {lastNightSleep.quality.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.sleepStagesContainer}>
              <View style={styles.sleepStage}>
                <View
                  style={[
                    styles.stageIndicator,
                    {backgroundColor: colors.chartPurple},
                  ]}
                />
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>Deep Sleep</Text>
                  <Text style={styles.stageValue}>
                    {lastNightSleep.deepSleep.toFixed(1)}h (
                    {Math.round((sleepQualityScore.deep * 100))}%)
                  </Text>
                </View>
              </View>

              <View style={styles.sleepStage}>
                <View
                  style={[
                    styles.stageIndicator,
                    {backgroundColor: colors.chartBlue},
                  ]}
                />
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>REM Sleep</Text>
                  <Text style={styles.stageValue}>
                    {lastNightSleep.remSleep.toFixed(1)}h (
                    {Math.round((sleepQualityScore.rem * 100))}%)
                  </Text>
                </View>
              </View>

              <View style={styles.sleepStage}>
                <View
                  style={[
                    styles.stageIndicator,
                    {backgroundColor: colors.primary},
                  ]}
                />
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>Light Sleep</Text>
                  <Text style={styles.stageValue}>
                    {lastNightSleep.lightSleep.toFixed(1)}h (
                    {Math.round((sleepQualityScore.light * 100))}%)
                  </Text>
                </View>
              </View>

              <View style={styles.sleepStage}>
                <View
                  style={[
                    styles.stageIndicator,
                    {backgroundColor: colors.chartOrange},
                  ]}
                />
                <View style={styles.stageInfo}>
                  <Text style={styles.stageName}>Awake</Text>
                  <Text style={styles.stageValue}>
                    {lastNightSleep.awake.toFixed(1)}h
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Sleep Quality Distribution */}
          <SectionHeader title="Sleep Quality" subtitle="Stage distribution" />
          <Card noPadding style={styles.chartCard}>
            <ProgressChart
              data={{
                labels: ['Deep', 'REM', 'Light'],
                data: [
                  sleepQualityScore.deep,
                  sleepQualityScore.rem,
                  sleepQualityScore.light,
                ],
                colors: [colors.chartPurple, colors.chartBlue, colors.primary],
              }}
              width={screenWidth - 2 * spacing.md}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 2,
                color: (opacity = 1, index) => {
                  const colorMap = [
                    colors.chartPurple,
                    colors.chartBlue,
                    colors.primary,
                  ];
                  return colorMap[index || 0];
                },
                labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
              }}
              hideLegend={false}
              style={styles.chart}
            />
          </Card>
        </>
      )}

      {/* Sleep Duration Trend */}
      {sleepDurations.length > 0 && (
        <>
          <SectionHeader title="Sleep Duration Trend" subtitle="Last 14 nights" />
          <Card noPadding style={styles.chartCard}>
            <LineChart
              data={{
                labels: weekLabels,
                datasets: [{data: sleepDurations}],
              }}
              width={screenWidth - 2 * spacing.md}
              height={220}
              yAxisLabel=""
              yAxisSuffix="h"
              chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(191, 90, 242, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: colors.chartPurple,
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

      {/* Sleep Tips */}
      <SectionHeader title="Sleep Insights" subtitle="Personalized recommendations" />
      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>💤 Sleep Quality</Text>
        <Text style={styles.tipText}>
          {avgSleepHours >= 7 && avgSleepHours <= 9
            ? 'Excellent! You\'re getting optimal sleep duration. Maintain this schedule for best results.'
            : avgSleepHours < 7
            ? 'You\'re not getting enough sleep. Aim for 7-9 hours per night for optimal recovery and health.'
            : 'You might be oversleeping. Most adults need 7-9 hours. Consider adjusting your schedule.'}
        </Text>
      </Card>

      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>🌙 Deep Sleep</Text>
        <Text style={styles.tipText}>
          {lastNightSleep && sleepQualityScore.deep >= 0.15
            ? 'Great deep sleep! This is when your body recovers and repairs. Keep up your routine.'
            : 'Try to increase deep sleep by maintaining a cool room temperature and avoiding screens before bed.'}
        </Text>
      </Card>

      <Card style={styles.tipCard}>
        <Text style={styles.tipTitle}>⏰ Consistency</Text>
        <Text style={styles.tipText}>
          Maintain a consistent sleep schedule. Go to bed and wake up at the same
          time every day to improve sleep quality.
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
    fontSize: 32,
    color: colors.chartPurple,
    marginBottom: spacing.xs / 2,
  },
  summaryUnit: {
    ...typography.small,
  },
  sleepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sleepTime: {
    ...typography.body,
    marginBottom: spacing.xs / 2,
  },
  sleepDuration: {
    ...typography.caption,
  },
  qualityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  qualityText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 12,
  },
  sleepStagesContainer: {
    gap: spacing.md,
  },
  sleepStage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  stageInfo: {
    flex: 1,
  },
  stageName: {
    ...typography.body,
    marginBottom: spacing.xs / 2,
  },
  stageValue: {
    ...typography.caption,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: 16,
  },
  tipCard: {
    marginBottom: spacing.md,
  },
  tipTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body,
    lineHeight: 22,
  },
  footer: {
    height: spacing.xl,
  },
});

export default SleepScreen;
