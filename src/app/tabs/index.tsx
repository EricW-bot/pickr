import { IconSymbol } from '@/components/ui/icon-symbol';
import CardPreview from '@/src/components/CardPreview';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper type for our specific query result
type Card = Database['public']['Tables']['cards']['Row'];

export default function DeckScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isBattleMode, setIsBattleMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCards();
  }, []);

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
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Main</Text>
            <Text style={styles.subtitle}>{cards.length} / 3 Cards Selected</Text>
          </View>
          <Pressable
            onPress={() => setShowInfoModal(true)}
            style={({ pressed }) => [
              styles.infoButton,
              pressed && styles.infoButtonPressed,
            ]}
          >
            <IconSymbol name="info.circle" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Battle bar button */}
      <View style={styles.battleBarContainer}>
        <Pressable 
          style={[
            styles.battleButton,
            isBattleMode && styles.battleButtonCancel
          ]} 
          onPress={() => setIsBattleMode(!isBattleMode)}
        >
          <Text style={styles.battleButtonText}>
            {isBattleMode ? 'CANCEL' : 'BATTLE'}
          </Text>
        </Pressable>
      </View>

      {/* Cards heading */}
      <Text style={styles.cardsHeading}>Cards</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <CardPreview 
              title={item.title} 
              damage={item.damage || 0}
              onPress={() => {
                router.push({
                  pathname: '/inspect',
                  params: {
                    cardId: item.id,
                    title: item.title,
                    damage: item.damage?.toString() || '0',
                    description: item.description || '',
                    rarity: item.rarity || '',
                  },
                });
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.placeholder}>No cards found. Check Supabase connection.</Text>
        }
      />

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowInfoModal(false)}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to Inspect Cards</Text>
              <Pressable
                onPress={() => setShowInfoModal(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
              >
                <IconSymbol name="xmark" size={20} color="#fff" />
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              Tap on any card in your deck to view it in detail. You can drag your finger across the card to see its holographic effects.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
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
  },
  headerContent: {
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
  battleBarContainer: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  battleButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  battleButtonCancel: {
    backgroundColor: '#800020',
    borderColor: '#a00030',
  },
  battleButtonText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'HelveticaBold',
  },
  cardsHeading: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
    fontSize: 24,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  infoButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 30,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'HelveticaBold',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    fontFamily: 'HelveticaRegular',
  },
  listContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: 24,
  },
  placeholder: {
    color: '#666',
    fontFamily: 'HelveticaRegular',
    marginTop: 20,
  },
});