export type FlightPose = {
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
  roll: number;
  scale: number;
  opacity: number;
};
const route: FlightPose[] = [
  {
    x: 2.7,
    y: 0.15,
    z: 0,
    pitch: 0.08,
    yaw: -0.75,
    roll: -0.12,
    scale: 1.12,
    opacity: 1,
  },
  {
    x: -3.2,
    y: 0.6,
    z: -1,
    pitch: 0.1,
    yaw: 1.15,
    roll: 0.28,
    scale: 0.65,
    opacity: 0.28,
  },
  {
    x: 3.0,
    y: -0.4,
    z: -2,
    pitch: -0.15,
    yaw: -1.05,
    roll: -0.2,
    scale: 0.58,
    opacity: 0.32,
  },
  {
    x: -2.8,
    y: 0.55,
    z: -1,
    pitch: 0.12,
    yaw: 0.9,
    roll: 0.18,
    scale: 0.68,
    opacity: 0.3,
  },
  {
    x: 2.6,
    y: -0.5,
    z: -2,
    pitch: -0.18,
    yaw: -1.1,
    roll: -0.28,
    scale: 0.55,
    opacity: 0.32,
  },
  {
    x: -2.2,
    y: 0.3,
    z: -1,
    pitch: 0.08,
    yaw: 0.85,
    roll: 0.14,
    scale: 0.62,
    opacity: 0.3,
  },
  {
    x: 2.7,
    y: 0.2,
    z: 0,
    pitch: 0.06,
    yaw: -0.75,
    roll: -0.12,
    scale: 0.96,
    opacity: 0.55,
  },
];

/** Continuous poses, including elastic overscroll and compact viewports. */
export function sampleFlight(progress: number, compact = false): FlightPose {
  const clamped = Math.max(
    0,
    Math.min(1, Number.isFinite(progress) ? progress : 0),
  );
  const offset = clamped * (route.length - 1);
  const index = Math.min(Math.floor(offset), route.length - 2);
  const fraction = offset - index;
  const blend = fraction * fraction * (3 - 2 * fraction);
  const start = route[index];
  const end = route[index + 1];
  const pose = Object.fromEntries(
    (Object.keys(start) as (keyof FlightPose)[]).map((key) => [
      key,
      start[key] + (end[key] - start[key]) * blend,
    ]),
  ) as FlightPose;
  if (compact) {
    pose.x *= 0.22;
    pose.y = pose.y * 0.45 + 1.5;
    pose.scale *= 0.55;
    pose.opacity *= 1 - clamped * 0.7;
  }
  return pose;
}
