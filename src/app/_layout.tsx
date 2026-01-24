import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'react-native-url-polyfill/auto';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthContextProvider } from './auth/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="auth/Signin" options={{ headerShown: false }} />
            <Stack.Screen name="auth/Signup" options={{ headerShown: false }} />
            <Stack.Screen name="tabs" options={{ headerShown: false }} />
            <Stack.Screen 
              name="inspect" 
              options={{ 
                headerShown: false,
                presentation: 'card',
              }} 
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}