import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your stats and settings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>RA</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>Rick Astley</Text>
              <Text style={styles.userLevel}>Level 12</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: '68%' }]} />
                </View>
                <Text style={styles.progressText}>2,450 / 3,600 XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Battle Stats</Text>
          
          <View style={styles.statsGrid}>
            {/* Simple count stats */}
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <Text style={styles.statLabel}>Wins</Text>
                <Text style={styles.statValue}>24</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <Text style={styles.statLabel}>Losses</Text>
                <Text style={styles.statValue}>8</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <Text style={styles.statLabel}>Games Played</Text>
                <Text style={styles.statValue}>32</Text>
              </View>
            </View>

            {/* Progress-style stat only for percentage metric */}
            <View style={styles.statCard}>
              <View style={styles.statHeaderRow}>
                <Text style={styles.statLabel}>Win Rate</Text>
                <Text style={styles.statValue}>75%</Text>
              </View>
              <View style={styles.statBarBackground}>
                <View style={[styles.statBarFill, { width: '75%' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>{notificationsEnabled ? 'Enabled' : 'Disabled'}</Text>
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => setSoundEnabled(!soundEnabled)}
          >
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Text style={styles.settingValue}>{soundEnabled ? 'Enabled' : 'Disabled'}</Text>
          </Pressable>
          
          <Pressable 
            style={styles.settingItem}
            onPress={() => setHapticEnabled(!hapticEnabled)}
          >
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Text style={styles.settingValue}>{hapticEnabled ? 'Enabled' : 'Disabled'}</Text>
          </Pressable>
          
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Text style={styles.settingLabel}>Friends & Social</Text>
              <Text style={styles.settingSubtext}>Connect with other players</Text>
            </View>
          </Pressable>
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
  profileCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'HelveticaBold',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'HelveticaRegular',
    marginBottom: 8,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'HelveticaRegular',
  },
  statsGrid: {
    flexDirection: 'column',
  },
  statCard: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    minHeight: 56,
    justifyContent: 'center',
  },
  statHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'HelveticaMedium',
    textTransform: 'uppercase',
  },
  statBarBackground: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  settingItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'HelveticaMedium',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'HelveticaRegular',
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'HelveticaRegular',
    marginTop: 4,
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