import { IconSymbol } from '@/components/ui/icon-symbol';
import { fetchUserDeck, saveDeckToSupabase } from '@/src/features/game-state/deck';
import { supabase } from '@/src/lib/supabase';
import { Database } from '@/src/types/supabase';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/auth';

// Helper type for our specific query result
type Card = Database['public']['Tables']['cards']['Row'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PADDING = 24;
const GRID_GAP = 10;
const TILE_WIDTH = Math.floor((SCREEN_WIDTH - H_PADDING * 2 - GRID_GAP * 2) / 3);
const TILE_HEIGHT = Math.floor(TILE_WIDTH * 1.35);
const SLOT_WIDTH = TILE_WIDTH;
const SLOT_HEIGHT = TILE_HEIGHT;
const INSPECT_FALLBACK_IMAGE_URL =
  'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3';

export default function ParlayScreen() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCardIds, setSavedCardIds] = useState<string[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedCards, setSelectedCards] = useState<(Card | null)[]>([null, null, null]);
  const router = useRouter();
  const isFocused = useIsFocused();

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

  async function loadSavedDeck() {
    if (!user?.id) return;

    try {
      console.log('Loading saved deck for user:', user.id);
      const result = await fetchUserDeck(user.id);

      if (result.success && result.data) {
        const deck = result.data;
        const cardIds = [deck.card_1_id, deck.card_2_id, deck.card_3_id].filter(
          (id): id is string => id !== null
        );

        if (cardIds.length > 0) {
          // Map card IDs to actual Card objects
          const loadedCards: (Card | null)[] = [null, null, null];
          cardIds.forEach((cardId, index) => {
            const card = cards.find((c) => c.id === cardId);
            if (card) {
              loadedCards[index] = card;
            } else {
              console.warn(`Card with ID ${cardId} not found in available cards`);
            }
          });

          setSelectedCards(loadedCards);
          console.log(`Loaded ${cardIds.length} cards from saved deck`);
        } else {
          console.log('Saved deck has no cards');
        }
      } else if (result.error) {
        console.error('Error loading saved deck:', result.error);
      } else {
        console.log('No saved deck found');
      }
    } catch (error: any) {
      console.error('Unexpected error loading saved deck:', error);
    }
  }

  // Load saved deck when cards are loaded and user is available
  useEffect(() => {
    if (!isFocused || !user?.id || cards.length === 0) return;
    loadSavedDeck();
  }, [isFocused, user?.id, cards.length]);

  // Reset saved state when deck changes
  useEffect(() => {
    const currentCardIds = selectedCards.filter((c) => c !== null).map((c) => c!.id).sort();
    const savedIdsSorted = [...savedCardIds].sort();
    
    // Compare current selection with saved selection
    const hasChanged = 
      currentCardIds.length !== savedIdsSorted.length ||
      currentCardIds.some((id, index) => id !== savedIdsSorted[index]);
    
    if (hasChanged) {
      setIsSaved(false);
    }
  }, [selectedCards, savedCardIds]);

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

  const selectedCount = selectedCards.filter((c) => c !== null).length;

  const handleCardSelect = (card: Card) => {
    // Do not allow the same card to be used twice
    const alreadySelected = selectedCards.some((c) => c?.id === card.id);
    if (alreadySelected) {
      return;
    }

    // Find first empty slot
    const emptyIndex = selectedCards.findIndex((c) => c === null);
    if (emptyIndex !== -1) {
      const newSelected = [...selectedCards];
      newSelected[emptyIndex] = card;
      setSelectedCards(newSelected);
    } else {
      // All slots full, replace the first one
      const newSelected = [...selectedCards];
      newSelected[0] = card;
      setSelectedCards(newSelected);
    }
  };

  const clearSlot = (index: number) => {
    if (!selectedCards[index]) return;
    const newSelected = [...selectedCards];
    newSelected[index] = null;
    setSelectedCards(newSelected);
  };

  const handleReset = () => {
    setSelectedCards([null, null, null]);
  };

  async function handleSaveDeck() {
    if (!user?.id) {
      return;
    }

    const cardIds = selectedCards.filter((c) => c !== null).map((c) => c!.id);
    if (cardIds.length === 0) {
      return;
    }

    await performSave(cardIds);
  }

  async function performSave(cardIds: string[]) {
    if (!user?.id) return;

    try {
      setSaving(true);
      const result = await saveDeckToSupabase(user.id, cardIds);

      if (result.success) {
        setIsSaved(true);
        setSavedCardIds(cardIds);
        console.log('Deck saved successfully');
      } else {
        console.error('Failed to save deck:', result.error);
        setIsSaved(false);
      }
    } catch (error: any) {
      console.error('Unexpected error saving deck:', error);
      setIsSaved(false);
    } finally {
      setSaving(false);
    }
  }

  const inspectCard = (card: Card) => {
    router.push({
      pathname: '/inspect',
      params: {
        cardId: card.id,
        title: card.title,
        damage: card.damage?.toString() || '0',
        description: card.description || '',
        rarity: card.rarity || '',
        type: card.type || '',
        image_url: card.image_url || INSPECT_FALLBACK_IMAGE_URL,
      },
    });
  };

  const renderCardSlot = (index: number) => {
    const card = selectedCards[index];
    
    if (card) {
      return (
        <Pressable
          key={index}
          style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
          onPress={() => inspectCard(card)}
        >
          <View style={styles.tileTopRow}>
            <Text style={styles.tileDamage}>{card.damage || 0}</Text>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                clearSlot(index);
              }}
              style={({ pressed }) => [
                styles.tileAddButton,
                styles.tileRemoveButton,
                pressed && styles.tileAddButtonPressed,
              ]}
            >
              <IconSymbol name="xmark" size={12} color="#fecaca" />
            </Pressable>
          </View>
          <View style={styles.tileImageWrap}>
            <Image
              source={{
                uri: card.image_url || INSPECT_FALLBACK_IMAGE_URL,
              }}
              style={styles.tileImage}
            />
          </View>
          <Text style={styles.tileTitle} numberOfLines={2} ellipsizeMode="tail">
            {card.title}
          </Text>
        </Pressable>
      );
    }

    return (
      <View key={index} style={styles.emptySlot}>
        <View style={styles.emptySlotPlus}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Parlay</Text>
            <Text style={styles.subtitle}>Select 3 cards for your parlay.</Text>
          </View>
          <Pressable
            onPress={() => setShowInfoModal(true)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <LinearGradient
              colors={['#1a1a1a', '#0f0f0f']}
              style={styles.iconButtonGradient}
            >
              <IconSymbol name="info.circle" size={20} color="#fff" />
            </LinearGradient>
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Selected Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Selected Cards</Text>
              <Text style={styles.sectionMeta}>{selectedCount}/3 cards selected</Text>
            </View>
            <View style={styles.sectionHeaderActions}>
              {selectedCount > 0 && (
                <Pressable
                  onPress={handleReset}
                  style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
                >
                  <IconSymbol name="reset" size={18} color="#fff" />
                </Pressable>
              )}
              {selectedCount > 0 && (
                <Pressable
                  onPress={handleSaveDeck}
                  disabled={saving}
                  style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                    saving && styles.saveButtonDisabled,
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.slotsContainer}>
            {[0, 1, 2].map((index) => renderCardSlot(index))}
          </View>
        </View>

        {/* All Cards Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>All Cards</Text>
            <Text style={styles.sectionMeta}>{filteredCards.length} available</Text>
          </View>

          <View style={styles.cardsGrid}>
            {filteredCards.map((item) => {
              const isSelected = selectedCards.some((c) => c?.id === item.id);
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
                  onPress={() => inspectCard(item)}
                >
                  <View style={styles.tileTopRow}>
                    <Text style={styles.tileDamage}>{item.damage || 0}</Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        if (isSelected) {
                          const slotIndex = selectedCards.findIndex((c) => c?.id === item.id);
                          if (slotIndex !== -1) clearSlot(slotIndex);
                          return;
                        }
                        handleCardSelect(item);
                      }}
                      style={({ pressed }) => [
                        styles.tileAddButton,
                        isSelected && styles.tileRemoveButton,
                        pressed && styles.tileAddButtonPressed,
                      ]}
                    >
                      {isSelected ? (
                        <IconSymbol name="xmark" size={12} color="#fecaca" />
                      ) : (
                        <>
                          <View style={styles.tilePlusHorizontal} />
                          <View style={styles.tilePlusVertical} />
                        </>
                      )}
                    </Pressable>
                  </View>
                  <View style={styles.tileImageWrap}>
                    <Image
                      source={{
                        uri:
                          item.image_url ||
                          INSPECT_FALLBACK_IMAGE_URL,
                      }}
                      style={styles.tileImage}
                    />
                  </View>
                  <Text style={styles.tileTitle} numberOfLines={2} ellipsizeMode="tail">
                    {item.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredCards.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.placeholderTitle}>No cards found</Text>
              <Text style={styles.placeholder}>Try a different search, or check Supabase connection.</Text>
            </View>
          )}
        </View>
      </ScrollView>

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
    overflow: 'hidden',
    marginTop: 4,
  },
  iconButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconButtonPressed: {
    opacity: 0.75,
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
  sectionHeaderLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  sectionMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
    fontFamily: 'HelveticaMedium',
  },
  sectionHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  saveButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#4ade80',
    fontSize: 14,
    fontWeight: '600',
  },
  slotsContainer: {
    flexDirection: 'row',
    gap: GRID_GAP,
    justifyContent: 'space-between',
  },
  cardSlot: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 10,
    overflow: 'hidden',
  },
  cardSlotPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  cardSlotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardSlotDamage: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardActionButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardActionAdd: {
    backgroundColor: 'rgba(74, 222, 128, 0.16)',
    borderColor: '#4ade80',
  },
  cardActionRemove: {
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
    borderColor: 'rgba(248, 113, 113, 0.6)',
  },
  cardActionButtonPressed: {
    opacity: 0.8,
  },
  cardActionPlusHorizontal: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: '#4ade80',
    borderRadius: 1,
  },
  cardActionPlusVertical: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#4ade80',
    borderRadius: 1,
  },
  cardSlotImageWrap: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#1a1a1a',
  },
  cardSlotImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardSlotTitle: {
    marginTop: 8,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 11,
    lineHeight: 14,
  },
  emptySlot: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptySlotPlus: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 24,
    height: 2,
    backgroundColor: '#444',
    borderRadius: 1,
  },
  plusVertical: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: '#444',
    borderRadius: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    justifyContent: 'space-between',
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
    marginBottom: GRID_GAP,
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  tileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  tileAddButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(74, 222, 128, 0.16)',
    borderWidth: 1,
    borderColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tileRemoveButton: {
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
    borderColor: 'rgba(248, 113, 113, 0.6)',
  },
  tileAddButtonPressed: {
    opacity: 0.8,
  },
  tileAddButtonDisabled: {
    opacity: 0.4,
  },
  tilePlusHorizontal: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: '#4ade80',
    borderRadius: 1,
  },
  tilePlusVertical: {
    position: 'absolute',
    width: 2,
    height: 10,
    backgroundColor: '#4ade80',
    borderRadius: 1,
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