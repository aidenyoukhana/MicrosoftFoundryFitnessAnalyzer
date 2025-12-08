import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {colors, spacing, borderRadius, typography, shadows} from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({children, style, noPadding}) => {
  return (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  color?: string;
  icon?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  color = colors.primary,
}) => {
  return (
    <Card style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={[styles.metricValue, {color}]}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </Card>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
  },
  noPadding: {
    padding: 0,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    margin: spacing.xs,
  },
  metricTitle: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  metricValue: {
    ...typography.title,
    fontSize: 32,
  },
  metricUnit: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  metricSubtitle: {
    ...typography.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: spacing.xs / 2,
  },
  sectionSubtitle: {
    ...typography.caption,
  },
});
