import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market</Text>
        <Text style={styles.subtitle}>Buy card packs and upgrades</Text>
      </View>

      {/* Currency Display */}
      <View style={styles.currencyContainer}>
        <View style={styles.currencyItem}>
          <Text style={styles.currencyLabel}>Gold</Text>
          <Text style={styles.currencyValue}>1,250</Text>
        </View>
        <View style={styles.currencyDivider} />
        <View style={styles.currencyItem}>
          <Text style={styles.currencyLabel}>Dust</Text>
          <Text style={styles.currencyValue}>340</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Card Draft Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Draft Cards</Text>
          
          <View style={styles.packCard}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Free Tier</Text>
              <Text style={styles.packPriceFree}>FREE</Text>
            </View>
            <Text style={styles.packDescription}>Draft 5 random cards</Text>
          </View>

          <View style={styles.packCard}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Standard Tier</Text>
              <Text style={styles.packPrice}>100 Gold</Text>
            </View>
            <Text style={styles.packDescription}>Draft 10 random cards</Text>
          </View>

          <View style={styles.packCard}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Premium Tier</Text>
              <Text style={styles.packPrice}>200 Gold</Text>
            </View>
            <Text style={styles.packDescription}>Draft 20 random cards</Text>
          </View>
        </View>

        {/* Reroll Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reroll Cards</Text>
          
          <View style={styles.packCard}>
            <View style={styles.packHeader}>
              <Text style={styles.packName}>Reroll Single Card</Text>
              <Text style={styles.packPrice}>500 Dust</Text>
            </View>
            <Text style={styles.packDescription}>Replace one card from your draft</Text>
          </View>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured</Text>
          
          <View style={styles.featuredCard}>
            <Text style={styles.featuredTitle}>Weekly Special</Text>
            <Text style={styles.featuredDescription}>Double Gold Weekend</Text>
            <Text style={styles.featuredSubtext}>Earn 2x gold from battles</Text>
          </View>
        </View>

        {/* Coming Soon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Card Trading</Text>
            <Text style={styles.placeholderSubtext}>Trade cards with other players</Text>
          </View>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Cosmetic Upgrades</Text>
            <Text style={styles.placeholderSubtext}>Customize your card borders</Text>
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
  currencyContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  currencyItem: {
    flex: 1,
    alignItems: 'center',
  },
  currencyDivider: {
    width: 1,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
  },
  currencyLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'HelveticaMedium',
    marginBottom: 4,
  },
  currencyValue: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'HelveticaBold',
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
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    marginBottom: 16,
  },
  packCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
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
  packBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  packBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'HelveticaMedium',
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
  placeholderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    opacity: 0.6,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'HelveticaMedium',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'HelveticaRegular',
  },
});