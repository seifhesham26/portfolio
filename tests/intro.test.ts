import test from "node:test";
import assert from "node:assert/strict";
import { assetProgress, monogramInner, monogramOuter, monogramSpine, ribbonOutline, type Point2 } from "../lib/intro-geometry.ts";

function insideOrOn(point: Point2, polygon: readonly Point2[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, ay] = polygon[j];
    const [bx, by] = polygon[i];
    const dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((point[0] - ax) * dx + (point[1] - ay) * dy) / (dx * dx + dy * dy)));
    if (Math.hypot(point[0] - ax - t * dx, point[1] - ay - t * dy) < 1e-7) return true;
    if ((ay > point[1]) !== (by > point[1]) && point[0] < (bx - ax) * (point[1] - ay) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

test("recessed S stays inside the metal rim across corners and diagonal", () => {
  for (const point of monogramInner) assert.ok(insideOrOn(point, monogramOuter));
  for (const point of monogramSpine) assert.ok(insideOrOn(point, monogramInner));
  assert.ok(monogramOuter.flat().every(Number.isFinite));
});

test("ribbon offsets preserve perpendicular width at a right angle", () => {
  const outline = ribbonOutline([[0, 0], [2, 0], [2, 2]], 1);
  assert.deepEqual(outline, [[0, -0.5], [2.5, -0.5], [2.5, 2], [1.5, 2], [1.5, 0.5], [0, 0.5]]);
  assert.throws(() => ribbonOutline([[0, 0], [0, 0]], 1));
  assert.throws(() => ribbonOutline([[0, 0], [1, 0], [0, 0]], 1));
});

test("asset progress reflects download weight and stays bounded", () => {
  assert.ok(Math.abs(assetProgress([0.5, 1], [0.8, 0.2]) - 0.6) < 1e-12);
  assert.equal(assetProgress([1, 1], [0.8, 0.2]), 1);
  assert.equal(assetProgress([2, -1], [1, 1]), 0.5);
  assert.equal(assetProgress([NaN, Infinity], [1, 1]), 0);
  assert.equal(assetProgress([1], [0]), 0);
  assert.equal(assetProgress([1], [1, 1]), 0);
});
