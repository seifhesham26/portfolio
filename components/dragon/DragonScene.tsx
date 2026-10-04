"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sampleFlight } from "@/lib/dragon-flight";

function disposeModel(root: THREE.Object3D) {
  const textures = new Set<THREE.Texture>();
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    for (const material of Array.isArray(object.material)
      ? object.material
      : [object.material]) {
      for (const value of Object.values(material))
        if (value instanceof THREE.Texture) textures.add(value);
      material.dispose();
    }
    if (object instanceof THREE.SkinnedMesh) object.skeleton.dispose();
  });
  textures.forEach((texture) => texture.dispose());
}

export default function DragonScene({
  motionEnabled,
}: {
  motionEnabled: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const moving = useRef(motionEnabled);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  useEffect(() => {
    moving.current = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      queueMicrotask(() => {
        if (!disposed) setStatus("unavailable");
      });
      return () => {
        disposed = true;
      };
    }
    gsap.registerPlugin(ScrollTrigger);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 12);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentTarget.texture;
    environment.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xc7e8ff, 0x12273e, 0.9));
    const key = new THREE.DirectionalLight(0xe5f8ff, 2.2);
    key.position.set(-3, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x79d5ed, 3.2);
    rim.position.set(5, 2, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x6289c9, 1.1);
    fill.position.set(-6, -2, 1);
    scene.add(fill);
    const flight = new THREE.Group();
    const bank = new THREE.Group();
    flight.add(bank);
    scene.add(flight);
    let model: THREE.Group | undefined;
    let mixer: THREE.AnimationMixer | undefined;
    let compact = window.innerWidth < 768;
    let dirty = true;
    let lastPoseProgress = 0;
    let heroHeight = window.innerHeight;
    let contextLost = false;
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const scroll = { progress: 0 };
    const controller = gsap.to(scroll, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#portfolio-main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
      },
      onUpdate: () => {
        dirty = true;
      },
    });
    const count = compact ? 65 : 240;
    const positions = new Float32Array(count * 3);
    let seed = 27;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let index = 0; index < count; index++) {
      positions[index * 3] = (random() - 0.5) * 22;
      positions[index * 3 + 1] = (random() - 0.5) * 13;
      positions[index * 3 + 2] = random() * -8 - 1;
    }
    const snowGeometry = new THREE.BufferGeometry();
    snowGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const snowMaterial = new THREE.PointsMaterial({
      color: 0xc6ebf8,
      size: 0.022,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    snowMaterial.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        "#include <color_fragment>\nif (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;",
      );
    };
    scene.add(new THREE.Points(snowGeometry, snowMaterial));

    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(
      "/models/ice-wyvern.glb",
      (gltf) => {
        if (disposed) {
          disposeModel(gltf.scene);
          return;
        }
        model = gltf.scene;
        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const original = (
            Array.isArray(object.material)
              ? object.material[0]
              : object.material
          ) as THREE.MeshStandardMaterial;
          const ice = new THREE.MeshPhysicalMaterial({
            color: 0x81bbd3,
            metalness: 0.26,
            roughness: 0.32,
            clearcoat: 0.8,
            clearcoatRoughness: 0.17,
            iridescence: 0.12,
            iridescenceIOR: 1.3,
            emissive: 0x24566c,
            emissiveIntensity: 0.12,
            aoMap: original.aoMap,
            aoMapIntensity: 1.3,
            side: THREE.DoubleSide,
            envMapIntensity: 0.6,
          });
          ice.onBeforeCompile = (shader) => {
            shader.vertexShader =
              "varying vec3 vFrostPosition;\n" + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              "#include <begin_vertex>\nvFrostPosition = position;",
            );
            shader.fragmentShader =
              "varying vec3 vFrostPosition;\n" + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <color_fragment>",
              `#include <color_fragment>
            float frost = sin(vFrostPosition.x * 1.7) * sin(vFrostPosition.y * 2.9) * sin(vFrostPosition.z * 2.1);
            diffuseColor.rgb *= mix(vec3(0.56, 0.77, 0.91), vec3(0.94, 0.99, 1.0), frost * 0.5 + 0.5);`,
            );
          };
          original.dispose();
          object.material = ice;
          object.frustumCulled = false;
        });
        const clip = gltf.animations.find((animation) =>
          /flying/i.test(animation.name),
        );
        if (clip) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(clip).play();
          mixer.setTime(0.3);
        }
        model.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const normalization = 6.8 / Math.max(size.x, size.y, size.z);
        model.scale.multiplyScalar(normalization);
        model.position.addScaledVector(center, -normalization);
        bank.add(model);
        dirty = true;
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) setStatus("unavailable");
      },
    );

    const resize = () => {
      heroHeight = document.getElementById("home")?.offsetHeight || window.innerHeight;
      compact = window.innerWidth < 768;
      camera.fov = compact ? 44 : 32;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, compact ? 1.25 : 1.6),
      );
      renderer.setSize(window.innerWidth, window.innerHeight);
      dirty = true;
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      setStatus("unavailable");
    };
    const onContextRestored = () => {
      contextLost = false;
      dirty = true;
      if (model) setStatus("ready");
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    let lastTime = 0;
    let elapsed = 0;
    let wasMoving = moving.current;
    renderer.setAnimationLoop((time) => {
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.04);
      lastTime = time;
      if (document.hidden || contextLost) return;
      const active = moving.current;
      if (active !== wasMoving) {
        dirty = true;
        wasMoving = active;
      }
      if (!active && !dirty) return;
      if (active) {
        elapsed += delta;
        mixer?.update(delta * 0.8);
        smoothed.x = THREE.MathUtils.lerp(smoothed.x, pointer.x, 0.025);
        smoothed.y = THREE.MathUtils.lerp(smoothed.y, pointer.y, 0.025);
      }
      if (active) lastPoseProgress = scroll.progress;
      const pose = sampleFlight(lastPoseProgress, compact);
      flight.position.set(
        pose.x,
        pose.y + (active ? Math.sin(elapsed * 0.7) * 0.08 : 0),
        pose.z,
      );
      flight.rotation.set(
        pose.pitch,
        pose.yaw + (active ? smoothed.x * 0.12 : 0),
        pose.roll,
      );
      flight.scale.setScalar(pose.scale);
      container.style.opacity = active || window.scrollY < heroHeight ? String(pose.opacity) : "0";
      bank.rotation.x = active ? smoothed.y * 0.045 : 0;
      if (active) {
        for (let index = 0; index < count; index++) {
          const y = index * 3 + 1;
          positions[y] -= delta * (0.12 + (index % 5) * 0.035);
          if (positions[y] < -6.5) positions[y] = 6.5;
        }
        snowGeometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      dirty = false;
    });
    return () => {
      disposed = true;
      controller.scrollTrigger?.kill();
      controller.kill();
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      mixer?.stopAllAction();
      if (model) {
        mixer?.uncacheRoot(model);
        disposeModel(model);
      }
      snowGeometry.dispose();
      snowMaterial.dispose();
      environmentTarget.dispose();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <>
      <div ref={host} className="dragon-canvas" data-dragon-status={status} />
      {status !== "ready" && (
        <p className="dragon-status" role="status">
          {status === "loading"
            ? "The wyvern is waking…"
            : "The arctic view is ready. 3D is unavailable on this device."}
        </p>
      )}
    </>
  );
}
