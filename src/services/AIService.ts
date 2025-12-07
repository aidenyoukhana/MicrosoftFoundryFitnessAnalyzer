import {OpenAIClient, AzureKeyCredential} from '@azure/openai';
import {HealthTip, DashboardMetrics, Workout, SleepData} from '../types/health';

// Azure OpenAI configuration
// In production, these should come from environment variables or secure config
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || 'https://your-resource.openai.azure.com';
const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY || 'your-api-key';
const DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';

class AITipsService {
  private client: OpenAIClient | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Only initialize if credentials are provided
    if (AZURE_OPENAI_KEY !== 'your-api-key' && AZURE_OPENAI_ENDPOINT !== 'https://your-resource.openai.azure.com') {
      try {
        this.client = new OpenAIClient(
          AZURE_OPENAI_ENDPOINT,
          new AzureKeyCredential(AZURE_OPENAI_KEY)
        );
        this.isConfigured = true;
      } catch (error) {
        console.warn('[AITipsService] Failed to initialize Azure OpenAI client:', error);
      }
    }
  }

  async generateTips(
    metrics: DashboardMetrics,
    recentWorkouts: Workout[],
    recentSleep: SleepData[]
  ): Promise<HealthTip[]> {
    // If Azure OpenAI is not configured, return mock tips
    if (!this.isConfigured || !this.client) {
      return this.getMockTips();
    }

    try {
      const prompt = this.buildPrompt(metrics, recentWorkouts, recentSleep);
      
      const result = await this.client.getChatCompletions(
        DEPLOYMENT_NAME,
        [
          {
            role: 'system',
            content: 'You are a professional fitness and wellness coach. Provide personalized, actionable health tips based on user data. Return tips as JSON array with fields: title, description, category (workout/sleep/nutrition/recovery/general), priority (low/medium/high).',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        {
          maxTokens: 800,
          temperature: 0.7,
        }
      );

      const content = result.choices[0]?.message?.content || '';
      const tips = this.parseTipsFromResponse(content);
      return tips;
    } catch (error) {
      console.error('[AITipsService] Error generating tips:', error);
      return this.getMockTips();
    }
  }

  private buildPrompt(
    metrics: DashboardMetrics,
    recentWorkouts: Workout[],
    recentSleep: SleepData[]
  ): string {
    const avgSleepHours = recentSleep.length > 0
      ? recentSleep.reduce((sum, s) => sum + s.duration, 0) / recentSleep.length
      : 0;

    return `Analyze this fitness data and provide 3-5 personalized health tips:

Metrics:
- Today's Calories: ${metrics.todayCalories}
- Weekly Workouts: ${metrics.weeklyWorkouts}
- Average Heart Rate: ${metrics.avgHeartRate} bpm
- Last Night Sleep: ${metrics.lastNightSleep.toFixed(1)} hours
- Workout Streak: ${metrics.workoutStreak} days
- Weekly Workout Load: ${metrics.weeklyWorkoutLoad}

Recent Workouts: ${recentWorkouts.length} workouts in the last 7 days
Average Sleep: ${avgSleepHours.toFixed(1)} hours per night

Provide actionable, specific tips to improve their fitness and health.`;
  }

  private parseTipsFromResponse(content: string): HealthTip[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const tipsData = JSON.parse(jsonMatch[0]);
        return tipsData.map((tip: any, index: number) => ({
          id: `tip-${Date.now()}-${index}`,
          title: tip.title || 'Health Tip',
          description: tip.description || '',
          category: tip.category || 'general',
          priority: tip.priority || 'medium',
          date: new Date(),
        }));
      }
    } catch (error) {
      console.error('[AITipsService] Error parsing tips:', error);
    }
    
    return this.getMockTips();
  }

  private getMockTips(): HealthTip[] {
    const tips: HealthTip[] = [
      {
        id: 'tip-1',
        title: 'Increase Weekly Activity',
        description: 'Try to add one more workout session this week. Even a 20-minute walk can make a significant difference in your overall fitness.',
        category: 'workout',
        priority: 'medium',
        date: new Date(),
      },
      {
        id: 'tip-2',
        title: 'Optimize Sleep Schedule',
        description: 'Aim for 7-9 hours of sleep consistently. Go to bed and wake up at the same time each day to improve sleep quality.',
        category: 'sleep',
        priority: 'high',
        date: new Date(),
      },
      {
        id: 'tip-3',
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses of water daily. Proper hydration improves workout performance and recovery.',
        category: 'nutrition',
        priority: 'medium',
        date: new Date(),
      },
      {
        id: 'tip-4',
        title: 'Active Recovery',
        description: 'Include active recovery days with light activities like yoga or stretching to prevent burnout and reduce injury risk.',
        category: 'recovery',
        priority: 'low',
        date: new Date(),
      },
      {
        id: 'tip-5',
        title: 'Monitor Heart Rate',
        description: 'Your average heart rate looks good. Continue monitoring it during workouts to ensure you\'re training in the right zone.',
        category: 'general',
        priority: 'low',
        date: new Date(),
      },
    ];

    return tips;
  }
}

export const AIService = new AITipsService();
