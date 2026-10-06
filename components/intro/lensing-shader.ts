import { Color, Vector2, type Texture } from "three";

// Adapted from the user's Voidix lib/lensingShader.ts. This is its screen-space
// inverse-square bend and travelling liquid field, centered on the monogram.
export const monogramLensingShader = {
  uniforms: {
    tDiffuse: { value: null as Texture | null },
    uCenter: { value: new Vector2(0.5, 0.5) },
    uRadius: { value: 0.12 },
    uStrength: { value: 0 },
    // A solid white glyph needs less dispersion than Voidix's sparse starfield.
    uAberration: { value: 0.045 },
    uLiquid: { value: 0.6 },
    uShadow: { value: 0 },
    uRingStrength: { value: 0 },
    uRingColor: { value: new Color(0xb5ecff) },
    uTime: { value: 0 },
    uAspect: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uCenter;
    uniform float uRadius;
    uniform float uStrength;
    uniform float uAberration;
    uniform float uLiquid;
    uniform float uShadow;
    uniform float uRingStrength;
    uniform vec3 uRingColor;
    uniform float uTime;
    uniform float uAspect;
    varying vec2 vUv;

    vec4 sampleBent(vec2 direction, float bend) {
      vec2 offset = direction * bend;
      offset.x /= uAspect;
      // Keep strong deflections within the texture instead of wrapping an edge.
      return texture2D(tDiffuse, clamp(vUv - offset, vec2(0.001), vec2(0.999)));
    }

    void main() {
      if (uStrength <= 0.0) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }
      vec2 delta = (vUv - uCenter) * vec2(uAspect, 1.0);
      float distance = length(delta);
      float normalized = distance / max(uRadius, 0.0001);
      vec2 direction = delta / max(distance, 0.00001);
      float falloff = 1.0 / max(normalized * normalized, 0.25);
      float reach = 1.0 - smoothstep(1.0, 7.0, normalized);
      float bend = uStrength * uRadius * falloff * reach;

      float angle = distance > 0.00001 ? atan(direction.y, direction.x) : 0.0;
      float ripple = sin(normalized * 6.0 - uTime * 1.6) * 0.6
                   + sin(angle * 3.0 + uTime * 0.7) * 0.4;
      bend *= 1.0 + uLiquid * ripple * reach;

      float split = uAberration * bend;
      vec4 middle = sampleBent(direction, bend);
      vec3 color = vec3(
        sampleBent(direction, bend - split).r,
        middle.g,
        sampleBent(direction, bend + split).b
      );
      float ring = (1.0 - smoothstep(1.0, 1.18, normalized))
                 * smoothstep(0.88, 1.02, normalized);
      color += uRingColor * ring * uRingStrength;
      color *= mix(1.0, smoothstep(0.9, 1.03, normalized), uShadow);
      gl_FragColor = vec4(color, middle.a);
    }
  `,
};
