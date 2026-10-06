export type Point2 = readonly [number, number];

// An open, angular S. Offsetting the same spine keeps the recessed channel
// consistently inset, including the diagonal and chamfered corners.
export const monogramSpine: readonly Point2[] = [
  [1.62, 1.03], [1.62, 1.43], [1.23, 1.8], [-1.23, 1.8],
  [-1.65, 1.4], [-1.65, 0.77], [-1.25, 0.43], [1.24, -0.13],
  [1.65, -0.51], [1.65, -1.4], [1.23, -1.8], [-1.23, -1.8],
  [-1.65, -1.4], [-1.65, -1.04],
];

export function ribbonOutline(points: readonly Point2[], width: number): Point2[] {
  if (points.length < 2 || !Number.isFinite(width) || width <= 0)
    throw new Error("A ribbon needs two points and a positive width");
  const normals = points.slice(1).map((point, i) => {
    const dx = point[0] - points[i][0];
    const dy = point[1] - points[i][1];
    const length = Math.hypot(dx, dy);
    if (!length) throw new Error("Repeated ribbon points");
    return [-dy / length, dx / length] as Point2;
  });
  const sides = [-1, 1].map((side) => points.map((point, i): Point2 => {
    const before = normals[Math.max(0, i - 1)];
    const after = normals[Math.min(normals.length - 1, i)];
    const mx = before[0] + after[0];
    const my = before[1] + after[1];
    const length = Math.hypot(mx, my);
    if (length < 0.001) throw new Error("A ribbon cannot reverse direction");
    const nx = mx / length;
    const ny = my / length;
    const denominator = nx * after[0] + ny * after[1];
    const offset = side * width / (2 * denominator);
    return [point[0] + nx * offset, point[1] + ny * offset];
  }));
  return [...sides[0], ...sides[1].reverse()];
}

export const monogramOuter = ribbonOutline(monogramSpine, 0.85);
export const monogramInner = ribbonOutline(monogramSpine, 0.55);
export const monogramHeight = 4.45;

export function svgOutline(points: readonly Point2[]) {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(4)},${(-y).toFixed(4)}`).join(" ") + " Z";
}

export function assetProgress(values: readonly number[], weights: readonly number[]) {
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
  if (!total || values.length !== weights.length) return 0;
  return values.reduce((sum, value, i) => sum +
    (Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0) * Math.max(0, weights[i]), 0) / total;
}
