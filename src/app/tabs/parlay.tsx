import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Helper type for our specific query result
type Card = Database['public']['Tables']['cards']['Row'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const GRID_GAP = 10;
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GRID_GAP * 2) / 3);
const TILE_HEIGHT = Math.floor(TILE_WIDTH * 1.35);

export default function DeckScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [query, setQuery] = useState('');
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

  const filteredCards = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter((c) => (c.title || '').toLowerCase().includes(q));
  })();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Parlay</Text>
            <Text style={styles.subtitle}>Search and select 3 cards.</Text>
          </View>
          <Pressable
            onPress={() => setShowInfoModal(true)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <IconSymbol name="info.circle" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search cards..."
            placeholderTextColor="#666"
            style={styles.searchInput}
          />
          <Pressable
            style={({ pressed }) => [styles.searchClear, pressed && styles.searchClearPressed]}
            onPress={() => setQuery('')}
          >
            <IconSymbol name="xmark" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
            onPress={() => {
              router.push({
                pathname: '/inspect',
                params: {
                  cardId: item.id,
                  title: item.title,
                  damage: item.damage?.toString() || '0',
                  description: item.description || '',
                  rarity: item.rarity || '',
                  type: item.type || '',
                  image_url:
                    item.image_url ||
                    'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3',
                },
              });
            }}
          >
            <View style={styles.tileTopRow}>
              <Text style={styles.tileDamage}>{item.damage || 0}</Text>
            </View>
            <View style={styles.tileImageWrap}>
              <Image
                source={{
                  uri:
                    item.image_url ||
                    'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3',
                }}
                style={styles.tileImage}
              />
            </View>
            <Text style={styles.tileTitle} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.placeholderTitle}>No cards found</Text>
            <Text style={styles.placeholder}>Try a different search, or check Supabase connection.</Text>
          </View>
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
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 12,
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  iconButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    color: '#fff',
    fontFamily: 'HelveticaRegular',
  },
  searchClear: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchClearPressed: {
    opacity: 0.75,
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
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_HEIGHT,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 10,
    overflow: 'hidden',
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  tileTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  tileDamage: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  tileImageWrap: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#1a1a1a',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tileTitle: {
    marginTop: 8,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 11,
    lineHeight: 14,
  },
  emptyState: {
    paddingTop: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  placeholderTitle: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
    marginBottom: 6,
  },
  placeholder: {
    color: '#666',
    fontFamily: 'HelveticaRegular',
    textAlign: 'center',
    lineHeight: 18,
  },
});