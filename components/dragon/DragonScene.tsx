"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  sampleFlight,
  progressAtSections,
  flightSectionIds,
  projectGuardianWeight,
} from "@/lib/dragon-flight";
import { createIceMaterial } from "./ice-material";

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
    renderer.toneMappingExposure = 0.75;
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
    scene.add(new THREE.HemisphereLight(0xc7e8ff, 0x12273e, 0.6));
    const key = new THREE.DirectionalLight(0xe5f8ff, 1.6);
    key.position.set(-3, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x79d5ed, 2.3);
    rim.position.set(5, 2, -4);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x6289c9, 0.8);
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
    let projectStart = 0;
    let projectEnd = 0;
    let guarding = false;
    const headAnchor = new THREE.Vector3();
    const foldedWings: { bone: THREE.Bone; rest: THREE.Quaternion; folded: THREE.Quaternion }[] = [];
    // Separate color spaces let one image supply color and fine scale relief.
    const scales: THREE.Texture<HTMLImageElement | ImageData> =
      new THREE.TextureLoader().load(
        "/textures/wyvern-pearl-scales.webp",
        () => {
          if (disposed) return;
          relief.needsUpdate = true;
          dirty = true;
        },
        undefined,
        () => {
          if (disposed) return;
          scales.source.data = new ImageData(
            new Uint8ClampedArray([255, 255, 255, 255]),
            1,
            1,
          );
          scales.needsUpdate = true;
          relief.needsUpdate = true;
          dirty = true;
        },
      );
    scales.colorSpace = THREE.SRGBColorSpace;
    scales.flipY = false;
    scales.wrapS = scales.wrapT = THREE.RepeatWrapping;
    scales.repeat.set(5, 5);
    scales.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const relief = scales.clone();
    relief.colorSpace = THREE.NoColorSpace;
    const membranes: THREE.Texture<HTMLImageElement | ImageData> =
      new THREE.TextureLoader().load(
        "/textures/wyvern-wing-membrane.webp",
        () => {
          if (!disposed) dirty = true;
        },
        undefined,
        () => {
          if (disposed) return;
          membranes.source.data = new ImageData(
            new Uint8ClampedArray([190, 223, 232, 255]),
            1,
            1,
          );
          membranes.needsUpdate = true;
          dirty = true;
        },
      );
    membranes.colorSpace = THREE.SRGBColorSpace;
    membranes.flipY = false;
    membranes.wrapS = membranes.wrapT = THREE.RepeatWrapping;
    membranes.anisotropy = Math.min(
      4,
      renderer.capabilities.getMaxAnisotropy(),
    );
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const scroll = { progress: 0 };
    let sectionStops: number[] = [];
    const measureSections = () => {
      sectionStops = flightSectionIds.map((id) => {
        const section = document.getElementById(id);
        return (section?.getBoundingClientRect().top || 0) + window.scrollY;
      });
      heroHeight =
        document.getElementById("home")?.offsetHeight || window.innerHeight;
      const work = document.getElementById("projects");
      projectStart = sectionStops[1];
      projectEnd = projectStart + (work?.offsetHeight || 0);
      scroll.progress = progressAtSections(window.scrollY, sectionStops);
      dirty = true;
    };
    const controller = ScrollTrigger.create({
      trigger: "#portfolio-main",
      start: "top top",
      end: "bottom bottom",
      onRefresh: measureSections,
      onUpdate: (self) => {
        scroll.progress = progressAtSections(self.scroll(), sectionStops);
        dirty = true;
      },
    });
    measureSections();
    lastPoseProgress = scroll.progress;
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
          if (!object.geometry.hasAttribute("_surface")) {
            object.geometry.setAttribute(
              "_surface",
              new THREE.BufferAttribute(
                new Float32Array(
                  object.geometry.getAttribute("position").count * 4,
                ),
                4,
              ),
            );
          }
          const ice = createIceMaterial(
            original.aoMap,
            scales,
            relief,
            membranes,
          );
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
        const normalization = 6.2 / Math.max(size.x, size.y, size.z);
        model.scale.multiplyScalar(normalization);
        model.position.addScaledVector(center, -normalization);
        bank.add(model);
        model.updateMatrixWorld(true);
        // Anchor the close-up to the rig's head rather than its wingspan.
        model.traverse((object) => {
          if (object instanceof THREE.Bone && /^head/i.test(object.name)) {
            object.getWorldPosition(headAnchor);
            bank.worldToLocal(headAnchor);
          }
        });
        // Fold both shoulders back along the body for the stationary close-up.
        const retreat = headAnchor.clone().negate().normalize();
        for (const side of ["l", "r"]) {
          let shoulder: THREE.Bone | undefined;
          let hand: THREE.Bone | undefined;
          model.traverse((object) => {
            if (!(object instanceof THREE.Bone)) return;
            if (object.name.startsWith(side + "_shoulder") && !object.name.includes("Twist")) shoulder = object;
            if (object.name.startsWith(side + "_hand") && !object.name.includes("Mid")) hand = object;
          });
          if (!shoulder || !hand || !shoulder.parent) continue;
          const arm = hand.getWorldPosition(new THREE.Vector3()).sub(shoulder.getWorldPosition(new THREE.Vector3())).normalize();
          const turn = new THREE.Quaternion().setFromUnitVectors(arm, retreat);
          const world = shoulder.getWorldQuaternion(new THREE.Quaternion());
          const parent = shoulder.parent.getWorldQuaternion(new THREE.Quaternion());
          foldedWings.push({ bone: shoulder, rest: shoulder.quaternion.clone(), folded: parent.invert().multiply(turn).multiply(world) });
        }
        for (const wing of foldedWings) wing.bone.quaternion.copy(wing.folded);
        model.updateMatrixWorld(true);
        for (const side of ["l", "r"]) {
          let hand: THREE.Bone | undefined;
          let tip: THREE.Bone | undefined;
          model.traverse((object) => {
            if (!(object instanceof THREE.Bone)) return;
            if (object.name.startsWith(side + "_hand") && !object.name.includes("Mid")) hand = object;
            if (object.name.startsWith(side + "_fingerD_04")) tip = object;
          });
          if (!hand || !tip || !hand.parent) continue;
          const direction = tip.getWorldPosition(new THREE.Vector3()).sub(hand.getWorldPosition(new THREE.Vector3())).normalize();
          const turn = new THREE.Quaternion().setFromUnitVectors(direction, retreat);
          const world = hand.getWorldQuaternion(new THREE.Quaternion());
          const parent = hand.parent.getWorldQuaternion(new THREE.Quaternion());
          foldedWings.push({ bone: hand, rest: hand.quaternion.clone(), folded: parent.invert().multiply(turn).multiply(world) });
        }
        for (const wing of foldedWings) wing.bone.quaternion.copy(wing.rest);
        dirty = true;
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) setStatus("unavailable");
      },
    );

    const resize = () => {
      heroHeight =
        document.getElementById("home")?.offsetHeight || window.innerHeight;
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
      const guardian = projectGuardianWeight(window.scrollY, projectStart, projectEnd, window.innerHeight);
      if (guardian > 0 && !guarding) {
        mixer?.setTime(0.3);
        guarding = true;
      } else if (guardian === 0) guarding = false;
      if (active) {
        elapsed += delta;
        if (!guarding) mixer?.update(delta * 0.8);
        smoothed.x = THREE.MathUtils.lerp(smoothed.x, pointer.x, 0.025);
        smoothed.y = THREE.MathUtils.lerp(smoothed.y, pointer.y, 0.025);
      }
      if (active)
        lastPoseProgress = THREE.MathUtils.damp(
          lastPoseProgress,
          scroll.progress,
          5,
          delta,
        );
      if (guarding) for (const wing of foldedWings) {
        wing.bone.quaternion.slerpQuaternions(wing.rest, wing.folded, guardian);
      }
      const pose = sampleFlight(lastPoseProgress, compact);
      const viewportFit = compact ? 1 : Math.min(1, camera.aspect / 1.85);
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 12;
      const halfWidth = halfHeight * camera.aspect;
      const blend = (from: number, to: number) => THREE.MathUtils.lerp(from, to, guardian);
      flight.position.set(
        blend(pose.x * viewportFit, halfWidth * (compact ? .85 : camera.aspect < 1.2 ? 1 : .87) + (1 - guardian) * 4),
        blend(pose.y + (active ? Math.sin(elapsed * .7) * .08 : 0), halfHeight * (compact ? .5 : -.15)),
        blend(pose.z, 0),
      );
      flight.rotation.set(
        blend(pose.pitch, -.05),
        blend(pose.yaw + (active && !compact ? smoothed.x * .12 : 0), -1.84),
        blend(pose.roll, -.08),
      );
      flight.scale.setScalar(blend(pose.scale * viewportFit, compact ? 2.2 : 4.4 * Math.min(1, camera.aspect / 1.35)));
      bank.position.copy(headAnchor).multiplyScalar(-guardian);
      bank.rotation.x = active ? smoothed.y * .045 * (1 - guardian) : 0;
      const pastTemple = window.scrollY >= heroHeight - 1;
      container.style.opacity = active ? String(guardian > 0 ? blend(pastTemple ? pose.opacity : 0, .9) : pastTemple ? pose.opacity : 0) : "0";
      // The close-up must never leak across the temple boundary.
      container.style.clipPath = guardian > 0
        ? "inset(" + Math.max(0, projectStart - window.scrollY) + "px 0 " + Math.max(0, window.innerHeight - (projectEnd - window.scrollY)) + "px 0)"
        : "none";
      // A soft portrait vignette isolates the head and neck at the screen edge.
      const outer = 1 - guardian;
      const center = compact ? 25 : 57.5;
      container.style.maskImage = guarding
        ? "linear-gradient(to bottom, rgb(0 0 0 / " + outer + ") " + (center - 18) + "%, #000 " + (center - 9) + "%, #000 " + (center + 10) + "%, rgb(0 0 0 / " + outer + ") " + (center + 22) + "%)"
        : "none";
      container.dataset.dragonMode = guarding ? "guardian" : "flight";
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
      // Covers model-load failure, when the maps have no material owner.
      scales.dispose();
      relief.dispose();
      membranes.dispose();
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
