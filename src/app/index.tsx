import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from './auth/auth';

export default function Index() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session !== undefined) {
      if (session) {
        router.replace('/tabs');
      } else {
        router.replace('./auth/Signin');
      }
    }
  }, [session, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
