import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper type for our specific query result
type Card = Database['public']['Tables']['cards']['Row'];

type LiveCard = {
  id: string;
  title: string;
  status: string; // e.g., "Q3 14-10"
};

export default function BattleScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [gameStage, setGameStage] = useState<string>('Idle'); // 'Idle', 'Duelling', 'Resolving', etc.
  const [trophyCount, setTrophyCount] = useState(42);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();

  // Mock live cards data (replace with real data later)
  const liveCards: LiveCard[] = [
    { id: '1', title: 'Chiefs vs Raiders', status: 'Q3 14-10' },
    { id: '2', title: 'Bitcoin Rally', status: 'Live $102,450' },
    { id: '3', title: 'Solar Flare', status: 'Active X-Class' },
  ];

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (isFindingMatch) {
      // Start pulsing animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isFindingMatch]);

  async function fetchCards() {
    try {
      setLoading(true);
      console.log('Fetching cards from Supabase...');
      // Fetch all cards that are currently 'pending' (active)
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('status', 'pending')
        .order('damage', { ascending: false }); // Show big hitters first

      if (error) {
        console.error('Error fetching cards:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log(`Successfully fetched ${data?.length || 0} cards`);
        setCards(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleBattlePress = () => {
    if (isFindingMatch) {
      setIsFindingMatch(false);
      setGameStage('Idle');
    } else {
      setIsFindingMatch(true);
      setGameStage('Finding Match');
      // Simulate finding match - in real app, this would connect to matchmaking
      setTimeout(() => {
        setGameStage('Duelling');
        // After some time, stop finding and enter battle
        setIsFindingMatch(false);
      }, 5000);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const animatedButtonStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Battle</Text>
            <Text style={styles.subtitle}>Challenge opponents. Win trophies.</Text>
          </View>
          <View style={styles.trophyPill}>
            <IconSymbol name="trophy" size={16} color="#ffd700" />
            <Text style={styles.trophyCount}>{trophyCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Battle Button Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Matchmaking</Text>
            <Text style={styles.sectionMeta}>{isFindingMatch ? 'Searching...' : 'Ready'}</Text>
          </View>

          <View style={styles.card}>
            <Animated.View style={animatedButtonStyle}>
              <Pressable
                style={({ pressed }) => [
                  styles.battleButton,
                  isFindingMatch && styles.battleButtonFinding,
                  pressed && styles.battleButtonPressed,
                ]}
                onPress={handleBattlePress}
              >
                <Text style={styles.battleButtonText}>
                  {isFindingMatch ? 'FINDING MATCH' : 'BATTLE'}
                </Text>
              </Pressable>
            </Animated.View>
            {isFindingMatch && (
              <Text style={styles.battleSubtext}>Click to cancel search</Text>
            )}
          </View>
        </View>

        {/* Game State Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Game State</Text>
            <Text style={styles.sectionMeta}>Current</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Stage</Text>
                <Text style={styles.rowSubtle}>Current battle phase</Text>
              </View>
              <Text style={styles.rowValue}>{gameStage}</Text>
            </View>
          </View>
        </View>

        {/* Live Cards Ticker */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Live Events</Text>
            <Text style={styles.sectionMeta}>{liveCards.length} active</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tickerContent}
          >
            {liveCards.map((card) => (
              <View key={card.id} style={styles.tickerCard}>
                <Text style={styles.tickerTitle} numberOfLines={1}>
                  {card.title}
                </Text>
                <Text style={styles.tickerStatus}>{card.status}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontFamily: 'HelveticaMedium',
  },
  trophyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginTop: 4,
    right: 15,
  },
  trophyCount: {
    color: '#ffd700',
    fontSize: 16,
    fontFamily: 'HelveticaBold',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'HelveticaMedium',
  },
  card: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 16,
  },
  battleButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  battleButtonFinding: {
    backgroundColor: '#1a3a2a',
    borderColor: '#2b6b4d',
  },
  battleButtonPressed: {
    opacity: 0.85,
  },
  battleButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'HelveticaBold',
    letterSpacing: 1,
  },
  battleSubtext: {
    marginTop: 10,
    color: '#888',
    fontSize: 12,
    fontFamily: 'HelveticaRegular',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
  },
  rowSubtle: {
    marginTop: 2,
    color: '#888',
    fontFamily: 'HelveticaRegular',
    fontSize: 12,
    lineHeight: 16,
  },
  rowValue: {
    marginLeft: 12,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
  },
  tickerContent: {
    paddingRight: 24,
    gap: 12,
  },
  tickerCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 180,
    marginRight: 12,
  },
  tickerTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'HelveticaBold',
    marginBottom: 4,
  },
  tickerStatus: {
    color: '#4ade80',
    fontSize: 12,
    fontFamily: 'HelveticaMedium',
  },
});