import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../store/useTheme';

export default function CountdownDetailScreen() {
  const { id } = useLocalSearchParams();
  const { isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
        Countdown Detail
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#888' : '#666' }]}>
        Countdown ID: {id}
      </Text>
      <Text style={[styles.text, { color: isDark ? '#888' : '#666' }]}>
        Detail view coming soon...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
});
