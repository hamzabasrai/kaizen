import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useTheme } from '../../store/useTheme';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HabitCard } from '../../components/habit/HabitCard';
import { Habit, HabitCompletion } from '../../types/habit';
import * as habitService from '../../services/habits';

interface HabitWithCompletions extends Habit {
  completions: HabitCompletion[];
}

export default function HabitsScreen() {
  const { habits, fetchHabits, isLoading } = useHabitsStore();
  const { isDark } = useTheme();
  const [habitsWithCompletions, setHabitsWithCompletions] = useState<HabitWithCompletions[]>([]);

  const loadCompletions = useCallback(async () => {
    const habitsData = await Promise.all(
      habits.map(async (habit) => {
        const completions = await habitService.getHabitCompletions(habit.id);
        return { ...habit, completions };
      })
    );
    setHabitsWithCompletions(habitsData);
  }, [habits]);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      loadCompletions();
    }
  }, [habits, loadCompletions]);

  const renderHabit = ({ item }: { item: HabitWithCompletions }) => (
    <Link href={`/habit/${item.id}`} asChild>
      <HabitCard 
        habit={item} 
        completions={item.completions}
      />
    </Link>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <FlatList
        data={habitsWithCompletions}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={() => {
          fetchHabits();
          loadCompletions();
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
              No habits yet. Add your first habit!
            </Text>
          </View>
        }
      />
      <Link href="/habit/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
