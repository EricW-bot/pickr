/**
 * Root Layout
 * Expo Router root layout with Amplify configuration
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';

// Dynamically import Amplify config only if amplify_outputs.json exists
let AmplifyConfigured = false;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const amplifyOutputs = require('../amplify_outputs.json');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Amplify } = require('aws-amplify');
  Amplify.configure(amplifyOutputs);
  AmplifyConfigured = true;
} catch (error) {
  // Amplify not configured yet - this is fine during initial setup
  console.log('Amplify not configured yet. Run "npx ampx sandbox" to set up.');
}

export default function RootLayout() {
  useEffect(() => {
    if (AmplifyConfigured) {
      console.log('AWS Amplify configured successfully');
    }
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar barStyle="light-content" />
    </>
  );
}
