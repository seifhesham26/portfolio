import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { monogramOuter, monogramInner, monogramHeight, type Point2 } from "@/lib/intro-geometry";
import { monogramLensingShader } from "./lensing-shader";

export type MonogramState = {
  fill: number; lens: number; burst: number; hue: number;
  x: number; y: number; scale: number; widthScale: number; rotationX: number; rotationY: number;
};

export function createMonogramScene(canvas: HTMLCanvasElement, onLost: () => void) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setClearColor(0x040607, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3.9, -3.9, 0.1, 100);
  camera.position.z = 12;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.5;
  scene.add(new THREE.HemisphereLight(0xc4e8ff, 0x171b25, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(-3, 4, 7);
  const rim = new THREE.DirectionalLight(0xa0d6ff, 3);
  rim.position.set(4, -1, 4);
  scene.add(key, rim);

  const shapeFrom = (points: readonly Point2[]) => new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const shellShape = shapeFrom(monogramOuter);
  shellShape.holes.push(new THREE.Path([...monogramInner].reverse().map(([x, y]) => new THREE.Vector2(x, y))));
  const shellGeometry = new THREE.ExtrudeGeometry(shellShape, {
    depth: 0.27, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.045, bevelSegments: 3, steps: 1,
  });
  const floorGeometry = new THREE.ExtrudeGeometry(shapeFrom(monogramInner), {
    depth: 0.055, bevelEnabled: true, bevelSize: 0.018, bevelThickness: 0.018, bevelSegments: 2, steps: 1,
  });
  const liquidGeometry = new THREE.ExtrudeGeometry(shapeFrom(monogramInner), {
    depth: 0.1, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, steps: 1,
  });
  const steel = new THREE.MeshStandardMaterial({ color: 0x343c45, metalness: 0.95, roughness: 0.29 });
  steel.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 vSteelPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvSteelPosition = position;");
    shader.fragmentShader = "varying vec3 vSteelPosition;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
      float grain = fract(sin(dot(floor(vSteelPosition.xy * 370.0), vec2(12.9898,78.233))) * 43758.5453);
      roughnessFactor = clamp(roughnessFactor + (grain - 0.5) * 0.14, 0.12, 0.6);
      diffuseColor.rgb *= 0.88 + grain * 0.18;`);
  };
  const dark = new THREE.MeshStandardMaterial({ color: 0x080d13, metalness: 0.75, roughness: 0.38 });
  const liquid = new THREE.MeshPhysicalMaterial({ color: 0xffffff, emissive: 0xd8faff,
    emissiveIntensity: 1.4, metalness: 0.2, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });
  const uniforms = { uFill: { value: 0 }, uTime: { value: 0 } };
  liquid.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = "varying vec3 vFluidPosition;\n" + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvFluidPosition = position;");
    shader.fragmentShader = "uniform float uFill; uniform float uTime; varying vec3 vFluidPosition;\n" + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>
      float wave = (sin(vFluidPosition.x * 7.0 + uTime * 2.1) * 0.027 + sin(vFluidPosition.x * 13.0 - uTime * 1.5) * 0.012) * sin(uFill * 3.14159);
      float level = mix(-2.18, 2.18, uFill) + wave;
      if (vFluidPosition.y > level) discard;`);
    shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
      float edge = 1.0 - smoothstep(0.0, 0.055, level - vFluidPosition.y);
      float ripple = sin(vFluidPosition.y * 31.0 + vFluidPosition.x * 8.0 - uTime * 2.0);
      totalEmissiveRadiance *= 0.92 + ripple * 0.08 + edge * 0.6;`);
  };
  const group = new THREE.Group();
  const shell = new THREE.Mesh(shellGeometry, steel);
  const floor = new THREE.Mesh(floorGeometry, dark);
  floor.position.z = -0.055;
  const fluid = new THREE.Mesh(liquidGeometry, liquid);
  fluid.position.z = 0.055;
  group.add(shell, floor, fluid);
  scene.add(group);
  const state: MonogramState = { fill: 0, lens: 0, burst: 0, hue: 0, x: 0, y: 0.35, scale: 1, widthScale: 1, rotationX: 0.09, rotationY: -0.23 };
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 });
  const composer = new EffectComposer(renderer, target);
  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.035, 0.3, 1.4);
  const lens = new ShaderPass(monogramLensingShader);
  const output = new OutputPass();
  composer.addPass(renderPass); composer.addPass(bloom); composer.addPass(lens); composer.addPass(output);
  let baseScale = 1;
  let disposed = false;
  let frame = 0;
  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    camera.left = -3.9 * aspect; camera.right = 3.9 * aspect;
    camera.updateProjectionMatrix();
    baseScale = Math.min(1.05, aspect * 1.13);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 768 ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(width, height);
    lens.uniforms.uAspect.value = aspect;
  };
  resize();
  const white = new THREE.Color(0xe8fbff);
  const ice = new THREE.Color(0x56ddff);
  const violet = new THREE.Color(0xa8a2ff);
  const render = (time: number) => {
    if (disposed) return;
    uniforms.uFill.value = state.fill;
    uniforms.uTime.value = time / 1000;
    group.position.set(state.x, state.y, 0);
    group.scale.set(baseScale * state.scale * state.widthScale, baseScale * state.scale, baseScale * state.scale);
    group.rotation.set(state.rotationX, state.rotationY, 0);
    liquid.emissive.copy(white).lerp(state.hue > 1 ? violet : ice, state.hue > 1 ? state.hue - 1 : state.hue);
    liquid.emissiveIntensity = 1.4 + state.burst * 0.5;
    bloom.strength = 0.035 + state.burst * 0.02;
    lens.uniforms.uCenter.value.set(
      0.5 + state.x / (2 * camera.right),
      0.5 + state.y / (2 * camera.top),
    );
    // Radius follows the S's projected size on both portrait and wide screens.
    lens.uniforms.uRadius.value = monogramHeight * baseScale * state.scale / 7.8 * 0.23;
    lens.uniforms.uStrength.value = state.lens * 0.9;
    // Voidix's black-hole mesh supplies this core; here the pass closes it itself.
    lens.uniforms.uShadow.value = state.lens;
    lens.uniforms.uRingStrength.value = state.lens * 0.08;
    lens.uniforms.uTime.value = time / 1000;
    composer.render();
    frame = requestAnimationFrame(render);
  };
  frame = requestAnimationFrame(render);
  window.addEventListener("resize", resize);
  const lost = (event: Event) => { event.preventDefault(); onLost(); };
  canvas.addEventListener("webglcontextlost", lost);
  return {
    state,
    ready: renderer.compileAsync(scene, camera),
    fit(rect: DOMRect) {
      return {
        x: ((rect.left + rect.width / 2) / window.innerWidth * 2 - 1) * camera.right,
        y: (1 - (rect.top + rect.height / 2) / window.innerHeight * 2) * camera.top,
        scale: rect.height / window.innerHeight * 7.8 / (monogramHeight * baseScale),
        widthScale: rect.width / rect.height * monogramHeight / 4.25,
      };
    },
    dispose() {
      disposed = true; cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", lost);
      shellGeometry.dispose(); floorGeometry.dispose(); liquidGeometry.dispose();
      steel.dispose(); dark.dispose(); liquid.dispose();
      renderPass.dispose(); bloom.dispose(); lens.dispose(); output.dispose(); composer.dispose();
      environment.dispose(); room.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
