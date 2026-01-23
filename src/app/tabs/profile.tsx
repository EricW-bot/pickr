import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Mock data (replace with real profile later)
  const username = 'Rick Astley';
  const level = 12;
  const xpCurrent = 2450;
  const xpNext = 3600;
  const xpPct = useMemo(() => Math.max(0, Math.min(1, xpCurrent / xpNext)), [xpCurrent, xpNext]);

  const wins = 24;
  const losses = 8;
  const gamesPlayed = 32;
  const winRatePct = useMemo(() => {
    if (!gamesPlayed) return 0;
    return Math.round((wins / gamesPlayed) * 100);
  }, [gamesPlayed, wins]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Stats, settings, and your identity.</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <IconSymbol name="info.circle" size={20} color="#fff" />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RA</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.userLevel}>Level {level}</Text>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${Math.round(xpPct * 100)}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {xpCurrent.toLocaleString()} / {xpNext.toLocaleString()} XP
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Battle Stats</Text>
            <Text style={styles.sectionMeta}>Lifetime</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Wins</Text>
              </View>
              <Text style={styles.rowValue}>{wins}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Losses</Text>
              </View>
              <Text style={styles.rowValue}>{losses}</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Games Played</Text>
              </View>
              <Text style={styles.rowValue}>{gamesPlayed}</Text>
            </View>
            <View style={[styles.row, styles.rowNoDivider]}>
              <View style={styles.rowMain}>
                <View style={styles.rowTopLine}>
                  <Text style={styles.rowLabel}>Win Rate</Text>
                  <Text style={styles.rowValue}>{winRatePct}%</Text>
                </View>
                <View style={styles.statBarBackground}>
                  <View style={[styles.statBarFill, { width: `${winRatePct}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <Text style={styles.sectionMeta}>Tap to toggle</Text>
          </View>

          <View style={styles.card}>
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Notifications</Text>
                <Text style={styles.rowSubtle}>Game updates and friend activity</Text>
              </View>
              <Text style={styles.rowValueMuted}>{notificationsEnabled ? 'On' : 'Off'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => setSoundEnabled(!soundEnabled)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Sound Effects</Text>
                <Text style={styles.rowSubtle}>UI clicks and battle SFX</Text>
              </View>
              <Text style={styles.rowValueMuted}>{soundEnabled ? 'On' : 'Off'}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => setHapticEnabled(!hapticEnabled)}
            >
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Haptic Feedback</Text>
                <Text style={styles.rowSubtle}>Vibration for important actions</Text>
              </View>
              <Text style={styles.rowValueMuted}>{hapticEnabled ? 'On' : 'Off'}</Text>
            </Pressable>

            <Pressable style={({ pressed }) => [styles.row, styles.rowNoDivider, pressed && styles.rowPressed]}>
              <View style={styles.rowMain}>
                <Text style={styles.rowLabel}>Friends & Social</Text>
                <Text style={styles.rowSubtle}>Connect with other players</Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color="#888" />
            </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  scrollContent: {
    paddingBottom: 100,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
    right: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    opacity: 0.75,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionMeta: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'HelveticaMedium',
  },
  profileCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
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
    color: '#888',
    fontFamily: 'HelveticaRegular',
    marginBottom: 8,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#222',
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
    color: '#888',
    fontFamily: 'HelveticaRegular',
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
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  rowNoDivider: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  },
  rowValue: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
  },
  rowValueMuted: {
    color: '#888',
    fontFamily: 'HelveticaMedium',
    fontSize: 12,
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
});