import * as THREE from "three";

/*
  "How we build" 3D scene: a two-storey gable house assembled in four stages.
    0 The Plan       floor plan drawn on the ground in lines of light
    1 The Structure  walls rise as wireframes
    2 The Build      walls solid, roof lowers into place, cladding and chimney
    3 The Handover   windows light up from inside
  Each stage is a level from 0 to 1 that eases toward its target, so stepping
  forwards and backwards animates smoothly. Loaded lazily by process.tsx.
*/

const GLOW = 0xf2b872;
const PLASTER = 0xcdbfa9;
const ROOF = 0x2b2622;
const TIMBER = 0x7a4a2c;
const DARK_GLASS = 0x191613;

const W = 8; // width (x)
const D = 6; // depth (z)
const H = 5.4; // eaves height, two storeys
const RIDGE = 2.6; // ridge height above the eaves
const T = 0.22; // wall thickness

export type HouseScene = {
  setStep: (step: number) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

type Levels = { plan: number; structure: number; build: number; light: number };

function targetsFor(step: number): Levels {
  return { plan: 1, structure: step >= 1 ? 1 : 0, build: step >= 2 ? 1 : 0, light: step >= 3 ? 1 : 0 };
}

/** Ground-plan line segments: outer walls, internal walls with door gaps, stairs. */
function planSegments(): number[] {
  const x0 = -W / 2, x1 = W / 2, z0 = -D / 2, z1 = D / 2;
  const s: number[][] = [
    // outer walls, with a front door gap
    [x0, z0, x1, z0], [x1, z0, x1, z1], [x1, z1, 0.6, z1], [-0.6, z1, x0, z1], [x0, z1, x0, z0],
    // internal walls
    [-1.2, z0, -1.2, -0.2], [-1.2, 0.8, -1.2, z1],
    [1.4, z0, 1.4, -1.2], [1.4, -0.2, 1.4, z1],
    [1.4, 0.4, x1, 0.4],
    [x0, 0.2, -2.4, 0.2],
  ];
  // stairs between x -1.2 and 1.4
  for (let i = 0; i <= 6; i++) s.push([-1.0, -2.6 + i * 0.4, 1.2, -2.6 + i * 0.4]);
  s.push([-1.0, -2.6, -1.0, -0.2], [1.2, -2.6, 1.2, -0.2]);
  const out: number[] = [];
  for (const [ax, az, bx, bz] of s) out.push(ax, 0.02, az, bx, 0.02, bz);
  return out;
}

/** Wall boxes as [cx, cz, sx, sz] in plan; all full height. */
const WALLS: [number, number, number, number][] = [
  [0, -D / 2, W, T],
  [0, D / 2, W, T],
  [-W / 2, 0, T, D],
  [W / 2, 0, T, D],
  [-1.2, -1.6, T, 2.8],
  [1.4, 1.2, T, 3.6],
];

function gableShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-D / 2, 0);
  shape.lineTo(D / 2, 0);
  shape.lineTo(0, RIDGE);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

export function createHouseScene(container: HTMLElement, opts: { reduced: boolean }): HouseScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const target = new THREE.Vector3(0, 2.6, 0);

  scene.add(new THREE.HemisphereLight(0xdfe6f0, 0x1a1714, 0.55));
  const key = new THREE.DirectionalLight(0xffe2bd, 1.6);
  key.position.set(-8, 14, 12);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fb2cc, 0.35);
  fill.position.set(10, 6, -6);
  scene.add(fill);
  const interior = new THREE.PointLight(GLOW, 0, 14, 1.6);
  interior.position.set(0, 2.6, 0.5);
  scene.add(interior);

  // Ground grid
  const grid = new THREE.GridHelper(48, 48, 0x6b5a45, 0x3a3229);
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.35;
  scene.add(grid);

  // 0. Plan lines
  const planGeo = new THREE.BufferGeometry();
  const planPos = planSegments();
  planGeo.setAttribute("position", new THREE.Float32BufferAttribute(planPos, 3));
  const planMat = new THREE.LineBasicMaterial({ color: GLOW, transparent: true, opacity: 1 });
  const plan = new THREE.LineSegments(planGeo, planMat);
  scene.add(plan);
  const planVerts = planPos.length / 3;

  // 1. Structure: wireframe walls that grow upwards
  const wireMat = new THREE.LineBasicMaterial({ color: GLOW, transparent: true, opacity: 0.85 });
  const structure = new THREE.Group();
  for (const [cx, cz, sx, sz] of WALLS) {
    const box = new THREE.BoxGeometry(sx, H, sz);
    box.translate(0, H / 2, 0);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), wireMat);
    edges.position.set(cx, 0, cz);
    structure.add(edges);
    box.dispose();
  }
  // first floor outline
  const floorEdges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, 0.2, D)), wireMat);
  floorEdges.position.y = H / 2;
  structure.add(floorEdges);
  scene.add(structure);

  // 2. Build: solid shell, gables, roof, chimney, cladding, windows
  const plaster = new THREE.MeshStandardMaterial({
    color: PLASTER,
    roughness: 0.9,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide, // gable triangles are single planes
  });
  const build = new THREE.Group();
  for (const [cx, cz, sx, sz] of WALLS.slice(0, 4)) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, H, sz).translate(0, H / 2, 0), plaster);
    m.position.set(cx, 0, cz);
    build.add(m);
  }
  for (const side of [-1, 1]) {
    const g = new THREE.Mesh(gableShape(), plaster);
    g.rotation.y = Math.PI / 2;
    g.position.set((side * W) / 2, H, 0);
    build.add(g);
  }
  const plinth = new THREE.Mesh(
    new THREE.BoxGeometry(W + 0.8, 0.25, D + 0.8),
    new THREE.MeshStandardMaterial({ color: 0x2a241f, roughness: 1, transparent: true, opacity: 0 }),
  );
  plinth.position.y = 0.12;
  build.add(plinth);

  const timberMat = new THREE.MeshStandardMaterial({ color: TIMBER, roughness: 0.7, transparent: true, opacity: 0 });
  for (let i = 0; i < 6; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.1, H - 0.2, 0.08), timberMat);
    slat.position.set(-2.55 + i * 0.16, H / 2, D / 2 + T / 2 + 0.04);
    build.add(slat);
  }

  // Windows: dark glass until the handover, then lit from inside.
  const glass = new THREE.MeshStandardMaterial({
    color: DARK_GLASS,
    emissive: 0xe89a4c, // warm interior light, kept below white so it reads as glow
    emissiveIntensity: 0,
    roughness: 0.4,
    transparent: true,
    opacity: 0,
  });
  const front = D / 2 + T / 2 + 0.03;
  const windows: [number, number, number, number, number, number][] = [
    // x, y, z, width, height, rotationY
    [-3.2, 1.5, front, 1.1, 1.6, 0], [-1.15, 1.5, front, 0.8, 1.6, 0], [0, 1.1, front, 1.0, 2.2, 0],
    [2.1, 1.3, front, 2.0, 1.9, 0], [-3.2, 4.0, front, 1.1, 1.3, 0], [-1.1, 4.0, front, 0.9, 1.3, 0],
    [1.6, 4.0, front, 1.5, 1.3, 0],
    [W / 2 + T / 2 + 0.03, 4.0, -0.8, 1.0, 1.3, Math.PI / 2], [W / 2 + T / 2 + 0.03, 1.3, 1.4, 0.8, 1.2, Math.PI / 2],
    [W / 2 + T / 2 + 0.03, H + 0.9, 0, 0.9, 1.0, Math.PI / 2],
  ];
  for (const [x, y, z, w, h, ry] of windows) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), glass);
    win.position.set(x, y, z);
    win.rotation.y = ry;
    build.add(win);
  }
  scene.add(build);

  // Roof drops into place during the build stage.
  const roofMat = new THREE.MeshStandardMaterial({ color: ROOF, roughness: 0.75, transparent: true, opacity: 0 });
  const roof = new THREE.Group();
  // Each slope runs from the eave (overhanging the wall) up to the ridge.
  const run = D / 2 + 0.4;
  const rise = RIDGE + 0.3;
  const slope = Math.hypot(run, rise);
  const angle = Math.atan2(rise, run);
  for (const side of [-1, 1]) {
    const plane = new THREE.Mesh(new THREE.BoxGeometry(W + 0.7, 0.16, slope), roofMat);
    plane.rotation.x = side * angle;
    plane.position.set(0, H - 0.3 + rise / 2, (side * run) / 2);
    roof.add(plane);
  }
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.7), plaster);
  chimney.position.set(-2.4, H + RIDGE - 0.1, -0.6);
  roof.add(chimney);
  // light trim along the roof edges, like the hero house's LED line
  const trimMat = new THREE.LineBasicMaterial({ color: GLOW, transparent: true, opacity: 0 });
  const trim = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-W / 2 - 0.35, H - 0.25, D / 2 + 0.4), new THREE.Vector3(W / 2 + 0.35, H - 0.25, D / 2 + 0.4),
      new THREE.Vector3(-W / 2 - 0.35, H + RIDGE, 0), new THREE.Vector3(W / 2 + 0.35, H + RIDGE, 0),
    ]),
    trimMat,
  );
  roof.add(trim);
  scene.add(roof);

  // State
  const levels: Levels = targetsFor(opts.reduced ? 3 : 0);
  let targets = { ...levels };
  if (!opts.reduced) Object.assign(levels, { plan: 0, structure: 0, build: 0, light: 0 });
  let active = false;
  let frame = 0;
  let last = performance.now();
  let t = 0;

  function apply() {
    plan.geometry.setDrawRange(0, Math.floor((planVerts * levels.plan) / 2) * 2);
    planMat.opacity = 1 - 0.55 * levels.build;

    structure.scale.y = Math.max(0.001, levels.structure);
    structure.visible = levels.structure > 0.001;
    wireMat.opacity = 0.85 * (1 - 0.8 * levels.build);

    plaster.opacity = levels.build;
    (plinth.material as THREE.MeshStandardMaterial).opacity = levels.build;
    timberMat.opacity = levels.build;
    glass.opacity = levels.build;
    build.visible = levels.build > 0.001;
    // Turn depth writing on once solid, so faces sort correctly.
    const solid = levels.build > 0.98;
    plaster.transparent = !solid;
    plaster.depthWrite = solid;

    roofMat.opacity = levels.build;
    roof.visible = levels.build > 0.001;
    roof.position.y = (1 - levels.build) * 3.5;

    glass.emissiveIntensity = 0.75 * levels.light;
    interior.intensity = 9 * levels.light;
    trimMat.opacity = levels.light * 0.9;
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = `${w}px`;
    renderer.domElement.style.height = `${h}px`;
    camera.aspect = w / h;
    // Pull back on narrow screens so the whole house fits.
    camera.fov = w / h < 0.9 ? 44 : 32;
    camera.updateProjectionMatrix();
  }

  function render(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    if (opts.reduced) {
      Object.assign(levels, targets);
    } else {
      const k = 1 - Math.exp(-dt * 2.4);
      for (const key of Object.keys(levels) as (keyof Levels)[]) levels[key] += (targets[key] - levels[key]) * k;
    }
    apply();
    // A slow, gentle orbit.
    const a = opts.reduced ? 0.7 : 0.7 + Math.sin(t * 0.18) * 0.22;
    camera.position.set(Math.sin(a) * 26, 14.5, Math.cos(a) * 26);
    camera.lookAt(target);
    renderer.render(scene, camera);
    if (active) frame = requestAnimationFrame(render);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();
  apply();
  render(performance.now());

  return {
    setStep(step) {
      targets = targetsFor(step);
      if (!active) render(performance.now());
    },
    setActive(next) {
      if (next === active) return;
      active = next;
      if (active) {
        last = performance.now();
        frame = requestAnimationFrame(render);
      } else cancelAnimationFrame(frame);
    },
    dispose() {
      active = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
