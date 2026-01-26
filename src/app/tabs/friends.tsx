import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Friend = {
  id: string;
  name: string;
  statusText: string; // e.g. "Online", "Last seen 2h ago"
  mutuals?: number;
};

type Request = {
  id: string;
  name: string;
  mutuals?: number;
};

type Club = {
  id: string;
  name: string;
  members: number;
  blurb: string;
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('');
}

export default function FriendsScreen() {
  const [friendsQuery, setFriendsQuery] = useState('');
  const [clubsQuery, setClubsQuery] = useState('');

  // Mock data (replace with Supabase later)
  const requests: Request[] = [
    { id: 'r1', name: 'Michael Jackson', mutuals: 3 },
    { id: 'r2', name: 'John Doe', mutuals: 1 },
  ];

  const filteredFriends = useMemo(() => {
    const friends: Friend[] = [
      { id: 'f1', name: 'The Rock', statusText: 'Online', mutuals: 2 },
      { id: 'f2', name: 'Rick Astley', statusText: 'Last seen 2h ago', mutuals: 0 },
      { id: 'f3', name: 'LeBron James', statusText: 'Online', mutuals: 5 },
    ];
    const q = friendsQuery.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter((f) => f.name.toLowerCase().includes(q));
  }, [friendsQuery]);

  const filteredClubs = useMemo(() => {
    const clubs: Club[] = [
      { id: 'c1', name: 'UNSW', members: 24, blurb: 'Campus picks + weekly ladders.' },
      { id: 'c2', name: 'Running Club', members: 8, blurb: 'Card drafts after long runs.' },
      { id: 'c3', name: 'The Boys', members: 32, blurb: 'No mercy, only parlays.' },
    ];
    const q = clubsQuery.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter((c) => c.name.toLowerCase().includes(q));
  }, [clubsQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Friends</Text>
          <Text style={styles.subtitle}>Build your crew. Share picks. Climb ladders.</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <LinearGradient
              colors={['#1a1a1a', '#0f0f0f']}
              style={styles.iconButtonGradient}
            >
              <IconSymbol name="paperplane.fill" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
            <LinearGradient
              colors={['#1a1a1a', '#0f0f0f']}
              style={styles.iconButtonGradient}
            >
              <IconSymbol name="friends" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Friend Requests</Text>
            <Text style={styles.sectionMeta}>{requests.length}</Text>
          </View>

          {requests.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No requests right now</Text>
              <Text style={styles.emptySubtitle}>Share your profile to get started.</Text>
            </View>
          ) : (
            <LinearGradient 
              colors={['#1a1a1a', '#0f0f0f']}
              style={styles.card}
            >
              {requests.map((r) => (
                <View key={r.id} style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(r.name)}</Text>
                  </View>
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle}>{r.name}</Text>
                    <Text style={styles.rowSubtle}>{r.mutuals ? `${r.mutuals} mutual friends` : 'No mutuals yet'}</Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable style={({ pressed }) => [styles.pill, styles.pillAccept, pressed && styles.pillPressed]}>
                      <Text style={styles.pillText}>Accept</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.pill, styles.pillDecline, pressed && styles.pillPressed]}>
                      <Text style={styles.pillText}>Decline</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </LinearGradient>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Your Friends</Text>
            <Text style={styles.sectionMeta}>{filteredFriends.length}</Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              value={friendsQuery}
              onChangeText={setFriendsQuery}
              placeholder="Search friends..."
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
            {friendsQuery.length > 0 && (
              <Pressable style={({ pressed }) => [styles.searchClear, pressed && styles.searchClearPressed]} onPress={() => setFriendsQuery('')}>
                <IconSymbol name="xmark" size={16} color="#fff" />
              </Pressable>
            )}
          </View>

          <LinearGradient 
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.card}
          >
            {filteredFriends.length === 0 ? (
              <View style={styles.emptyInline}>
                <Text style={styles.emptyTitle}>No matches</Text>
                <Text style={styles.emptySubtitle}>Try a different search.</Text>
              </View>
            ) : (
              filteredFriends.map((f) => (
                <Pressable key={f.id} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(f.name)}</Text>
                  </View>
                  <View style={styles.rowMain}>
                    <View style={styles.rowTopLine}>
                      <Text style={styles.rowTitle}>{f.name}</Text>
                      {f.statusText === 'Online' ? <View style={styles.onlineDot} /> : null}
                    </View>
                    <Text style={styles.rowSubtle}>
                      {f.statusText}
                      {typeof f.mutuals === 'number' ? ` • ${f.mutuals} mutuals` : ''}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={18} color="#888" />
                </Pressable>
              ))
            )}
          </LinearGradient>

          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
            <Text style={styles.primaryButtonText}>Invite a friend</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Clubs</Text>
            <Text style={styles.sectionMeta}>{filteredClubs.length}</Text>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              value={clubsQuery}
              onChangeText={setClubsQuery}
              placeholder="Search clubs..."
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
            {clubsQuery.length > 0 && (
              <Pressable style={({ pressed }) => [styles.searchClear, pressed && styles.searchClearPressed]} onPress={() => setClubsQuery('')}>
                <IconSymbol name="xmark" size={16} color="#fff" />
              </Pressable>
            )}
          </View>

          <LinearGradient 
            colors={['#1a1a1a', '#0f0f0f']}
            style={styles.card}
          >
            {filteredClubs.length === 0 ? (
              <View style={styles.emptyInline}>
                <Text style={styles.emptyTitle}>No matches</Text>
                <Text style={styles.emptySubtitle}>Try a different search.</Text>
              </View>
            ) : (
              filteredClubs.map((c) => (
                <Pressable key={c.id} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                  <View style={styles.rowMain}>
                    <View style={styles.rowTopLine}>
                      <Text style={styles.rowTitle}>{c.name}</Text>
                    </View>
                    <Text style={styles.rowSubtle}>
                      {c.members} members • {c.blurb}
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={18} color="#888" />
                </Pressable>
              ))
            )}
          </LinearGradient>
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
    right: 90,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
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
    marginBottom: 12,
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
  rowPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
  },
  rowTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowTitle: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 16,
  },
  rowSubtle: {
    marginTop: 2,
    color: '#888',
    fontFamily: 'HelveticaRegular',
    fontSize: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  rowActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillPressed: {
    opacity: 0.8,
  },
  pillAccept: {
    backgroundColor: '#1b3a2a',
    borderColor: '#2b6b4d',
  },
  pillDecline: {
    backgroundColor: '#2a1212',
    borderColor: '#7f1d1d',
  },
  pillText: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 16,
  },
  emptyInline: {
    padding: 16,
  },
  emptyTitle: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
    marginBottom: 2,
  },
  emptySubtitle: {
    color: '#888',
    fontFamily: 'HelveticaRegular',
    fontSize: 12,
    lineHeight: 16,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  clubCard: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    padding: 16,
    marginBottom: 12,
  },
  clubTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  clubName: {
    color: '#fff',
    fontFamily: 'HelveticaBold',
    fontSize: 16,
  },
  clubMembers: {
    color: '#888',
    fontFamily: 'HelveticaMedium',
    fontSize: 12,
  },
  clubBlurb: {
    color: '#aaa',
    fontFamily: 'HelveticaRegular',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  clubFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubFooterText: {
    color: '#888',
    fontFamily: 'HelveticaMedium',
    fontSize: 12,
  },
});