import test from "node:test";
import assert from "node:assert/strict";
import { classifyDragonSurface } from "../scripts/dragon-surfaces.mjs";
const sample = (point, influences, extra = {}, spars = []) =>
  classifyDragonSurface(
    { point, influences, detached: false, ...extra },
    spars,
  );
test("the torso remains pearl scales", () =>
  assert.deepEqual(sample([0, 0.06, 0], [["spine_03", 1]]), [0, 0, 0, 0]));
test("wing web gets membrane material while a nearby spar stays white", () => {
  const spars = [
    [
      [0.05, 0.1, 0],
      [0.3, 0.1, 0],
    ],
  ];
  assert.equal(
    sample([0.15, 0.1, 0.03], [["l_wingFlapA_01", 1]], {}, spars)[0],
    1,
  );
  assert.equal(sample([0.15, 0.1, 0], [["l_fingerD_03", 1]], {}, spars)[0], 0);
});
test("spines and detached horns have distinct surfaces", () => {
  assert.deepEqual(sample([0, 0.08, 0], [["spineSpike_01", 1]]), [0, 1, 0, 0]);
  assert.deepEqual(
    sample([0.01, 0.08, 0.12], [["head", 1]], {
      detached: true,
      componentBone: "head",
    }),
    [0, 0, 1, 0],
  );
});
test("eyes get a dark glossy surface without darkening eyelids", () => {
  assert.deepEqual(
    sample([0, 0, 0], [["l_eye", 1]], {
      detached: true,
      componentBone: "l_eye",
    }),
    [0, 0, 0, 1],
  );
  assert.deepEqual(sample([0, 0, 0], [["l_upperLid", 1]]), [0, 0, 0, 0]);
});
