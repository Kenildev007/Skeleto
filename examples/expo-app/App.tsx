import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AutoSkeleton } from 'skeleton-auto';

const FAKE_USER = {
  name: 'Ada Lovelace',
  bio: 'Mathematician, writer. Often regarded as the first computer programmer.',
  avatar: 'https://i.pravatar.cc/96?u=ada',
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.h1}>skeleton-auto</Text>

          <View style={styles.controls}>
            <Pressable
              onPress={() => setLoading((l) => !l)}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnText}>{loading ? 'Show real' : 'Show skeleton'}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
              style={({ pressed }) => [styles.btnGhost, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnGhostText}>Simulate fetch</Text>
            </Pressable>
          </View>

          <Text style={styles.h2}>1. User card</Text>
          <AutoSkeleton loading={loading} minDuration={400}>
            <UserCard />
          </AutoSkeleton>

          <Text style={styles.h2}>2. Pulse animation</Text>
          <AutoSkeleton loading={loading} animation="pulse">
            <UserCard />
          </AutoSkeleton>

          <Text style={styles.h2}>3. Stagger reveal</Text>
          <AutoSkeleton loading={loading} staggerChildren={80}>
            <View style={{ gap: 12 }}>
              <UserCard />
              <UserCard />
              <UserCard />
            </View>
          </AutoSkeleton>

          <Text style={styles.h2}>4. List (no measurement)</Text>
          {loading ? (
            <AutoSkeleton.List count={5} estimatedItemHeight={56} gap={10} />
          ) : (
            <View style={{ gap: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View key={i} style={styles.row}>
                  <Text>Row {i + 1}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function UserCard() {
  return (
    <View style={styles.card}>
      <Image source={{ uri: FAKE_USER.avatar }} style={styles.avatar} />
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.name}>{FAKE_USER.name}</Text>
        <Text style={styles.bio}>{FAKE_USER.bio}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Follow</Text>
          </View>
          <View style={[styles.pill, styles.pillGhost]}>
            <Text style={styles.pillTextGhost}>Message</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16, gap: 16 },
  h1: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  h2: { fontSize: 14, fontWeight: '600', color: '#52525b', marginTop: 16, marginBottom: 4 },
  controls: { flexDirection: 'row', gap: 8 },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: '#4f46e5' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnGhost: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7', backgroundColor: '#fff' },
  btnGhostText: { color: '#18181b', fontSize: 13 },
  btnPressed: { opacity: 0.7 },
  card: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e4e7' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { fontWeight: '600', fontSize: 16 },
  bio: { fontSize: 13, color: '#71717a' },
  pill: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, backgroundColor: '#f4f4f5' },
  pillGhost: { borderWidth: 1, borderColor: '#e4e4e7', backgroundColor: '#fff' },
  pillText: { fontSize: 12 },
  pillTextGhost: { fontSize: 12, color: '#71717a' },
  row: { padding: 14, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e4e7' },
});
