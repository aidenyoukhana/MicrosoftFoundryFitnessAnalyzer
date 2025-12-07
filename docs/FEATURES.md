# Features Documentation

Detailed documentation of all features in the Microsoft Foundry Fitness Analyzer app.

## Table of Contents
1. [Dashboard](#dashboard)
2. [Workouts](#workouts)
3. [Trends](#trends)
4. [Sleep](#sleep)
5. [Settings](#settings)
6. [AI-Powered Insights](#ai-powered-insights)
7. [HealthKit Integration](#healthkit-integration)
8. [Data Visualization](#data-visualization)

---

## Dashboard

The Dashboard provides an at-a-glance view of your health and fitness metrics.

### Key Metrics Cards

#### Today's Calories
- **What it shows**: Active calories burned today
- **Color**: Orange
- **Updates**: Real-time from HealthKit
- **Units**: kcal

#### Weekly Workouts
- **What it shows**: Number of workouts in the last 7 days
- **Color**: Blue
- **Updates**: Daily
- **Goal**: Aim for 3-5 workouts per week

#### Average Heart Rate
- **What it shows**: Mean heart rate from recent readings
- **Color**: Pink
- **Updates**: Every 15 minutes
- **Units**: bpm (beats per minute)

#### Last Night Sleep
- **What it shows**: Sleep duration from previous night
- **Color**: Purple
- **Updates**: Daily after waking
- **Units**: hours

#### Workout Streak
- **What it shows**: Consecutive days with at least one workout
- **Color**: Green
- **Updates**: Daily
- **Motivation**: Maintain consistency!

#### Weekly Load
- **What it shows**: Average daily workout intensity
- **Color**: Yellow
- **Updates**: Daily
- **Range**: 0-100 scale

### Heart Rate Chart
- **Type**: Line chart with bezier curves
- **Data Points**: Last 12 readings
- **Update Frequency**: Real-time
- **Y-axis**: Heart rate (bpm)
- **Color**: Blue gradient
- **Features**: 
  - Smooth animations
  - Touch feedback
  - Auto-scaling

### AI Health Tips
- **Source**: Azure OpenAI GPT-4
- **Generation**: Based on your recent activity
- **Categories**: Workout, Sleep, Nutrition, Recovery, General
- **Priority Levels**:
  - **High** (Red): Urgent recommendations
  - **Medium** (Orange): Beneficial improvements
  - **Low** (Green): Optional optimizations
- **Update Frequency**: Daily or on manual refresh
- **Personalization**: Uses your unique health data

### Pull-to-Refresh
- Swipe down to refresh all data
- Updates metrics, charts, and tips
- Visual loading indicator

---

## Workouts

Track and analyze all your fitness activities.

### Weekly Calories Chart
- **Type**: Bar chart
- **Duration**: Last 7 days
- **Y-axis**: Calories burned
- **Color**: Blue bars
- **Features**:
  - Daily breakdown
  - Visual comparison
  - Touch to see exact values

### Activity Distribution Chart
- **Type**: Pie chart
- **Data**: Workout types
- **Shows**:
  - Percentage of each activity
  - Total count per type
  - Color-coded segments
- **Common Types**:
  - Running
  - Cycling
  - Swimming
  - Yoga
  - Strength Training
  - Walking

### Workout History List

Each workout displays:
- **Header**:
  - Workout type
  - Date and time
  - Calories badge (prominent)
- **Metrics**:
  - Duration (hours and minutes)
  - Distance (km, if applicable)
  - Average heart rate (bpm)
- **Heart Rate Details**:
  - Minimum HR
  - Maximum HR
  - Heart rate range

### Features
- Infinite scroll
- Pull-to-refresh
- Sort by date (newest first)
- Filter by workout type (future)
- Export functionality (future)

---

## Trends

Analyze your fitness patterns over time.

### Summary Statistics

#### Average Daily Calories
- 14-day rolling average
- Helps track consistency
- Goal: Maintain or increase

#### Average Workout Load
- Intensity metric
- Scale: 0-100
- Indicates training volume

#### Peak Calories
- Highest single-day burn
- Motivation metric
- Personal best tracking

#### Peak Load
- Maximum workout intensity
- Shows capacity limits
- Progressive overload indicator

### Active Calories Trend
- **Type**: Line chart
- **Duration**: 14 days
- **Color**: Orange
- **Features**:
  - Bezier curve smoothing
  - Trend line
  - Date labels
  - Value labels on hover

### Workout Load Trend
- **Type**: Bar chart
- **Duration**: 14 days
- **Color**: Purple
- **Shows**: Daily training intensity
- **Helps**: Prevent overtraining

### AI Trend Analysis

#### Overall Performance
- Assessment of activity level
- Recommendations for improvement
- Congratulations for good habits

#### Workout Intensity
- Analysis of training load
- Suggestions for progression
- Recovery reminders

#### Progress Trajectory
- Trend direction (up/down/stable)
- Momentum feedback
- Motivation messages

---

## Sleep

Monitor and improve your sleep quality.

### Sleep Metrics

#### Average Sleep Duration
- Rolling 7-day average
- Optimal: 7-9 hours
- Consistency indicator

#### Last Night's Sleep
- Total duration
- Quality rating
- Stage breakdown

### Sleep Quality Levels
- **Excellent**: 8-9 hours, good stages
- **Good**: 7-8 hours, balanced stages
- **Fair**: 6-7 hours, some issues
- **Poor**: <6 or >9 hours, imbalanced

### Sleep Stages

#### Deep Sleep
- **Color**: Purple
- **Percentage**: 15-25% is optimal
- **Function**: Physical recovery
- **Duration**: Typically 1-2 hours

#### REM Sleep
- **Color**: Blue
- **Percentage**: 20-25% is optimal
- **Function**: Mental recovery, memory
- **Duration**: Typically 1.5-2 hours

#### Light Sleep
- **Color**: Light blue
- **Percentage**: 50-60% is typical
- **Function**: Transition, light recovery
- **Duration**: Typically 3-4 hours

#### Awake Time
- **Color**: Orange
- **Optimal**: <5% of total sleep
- **Normal**: Brief awakenings
- **Concern**: If >10%, consult doctor

### Sleep Trends Chart
- **Type**: Line chart
- **Duration**: 14 nights
- **Color**: Purple
- **Shows**: Duration patterns
- **Helps**: Identify consistency

### Sleep Insights
- Personalized recommendations
- Based on your sleep data
- Categories:
  - Sleep duration
  - Sleep quality
  - Consistency
  - Environmental factors

---

## Settings

Configure app preferences and manage data.

### App Preferences

#### Dark Mode
- Default: Enabled
- Toggle on/off
- Applies immediately
- System-wide (within app)

#### Notifications
- Workout reminders
- Health tip alerts
- Weekly summaries
- Achievement notifications

#### Auto-Sync
- Automatic HealthKit sync
- Background updates
- Data freshness
- Battery efficient

#### Weekly Reports
- AI-generated summaries
- Sent via notification
- Comprehensive analysis
- Actionable insights

### Health Data Management

#### HealthKit Permissions
- Request/manage access
- Select data types
- Privacy controls
- Revoke access

#### Data Export
- Export to CSV format
- Includes all metrics
- Date range selection
- Share or backup

#### Clear Cache
- Remove local data
- Free up storage
- Reset preferences
- Fresh start option

### Azure OpenAI Configuration
- View connection status
- Service information
- Model details
- Usage guidelines

### About Information
- App version
- Build number
- License information
- Credits and attribution

---

## AI-Powered Insights

### How It Works

1. **Data Collection**: App reads your HealthKit data
2. **Analysis**: Metrics are calculated and aggregated
3. **Context Building**: Recent patterns are identified
4. **AI Generation**: Azure OpenAI processes the context
5. **Personalization**: Tips are tailored to your data
6. **Delivery**: Insights displayed in Dashboard

### Tip Categories

#### Workout Tips
- Exercise recommendations
- Training intensity advice
- Workout variety suggestions
- Progressive overload guidance

#### Sleep Tips
- Sleep hygiene recommendations
- Schedule consistency advice
- Quality improvement suggestions
- Recovery optimization

#### Nutrition Tips
- Hydration reminders
- Calorie balance guidance
- Timing recommendations
- Supplement suggestions

#### Recovery Tips
- Rest day importance
- Active recovery ideas
- Injury prevention
- Stretching routines

#### General Tips
- Lifestyle advice
- Motivation boosters
- Goal setting help
- Progress tracking

### Privacy & Security
- All processing is secure
- No data shared externally
- Azure enterprise security
- Optional feature (works without Azure)

---

## HealthKit Integration

### Supported Data Types

#### Workouts
- All activity types
- Start/end times
- Duration
- Calories burned
- Distance
- Heart rate data

#### Heart Rate
- Resting heart rate
- Active heart rate
- Heart rate variability
- Maximum heart rate

#### Sleep Analysis
- In bed time
- Asleep time
- Sleep stages
- Interruptions

#### Energy
- Active energy burned
- Resting energy burned
- Total daily energy

#### Activity
- Steps
- Distance
- Flights climbed
- Exercise minutes

### Permissions
- Read-only access
- User granted
- Can be revoked anytime
- Transparent usage

### Privacy
- Local processing
- No cloud storage of health data
- Apple's secure framework
- HIPAA considerations

---

## Data Visualization

### Chart Types

#### Line Charts
- **Used for**: Trends over time
- **Examples**: Heart rate, sleep duration, calories
- **Features**: 
  - Smooth bezier curves
  - Interactive tooltips
  - Zoom and pan
  - Auto-scaling axes

#### Bar Charts
- **Used for**: Comparisons
- **Examples**: Weekly calories, workout load
- **Features**:
  - Color-coded bars
  - Value labels
  - Grouped data
  - Responsive sizing

#### Pie Charts
- **Used for**: Proportions
- **Examples**: Workout distribution, sleep stages
- **Features**:
  - Percentage display
  - Color segments
  - Legend
  - Interactive selection

#### Progress Charts
- **Used for**: Goals and percentages
- **Examples**: Sleep quality breakdown
- **Features**:
  - Circular design
  - Multiple rings
  - Color gradients
  - Animated filling

### Design System
- **Dark mode optimized**
- **Consistent color palette**
- **Accessible contrast ratios**
- **Smooth animations**
- **Touch-friendly sizing**

---

## Future Features

### Planned Enhancements
- [ ] Android support with Google Fit
- [ ] Apple Watch app
- [ ] Social features and challenges
- [ ] Nutrition tracking
- [ ] Workout planning
- [ ] Custom workout creation
- [ ] Integration with fitness equipment
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Widgets

### Roadmap
See [CHANGELOG.md](../CHANGELOG.md) for version history and upcoming features.
