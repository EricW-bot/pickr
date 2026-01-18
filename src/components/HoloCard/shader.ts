import { Skia } from "@shopify/react-native-skia";

// This GLSL code creates a "Linear Interference" rainbow effect
// It mimics how light bounces off the foil texture of a trading card.
export const foilShader = Skia.RuntimeEffect.Make(`
  uniform float2 resolution;
  uniform float roll;  // Phone tilt left/right
  uniform float pitch; // Phone tilt up/down

  const float PI = 3.14159265;

  vec4 main(vec2 pos) {
    vec2 uv = pos / resolution;
    
    // 1. Calculate the "Light Angle" based on device tilt
    // We mix roll and pitch to create a diagonal light source
    float angle = atan(pitch, roll) + (uv.x * 2.0 + uv.y);
    
    // 2. Create "Bands" of light (The holographic ridges)
    // The sin() function creates repeating stripes
    float bands = sin(angle * 10.0 + (roll * 5.0));
    
    // 3. Colorize the bands (Iridescence)
    // We use a cosine palette to create a smooth rainbow shift
    vec3 color = 0.5 + 0.5 * cos(vec3(0.0, 0.33, 0.67) * PI * 2.0 + bands);
    
    // 4. Intensity Mask
    // Only show the shine where the "light" hits strongly
    float intensity = smoothstep(0.8, 1.0, sin(angle * 5.0 + 2.0));
    
    // Return the color with 40% opacity (0.4) so the card art shows through
    return vec4(color * intensity, 0.4); 
  }
`)!;