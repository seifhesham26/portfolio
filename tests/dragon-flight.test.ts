import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleFlight } from "../lib/dragon-flight.ts";

test("flight stays finite at every scroll position", () => {
  for (let step = 0; step <= 1000; step++) {
    const pose = sampleFlight(step / 1000);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(pose.scale > 0 && pose.opacity >= 0 && pose.opacity <= 1);
  }
});

test("overscroll clamps to the endpoints", () => {
  assert.deepEqual(sampleFlight(-2), sampleFlight(0));
  assert.deepEqual(sampleFlight(4), sampleFlight(1));
  assert.deepEqual(sampleFlight(Number.NaN), sampleFlight(0));
});

test("dragon flight has no jumps between keyframes", () => {
  for (let step = 1; step <= 1000; step++) {
    const previous = sampleFlight((step - 1) / 1000);
    const next = sampleFlight(step / 1000);
    assert.ok(Math.abs(next.x - previous.x) < 0.12);
    assert.ok(Math.abs(next.y - previous.y) < 0.12);
    assert.ok(Math.abs(next.yaw - previous.yaw) < 0.12);
  }
});

test("the wyvern crosses both sides of the website", () => {
  const poses = Array.from({ length: 101 }, (_, index) =>
    sampleFlight(index / 100),
  );
  assert.ok(poses.some((pose) => pose.x < -2));
  assert.ok(poses.some((pose) => pose.x > 2));
});

test("mobile uses a smaller dragon within the viewport", () => {
  for (let step = 0; step <= 100; step++) {
    const desktop = sampleFlight(step / 100);
    const mobile = sampleFlight(step / 100, true);
    assert.ok(mobile.scale < desktop.scale);
    assert.ok(Math.abs(mobile.x) < 1.1);
  }
});
