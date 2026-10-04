# Seif — Ice Wyvern Portfolio

A Next.js portfolio with an arctic visual identity, a real Three.js animated wyvern, and GSAP scroll choreography. Projects, experience, education, credentials, CV and social links come from the existing content in lib/data.ts.

## Development

Use Node.js 22.6 or newer (tested with Node.js 24) and pnpm.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Production commands: pnpm build, then pnpm start.

## Motion and artwork

- components/dragon/DragonScene.tsx owns the renderer, frost material, original flying clip, snow and resource cleanup.
- lib/dragon-flight.ts defines the continuous flight route and mobile poses.
- components/experience/ExperienceShell.tsx owns GSAP reveals, parallax, the desktop project gallery, keyboard navigation and motion preferences.
- The Motion button pauses animations; system reduced-motion preferences use static sections. Mobile projects stay vertical. The portfolio remains usable if 3D cannot load.
- public/images/frozen-landscape.webp and arctic-detail.webp are generated arctic artwork.

The supplied dragon was optimized from approximately 26 MB to 6 MB. To regenerate it, extract source/demon_dragon.glb from the original archive to .cache/demon_dragon.glb, then run pnpm prepare:dragon. Asset tooling is in scripts/prepare-dragon.mjs; provenance is in public/models/README.md.

## Validation

```bash
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Flight tests cover finite poses, clamping, continuity, traversal and mobile constraints. Desktop and mobile browser checks cover navigation, gallery focus, pause/resume and invalid contact input. The contact form retains the existing EmailJS integration; browser checks do not send actual email. Delivery and Lighthouse performance have not been measured.
