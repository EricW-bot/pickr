import HoloCard from '@/src/components/HoloCard';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DeckScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Deck</Text>
      </View>
      
      <View style={styles.content}>
        {/* Render the Card */}
        <HoloCard 
          title="DEMO_CARD" 
          damage={85} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark mode by default for the game
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    color: '#333',
  },
});