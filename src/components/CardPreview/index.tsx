import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

interface CardPreviewProps {
  title: string;
  damage: number;
  onPress?: () => void;
  image_url: string;
}

export default function CardPreview({ title, damage, onPress, image_url }: CardPreviewProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
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
    </Pressable>
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
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
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
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    flexShrink: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0, // Allows flex to shrink below content size
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
