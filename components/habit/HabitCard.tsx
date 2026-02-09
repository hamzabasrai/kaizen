import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit, HabitCompletion } from '../../types/habit';
import { useTheme } from '../../store/useTheme';
import { ContributionGrid } from './ContributionGrid';
import { StreakDisplay } from './StreakDisplay';

interface HabitCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  onPress?: () => void;
}

export function HabitCard({ habit, completions, onPress }: HabitCardProps) {
  const { isDark } = useTheme();

  // Calculate stats
  const stats = React.useMemo(() => {
    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: 0, completionRate: 0 };
    }

    const sortedCompletions = [...completions]
      .filter(c => c.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const completion of sortedCompletions) {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);

      if (!prevDate) {
        const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        } else {
          tempStreak = 1;
        }
      } else {
        const daysDiff = Math.floor((prevDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          tempStreak++;
          if (currentStreak === 0 && tempStreak > 0) {
            const daysSinceToday = Math.floor((today.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceToday <= 1) {
              currentStreak = tempStreak;
            }
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      prevDate = completionDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // Calculate completion rate over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCompletions = completions.filter(c => new Date(c.date) >= thirtyDaysAgo && c.completed);
    const completionRate = Math.round((recentCompletions.length / 30) * 100);

    return { currentStreak, longestStreak, completionRate };
  }, [completions]);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>{habit.icon || '✓'}</Text>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>
            {habit.name}
          </Text>
          <Text style={[styles.frequency, { color: isDark ? '#888' : '#666' }]}>
            {habit.frequency_goal}x per {habit.frequency_period}
          </Text>
        </View>
      </View>

      <ContributionGrid 
        completions={completions
          .filter((c): c is HabitCompletion & { completed: boolean } => c.completed !== null)
          .map(c => ({ date: c.date, completed: c.completed }))}
        color={habit.color || '#39d353'}
        onPress={onPress}
      />

      <StreakDisplay 
        currentStreak={stats.currentStreak}
        longestStreak={stats.longestStreak}
        completionRate={stats.completionRate}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  frequency: {
    fontSize: 13,
  },
});
