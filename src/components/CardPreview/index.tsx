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
    borderRadius: 16,
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'HelveticaBold',
    flexShrink: 1,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0, // Allows flex to shrink below content size
  },
  damageBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  damageText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'HelveticaBold',
  },
  imageContainer: {
    width: CARD_WIDTH - 32, // padding 16 each side
    height: CARD_HEIGHT - 110, // header + padding
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#1a1a1a',
  },
  cardArt: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
