import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function ShopScreen() {
  const [loaded] = useFonts({
    HelveticaRegular: require('../../assets/fonts/HelveticaNeue-Regular.otf'),
    HelveticaBold: require('../../assets/fonts/HelveticaNeue-Bold.otf'),
    HelveticaMedium: require('../../assets/fonts/HelveticaNeue-Medium.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Shop</Text>
      </View>
      
      <View style={styles.content}>
        <Text>Coming Soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark mode by default for the game
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'HelveticaBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'HelveticaRegular',
  },
  placeholder: {
    color: '#333',
  },
});