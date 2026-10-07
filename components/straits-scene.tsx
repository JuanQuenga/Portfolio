import { useEffect, useRef, type ReactNode } from "react";

// The Mackinac Bridge at dusk, seen from the Mackinaw City shore. The bridge
// is modelled in feet and projected through a camera, then drawn in two
// layers so the page's own content (the name) sits between sky and bridge.

type Lamp = {
  x: number;
  y: number;
  r: number;
  delay: number;
  seed: number;
  mirror: number;
  dim: number;
};

type Star = { x: number; y: number; r: number; a: number; speed: number };

type Point = { x: number; y: number; z: number };

type Camera = {
  focal: number;
  project: (x: number, y: number, z: number) => Point;
};

type Scene = {
  w: number;
  h: number;
  horizon: number;
  camera: Camera;
  background: HTMLCanvasElement;
  bridge: HTMLCanvasElement;
  lamps: Lamp[];
  beacons: Point[];
  towers: { x: number; y: number; width: number; length: number }[];
  stars: Star[];
};

const IGNITE_START = 650;
const IGNITE_SWEEP = 1700;
const IGNITE_FADE = 520;

// Real proportions, in feet: 552 ft towers, 3,800 ft main span, 1,800 ft
// side spans, a 38 ft deep stiffening truss, and long approach viaducts.
const TOWER_HEIGHT = 552;
const TOWERS = [1800, 5600];
const ANCHORAGES = [0, 7400];
const SOUTH_END = -2800;
const NORTH_END = 17000;
const CABLE_Z = 34;
const LEG_Z = 40;
const EYE_HEIGHT = 45;

const IVORY = "#efe5c8";
const FOLIAGE = ["#0f2119", "#163025"];

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layer(w: number, h: number, dpr: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  return { canvas, ctx };
}

const smooth = (t: number) => {
  const k = Math.min(1, Math.max(0, t));
  return k * k * (3 - 2 * k);
};

function road(x: number) {
  if (x < ANCHORAGES[0]) return 55 + 120 * smooth((x - SOUTH_END) / -SOUTH_END);
  if (x <= ANCHORAGES[1]) return 175 + 24 * Math.sin((Math.PI * x) / ANCHORAGES[1]);
  return 55 + 120 * smooth((NORTH_END - x) / (NORTH_END - ANCHORAGES[1]));
}

const trussDepth = (x: number) =>
  x >= ANCHORAGES[0] && x <= ANCHORAGES[1] ? 38 : 26;

function cable(x: number) {
  const [south, north] = TOWERS;
  const top = TOWER_HEIGHT - 12;
  if (x <= south) {
    const u = x / south;
    return 170 + (top - 170) * u - 220 * u * (1 - u);
  }
  if (x <= north) {
    const u = (x - (south + north) / 2) / ((north - south) / 2);
    return 210 + (top - 210) * u * u;
  }
  const u = (x - north) / (ANCHORAGES[1] - north);
  return top + (170 - top) * u - 220 * u * (1 - u);
}

// Place the camera so the near tower lands at `near` and the far tower at
// `far` (fractions of the width), then back away until the near tower's top
// sits at `top` (a fraction of the height).
function makeCamera(
  w: number,
  h: number,
  horizon: number,
  anchor?: number,
): Camera {
  const narrow = w / h < 0.8;
  const eyeX = narrow ? -1500 : -500;
  const near = Math.min(anchor ?? 0.31 * w, 0.45 * w);
  const s1 = near - w / 2;
  const s2 = 0.8 * w - w / 2;
  const rise = horizon - h * (narrow ? 0.13 : 0.1);

  const aim = (distance: number) => {
    const a1 = Math.atan2(TOWERS[0] - eyeX, distance);
    const a2 = Math.atan2(TOWERS[1] - eyeX, distance);
    let lo = a1;
    let hi = a2;
    for (let i = 0; i < 50; i++) {
      const yaw = (lo + hi) / 2;
      if (s2 * Math.tan(a1 - yaw) - s1 * Math.tan(a2 - yaw) > 0) lo = yaw;
      else hi = yaw;
    }
    const yaw = (lo + hi) / 2;
    const focal = s2 / Math.tan(a2 - yaw);
    const depth = Math.hypot(TOWERS[0] - eyeX, distance) * Math.cos(a1 - yaw);
    return { yaw, focal, top: (focal * (TOWER_HEIGHT - EYE_HEIGHT)) / depth };
  };

  let lo = 150;
  let hi = 9000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (aim(mid).top > rise) lo = mid;
    else hi = mid;
  }
  const distance = (lo + hi) / 2;
  const { yaw, focal } = aim(distance);
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);

  return {
    focal,
    project: (x, y, z) => {
      const vx = x - eyeX;
      const vz = z + distance;
      const depth = vx * sin + vz * cos;
      return {
        x: w / 2 + (focal * (vx * cos - vz * sin)) / depth,
        y: horizon - (focal * (y - EYE_HEIGHT)) / depth,
        z: depth,
      };
    },
  };
}

const horizonFor = (w: number, h: number) => Math.round(h * (w < 720 ? 0.6 : 0.62));

// Screen width of the near tower, legs included, where it crosses the name.
function nearTowerWidth(camera: Camera) {
  const xs = [-1, 1].flatMap((side) =>
    [-LEG_Z - 8, LEG_Z + 8].map(
      (z) => camera.project(TOWERS[0] + side * 9, 440, z).x,
    ),
  );
  return Math.max(...xs) - Math.min(...xs);
}

function build(w: number, h: number, dpr: number, anchor?: number): Scene {
  const rand = seeded(1957);
  const narrow = w < 720;
  const horizon = horizonFor(w, h);
  const camera = makeCamera(w, h, horizon, anchor);
  const P = camera.project;
  const NEAR = 80;
  const px = (feet: number, depth: number) => (camera.focal * feet) / depth;

  // Sky, far shores, and water: everything that never moves.
  const bg = layer(w, h, dpr);
  const sky = bg.ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#050f26");
  sky.addColorStop(0.5, "#0e2652");
  sky.addColorStop(0.86, "#284777");
  sky.addColorStop(1, "#4b5f86");
  bg.ctx.fillStyle = sky;
  bg.ctx.fillRect(0, 0, w, horizon);

  bg.ctx.save();
  bg.ctx.translate(w * 0.1, horizon);
  bg.ctx.scale(1, 0.32);
  const glow = bg.ctx.createRadialGradient(0, 0, 0, 0, 0, w * 0.7);
  glow.addColorStop(0, "rgba(240, 164, 108, 0.42)");
  glow.addColorStop(0.45, "rgba(196, 120, 110, 0.14)");
  glow.addColorStop(1, "rgba(120, 90, 120, 0)");
  bg.ctx.fillStyle = glow;
  bg.ctx.fillRect(-w, -h * 3, w * 3, h * 6);
  bg.ctx.restore();

  const water = bg.ctx.createLinearGradient(0, horizon, 0, h);
  water.addColorStop(0, "#1c3863");
  water.addColorStop(0.35, "#0e2346");
  water.addColorStop(1, "#08162b");
  bg.ctx.fillStyle = water;
  bg.ctx.fillRect(0, horizon, w, h - horizon);

  // Lake Michigan's far shore on the left, St. Ignace where the bridge lands.
  const landing = P(NORTH_END, 0, 0);
  const shores: [number, number, number][] = [
    [-0.02, 0.2, 0.012],
    [Math.min(0.92, landing.x / w - 0.03), 1.02, 0.014],
  ];
  for (const [start, end, rise] of shores) {
    bg.ctx.fillStyle = "#0a1630";
    bg.ctx.beginPath();
    bg.ctx.moveTo(w * start, horizon + 1);
    for (let i = 0; i <= 24; i++) {
      const x = w * (start + ((end - start) * i) / 24);
      const lift = Math.sin((i / 24) * Math.PI * 0.5 + 0.2) ** 0.6;
      bg.ctx.lineTo(x, horizon - h * rise * lift * (0.85 + rand() * 0.3));
    }
    bg.ctx.lineTo(w * end, horizon + 1);
    bg.ctx.fill();
    for (let i = 0; i < 18; i++) {
      bg.ctx.fillStyle = `rgba(255, 214, 150, ${0.25 + rand() * 0.45})`;
      bg.ctx.fillRect(
        w * (start + (end - start) * rand()),
        horizon - 1.5 - rand() * h * rise * 0.5,
        1.2,
        1.2,
      );
    }
  }

  bg.ctx.fillStyle = "rgba(205, 220, 245, 0.22)";
  bg.ctx.fillRect(0, horizon, w, 1);
  for (let i = 0; i < 260; i++) {
    const depth = rand() ** 1.8;
    const y = horizon + 2 + depth * (h - horizon);
    const len = (12 + rand() * 70) * (0.4 + depth * 1.8);
    bg.ctx.fillStyle = `rgba(170, 195, 235, ${0.025 + rand() * 0.05})`;
    bg.ctx.fillRect(rand() * w - len / 2, y, len, 1 + depth);
  }

  // The bridge.
  const br = layer(w, h, dpr);
  const ctx = br.ctx;
  const xs: number[] = [];
  for (let x = SOUTH_END; x <= NORTH_END; x += x < 9000 ? 25 : 120) xs.push(x);

  const polygon = (points: Point[], fill: string | CanvasGradient) => {
    if (points.some((p) => p.z < NEAR)) return;
    ctx.fillStyle = fill;
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fill();
  };
  const line = (a: Point, b: Point, width: number, style: string) => {
    if (a.z < NEAR || b.z < NEAR) return;
    ctx.strokeStyle = style;
    ctx.lineWidth = Math.max(0.6, width);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  const box = (
    x0: number,
    x1: number,
    y0: number,
    y1: number,
    z0: number,
    z1: number,
    front: string,
    side: string,
  ) => {
    polygon([P(x0, y0, z0), P(x0, y0, z1), P(x0, y1, z1), P(x0, y1, z0)], side);
    polygon([P(x0, y0, z0), P(x1, y0, z0), P(x1, y1, z0), P(x0, y1, z0)], front);
  };

  // Approach piers and the concrete under each tower and anchorage.
  for (let x = SOUTH_END + 300; x < NORTH_END; x += x < 0 ? 420 : 480) {
    if (x > ANCHORAGES[0] - 80 && x < ANCHORAGES[1] + 200) continue;
    box(x - 8, x + 8, 0, road(x) - trussDepth(x), -26, 26, "#1f2a38", "#151e29");
  }
  for (const x of TOWERS) box(x - 40, x + 40, 0, 22, -58, 58, "#3a4250", "#2a313d");

  const leg = (tx: number, z: number) => {
    const half = (y: number) => 11 - (4 * y) / TOWER_HEIGHT;
    const top = P(tx, TOWER_HEIGHT, z);
    const base = P(tx, 0, z);
    const lit = ctx.createLinearGradient(0, top.y, 0, base.y);
    lit.addColorStop(0, IVORY);
    lit.addColorStop(0.55, "#c9b993");
    lit.addColorStop(1, "#5b5547");
    polygon(
      [
        P(tx - half(0), 0, z - 8),
        P(tx + half(0), 0, z - 8),
        P(tx + half(TOWER_HEIGHT), TOWER_HEIGHT, z - 8),
        P(tx - half(TOWER_HEIGHT), TOWER_HEIGHT, z - 8),
      ],
      lit,
    );
    polygon(
      [
        P(tx - half(0), 0, z - 8),
        P(tx - half(0), 0, z + 8),
        P(tx - half(TOWER_HEIGHT), TOWER_HEIGHT, z + 8),
        P(tx - half(TOWER_HEIGHT), TOWER_HEIGHT, z - 8),
      ],
      "rgba(120, 108, 84, 0.95)",
    );
    polygon(
      [
        P(tx - 9, TOWER_HEIGHT, z - 10),
        P(tx + 9, TOWER_HEIGHT, z - 10),
        P(tx + 9, TOWER_HEIGHT + 8, z - 10),
        P(tx - 9, TOWER_HEIGHT + 8, z - 10),
      ],
      IVORY,
    );
  };

  // Stacked X-bracing between the legs: the towers' signature.
  const bracing = (tx: number) => {
    const depth = P(tx, 300, 0).z;
    const width = px(6, depth);
    const levels = [215, 325, 435, TOWER_HEIGHT - 14];
    const z = LEG_Z - 9;
    const member = (y0: number, z0: number, y1: number, z1: number, w = width) =>
      line(P(tx, y0, z0), P(tx, y1, z1), w, "#d8cba6");
    member(26, -z, 150, z);
    member(26, z, 150, -z);
    member(150, -z, 150, z);
    levels.forEach((y, i) => {
      member(y, -z, y, z, i === levels.length - 1 ? width * 1.6 : width);
      const next = levels[i + 1];
      if (next) {
        member(y, -z, next, z);
        member(y, z, next, -z);
      }
    });
  };

  const truss = (z: number, fill: string) => {
    const top: Point[] = [];
    const bottom: Point[] = [];
    for (const x of xs) {
      const a = P(x, road(x), z);
      if (a.z < NEAR) continue;
      top.push(a);
      bottom.push(P(x, road(x) - trussDepth(x), z));
    }
    polygon([...top, ...bottom.reverse()], fill);
    ctx.strokeStyle = "rgba(120, 160, 128, 0.32)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let x = SOUTH_END; x < NORTH_END; x += 40) {
      const a = P(x, road(x), z);
      const b = P(x + 20, road(x + 20) - trussDepth(x + 20), z);
      const c = P(x + 40, road(x + 40), z);
      if (a.z < NEAR || Math.abs(c.x - a.x) < 5) continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 210, 140, 0.3)";
    for (let i = 1; i < top.length; i++) {
      ctx.fillRect(top[i - 1].x, top[i - 1].y - 0.5, top[i].x - top[i - 1].x, 1);
    }
  };

  const strands = (z: number, alpha: number) => {
    ctx.strokeStyle = `rgba(200, 206, 214, ${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    let last = -Infinity;
    for (let x = 50; x < ANCHORAGES[1]; x += 50) {
      if (TOWERS.some((t) => Math.abs(x - t) < 20)) continue;
      const a = P(x, cable(x), z);
      if (a.z < NEAR || Math.abs(a.x - last) < 2.5) continue;
      last = a.x;
      const b = P(x, road(x), z);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();
    const mid = P(TOWERS[1] - 1900, 300, z);
    ctx.strokeStyle = "rgba(226, 220, 196, 0.7)";
    ctx.lineWidth = Math.max(1, px(2.5, mid.z));
    ctx.beginPath();
    let started = false;
    for (let x = 0; x <= ANCHORAGES[1]; x += 20) {
      const a = P(x, cable(x), z);
      if (a.z < NEAR) continue;
      if (started) ctx.lineTo(a.x, a.y);
      else ctx.moveTo(a.x, a.y);
      started = true;
    }
    ctx.stroke();
  };

  for (const tx of TOWERS) leg(tx, LEG_Z);
  truss(CABLE_Z, FOLIAGE[0]);
  strands(CABLE_Z, 0.14);
  for (const tx of TOWERS) bracing(tx);

  const underside: Point[] = [];
  const farSide: Point[] = [];
  for (const x of xs) {
    const a = P(x, road(x) - trussDepth(x), -CABLE_Z);
    if (a.z < NEAR) continue;
    underside.push(a);
    farSide.push(P(x, road(x) - trussDepth(x), CABLE_Z));
  }
  polygon([...underside, ...farSide.reverse()], "#09130f");

  truss(-CABLE_Z, FOLIAGE[1]);
  strands(-CABLE_Z, 0.2);
  for (const tx of TOWERS) leg(tx, -LEG_Z);
  for (const ax of ANCHORAGES) {
    box(ax - 50, ax + 50, 0, road(ax) + 6, -50, 50, "#2c3542", "#202833");
  }

  // Necklace lights on both main cables and lamps along the roadway.
  const lamps: Lamp[] = [];
  const add = (x: number, y: number, z: number, scale: number, dim: number) => {
    const p = P(x, y, z);
    if (p.z < NEAR || p.x < -20 || p.x > w + 20) return;
    const mirror = P(x, -y, z).y;
    lamps.push({
      x: p.x,
      y: p.y,
      r: Math.min(2.6, Math.max(0.55, px(scale, p.z))),
      seed: rand() * 100,
      mirror,
      dim,
      delay: IGNITE_START + (Math.max(0, p.x) / w) * IGNITE_SWEEP,
    });
  };
  for (const z of [CABLE_Z, -CABLE_Z]) {
    for (let x = 60; x < ANCHORAGES[1]; x += 105) {
      if (TOWERS.some((t) => Math.abs(x - t) < 40)) continue;
      add(x, cable(x) + 3, z, 3.2, z > 0 ? 0.7 : 1);
    }
    for (let x = SOUTH_END + 100; x < NORTH_END; x += 160) {
      add(x, road(x) + 12, z, 2.4, z > 0 ? 0.55 : 0.85);
    }
  }

  const beacons = TOWERS.flatMap((x) =>
    [LEG_Z, -LEG_Z].map((z) => P(x, TOWER_HEIGHT + 14, z)),
  );
  const towers = TOWERS.map((x) => {
    const base = P(x, 0, -LEG_Z);
    return {
      x: base.x,
      y: base.y,
      width: px(18, base.z),
      length: (P(x, -TOWER_HEIGHT, -LEG_Z).y - base.y) * 0.55,
    };
  });

  const stars: Star[] = Array.from({ length: narrow ? 45 : 90 }, () => ({
    x: rand() * w,
    y: rand() ** 1.4 * horizon * 0.62,
    r: 0.35 + rand() * 0.8,
    a: 0.15 + rand() * 0.55,
    speed: 0.4 + rand() * 1.4,
  }));

  return {
    w,
    h,
    horizon,
    camera,
    background: bg.canvas,
    bridge: br.canvas,
    lamps,
    beacons,
    towers,
    stars,
  };
}

// A Great Lakes freighter: long and low, pilothouse forward, engine room aft.
// It steams east through the straits, under the main span.
const SHIP_LENGTH = 730;
const SHIP_SPEED = 30;
const SHIP_PATH = [5600, -4200];
const SHIP_PROFILE: [number, number][] = [
  [0, 10],
  [0, 50],
  [0.025, 50],
  [0.025, 92],
  [0.1, 92],
  [0.1, 46],
  [0.84, 44],
  [0.84, 80],
  [0.9, 80],
  [0.9, 108],
  [0.935, 108],
  [0.935, 80],
  [0.985, 80],
  [0.985, 46],
  [1, 46],
  [1, 10],
];
const SHIP_LIGHTS: [number, number, string][] = [
  [0.012, 112, "255, 250, 235"],
  [0.035, 84, "255, 214, 140"],
  [0.05, 84, "255, 214, 140"],
  [0.065, 84, "255, 214, 140"],
  [0.08, 84, "255, 214, 140"],
  [0.06, 72, "90, 255, 150"],
  [0.25, 54, "255, 236, 200"],
  [0.42, 54, "255, 236, 200"],
  [0.59, 54, "255, 236, 200"],
  [0.76, 54, "255, 236, 200"],
  [0.87, 68, "255, 214, 140"],
  [0.95, 68, "255, 214, 140"],
  [1, 58, "255, 250, 235"],
];

function shipBow(seconds: number) {
  const [from, to] = SHIP_PATH;
  const span = from - to;
  return from - ((4400 + seconds * SHIP_SPEED) % span);
}

function glowSprite(core: string, tint: string) {
  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${core}, 1)`);
  g.addColorStop(0.12, `rgba(${tint}, 0.7)`);
  g.addColorStop(0.4, `rgba(${tint}, 0.14)`);
  g.addColorStop(1, `rgba(${tint}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}

function drawShip(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  seconds: number,
  still: boolean,
) {
  const bow = shipBow(still ? 0 : seconds);
  const x = (TOWERS[0] + TOWERS[1]) / 2 + 250;
  const at = (s: number, y: number) =>
    scene.camera.project(x, y, bow + s * SHIP_LENGTH);
  const hull = SHIP_PROFILE.map(([s, y]) => at(s, y));
  if (hull.some((p) => p.z < 200)) return;
  const xs = hull.map((p) => p.x);
  if (Math.max(...xs) < -20 || Math.min(...xs) > scene.w + 20) return;

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0a1220";
  ctx.beginPath();
  hull.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(170, 186, 210, 0.22)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.globalCompositeOperation = "lighter";
  for (const [s, y, rgb] of SHIP_LIGHTS) {
    const p = at(s, y);
    const r = Math.max(0.8, Math.min(2, (scene.camera.focal * 2.4) / p.z));
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(p.x - r / 2, p.y - r / 2, r, r);
    const mirror = at(s, -y);
    for (let yy = mirror.y - 6; yy < mirror.y + 10; yy += 3) {
      ctx.globalAlpha =
        0.25 * (0.5 + 0.5 * Math.sin(seconds * 2.4 + yy * 0.4 + s * 40));
      ctx.fillRect(p.x - r + Math.sin(yy * 0.3 + seconds) * 1.5, yy, r * 2, 1.4);
    }
  }
  ctx.globalAlpha = 1;
}

export function StraitsScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const bctx = back?.getContext("2d");
    const fctx = front?.getContext("2d");
    if (!root || !back || !front || !bctx || !fctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sprite = glowSprite("255, 236, 190", "244, 178, 84");
    const beacon = glowSprite("255, 150, 130", "255, 70, 56");
    const start = performance.now();
    let scene: Scene | null = null;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let pointer = -1;
    let focus = -1;
    let boost = 0;

    const ignition = (lamp: Lamp, elapsed: number) => {
      if (still.matches) return 1;
      const k = Math.min(1, Math.max(0, (elapsed - lamp.delay) / IGNITE_FADE));
      return 1 - (1 - k) ** 3;
    };

    const draw = (now: number) => {
      if (!scene) return;
      const { w, h, horizon, lamps } = scene;
      const elapsed = still.matches ? Infinity : now - start;
      const t = still.matches ? 0 : now / 1000;

      if (pointer >= 0) {
        focus = focus < 0 ? pointer : focus + (pointer - focus) * 0.12;
        boost += (1 - boost) * 0.08;
      } else {
        boost *= 0.94;
      }
      const lift = (x: number) =>
        focus < 0 ? 0 : boost * Math.exp(-(((x - focus) / (w * 0.07)) ** 2));

      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.globalCompositeOperation = "source-over";
      bctx.drawImage(scene.background, 0, 0, w, h);
      for (const s of scene.stars) {
        bctx.globalAlpha = s.a * (0.7 + 0.3 * Math.sin(t * s.speed + s.x));
        bctx.fillStyle = "#e6edff";
        bctx.fillRect(s.x, s.y, s.r, s.r);
      }

      bctx.globalCompositeOperation = "lighter";
      bctx.fillStyle = "#e7c793";
      for (const tower of scene.towers) {
        for (let y = tower.y; y < tower.y + tower.length; y += 3) {
          const k = (y - tower.y) / tower.length;
          const sway = Math.sin(t * 1.1 + y * 0.08) * (1 + k * 6);
          bctx.globalAlpha = 0.2 * (1 - k) ** 1.6;
          bctx.fillRect(tower.x - tower.width / 2 + sway, y, tower.width, 2);
        }
      }
      drawShip(bctx, scene, t, still.matches);
      bctx.fillStyle = "#ffc86e";
      for (const lamp of lamps) {
        const on = ignition(lamp, elapsed);
        if (on <= 0) continue;
        // Reflections of high lamps land deep in the water; keep them faint.
        const y0 = lamp.mirror;
        if (y0 > h || lamp.r < 1) continue;
        const reach = (y0 - horizon) / (h - horizon);
        if (reach > 0.65) continue;
        const len = lamp.r * h * 0.035;
        const strength =
          on * lamp.dim * (0.4 - reach * 0.45 + lift(lamp.x) * 0.4);
        for (let y = y0; y < y0 + len; y += 3) {
          const k = (y - y0) / len;
          const depth = (y - horizon) / (h - horizon);
          const sway =
            (Math.sin(y * 0.11 + t * 1.6 + lamp.seed) +
              Math.sin(y * 0.037 - t * 0.9 + lamp.seed * 2) * 0.6) *
            (0.5 + depth * 2.5);
          const shimmer =
            (0.5 + 0.5 * Math.sin(t * 2.6 + y * 0.29 + lamp.seed)) ** 2;
          bctx.globalAlpha = strength * (1 - k) ** 1.6 * shimmer;
          const width =
            lamp.r * (1.3 + depth * 3) * (0.7 + 0.5 * Math.sin(y * 0.5 + t * 3));
          bctx.fillRect(lamp.x - width / 2 + sway, y, width, 1.5);
        }
      }
      bctx.globalAlpha = 1;

      fctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.clearRect(0, 0, front.width, front.height);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.globalCompositeOperation = "source-over";
      fctx.drawImage(scene.bridge, 0, 0, w, h);
      fctx.globalCompositeOperation = "lighter";
      for (const lamp of lamps) {
        const on = ignition(lamp, elapsed);
        if (on <= 0) continue;
        const near = lift(lamp.x);
        const size = lamp.r * (14 + near * 10);
        fctx.globalAlpha = on * lamp.dim * (0.8 + near * 0.2);
        fctx.drawImage(sprite, lamp.x - size / 2, lamp.y - size / 2, size, size);
      }
      const blink = still.matches ? 1 : 0.5 + 0.5 * Math.sin(t * 2.4);
      for (const b of scene.beacons) {
        fctx.globalAlpha = 0.35 + blink * 0.65;
        fctx.fillStyle = "#ff4b3e";
        fctx.beginPath();
        const r = Math.max(1, Math.min(2.4, scene.camera.focal * 3 / b.z));
        fctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        fctx.fill();
        fctx.globalAlpha = blink * 0.5;
        const size = r * 16;
        fctx.drawImage(beacon, b.x - size / 2, b.y - size / 2, size, size);
      }
      fctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible && !still.matches ? requestAnimationFrame(loop) : 0;
    };
    const run = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    // Aim the near tower at the gap between first and last name, and widen
    // that gap until the tower fits, so it frames the name instead of hiding
    // a letter.
    const nameGap = (left: number) => {
      const text = root.querySelector("h1")?.firstChild;
      const space = text?.textContent?.indexOf(" ") ?? -1;
      if (!text || space < 1) return undefined;
      const range = document.createRange();
      range.setStart(text, 0);
      range.setEnd(text, 1);
      const first = range.getBoundingClientRect();
      range.setStart(text, space + 1);
      range.setEnd(text, space + 2);
      const last = range.getBoundingClientRect();
      range.setStart(text, space);
      range.setEnd(text, space + 1);
      const gap = range.getBoundingClientRect();
      if (Math.abs(first.top - last.top) > 4) return undefined;
      return { center: gap.left + gap.width / 2 - left, width: gap.width };
    };

    const fitName = (left: number, width: number, height: number) => {
      const name = root.querySelector("h1");
      if (!name) return undefined;
      name.style.wordSpacing = "";
      let gap = nameGap(left);
      for (let i = 0; i < 3 && gap; i++) {
        const camera = makeCamera(width, height, horizonFor(width, height), gap.center);
        const need = nearTowerWidth(camera) * 1.3;
        if (gap.width >= need) break;
        const current = parseFloat(getComputedStyle(name).wordSpacing) || 0;
        name.style.wordSpacing = `${current + need - gap.width}px`;
        gap = nameGap(left);
      }
      return gap?.center;
    };

    const resize = () => {
      const { width, height, left } = root.getBoundingClientRect();
      if (!width || !height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [back, front]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      scene = build(width, height, dpr, fitName(left, width, height));
      draw(performance.now());
      run();
    };

    document.fonts?.ready.then(resize);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(root);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) run();
    });
    viewObserver.observe(root);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = event.clientX - root.getBoundingClientRect().left;
    };
    const onLeave = () => {
      pointer = -1;
    };
    const onMotionChange = () => {
      draw(performance.now());
      run();
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    still.addEventListener("change", onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      sizeObserver.disconnect();
      viewObserver.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      still.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="scene" ref={rootRef}>
      <canvas className="scene-back" ref={backRef} aria-hidden="true" />
      {children}
      <canvas className="scene-front" ref={frontRef} aria-hidden="true" />
    </div>
  );
}
