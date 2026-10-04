# Ice wyvern

Derived from the user-supplied demon-dragon.zip (source/demon_dragon.glb).
Original rig and flying animation are preserved. Unused clips are removed; geometry
and animation use Meshopt compression and the AO texture uses WebP.
Anatomical masks are baked into _SURFACE by scripts/dragon-surfaces.mjs.
Body scales, cyan membranes, crystalline spines, ivory horns/claws and dark eyes
have separate surface responses in components/dragon/ice-material.ts.
Pearl and membrane maps are in public/textures. Lighting is in DragonScene.tsx.

To rebuild, extract source/demon_dragon.glb into .cache/demon_dragon.glb and run
`pnpm prepare:dragon`. The original archive did not include licensing information;
retain any attribution or license supplied with the original download.
