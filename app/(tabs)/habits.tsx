import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useHabitsStore } from '../../store/useHabitsStore';
import { useTheme } from '../../store/useTheme';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HabitsScreen() {
  const { habits, fetchHabits, isLoading } = useHabitsStore();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchHabits();
  }, []);

  const renderHabit = ({ item }: { item: typeof habits[0] }) => (
    <Link href={`/habit/${item.id}`} asChild>
      <TouchableOpacity
        style={[
          styles.habitCard,
          { backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7' }
        ]}
      >
        <View style={styles.habitContent}>
          <Text style={styles.habitIcon}>{item.icon || '✓'}</Text>
          <View style={styles.habitInfo}>
            <Text style={[styles.habitName, { color: isDark ? '#fff' : '#000' }]}>
              {item.name}
            </Text>
            <Text style={[styles.habitFrequency, { color: isDark ? '#888' : '#666' }]}>
              {item.frequency_goal}x per {item.frequency_period}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={fetchHabits}
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
  habitCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitFrequency: {
    fontSize: 14,
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
