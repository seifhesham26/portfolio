const clamp = (x) => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
function distanceToSegment(p, a, b) {
  const d = b.map((v, i) => v - a[i]);
  const length = d.reduce((s, v) => s + v * v, 0);
  const t = clamp(
    p.reduce((s, v, i) => s + (v - a[i]) * d[i], 0) / Math.max(length, 1e-12),
  );
  return Math.hypot(...p.map((v, i) => v - a[i] - t * d[i]));
}
// RGBA masks: membrane, crystalline spines, ivory, dark eye/mouth. Unused weight is body.
export function classifyDragonSurface(input, spars = [], clawTips = []) {
  const { point: p, influences, detached, componentBone = "" } = input;
  if (detached) {
    if (/(?:^|_)eye(?:[._]|$)|tongue/i.test(componentBone)) return [0, 0, 0, 1];
    if (/spike/i.test(componentBone)) return [0, 1, 0, 0];
    if (/head|jaw/i.test(componentBone)) return [0, 0, 1, 0];
  }
  let wing = 0,
    ice = 0,
    ivory = 0;
  for (const [name, weight] of influences) {
    if (/wingFlap|finger[D-G]_/i.test(name)) wing += weight;
    if (/spike/i.test(name)) ice += weight;
    for (const [tipName, tip, direction] of clawTips) {
      if (name !== tipName || weight < 0.2) continue;
      const extension = p.reduce(
        (s, v, i) => s + (v - tip[i]) * direction[i],
        0,
      );
      const radial = Math.hypot(
        ...p.map((v, i) => v - tip[i] - extension * direction[i]),
      );
      ivory = Math.max(
        ivory,
        smooth(0.0003, 0.0015, extension) *
          (1 - smooth(0.002, 0.0035, radial)) *
          smooth(0.2, 0.6, weight),
      );
    }
  }
  if (ice > 0.5) return [0, smooth(0.5, 0.9, ice), 0, 0];
  if (ivory > 0) return [0, 0, ivory, 0];
  const frameDistance = spars.reduce(
    (nearest, [a, b, r = 0.0015]) =>
      Math.min(nearest, distanceToSegment(p, a, b) - r),
    Infinity,
  );
  const membrane =
    smooth(0.035, 0.055, Math.abs(p[0])) *
    smooth(0.45, 0.85, wing) *
    smooth(0, 0.0015, frameDistance);
  return [membrane, 0, 0, 0];
}

export function buildDragonSurfaceMasks(
  positions,
  indices,
  joints,
  weights,
  bones,
) {
  const count = positions.length / 3,
    parent = new Int32Array(count);
  for (let i = 0; i < count; i++) parent[i] = i;
  const find = (a) => {
    while (parent[a] !== a) {
      parent[a] = parent[parent[a]];
      a = parent[a];
    }
    return a;
  };
  const join = (a, b) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent[b] = a;
  };
  const coordinates = new Map();
  for (let i = 0; i < count; i++) {
    const key = [0, 1, 2]
      .map((c) => Math.round(positions[i * 3 + c] * 1e6))
      .join(",");
    if (coordinates.has(key)) join(i, coordinates.get(key));
    else coordinates.set(key, i);
  }
  for (let i = 0; i < indices.length; i += 3) {
    join(indices[i], indices[i + 1]);
    join(indices[i], indices[i + 2]);
  }
  const components = new Map();
  for (let i = 0; i < count; i++) {
    const root = find(i);
    if (!components.has(root))
      components.set(root, { count: 0, bones: new Map() });
    const component = components.get(root);
    component.count++;
    for (let c = 0; c < 4; c++) {
      const bone = joints[i * 4 + c];
      component.bones.set(
        bone,
        (component.bones.get(bone) || 0) + weights[i * 4 + c],
      );
    }
  }
  const main = [...components].sort((a, b) => b[1].count - a[1].count)[0][0];
  for (const component of components.values())
    component.dominant =
      bones[[...component.bones].sort((a, b) => b[1] - a[1])[0][0]].name;
  const chains = new Map(),
    spars = [],
    clawTips = [];
  for (const bone of bones) {
    const match = bone.name.match(/^([lr]_finger[D-G])_(\d+)/i);
    if (match) {
      if (!chains.has(match[1])) chains.set(match[1], []);
      chains.get(match[1]).push(bone);
    }
  }
  for (const chain of chains.values()) {
    chain.sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 1; i < chain.length; i++)
      spars.push([chain[i - 1].p, chain[i].p]);
    if (chain.length > 1) {
      const last = chain.at(-1).p,
        previous = chain.at(-2).p;
      spars.push([last, last.map((v, i) => v + (v - previous[i]) * 1.3)]);
    }
  }
  for (const side of ["l", "r"]) {
    const names = ["shoulder", "forearm", "hand"].map((n) =>
      bones.find((b) => b.name.startsWith(side + "_" + n + ".")),
    );
    for (let i = 1; i < names.length; i++)
      if (names[i - 1] && names[i])
        spars.push([names[i - 1].p, names[i].p, 0.0035]);
  }
  for (const bone of bones) {
    if (!/toe(?:Out|In)?B[.]|finger[ABC]_03[.]/i.test(bone.name)) continue;
    const prefix = bone.name.split(".")[0];
    const previous = bones.find(
      (b) =>
        b.name.split(".")[0] ===
        (prefix.includes("finger")
          ? prefix.replace("_03", "_02")
          : prefix.replace(/B$/, "A")),
    );
    if (!previous) continue;
    const delta = bone.p.map((v, i) => v - previous.p[i]),
      length = Math.hypot(...delta);
    clawTips.push([bone.name, bone.p, delta.map((v) => v / length)]);
  }
  const result = new Uint8Array(count * 4),
    totals = [0, 0, 0, 0, 0];
  for (let i = 0; i < count; i++) {
    const root = find(i),
      component = components.get(root);
    const mask = classifyDragonSurface(
      {
        point: Array.from(positions.slice(i * 3, i * 3 + 3)),
        influences: [0, 1, 2, 3].map((c) => [
          bones[joints[i * 4 + c]].name,
          weights[i * 4 + c],
        ]),
        detached: root !== main,
        componentBone: component.dominant,
      },
      spars,
      clawTips,
    );
    const sum = mask.reduce((a, b) => a + b, 0);
    if (!Number.isFinite(sum) || sum > 1.001)
      throw Error("Invalid anatomical surface mask at vertex " + i);
    mask.forEach((v, c) => {
      result[i * 4 + c] = Math.round(v * 255);
      totals[c + 1] += v;
    });
    totals[0] += 1 - sum;
  }
  if (totals.some((x) => x < 500))
    throw Error("A dragon surface region is missing: " + totals.join(", "));
  console.log(
    "Surface coverage (body, membrane, ice, ivory, eyes):",
    totals.map(Math.round),
  );
  return result;
}
