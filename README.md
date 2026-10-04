# Seif — Ice Wyvern Portfolio

A Next.js portfolio with a gray stone temple entrance, an arctic interior, a real Three.js animated wyvern, and GSAP scroll choreography. Projects, experience, education, credentials, CV and social links come from the existing content in lib/data.ts.

## Development

Use Node.js 22.6 or newer (tested with Node.js 24) and pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production commands: pnpm build, then pnpm start.

## Motion and artwork

- components/dragon/DragonScene.tsx owns the renderer, original flying clip, snow and resource cleanup.
- components/dragon/ice-material.ts separates pearl body scales, smooth cyan membranes, crystalline spines, ivory horns/claws and dark eyes. Body and membranes use distinct maps; the other surfaces use regional procedural detail and independent roughness.
- scripts/dragon-surfaces.mjs bakes anatomical masks from mesh connectivity, rig weights and bind-pose distances. The masks remain attached during skin animation.
- lib/dragon-flight.ts defines the continuous flight route and mobile poses.
- components/experience/ExperienceShell.tsx owns keyboard navigation and motion preferences. section-motion.ts gives each section its own choreography: temple zoom, horizontal project travel, About wipe, skill assembly, timeline progress, education sequence and contact convergence.
- The Motion button pauses animations; system reduced-motion preferences use static sections. Mobile projects stay vertical. The portfolio remains usable if 3D cannot load.
- public/images/temple-quiet.webp and temple-carved.webp come from the two user-supplied temple images. TempleBackdrop.tsx reveals the carved image with sharp, unblurred detail, a feathered opacity boundary and up to six short traces that finish fading before reuse. The last reveal holds for 0.15 seconds on pointer leave, then dissolves over 0.65 seconds; traces fade over 0.8 seconds after a 0.12-second hold. The Reveal carvings button crossfades the full image and works with touch and keyboard.
- public/images/arctic-detail.webp is generated arctic artwork; frozen-landscape.webp is retained from the previous hero.
- Dragon flight follows real section positions, including the pinned gallery start. The model loads on entering any later section and stays hidden in the temple.

The supplied dragon was optimized from approximately 26 MB to 6 MB. To regenerate it, extract source/demon_dragon.glb from the original archive to .cache/demon_dragon.glb, then run pnpm prepare:dragon. Asset tooling is in scripts/prepare-dragon.mjs; provenance is in public/models/README.md.

## Validation

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Flight tests cover finite poses, clamping, continuity, traversal and mobile constraints. Surface tests cover torso, wing web versus spars, spines versus horns, and eyes versus eyelids. Desktop and mobile browser checks cover navigation, gallery focus, pause/resume and invalid contact input. The contact form retains the existing EmailJS integration; browser checks do not send actual email. Delivery and Lighthouse performance have not been measured.

The navigation and interactive controls use a Liquid Glass inspired CSS material: translucent tints, backdrop blur, reflected highlights and pill corners. It adapts to the temple and dark sections and provides solid surfaces for reduced transparency.
