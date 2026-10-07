import { useEffect, useRef, type ReactNode } from "react";

// The Mackinac Bridge at dusk, drawn in two layers so the page's own
// content (the name) can sit between the sky and the bridge structure.

type Lamp = {
  x: number;
  y: number;
  r: number;
  delay: number;
  seed: number;
  streak: number;
};

type Star = { x: number; y: number; r: number; a: number; speed: number };

type Scene = {
  w: number;
  h: number;
  horizon: number;
  background: HTMLCanvasElement;
  bridge: HTMLCanvasElement;
  lamps: Lamp[];
  beacons: { x: number; y: number }[];
  towers: number[];
  towerW: number;
  stars: Star[];
};

const IGNITE_START = 650;
const IGNITE_SWEEP = 1700;
const IGNITE_FADE = 520;

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

function quad(
  a: [number, number],
  c: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  const u = 1 - t;
  return [
    u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
    u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
  ];
}

function build(w: number, h: number, dpr: number): Scene {
  const rand = seeded(1957);
  const narrow = w < 720;
  const horizon = Math.round(h * (narrow ? 0.64 : 0.69));
  const deck = horizon - Math.max(16, h * 0.045);
  const tL = w * (narrow ? 0.16 : 0.33);
  const tR = w * (narrow ? 0.88 : 0.79);
  const span = tR - tL;
  const side = span * 0.5;
  const towerTop = deck - Math.min(span * (narrow ? 1.4 : 0.68), h * 0.5);
  const towerW = Math.max(4, w * 0.006);
  const sag = deck - (deck - towerTop) * 0.07;
  const truss = Math.max(4, h * 0.01);

  const main = (x: number) => {
    const u = (x - (tL + tR) / 2) / (span / 2);
    return sag + (towerTop - sag) * u * u;
  };
  const sideCables = [
    {
      from: [tL, towerTop] as [number, number],
      ctrl: [tL - side * 0.55, deck - (deck - towerTop) * 0.12] as [
        number,
        number,
      ],
      to: [tL - side, deck - 4] as [number, number],
    },
    {
      from: [tR, towerTop] as [number, number],
      ctrl: [tR + side * 0.55, deck - (deck - towerTop) * 0.12] as [
        number,
        number,
      ],
      to: [tR + side, deck - 4] as [number, number],
    },
  ];

  // Sky, far shore, and water: everything that never moves.
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

  bg.ctx.fillStyle = "#0a1630";
  for (const [start, end, rise] of [
    [-0.02, 0.24, 0.016],
    [0.84, 1.02, 0.011],
  ]) {
    bg.ctx.beginPath();
    bg.ctx.moveTo(w * start, horizon);
    for (let i = 0; i <= 24; i++) {
      const x = w * (start + ((end - start) * i) / 24);
      const lift = Math.sin((i / 24) * Math.PI) ** 0.6;
      bg.ctx.lineTo(x, horizon - h * rise * lift * (0.85 + rand() * 0.3));
    }
    bg.ctx.lineTo(w * end, horizon);
    bg.ctx.fill();
    for (let i = 0; i < 14; i++) {
      bg.ctx.fillStyle = `rgba(255, 214, 150, ${0.25 + rand() * 0.45})`;
      bg.ctx.fillRect(
        w * (start + (end - start) * rand()),
        horizon - 1.5 - rand() * h * rise * 0.5,
        1.2,
        1.2,
      );
      bg.ctx.fillStyle = "#0a1630";
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

  // The bridge itself: piers, deck, suspenders, cables, towers.
  const br = layer(w, h, dpr);
  const steel = "#040b18";
  br.ctx.fillStyle = steel;
  const anchors = [tL - side, tR + side];
  for (let x = -span / 14; x < w + span / 7; x += span / 7) {
    if (x > anchors[0] + 6 && x < anchors[1] - 6) continue;
    br.ctx.fillRect(x - 1.5, deck + truss, 3, horizon - deck - truss);
  }
  for (const x of anchors) {
    br.ctx.fillRect(x - 9, deck - 6, 18, horizon - deck + 6);
  }
  br.ctx.fillRect(-2, deck, w + 4, truss);
  br.ctx.strokeStyle = "rgba(130, 150, 185, 0.22)";
  br.ctx.lineWidth = 0.75;
  br.ctx.beginPath();
  for (let x = 0; x < w; x += truss * 2) {
    br.ctx.moveTo(x, deck);
    br.ctx.lineTo(x + truss * 2, deck + truss);
    br.ctx.moveTo(x + truss * 2, deck);
    br.ctx.lineTo(x, deck + truss);
  }
  br.ctx.stroke();
  br.ctx.fillStyle = "rgba(255, 210, 140, 0.32)";
  br.ctx.fillRect(0, deck - 1, w, 1);

  br.ctx.strokeStyle = "rgba(196, 208, 226, 0.2)";
  br.ctx.lineWidth = 0.75;
  br.ctx.beginPath();
  for (let x = tL + span / 64; x < tR; x += span / 64) {
    br.ctx.moveTo(x, main(x));
    br.ctx.lineTo(x, deck);
  }
  for (const c of sideCables) {
    for (let i = 1; i < 32; i++) {
      const [x, y] = quad(c.from, c.ctrl, c.to, i / 32);
      br.ctx.moveTo(x, y);
      br.ctx.lineTo(x, deck);
    }
  }
  br.ctx.stroke();

  br.ctx.strokeStyle = "rgba(236, 216, 176, 0.62)";
  br.ctx.lineWidth = Math.max(1, w * 0.0011);
  br.ctx.beginPath();
  br.ctx.moveTo(tL, towerTop);
  for (let x = tL; x <= tR; x += 2) br.ctx.lineTo(x, main(x));
  for (const c of sideCables) {
    br.ctx.moveTo(...c.from);
    br.ctx.quadraticCurveTo(...c.ctrl, ...c.to);
  }
  br.ctx.stroke();

  for (const x of [tL, tR]) {
    const lit = br.ctx.createLinearGradient(0, towerTop, 0, horizon);
    lit.addColorStop(0, "#f6e2b6");
    lit.addColorStop(0.45, "#b89c6c");
    lit.addColorStop(1, "#2d2a2a");
    br.ctx.fillStyle = lit;
    br.ctx.beginPath();
    br.ctx.moveTo(x - towerW * 0.42, towerTop - towerW);
    br.ctx.lineTo(x + towerW * 0.42, towerTop - towerW);
    br.ctx.lineTo(x + towerW * 0.6, horizon);
    br.ctx.lineTo(x - towerW * 0.6, horizon);
    br.ctx.fill();
    br.ctx.fillStyle = "rgba(40, 30, 20, 0.35)";
    for (let i = 1; i < 5; i++) {
      const y = towerTop + ((deck - towerTop) * i) / 5;
      br.ctx.fillRect(x - towerW * 0.6, y, towerW * 1.2, 1.5);
    }
  }

  // Lamps strung along the cables and the roadway, lit left to right.
  const lamps: Lamp[] = [];
  const r = Math.max(1.4, Math.min(2.4, w * 0.0016));
  const add = (x: number, y: number, size: number, streak: number) =>
    lamps.push({
      x,
      y,
      r: size,
      streak,
      seed: rand() * 100,
      delay: IGNITE_START + (Math.max(0, x) / w) * IGNITE_SWEEP,
    });
  for (let i = 1; i < 36; i++) {
    const x = tL + (span * i) / 36;
    add(x, main(x), r, 0.035);
  }
  for (const c of sideCables) {
    for (let i = 1; i < 14; i++) {
      const [x, y] = quad(c.from, c.ctrl, c.to, i / 14);
      add(x, y, r, 0.035);
    }
  }
  for (let x = w * 0.01; x < w; x += Math.max(16, w / 64)) {
    add(x, deck - 2, r * 0.75, 0.08 + rand() * 0.1);
  }

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
    background: bg.canvas,
    bridge: br.canvas,
    lamps,
    beacons: [tL, tR].map((x) => ({ x, y: towerTop - towerW * 1.6 })),
    towers: [tL, tR],
    towerW,
    stars,
  };
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
      for (const x of scene.towers) {
        for (let y = horizon + 2; y < horizon + h * 0.24; y += 3) {
          const k = (y - horizon) / (h * 0.24);
          const sway = Math.sin(t * 1.1 + y * 0.08) * (1 + k * 6);
          bctx.globalAlpha = 0.16 * (1 - k) ** 1.6;
          bctx.fillStyle = "#e7c793";
          bctx.fillRect(x - scene.towerW + sway, y, scene.towerW * 2, 2);
        }
      }
      bctx.fillStyle = "#ffc86e";
      for (const lamp of lamps) {
        const on = ignition(lamp, elapsed);
        if (on <= 0) continue;
        // High cable lamps reflect deep in the water, so keep them faint.
        const height = (horizon - lamp.y) / horizon;
        const y0 = horizon + (horizon - lamp.y) * 0.9;
        const len = h * lamp.streak;
        const strength = on * (0.5 - height * 0.38 + lift(lamp.x) * 0.4);
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
        fctx.globalAlpha = on * (0.8 + near * 0.2);
        fctx.drawImage(sprite, lamp.x - size / 2, lamp.y - size / 2, size, size);
      }
      const blink = still.matches ? 1 : 0.5 + 0.5 * Math.sin(t * 2.4);
      for (const b of scene.beacons) {
        fctx.globalAlpha = 0.35 + blink * 0.65;
        fctx.fillStyle = "#ff4b3e";
        fctx.beginPath();
        fctx.arc(b.x, b.y, Math.max(1.4, scene.towerW * 0.32), 0, Math.PI * 2);
        fctx.fill();
        fctx.globalAlpha = blink * 0.5;
        const size = scene.towerW * 7;
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

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [back, front]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      scene = build(width, height, dpr);
      draw(performance.now());
      run();
    };

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
