import * as THREE from "three";

/** Anatomical masks stay on the skinned surface; each region has its own finish. */
export function createIceMaterial(
  aoMap: THREE.Texture | null,
  scales: THREE.Texture,
  relief: THREE.Texture,
  membranes: THREE.Texture,
) {
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: scales,
    bumpMap: relief,
    bumpScale: 0.012,
    metalness: 0.02,
    roughness: 0.52,
    clearcoat: 0.12,
    clearcoatRoughness: 0.3,
    iridescence: 0.025,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [180, 300],
    specularIntensity: 0.3,
    specularColor: 0xe1f2ff,
    aoMap,
    aoMapIntensity: 1.25,
    side: THREE.DoubleSide,
    envMapIntensity: 0.3,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.membraneSurface = { value: membranes };
    shader.vertexShader =
      "attribute vec4 _surface;\nvarying vec4 vSurface;\nvarying vec3 vFrostPosition;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      "#include <begin_vertex>\nvFrostPosition = position;\nvSurface = _surface;",
    );
    shader.fragmentShader =
      "uniform sampler2D membraneSurface;\nvarying vec4 vSurface;\nvarying vec3 vFrostPosition;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec4 surfaces = clamp(vSurface, 0.0, 1.0);
      float bodySurface = max(0.0, 1.0 - dot(surfaces, vec4(1.0)));
      vec3 pearl = diffuseColor.rgb * vec3(0.67, 0.77, 0.86);
      vec3 membrane = texture2D(membraneSurface, vMapUv * 0.2).rgb;
      membrane = mix(membrane, vec3(0.30, 0.65, 0.78), 0.35);
      membrane *= vec3(0.35, 0.74, 0.90);
      float icePhase = vFrostPosition.y * 460.0 + vFrostPosition.z * 190.0;
      float iceDetail = 1.0 - smoothstep(0.6, 3.14159, fwidth(icePhase));
      float iceVein = sin(icePhase) * iceDetail * 0.5 + 0.5;
      vec3 crystal = mix(vec3(0.025, 0.18, 0.38), vec3(0.08, 0.38, 0.58), iceVein);
      float ivoryPhase = vFrostPosition.y * 1750.0 + vFrostPosition.z * 730.0;
      float ivoryDetail = 1.0 - smoothstep(0.6, 3.14159, fwidth(ivoryPhase));
      float ivoryGrain = sin(ivoryPhase) * ivoryDetail;
      vec3 ivory = vec3(0.48, 0.40, 0.27) * (0.98 + ivoryGrain * 0.02);
      vec3 eye = vec3(0.003, 0.012, 0.025);
      diffuseColor.rgb = pearl * bodySurface + membrane * surfaces.r
        + crystal * surfaces.g + ivory * surfaces.b + eye * surfaces.a;
      float membraneHeight = membrane.g * 0.006;
      float crystalHeight = iceVein * 0.002;
      float ivoryHeight = ivoryGrain * 0.00015;
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <roughnessmap_fragment>",
      `#include <roughnessmap_fragment>
      roughnessFactor = bodySurface * 0.52 + dot(surfaces, vec4(0.67, 0.24, 0.49, 0.12));
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <metalnessmap_fragment>",
      `#include <metalnessmap_fragment>
      metalnessFactor = bodySurface * 0.02 + surfaces.g * 0.08;
    `,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `
      #ifdef USE_BUMPMAP
        vec2 partRelief = dHdxy_fwd() * bodySurface;
        partRelief += surfaces.r * vec2(dFdx(membraneHeight), dFdy(membraneHeight));
        partRelief += surfaces.g * vec2(dFdx(crystalHeight), dFdy(crystalHeight));
        partRelief += surfaces.b * vec2(dFdx(ivoryHeight), dFdy(ivoryHeight));
        normal = perturbNormalArb(-vViewPosition, normal, partRelief, faceDirection);
      #endif
    `,
    );
  };
  material.customProgramCacheKey = () => "wyvern-anatomical-surfaces-v4";
  return material;
}
