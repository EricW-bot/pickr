import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/lib/supabase';
import React, { useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/auth';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const [username, setUsername] = useState(user?.username || 'User');
  const [wins, setWins] = useState(user?.wins ?? 0);
  const [losses, setLosses] = useState(user?.losses ?? 0);
  const [draws, setDraws] = useState(user?.draws ?? 0);
  const [gamesPlayed, setGamesPlayed] = useState((user?.wins ?? 0) + (user?.losses ?? 0) + (user?.draws ?? 0));
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    if (!user?.id) return;
    fetchStats(user.id);
  }, [isFocused, user?.id]);

  async function fetchStats(userId: string) {
    try {
      if (!userId) return;
      console.log('Fetching stats from Supabase...');
      const { data, error } = await (supabase as any)
        .from('users')
        .select(
          `
            username,
            wins,
            losses,
            draws
          `,
        )
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error('Error fetching stats:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      } else {
        const row = data as unknown as { 
          username: string | null,
          wins: number | null, 
          losses: number | null, 
          draws: number | null,
        } | null;
        const nextUsername = row?.username ?? 'User';
        const nextWins = row?.wins ?? 0;
        const nextLosses = row?.losses ?? 0;
        const nextDraws = row?.draws ?? 0;
        const nextGamesPlayed = nextWins + nextLosses + nextDraws;
        console.log(`Successfully fetched ${nextUsername} username, ${nextWins} wins, ${nextLosses} losses, ${nextDraws} draws, ${nextGamesPlayed} games played`);
        setUsername(nextUsername);
        setWins(nextWins);
        setLosses(nextLosses);
        setDraws(nextDraws);
        setGamesPlayed(nextGamesPlayed);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  // Mock data for level/XP (not in database yet)
  const level = 12;
  const xpCurrent = 2450;
  const xpNext = 3600;
  const xpPct = useMemo(() => Math.max(0, Math.min(1, xpCurrent / xpNext)), [xpCurrent, xpNext]);

  // Calculate win rate percentage based on data from db
  const winRatePct = useMemo(() => {
    if (!gamesPlayed) return 0;
    return Math.round((wins / gamesPlayed) * 100);
  }, [gamesPlayed, wins]);

  // Get initials for avatar
  const avatarInitials = useMemo(() => {
    if (!username) return 'U';
    const parts = username.split(' ');
    if (parts.length === 1) return username[0].toUpperCase();
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return username.substring(0, 2).toUpperCase();
  }, [username]);

  const handleSignOutPress = () => {
    setShowSignOutModal(true);
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    const { success } = await signOut();
    setIsSigningOut(false);
    
    if (success) {
      setShowSignOutModal(false);
      router.replace('/auth/Signin');
    } else {
      setShowSignOutModal(false);
    }
  };

  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
  };

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
              <Text style={styles.avatarText}>{avatarInitials}</Text>
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
                <Text style={styles.rowLabel}>Draws</Text>
              </View>
              <Text style={styles.rowValue}>{draws}</Text>
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

        {/* Sign Out Section */}
        <View style={styles.section}>
          <Pressable
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
            onPress={handleSignOutPress}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal
        visible={showSignOutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelSignOut}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={handleCancelSignOut}
        >
          <Pressable 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sign Out</Text>
            </View>
            
            <Text style={styles.modalMessage}>Are you sure?</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonCancel,
                  pressed && styles.modalButtonPressed,
                ]}
                onPress={handleCancelSignOut}
                disabled={isSigningOut}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalButtonConfirm,
                  (pressed || isSigningOut) && styles.modalButtonPressed,
                ]}
                onPress={handleConfirmSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <ActivityIndicator size="small" color="#fecaca" />
                ) : (
                  <Text style={styles.modalButtonConfirmText}>Sign Out</Text>
                )}
              </Pressable>
            </View>
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
  signOutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  signOutButtonPressed: {
    opacity: 0.85,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  signOutButtonText: {
    color: '#fecaca',
    fontSize: 16,
    fontFamily: 'HelveticaBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  modalMessage: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'HelveticaRegular',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonCancel: {
    backgroundColor: '#0f0f0f',
    borderColor: '#2a2a2a',
  },
  modalButtonConfirm: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalButtonPressed: {
    opacity: 0.75,
  },
  modalButtonCancelText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'HelveticaBold',
  },
  modalButtonConfirmText: {
    color: '#fecaca',
    fontSize: 16,
    fontFamily: 'HelveticaBold',
  },
});