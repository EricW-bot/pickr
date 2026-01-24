import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/src/lib/supabase';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/auth';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';

export default function MarketScreen() {
  const { user } = useAuth();
  const isFocused = useIsFocused();
  
  const [gold, setGold] = useState(user?.gold ?? 0);
  const [dust, setDust] = useState(user?.dust ?? 0);
  const [tokens, setTokens] = useState(user?.tokens ?? 0);

  useEffect(() => {
    fetchCurrencies(user?.id ?? '');
  }, [isFocused]);

  async function fetchCurrencies(userId: string) {
    try {
      console.log('Fetching currencies from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select(
          `
            gold,
            dust,
            tokens
          `,
        )
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching currencies:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        const row = data as unknown as { 
          gold: number | null, 
          dust: number | null, 
          tokens: number | null 
        } | null;
        const nextGold = row?.gold ?? 0;
        const nextDust = row?.dust ?? 0;
        const nextTokens = row?.tokens ?? 0;
        console.log(`Successfully fetched ${nextGold} gold, ${nextDust} dust, ${nextTokens} tokens`);
        setGold(nextGold);
        setDust(nextDust);
        setTokens(nextTokens);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Market</Text>
          <Text style={styles.subtitle}>Draft cards, reroll picks, and catch specials.</Text>

          {/* Currency bar */}
          <View style={styles.currencyBar}>
            <View style={styles.currencyItem}>
              <Text style={styles.currencyLabel}>Gold</Text>
              <Text style={styles.currencyValue}>{gold.toLocaleString()}</Text>
            </View>
            <View style={styles.currencyDivider} />
            <View style={styles.currencyItem}>
              <Text style={styles.currencyLabel}>Dust</Text>
              <Text style={styles.currencyValue}>{dust.toLocaleString()}</Text>
            </View>
            <View style={styles.currencyDivider} />
            <View style={styles.currencyItem}>
              <Text style={styles.currencyLabel}>Tokens</Text>
              <Text style={styles.currencyValue}>{tokens.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Card Draft Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Draft Cards</Text>
            <Text style={styles.sectionMeta}>Build your deck</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Free Tier</Text>
              <Text style={styles.packPriceFree}>FREE</Text>
            </View>
            <Text style={styles.packDescription}>Draft 5 random cards</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>One free pack every day.</Text>
              <Text style={styles.packCta}>CLAIM</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Standard Tier</Text>
              <Text style={styles.packPrice}>100 Gold</Text>
            </View>
            <Text style={styles.packDescription}>Draft 10 random cards</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Better odds for rare events.</Text>
              <Text style={styles.packCta}>BUY</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Premium Tier</Text>
              <Text style={styles.packPrice}>200 Gold</Text>
            </View>
            <Text style={styles.packDescription}>Draft 20 random cards</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Max cards, max volatility.</Text>
              <Text style={styles.packCta}>BUY</Text>
            </View>
          </View>
        </View>

        {/* Reroll Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Reroll Cards</Text>
            <Text style={styles.sectionMeta}>Fine-tune your picks</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Reroll Single Card</Text>
              <Text style={styles.packPrice}>500 Dust</Text>
            </View>
            <Text style={styles.packDescription}>Replace one card from your draft</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Use on low-impact events.</Text>
              <Text style={styles.packCta}>REROLL</Text>
            </View>
          </View>
        </View>

        {/* Buy Gold Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Buy Gold</Text>
            <Text style={styles.sectionMeta}>Convert tokens into spendable gold</Text>
          </View>

          {/* Small Gold Bundle */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Small Purse</Text>
              <Text style={styles.packPriceTokens}>40 Tokens</Text>
            </View>
            <Text style={styles.packDescription}>400 Gold • Enough for a few standard drafts.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Light top-up between battles.</Text>
              <Text style={styles.packCta}>BUY 400</Text>
            </View>
          </View>

          {/* Medium Gold Bundle */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Bankroll</Text>
              <Text style={styles.packPriceTokens}>80 Tokens</Text>
            </View>
            <Text style={styles.packDescription}>900 Gold • Better value for frequent drafting.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Ideal for active sessions.</Text>
              <Text style={styles.packCta}>BUY 900</Text>
            </View>
          </View>

          {/* Large Gold Bundle */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>War Chest</Text>
              <Text style={styles.packPriceTokens}>150 Tokens</Text>
            </View>
            <Text style={styles.packDescription}>2,000 Gold • Stockpile for long-term play.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>For players living in the Market.</Text>
              <Text style={styles.packCta}>BUY 2,000</Text>
            </View>
          </View>
        </View>

        {/* Buy Tokens Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Buy Tokens</Text>
            <Text style={styles.sectionMeta}>Top up your premium currency</Text>
          </View>

          {/* Starter Stack */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Starter Stack</Text>
              <Text style={styles.packPrice}>$0.99</Text>
            </View>
            <Text style={styles.packDescription}>100 Tokens • Enough to try out cosmetics and small upgrades.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Best for getting a feel for tokens.</Text>
              <Text style={styles.packCta}>BUY 100</Text>
            </View>
          </View>

          {/* Value Stack */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Value Stack</Text>
              <Text style={styles.packPrice}>$4.99</Text>
            </View>
            <Text style={styles.packDescription}>550 Tokens • Extra value versus buying multiple Starter Stacks.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>Most popular option for regular players.</Text>
              <Text style={styles.packCta}>BUY 550</Text>
            </View>
          </View>

          {/* Whale Stack */}
          <View style={styles.card}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Whale Stack</Text>
              <Text style={styles.packPrice}>$9.99</Text>
            </View>
            <Text style={styles.packDescription}>1,200 Tokens • Enough to max cosmetics and future token-only offers.</Text>
            <View style={styles.packFooterRow}>
              <Text style={styles.packHint}>For collectors and cosmetics enjoyers.</Text>
              <Text style={styles.packCta}>BUY 1,200</Text>
            </View>
          </View>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <Text style={styles.sectionMeta}>This week</Text>
          </View>
          
          <View style={styles.featuredCard}>
            <View style={styles.featuredTopRow}>
              <Text style={styles.featuredTitle}>Weekly Special</Text>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.featuredDescription}>Double Gold Weekend</Text>
            <Text style={styles.featuredSubtext}>Earn 2x gold from battles.</Text>
            <View style={styles.featuredFooter}>
              <Text style={styles.featuredFooterText}>Ends in 2d 4h</Text>
              <IconSymbol name="chevron.right" size={18} color="#ffd700" />
            </View>
          </View>
        </View>

        {/* Coming Soon Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Coming Soon</Text>
            <Text style={styles.sectionMeta}>Sneak peek</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Card Trading</Text>
                <Text style={styles.rowSubtle}>Trade cards with other players.</Text>
              </View>
              <Text style={styles.rowTag}>Planned</Text>
            </View>
            <View style={[styles.row, styles.rowNoDivider]}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Cosmetic Upgrades</Text>
                <Text style={styles.rowSubtle}>Animated borders, foils, and more.</Text>
              </View>
              <Text style={styles.rowTag}>Planned</Text>
            </View>
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
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    fontFamily: 'HelveticaMedium',
  },
  currencyBar: {
    marginTop: 14,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyItem: {
    flex: 1,
    minWidth: 0,
  },
  currencyLabel: {
    fontSize: 11,
    color: '#777',
    fontFamily: 'HelveticaMedium',
    marginBottom: 2,
  },
  currencyValue: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  tokenValue: {
    color: '#38bdf8',
  },
  currencyDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    marginBottom: 12,
  },
  packHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packName: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  packPrice: {
    fontSize: 18,
    color: '#ffd700',
    fontFamily: 'HelveticaBold',
  },
  packPriceTokens: {
    fontSize: 18,
    color: '#38bdf8',
    fontFamily: 'HelveticaBold',
  },
  packPriceFree: {
    fontSize: 18,
    color: '#4ade80',
    fontFamily: 'HelveticaBold',
  },
  packDescription: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'HelveticaRegular',
    marginBottom: 12,
  },
  packFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packHint: {
    fontSize: 12,
    color: '#777',
    fontFamily: 'HelveticaRegular',
  },
  packCta: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    letterSpacing: 0.6,
  },
  featuredCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  featuredTitle: {
    fontSize: 20,
    color: '#ffd700',
    fontFamily: 'HelveticaBold',
    marginBottom: 8,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  featuredBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 204, 21, 0.16)',
    borderWidth: 1,
    borderColor: '#facc15',
  },
  featuredBadgeText: {
    fontSize: 11,
    color: '#facc15',
    fontFamily: 'HelveticaMedium',
  },
  featuredDescription: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'HelveticaMedium',
    marginBottom: 4,
  },
  featuredSubtext: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'HelveticaRegular',
  },
  featuredFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredFooterText: {
    fontSize: 12,
    color: '#facc15',
    fontFamily: 'HelveticaMedium',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 14,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  rowSubtle: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
    fontFamily: 'HelveticaRegular',
  },
  rowTag: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'HelveticaMedium',
  },
});