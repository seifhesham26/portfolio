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
export const flightSectionIds = [
  "home",
  "projects",
  "about",
  "skills",
  "experience",
  "education",
  "contact",
] as const;
const route: FlightPose[] = [
  { x: 0, y: 0, z: -5, pitch: 0, yaw: -0.75, roll: 0, scale: 0.4, opacity: 0 },
  {
    x: 3,
    y: 0.8,
    z: -2,
    pitch: 0.18,
    yaw: -1.1,
    roll: -0.3,
    scale: 0.52,
    opacity: 0.36,
  },
  {
    x: -3.2,
    y: 0.3,
    z: -1,
    pitch: -0.05,
    yaw: 1.05,
    roll: 0.15,
    scale: 0.72,
    opacity: 0.55,
  },
  {
    x: 2.6,
    y: 1,
    z: -3,
    pitch: 0.2,
    yaw: -0.4,
    roll: -0.12,
    scale: 0.5,
    opacity: 0.3,
  },
  {
    x: -2.7,
    y: -0.8,
    z: -2,
    pitch: -0.15,
    yaw: 1.2,
    roll: 0.32,
    scale: 0.48,
    opacity: 0.26,
  },
  {
    x: 2.9,
    y: 0.8,
    z: -2,
    pitch: 0.1,
    yaw: -1.2,
    roll: -0.25,
    scale: 0.54,
    opacity: 0.3,
  },
  {
    x: 0,
    y: 1.9,
    z: -4,
    pitch: 0.05,
    yaw: -0.75,
    roll: -0.05,
    scale: 0.36,
    opacity: 0.18,
  },
];

/** Map actual section positions, including pin spacing, into the flight route. */
export function progressAtSections(
  scrollTop: number,
  stops: readonly number[],
): number {
  if (stops.length < 2 || !Number.isFinite(scrollTop)) return 0;
  if (scrollTop <= stops[0]) return 0;
  for (let index = 1; index < stops.length; index++) {
    if (scrollTop <= stops[index]) {
      const distance = stops[index] - stops[index - 1];
      const fraction =
        distance > 0 ? (scrollTop - stops[index - 1]) / distance : 0;
      return (index - 1 + fraction) / (stops.length - 1);
    }
  }
  return 1;
}

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
