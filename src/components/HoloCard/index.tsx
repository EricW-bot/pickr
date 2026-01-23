import { Canvas, Rect, Shader } from "@shopify/react-native-skia";
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { foilShader } from './shader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface HoloCardProps {
  title: string;
  damage: number;
  rarity?: 'common' | 'rare' | 'legendary';
  image_url: string;
}

export default function HoloCard({ title, damage, rarity = 'common', image_url }: HoloCardProps) {
  // Convert rarity string to number for shader: common=0, rare=1, legendary=2
  const rarityValue = rarity === 'common' ? 0 : rarity === 'rare' ? 1 : 2;
  // 1. Setup Animation Values (Reanimated)
  const roll = useSharedValue(0);
  const pitch = useSharedValue(0);
  
  // Track the starting position for smooth dragging
  const startRoll = useSharedValue(0);
  const startPitch = useSharedValue(0);

  // 2. Prepare Uniforms for Skia
  // We wrap them in a derived value so Skia can read them as a single object
  const uniforms = useDerivedValue(() => {
    return {
      resolution: [CARD_WIDTH, CARD_HEIGHT],
      roll: roll.value,
      pitch: pitch.value,
      rarity: rarityValue,
    };
  });

  // 3. Pan Gesture Handler (Finger Drag)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Store the current values when drag starts
      startRoll.value = roll.value;
      startPitch.value = pitch.value;
    })
    .onUpdate((event) => {
      // Convert drag position to roll/pitch values
      // Normalize to -1 to 1 range based on card dimensions
      // Horizontal drag controls roll (left/right tilt)
      const newRoll = startRoll.value + (event.translationX / (CARD_WIDTH / 2));
      // Vertical drag controls pitch (up/down tilt)
      const newPitch = startPitch.value + (event.translationY / (CARD_HEIGHT / 2));
      
      // Clamp values to reasonable range
      roll.value = Math.max(-1, Math.min(1, newRoll));
      pitch.value = Math.max(-1, Math.min(1, newPitch));
    })
    .onEnd(() => {
      // Spring back to center when finger is released
      roll.value = withSpring(0, { damping: 15, stiffness: 150 });
      pitch.value = withSpring(0, { damping: 15, stiffness: 150 });
    });

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
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, rStyle]}>
        {/* Background Content */}
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
              </Text>
            </View>
            <View style={styles.damageBadge}>
              <Text style={styles.damageText}>{damage}</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <Image 
              source={{uri: `${image_url}`}} 
              style={styles.cardArt} 
            />
          </View>
        </View>

        {/* Holographic Overlay */}
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Rect x={0} y={0} width={CARD_WIDTH} height={CARD_HEIGHT}>
            <Shader source={foilShader} uniforms={uniforms} />
          </Rect>
        </Canvas>
      </Animated.View>
    </GestureDetector>
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
    gap: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0, // Allows flex to shrink below content size
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flexShrink: 1,
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
  },
  imageContainer: {
    width: CARD_WIDTH - 50, // Account for padding (20 on each side)
    height: CARD_HEIGHT - 140, // Account for padding and header space
    borderRadius: 30,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cardArt: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});