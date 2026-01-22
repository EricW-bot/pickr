import { Skia } from "@shopify/react-native-skia";

// This GLSL code creates a subtle holographic highlight with rarity-based color tints
// rarity: 0 = common (green), 1 = rare (blue), 2 = legendary (gold)
export const foilShader = Skia.RuntimeEffect.Make(`
  uniform float2 resolution;
  uniform float roll;  // Phone tilt left/right
  uniform float pitch; // Phone tilt up/down
  uniform float rarity; // 0 = common, 1 = rare, 2 = legendary

  const float PI = 3.14159265;

  vec4 main(vec2 pos) {
    // Normalized UV, centered at (0,0)
    vec2 uv = pos / resolution;
    vec2 centered = (pos - 0.5 * resolution) / resolution.y;

    // 1. Compute a light direction from device tilt
    vec2 lightDir = normalize(vec2(roll, -pitch) + 0.001);

    // 2. Very subtle stripes with low frequency
    float stripeCoord = dot(centered, lightDir) * 2.5 + atan(pitch, roll) * 1.5;
    float bands = sin(stripeCoord) * 0.3 + 0.7; // Softer, less harsh

    // 3. Rarity-based color tints
    vec3 rarityTint;
    if (rarity < 0.5) {
      // Common - Green tint (0.0)
      rarityTint = vec3(0.2, 0.4, 0.25);
    } else if (rarity < 1.5) {
      // Rare - Blue tint (1.0)
      rarityTint = vec3(0.2, 0.3, 0.5);
    } else {
      // Legendary - Gold tint (2.0)
      rarityTint = vec3(0.5, 0.4, 0.2);
    }

    // 4. Subtle iridescent shimmer mixed with rarity tint
    vec3 rainbow = 0.5 + 0.3 * cos(vec3(0.0, 0.33, 0.67) * PI * 2.0 + bands);
    vec3 color = mix(rarityTint, rainbow, 0.4);

    // 5. Vignette so the effect is strongest near the center
    float dist = length(centered);
    float vignette = 1.0 - smoothstep(0.2, 0.9, dist);

    // 6. Scale intensity by how much the card is tilted (more subtle)
    float tiltStrength = clamp(length(vec2(roll, pitch)) * 1.2, 0.0, 1.0);

    // Final intensity: very subtle and localized
    float intensity = vignette * tiltStrength * 0.4;

    // Very low alpha to keep underlying art clearly visible
    float alpha = 0.15 * intensity;

    return vec4(color * intensity, alpha);
  }
`)!;