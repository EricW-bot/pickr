import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/auth';

// Helper type for our specific query result
type Card = Database['public']['Tables']['cards']['Row'];

type LiveCard = {
  id: string;
  title: string;
  status: string; // e.g., "Q3 14-10"
};

export default function BattleScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isFindingMatch, setIsFindingMatch] = useState(false);
  const [gameStage, setGameStage] = useState<string>('Idle'); // 'Idle', 'Duelling', 'Resolving', etc.
  const [trophies, setTrophies] = useState(user?.trophies ?? 0);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const blinkAnim = React.useRef(new Animated.Value(1)).current;
  const isFocused = useIsFocused();

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
    // Refresh trophies everytime we switch back to this tab
    if (!isFocused) return;
    if (!user?.id) return;
    fetchTrophies(user.id);
  }, [isFocused, user?.id]);

  // Blinking Effect for "READY" status
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  // Pulsing Effect for Matchmaking
  useEffect(() => {
    if (isFindingMatch) {
      // Start pulsing animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
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
        .order('damage', { ascending: false }); // Show bigger plays first

      if (error) {
        console.error('Error fetching cards:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        console.log(`Successfully fetched ${data?.length || 0} cards`);
        // Cards fetched but not currently used in UI
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTrophies(userId: string) {
    try {
      if (!userId) return;
      console.log('Fetching trophies from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('trophies')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching trophies:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        const row = data as unknown as { 
          trophies: number | null 
        } | null;
        const nextTrophies = row?.trophies ?? 0;
        console.log(`Successfully fetched ${nextTrophies} trophies`);
        setTrophies(nextTrophies);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  const handleBattlePress = () => {
    if (isFindingMatch) {
      setIsFindingMatch(false);
      setGameStage('Idle');
    } else {
      setIsFindingMatch(true);
      setGameStage('Finding Match');
      // Simulate finding match - in real app, this connects to matchmaking
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>Battle</Text>
            <Text style={styles.subtitle}>Challenge opponents. Win trophies.</Text>
          </View>
          <LinearGradient
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.trophyPill}
          >
            <IconSymbol name="trophy" size={16} color="#ffd700" />
            <Text style={styles.trophyCount}>{trophies.toLocaleString()}</Text>
          </LinearGradient>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Battle Button Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Matchmaking</Text>
            <Animated.View style={{ opacity: blinkAnim, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.liveIndicator} />
              <Text style={styles.sectionMeta}>{isFindingMatch ? 'SEARCHING' : 'READY'}</Text>
            </Animated.View>
          </View>

          <LinearGradient
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.glassCard}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }], width: '100%' }}>
              <Pressable
                style={({ pressed }) => [
                  styles.obsidianButton,
                  isFindingMatch ? styles.glowActive : styles.glowIdle,
                  pressed && { transform: [{ scale: 0.97 }] }
                ]}
                onPress={handleBattlePress}
              >
                <Text style={[styles.battleButtonText, isFindingMatch && { color: '#4ade80' }]}>
                  {isFindingMatch ? 'FINDING MATCH' : 'BATTLE'}
                </Text>
                <View style={styles.topEdgeHighlight} />
              </Pressable>
            </Animated.View>
            {isFindingMatch && (
              <Text style={styles.battleSubtext}>TAP TO CANCEL SEARCH</Text>
            )}
          </LinearGradient>
        </View>

        {/* Game State Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Game State</Text>
            <Text style={styles.sectionMeta}>Current</Text>
          </View>

          <LinearGradient 
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.card}
          >
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Stage</Text>
                <Text style={styles.rowSubtle}>Current battle phase</Text>
              </View>
              <Text style={[styles.rowValue, gameStage !== 'Idle' && styles.rowValueActive]}>
                {gameStage}
              </Text>
            </View>
          </LinearGradient>
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
              <LinearGradient 
                colors={['#1a1a1a', '#0f0f0f']}
                style={styles.tickerCard}
                key={card.id}
              >
                <Text style={styles.tickerTitle} numberOfLines={1}>
                  {card.title}
                </Text>
                <Text style={styles.tickerStatus}>{card.status}</Text>
              </LinearGradient>
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
    fontWeight: '600',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 16,
  },
  // "Glass Edge" Card Styling
  glassCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderTopColor: 'rgba(255, 255, 255, 0.1)', // Light hits the top
    alignItems: 'center',
  },
  obsidianButton: {
    width: '100%',
    paddingVertical: 20,
    borderRadius: 18,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  glowIdle: {
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  glowActive: {
    borderColor: 'rgba(74, 222, 128, 0.4)',
    shadowColor: "#4ade80",
    shadowRadius: 15,
    shadowOpacity: 0.3,
    elevation: 10,
  },
  battleButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 3,
    fontFamily: 'HelveticaBold',
  },
  topEdgeHighlight: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  battleSubtext: {
    marginTop: 12,
    color: '#444',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
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
  rowValueActive: {
    color: '#4ade80',
  },
  tickerContent: {
    paddingRight: 24,
    gap: 12,
  },
  tickerCard: {
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