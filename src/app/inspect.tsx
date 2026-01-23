import { IconSymbol } from '@/components/ui/icon-symbol';
import HoloCard from '@/src/components/HoloCard';
import { capitalCase } from 'change-case';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InspectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    cardId: string;
    type: string;
    title: string;
    damage: string;
    description?: string;
    rarity?: string;
    image_url?: string;
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
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <IconSymbol name="chevron.left" size={20} color="#fff" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {params.title || 'Inspect'}
            </Text>
            <Text style={styles.subtitle}>Drag to reveal the holo effect.</Text>
          </View>

          {/* Spacer to balance back button width */}
          <View style={styles.headerRightSpacer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card Display */}
        <View style={styles.cardStage}>
          <View style={styles.cardStageInner}>
            <HoloCard
              title={params.title || 'Unknown Card'}
              damage={damage}
              rarity={rarity}
              image_url={
                params.image_url ||
                'https://tse1.mm.bing.net/th/id/OIP.oHYyOUomj30SYJGtOprncAHaHa?pid=ImgDet&w=474&h=474&rs=1&o=7&rm=3'
              }
            />
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Details</Text>
            <Text style={styles.sectionMeta}>{params.cardId ? `ID: ${params.cardId.slice(0, 6)}…` : ''}</Text>
          </View>

          <View style={styles.card}>
            {params.rarity ? (
              <View style={styles.row}>
                <View style={styles.rowMain}>
                  <Text style={styles.rowLabel}>Rarity</Text>
                  <Text style={styles.rowSubtle}>Determines holo tint and value.</Text>
                </View>
                <Text style={[styles.rowValue, { color: rarityColor }]}>{params.rarity.toUpperCase()}</Text>
              </View>
            ) : null}

            {params.type ? (
              <View style={styles.row}>
                <View style={styles.rowMain}>
                  <Text style={styles.rowLabel}>Category</Text>
                  <Text style={styles.rowSubtle}>What kind of event this card represents.</Text>
                </View>
                <Text style={styles.rowValue}>{capitalCase(params.type)}</Text>
              </View>
            ) : null}

            {params.description ? (
              <View style={[styles.row, styles.rowNoDivider]}>
                <View style={styles.rowMain}>
                  <Text style={styles.rowLabel}>Description</Text>
                  <Text style={styles.rowDescription}>{params.description}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.row, styles.rowNoDivider]}>
                <View style={styles.rowMain}>
                  <Text style={styles.rowLabel}>Description</Text>
                  <Text style={styles.rowDescriptionMuted}>No description provided.</Text>
                </View>
              </View>
            )}
          </View>
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
  header: {
    padding: 24,
    paddingBottom: 14,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
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
  headerText: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'HelveticaBold',
  },
  subtitle: {
    marginTop: 6,
    color: '#666',
    fontSize: 14,
    fontFamily: 'HelveticaMedium',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  cardStage: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardStageInner: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 10,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
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
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  rowNoDivider: {
    borderBottomWidth: 0,
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
    fontSize: 12,
    letterSpacing: 1.2,
  },
  rowDescription: {
    marginTop: 8,
    color: '#fff',
    fontFamily: 'HelveticaRegular',
    fontSize: 14,
    lineHeight: 20,
  },
  rowDescriptionMuted: {
    marginTop: 8,
    color: '#666',
    fontFamily: 'HelveticaRegular',
    fontSize: 14,
    lineHeight: 20,
  },
});
