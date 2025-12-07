import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {colors, spacing, typography} from '../theme';
import {Card, SectionHeader} from '../components/Card';
import {HealthService} from '../services/HealthService';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const handleHealthKitPermissions = async () => {
    const granted = await HealthService.requestPermissions();
    if (granted) {
      Alert.alert(
        'Success',
        'HealthKit permissions granted. You can now sync your health data.'
      );
    } else {
      Alert.alert(
        'Error',
        'Failed to grant HealthKit permissions. Please check your iOS Settings.'
      );
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your health data will be exported as a CSV file.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Export',
          onPress: () => {
            Alert.alert('Success', 'Data exported successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences</Text>
      </View>

      {/* App Settings */}
      <SectionHeader title="App Settings" />
      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme throughout the app
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{false: colors.border, true: colors.primary}}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive workout reminders and health tips
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{false: colors.border, true: colors.primary}}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Sync</Text>
            <Text style={styles.settingDescription}>
              Automatically sync data from HealthKit
            </Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{false: colors.border, true: colors.primary}}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Weekly Reports</Text>
            <Text style={styles.settingDescription}>
              Get AI-generated weekly fitness summaries
            </Text>
          </View>
          <Switch
            value={weeklyReports}
            onValueChange={setWeeklyReports}
            trackColor={{false: colors.border, true: colors.primary}}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      {/* Health Data */}
      <SectionHeader title="Health Data" />
      <TouchableOpacity onPress={handleHealthKitPermissions}>
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>HealthKit Permissions</Text>
          <Text style={styles.actionDescription}>
            Grant access to read health data from Apple Health
          </Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleExportData}>
        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>Export Data</Text>
          <Text style={styles.actionDescription}>
            Download your health data as CSV
          </Text>
        </Card>
      </TouchableOpacity>

      {/* Azure OpenAI Configuration */}
      <SectionHeader title="AI Features" />
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>🤖 Microsoft Foundry AI</Text>
        <Text style={styles.infoText}>
          This app uses Azure OpenAI to generate personalized health tips and
          insights based on your fitness data.
        </Text>
        <Text style={styles.infoNote}>
          Configure Azure OpenAI credentials in environment variables to enable
          AI-powered features.
        </Text>
      </Card>

      {/* About */}
      <SectionHeader title="About" />
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fitness Analyzer</Text>
        <Text style={styles.infoText}>Version 1.0.0</Text>
        <Text style={styles.infoDescription}>
          A comprehensive fitness tracking app powered by Microsoft Foundry
          Agents and Apple HealthKit. Track workouts, monitor sleep, analyze
          trends, and get AI-powered personalized health recommendations.
        </Text>
      </Card>

      {/* Data Management */}
      <SectionHeader title="Data Management" />
      <TouchableOpacity onPress={handleClearCache}>
        <Card style={[styles.actionCard, styles.dangerCard]}>
          <Text style={[styles.actionTitle, styles.dangerText]}>
            Clear Cache
          </Text>
          <Text style={styles.actionDescription}>
            Remove all cached data from the app
          </Text>
        </Card>
      </TouchableOpacity>

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
  settingCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.subheading,
    marginBottom: spacing.xs / 2,
  },
  settingDescription: {
    ...typography.caption,
  },
  actionCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  actionTitle: {
    ...typography.subheading,
    marginBottom: spacing.xs / 2,
  },
  actionDescription: {
    ...typography.caption,
  },
  dangerCard: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  dangerText: {
    color: colors.error,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...typography.subheading,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  infoDescription: {
    ...typography.caption,
    lineHeight: 20,
  },
  infoNote: {
    ...typography.small,
    fontStyle: 'italic',
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  footer: {
    height: spacing.xl,
  },
});

export default SettingsScreen;
