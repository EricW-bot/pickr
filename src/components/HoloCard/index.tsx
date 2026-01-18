import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import { DeviceMotion } from 'expo-sensors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  useDerivedValue
} from 'react-native-reanimated';
import { foilShader } from './shader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface HoloCardProps {
  title: string;
  damage: number;
}

export default function HoloCard({ title, damage }: HoloCardProps) {
  // 1. Setup Animation Values (Reanimated)
  const roll = useSharedValue(0);
  const pitch = useSharedValue(0);

  // 2. Prepare Uniforms for Skia
  // We wrap them in a derived value so Skia can read them as a single object
  const uniforms = useDerivedValue(() => {
    return {
      resolution: [CARD_WIDTH, CARD_HEIGHT],
      roll: roll.value,
      pitch: pitch.value,
    };
  });

  // 3. Start Sensors
  useEffect(() => {
    DeviceMotion.setUpdateInterval(16); // ~60fps
    
    const subscription = DeviceMotion.addListener((data) => {
      if (data.rotation) {
        // Smoothly animate the values
        roll.value = withSpring(data.rotation.gamma, { damping: 20 });
        pitch.value = withSpring(data.rotation.beta, { damping: 20 });
      }
    });

    return () => subscription.remove();
  }, []);

  // 4. 3D Transform Style (Physical Rotation)
  const rStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(roll.value, [-1, 1], [-20, 20]); // Left/Right
    const rotateX = interpolate(pitch.value, [-1, 1], [20, -20]); // Up/Down

    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { rotateX: `${rotateX}deg` },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, rStyle]}>
      {/* Background Content */}
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.damageBadge}>
            <Text style={styles.damageText}>{damage}</Text>
          </View>
        </View>
        <Text style={styles.placeholderArt}>[ ARTWORK ]</Text>
      </View>

      {/* Holographic Overlay */}
      <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
        <Rect x={0} y={0} width={CARD_WIDTH} height={CARD_HEIGHT}>
          <Shader source={foilShader} uniforms={uniforms} />
        </Rect>
      </Canvas>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 8,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  damageBadge: {
    backgroundColor: '#ef4444',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  damageText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderArt: {
    color: '#333',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 100,
    opacity: 0.5,
  }
});