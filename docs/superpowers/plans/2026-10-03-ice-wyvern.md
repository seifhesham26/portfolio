# Ice Wyvern Implementation Plan

**Goal:** Deliver a complete arctic portfolio redesign with a real flying ice wyvern.

**Architecture:** Existing Next.js server rendering owns content and metadata.
Client leaves own the Three.js renderer, GSAP orchestration, navigation, motion
controls, and contact form. Existing lib/data.ts remains the content source.

**Tech Stack:** Next.js 16, React 19, TypeScript, native CSS, GSAP, Three.js.

**Spec:** ../specs/2026-10-03-ice-wyvern-design.md

## Constraints

- Preserve real content, links, CV, certificates, and the existing EmailJS integration.
- No scroll hijacking on mobile or under reduced motion; never block text on asset loading.
- Use one renderer, scoped animation cleanup, and responsive layout.
- Keep the original download intact and never send test messages externally.

## Review focus

- Missing WebGL or failed GLB request: content remains usable and a status is visible.
- Motion preference or button changes: flight and GSAP work agree, without reloading the model.
- Mobile width and resized desktop: no horizontal overflow or stale pin measurements.
- Fast scrolling/overscroll: finite, continuous flight poses; no disappearance of content.
- Contact failures or repeated submits: readable status, retained input, no duplicate submission.

## Tasks

- [x] Asset pipeline: preserve the flying clip, compress the GLB, and convert the backdrop.
- [x] Flight module: run tests before implementation, implement continuous desktop/mobile poses.
- [x] Three.js leaf: animated model, ice material, snow, responsive camera, resource cleanup/fallback.
- [x] Content redesign: server-rendered sections, navigation, contact, dark arctic CSS.
- [x] Motion shell: accessible preference/toggle, GSAP entry/reveals/pan/parallax, strict cleanup.
- [x] Verify flight tests, TypeScript, lint, build, desktop/mobile UI and manual motion controls; review reduced-motion and model-failure fallbacks.

Commands: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`, `pnpm dev`.

## Completed validation

Five flight tests pass; TypeScript, ESLint and the production build pass. Desktop and 390px mobile layouts have no horizontal overflow. Browser checks confirmed loaded animation, responsive pin removal, project focus alignment, mobile menu focus/Escape, pause/resume and whitespace validation without sending email. Browser error log is empty. WebGL/model-failure handling and system reduced-motion behavior were reviewed in code; fault injection and actual email delivery were not exercised.
