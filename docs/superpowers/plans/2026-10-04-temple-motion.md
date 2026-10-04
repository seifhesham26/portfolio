# Temple entrance and section motion implementation plan

**Goal:** Replace the flying-dragon hero with a cursor-revealed stone temple, then give the portfolio sections distinct motions and section-aware dragon poses.

**Architecture:** Two identically cropped raster images share one transformed backdrop. The detailed image uses a feathered cursor mask; a button exposes the whole image for touch and keyboard. GSAP owns section transitions and a shared motion preference controls every effect. Dragon progress follows measured section positions after GSAP pinning.

**Tech Stack:** Existing Next.js, React, GSAP, Three.js, Sharp.

## Constraints
Preserve content, links, contact form, dragon rig and anatomical materials. No flying dragon in the hero. No actual 3D geometry in the temple. Pause and system reduced motion disable movement. No new dependencies or automatic commit.

## Tasks
- [x] Optimize the two supplied PNGs into WebP assets. Build TempleBackdrop.tsx with aligned image layers, pointer smoothing, soft mask, reveal button, visibility-aware updates and cleanup. Update page.tsx hero and scoped temple CSS.
- [x] Replace generic section fades with work pan, About wipe, skills stagger, timeline line growth, education sequence and contact convergence. Preserve keyboard gallery handling and refresh on disclosure changes.
- [x] Add failing flight tests for hidden hero, section-aware progress and changing pinned distances; implement measured stops and per-section flight route. Run all tests, lint, build, and browser checks at desktop/mobile. Review lifecycle, touch, pause/resume, direct anchors and content legibility.

## Review focus
Cursor must reveal carved image without shifting base geometry. Touch and keyboard must have equivalent reveal control. Reload and pause/resume must not re-hide visible sections. Flight must follow real sections when pin spacing or details change. Hero dragon must remain hidden through scrolling, resizing and pausing.

## Validation
12 tests passed. ESLint passed. Production build compiled and generated all static routes. Browser checks covered cursor reveal, genuine 12px edge blur, lingering traces and fade completion, full-reveal control, pause cleanup and resume, hidden hero dragon, direct Contact reload, mobile overflow and keyboard navigation. No browser rendering errors.
