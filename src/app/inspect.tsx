import { IconSymbol } from '@/components/ui/icon-symbol';
import HoloCard from '@/src/components/HoloCard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { capitalCase } from 'change-case';

export default function InspectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    cardId: string;
    type: string;
    title: string;
    damage: string;
    description?: string;
    rarity?: string;
  }>();

  const damage = parseInt(params.damage || '0', 10);
  
  // Convert rarity string to proper type, defaulting to 'common'
  const rarity = (params.rarity?.toLowerCase() === 'rare' ? 'rare' : 
                  params.rarity?.toLowerCase() === 'legendary' ? 'legendary' : 
                  'common') as 'common' | 'rare' | 'legendary';

  const rarityColor =
    rarity === 'rare' ? '#00FFFF' :
    rarity === 'legendary' ? '#FFD700' :
    '#FFFFFF';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Back Button */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed
          ]}
        >
          <IconSymbol name="chevron.left" size={24} color="white" />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {/* Card Display */}
      <View style={styles.cardContainer}>
        <HoloCard 
          title={params.title || 'Unknown Card'} 
          damage={damage}
          rarity={rarity}
        />
      </View>

      {/* Card Details */}
      {params.description && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}>Description</Text>
          <Text style={styles.detailsText}>{params.description}</Text>
        </View>
      )}

      {params.type && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}>Category</Text>
          <Text style={styles.detailsText}>{capitalCase(params.type)}</Text>
        </View>
      )}

      {params.rarity && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsLabel}>Rarity</Text>
          <Text style={[styles.rarityText, { color: rarityColor }]}>
            {params.rarity.toUpperCase()}
          </Text>
        </View>
      )}    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    left: 10,
    top: 10,
    paddingRight: 25,
  },
  backButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'HelveticaMedium',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  detailsContainer: {
    padding: 20,
    paddingTop: 0,
    bottom: 25,
    backgroundColor: 'dark-grey',
  },
  detailsLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: 'HelveticaMedium',
  },
  detailsText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'HelveticaRegular',
  },
  rarityText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: 'HelveticaBold',
  },
});
