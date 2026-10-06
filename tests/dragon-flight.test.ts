import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleFlight, progressAtSections, projectGuardianWeight } from "../lib/dragon-flight.ts";

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

test("the temple entrance has no flying dragon", () => {
  assert.equal(sampleFlight(0).opacity, 0);
  assert.equal(sampleFlight(0, true).opacity, 0);
});

test("dragon progress follows real section positions", () => {
  const stops = [0, 900, 3000, 4100, 5000, 6100, 7300];
  assert.equal(progressAtSections(900, stops), 1 / 6);
  assert.equal(progressAtSections(3000, stops), 2 / 6);
  assert.equal(progressAtSections(1950, stops), 1.5 / 6);
  assert.equal(progressAtSections(-100, stops), 0);
  assert.equal(progressAtSections(9000, stops), 1);
});

test("dragon progress adapts when responsive section heights change", () => {
  assert.equal(
    progressAtSections(4000, [0, 900, 4000, 5000, 6000, 7000, 8000]),
    2 / 6,
  );
  assert.equal(
    progressAtSections(3000, [0, 900, 3000, 4000, 5000, 6000, 7000]),
    2 / 6,
  );
});

test("the side guardian holds its pose through the project section", () => {
  for (const scrollTop of [850, 900, 1200, 1500]) {
    assert.equal(projectGuardianWeight(scrollTop, 900, 1900, 800), 1);
  }
  assert.equal(projectGuardianWeight(0, 900, 1900, 800), 0);
  assert.equal(projectGuardianWeight(1900, 900, 1900, 800), 0);
});

test("guardian entry and retreat stay bounded and continuous", () => {
  let previous = 0;
  for (let scrollTop = 0; scrollTop <= 2200; scrollTop++) {
    const value = projectGuardianWeight(scrollTop, 900, 1900, 800);
    assert.ok(value >= 0 && value <= 1);
    assert.ok(Math.abs(value - previous) < .01);
    previous = value;
  }
  assert.equal(projectGuardianWeight(NaN, 900, 1900, 800), 0);
  assert.equal(projectGuardianWeight(1000, 900, 1900, 0), 0);
});
