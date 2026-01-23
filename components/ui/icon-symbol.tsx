// Fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type MaterialIconsMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
type MaterialCommunityIconsMapping = Record<string, ComponentProps<typeof MaterialCommunityIcons>['name']>;
type FontAwesomeMapping = Record<string, ComponentProps<typeof FontAwesome5>['name']>;
type IoniconsMapping = Record<string, ComponentProps<typeof Ionicons>['name']>;
/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see Material Community Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MATERIAL_ICONS_MAPPING: MaterialIconsMapping = {
  'house.fill': 'home',
  'cart.fill': 'shopping-cart',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'info.circle': 'info',
  'xmark': 'close',
  'friends': 'groups',
};

const MATERIAL_COMMUNITY_ICONS_MAPPING: MaterialCommunityIconsMapping = {
  // Add MaterialCommunityIcons mappings here
  // Example: 'some.symbol': 'some-material-community-icon-name',
  'cards.playing': 'cards',
  'battle': 'axe-battle',
};

const FONT_AWESOME_ICONS_MAPPING: FontAwesomeMapping = {
  'friends': 'user-friends',
};

const IONICONS_ICONS_MAPPING: IoniconsMapping = {
  'person.fill': 'person',
  'trophy': 'trophy',
};

// Combined mapping for type checking
const MAPPING = { ...MATERIAL_ICONS_MAPPING, ...MATERIAL_COMMUNITY_ICONS_MAPPING, ...FONT_AWESOME_ICONS_MAPPING, ...IONICONS_ICONS_MAPPING };
type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons or Material Community Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Check if the icon is in MaterialCommunityIcons mapping first
  if (name in MATERIAL_COMMUNITY_ICONS_MAPPING) {
    return (
      <MaterialCommunityIcons
        color={color}
        size={size}
        name={MATERIAL_COMMUNITY_ICONS_MAPPING[name]}
        style={style}
      />
    );
  }

  if (name in FONT_AWESOME_ICONS_MAPPING) {
    return (
      <FontAwesome5
        color={color}
        size={size}
        name={FONT_AWESOME_ICONS_MAPPING[name]}
        style={style}
      />
    );
  }

  if (name in IONICONS_ICONS_MAPPING) {
    return (
      <Ionicons
        color={color}
        size={size}
        name={IONICONS_ICONS_MAPPING[name]}
        style={style}
      />
    );
  }

  // Default to MaterialIcons
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MATERIAL_ICONS_MAPPING[name]}
      style={style}
    />
  );
}
