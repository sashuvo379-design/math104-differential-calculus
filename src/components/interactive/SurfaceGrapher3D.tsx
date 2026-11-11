import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { evaluateAst, parseMathExpression } from '../../utils/mathEngine';
import {
  Box,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';

interface Preset3D {
  id: string;
  name: string;
  badge: string;
  expr: string;
  domain: [number, number];
  defaultPoint: [number, number];
  description: string;
}

const PRESETS_3D: Preset3D[] = [
  {
    id: 'saddle',
    name: 'Hyperbolic Saddle: x² - y²',
    badge: 'Classic Saddle (D < 0)',
    expr: 'x^2 - y^2',
    domain: [-2.5, 2.5],
    defaultPoint: [0, 0],
    description: 'Opposite curvatures along x and y axes create a saddle point with horizontal tangent plane at (0, 0).',
  },
  {
    id: 'paraboloid',
    name: 'Elliptic Paraboloid: x² + y²',
    badge: 'Local Minimum (D > 0, fxx > 0)',
    expr: 'x^2 + y^2',
    domain: [-2.5, 2.5],
    defaultPoint: [0, 0],
    description: 'Bowl surface curving upward in all directions with a global minimum at the origin.',
  },
  {
    id: 'slide-ex5',
    name: 'DU Slide Ex 5: x³ + y³ - 3xy',
    badge: 'DU Lecture 15 (Saddle & Min)',
    expr: 'x^3 + y^3 - 3*x*y',
    domain: [-2, 2.2],
    defaultPoint: [1, 1],
    description: 'Dr. Md. Rakib Hossain Slide Example 5: possesses a saddle point at (0,0) and a local minimum at (1,1).',
  },
  {
    id: 'slide-ex7',
    name: 'DU Slide Ex 7: xy(1 - x - y)',
    badge: 'DU Lecture 15 (Local Max)',
    expr: 'x*y*(1 - x - y)',
    domain: [-0.5, 1.2],
    defaultPoint: [0.33, 0.33],
    description: 'Dr. Md. Rakib Hossain Slide Example 7: triangular boundary with unique interior maximum at (1/3, 1/3).',
  },
  {
    id: 'monkey-saddle',
    name: 'Monkey Saddle: x³ - 3xy²',
    badge: 'Degenerate Critical Point (D = 0)',
    expr: 'x^3 - 3*x*y^2',
    domain: [-2, 2],
    defaultPoint: [0, 0],
    description: 'Features 3 downhill valleys (two for legs, one for tail) and 3 uphill peaks.',
  },
  {
    id: 'ripple',
    name: 'Concentric Wave: sin(√(x²+y²))',
    badge: 'Radial Symmetry Wave',
    expr: 'sin(sqrt(x^2 + y^2) * 2.5)',
    domain: [-3, 3],
    defaultPoint: [0, 0],
    description: 'Circular ripples demonstrating multivariable chain rule along radial polar paths.',
  },
];

// Helper: map elevation z from [zMin, zMax] to an artistic colormap (Indigo -> Cyan -> Emerald -> Amber -> Rose)
function getElevationColor(val: number, min: number, max: number): THREE.Color {
  const t = Math.max(0, Math.min(1, max === min ? 0.5 : (val - min) / (max - min)));
  const color = new THREE.Color();
  if (t < 0.25) {
    // Deep Indigo/Navy to Cyan
    const u = t / 0.25;
    color.setRGB(0.1 + 0.05 * u, 0.2 + 0.6 * u, 0.7 + 0.25 * u);
  } else if (t < 0.5) {
    // Cyan to Emerald
    const u = (t - 0.25) / 0.25;
    color.setRGB(0.15 - 0.05 * u, 0.8 + 0.15 * u, 0.95 - 0.45 * u);
  } else if (t < 0.75) {
    // Emerald to Amber/Gold
    const u = (t - 0.5) / 0.25;
    color.setRGB(0.1 + 0.85 * u, 0.95 - 0.2 * u, 0.5 - 0.4 * u);
  } else {
    // Amber to Neon Coral/Rose
    const u = (t - 0.75) / 0.25;
    color.setRGB(0.95 + 0.05 * u, 0.75 - 0.5 * u, 0.1 + 0.3 * u);
  }
  return color;
}

export const SurfaceGrapher3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);
  const tangentPlaneMeshRef = useRef<THREE.Mesh | null>(null);
  const pointMarkerMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isRotatingRef = useRef<boolean>(true);

  // Surface & Equation state
  const [selectedPreset, setSelectedPreset] = useState<string>('saddle');
  const [expression, setExpression] = useState<string>('x^2 - y^2');
  const [customInput, setCustomInput] = useState<string>('x^2 - y^2');
  const [domain, setDomain] = useState<[number, number]>([-2.5, 2.5]);
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [showTangentPlane, setShowTangentPlane] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const resolution = 44;
  const [parseError, setParseError] = useState<string | null>(null);

  // Tangent Point of Evaluation (x0, y0)
  const [x0, setX0] = useState<number>(0);
  const [y0, setY0] = useState<number>(0);

  // Collapsible control palette state (User requested collapsible palette)
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [presetsCollapsed, setPresetsCollapsed] = useState<boolean>(false);

  // Evaluated quantitative state at (x0, y0)
  const [evalResult, setEvalResult] = useState<{
    z0: number;
    fx: number;
    fy: number;
    fxx: number;
    fyy: number;
    fxy: number;
    D: number;
    classification: string;
  }>({
    z0: 0,
    fx: 0,
    fy: 0,
    fxx: 2,
    fyy: -2,
    fxy: 0,
    D: -4,
    classification: 'Saddle Point (D < 0)',
  });

  // 1. Initialize Three.js Scene, Camera, Lights, and OrbitControls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Soft dark background matching lucrative palette
    scene.background = new THREE.Color(0x0a0e1a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5.5, 6, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 25;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // Atmospheric lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-8, -4, -6);
    scene.add(dirLight2);

    // Coordinate Axes Helper (X=Red, Y=Green, Z=Blue)
    const axesHelper = new THREE.AxesHelper(3.5);
    scene.add(axesHelper);

    // Subtle Ground Grid
    const grid = new THREE.GridHelper(7, 14, 0x1e293b, 0x0f172a);
    grid.position.y = -2.5;
    scene.add(grid);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.autoRotate = isRotatingRef.current;
        controlsRef.current.autoRotateSpeed = 1.2;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
    };
  }, []);

  // Sync auto-rotate state dynamically
  useEffect(() => {
    isRotatingRef.current = isRotating;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);

  // 2. Build or Rebuild the 3D Multivariable Surface Mesh
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Validate and parse expression
    const parsed = parseMathExpression(expression);
    if (!parsed.valid || !parsed.ast) {
      setParseError(parsed.error || 'Invalid mathematical expression syntax.');
      return;
    }
    setParseError(null);
    const ast = parsed.ast;

    // Remove old surface mesh if exists
    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
      meshRef.current = null;
    }
    if (wireframeMeshRef.current) {
      scene.remove(wireframeMeshRef.current);
      wireframeMeshRef.current.geometry.dispose();
      (wireframeMeshRef.current.material as THREE.Material).dispose();
      wireframeMeshRef.current = null;
    }

    const [dMin, dMax] = domain;
    const segs = resolution;
    const size = dMax - dMin;

    const geometry = new THREE.PlaneGeometry(size, size, segs, segs);
    // Rotate to lie horizontally (X, Z horizontal, Y vertical in Three.js coordinates)
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position;
    const colors: number[] = [];
    const heights: number[] = [];

    let zMin = Infinity;
    let zMax = -Infinity;

    // First pass: compute elevation values
    for (let i = 0; i < posAttr.count; i++) {
      const u = posAttr.getX(i);
      const v = posAttr.getZ(i); // In our plane, Z is the second spatial dimension (y in math)

      // Evaluate f(u, v)
      let zVal = 0;
      try {
        const res = evaluateAst(ast, { x: u, y: v });
        if (res.ok && !isNaN(res.value) && isFinite(res.value)) {
          // Clamp extreme spikes for stable 3D visual geometry
          zVal = Math.max(-6, Math.min(6, res.value));
        }
      } catch {
        zVal = 0;
      }

      posAttr.setY(i, zVal);
      heights.push(zVal);
      if (zVal < zMin) zMin = zVal;
      if (zVal > zMax) zMax = zVal;
    }

    // Second pass: apply elevation vertex colors
    for (let i = 0; i < posAttr.count; i++) {
      const col = getElevationColor(heights[i], zMin, zMax);
      colors.push(col.r, col.g, col.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Lucrative double-sided material with vertex colors and subtle metallic luster
    const surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.25,
      wireframe: false,
    });

    const surfaceMesh = new THREE.Mesh(geometry, surfaceMaterial);
    scene.add(surfaceMesh);
    meshRef.current = surfaceMesh;

    // Subtle wireframe overlay
    if (showWireframe) {
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
      scene.add(wireframeMesh);
      wireframeMeshRef.current = wireframeMesh;
    }
  }, [expression, domain, resolution, showWireframe]);

  // 3. Compute Partial Derivatives, Tangent Plane, and Hessian Classification at (x0, y0)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const parsed = parseMathExpression(expression);
    if (!parsed.valid || !parsed.ast) return;
    const ast = parsed.ast;

    const evalAt = (x: number, y: number): number => {
      try {
        const res = evaluateAst(ast, { x, y });
        return res.ok && isFinite(res.value) ? res.value : 0;
      } catch {
        return 0;
      }
    };

    const h = 0.002;
    const z0 = evalAt(x0, y0);

    // Central differences for partial derivatives
    const fx = (evalAt(x0 + h, y0) - evalAt(x0 - h, y0)) / (2 * h);
    const fy = (evalAt(x0, y0 + h) - evalAt(x0, y0 - h)) / (2 * h);
    const fxx = (evalAt(x0 + h, y0) - 2 * z0 + evalAt(x0 - h, y0)) / (h * h);
    const fyy = (evalAt(x0, y0 + h) - 2 * z0 + evalAt(x0, y0 - h)) / (h * h);
    const fxy =
      (evalAt(x0 + h, y0 + h) -
        evalAt(x0 + h, y0 - h) -
        evalAt(x0 - h, y0 + h) +
        evalAt(x0 - h, y0 - h)) /
      (4 * h * h);

    const D = fxx * fyy - fxy * fxy;

    const gradMagnitude = Math.sqrt(fx * fx + fy * fy);
    const isCritical = gradMagnitude < 0.08;

    let classification = 'Regular Point (Non-Critical Slope)';
    if (isCritical) {
      if (D > 0.005) {
        classification =
          fxx > 0
            ? 'Local Minimum (Horizontal Tangent, D > 0, fxx > 0)'
            : 'Local Maximum (Horizontal Tangent, D > 0, fxx < 0)';
      } else if (D < -0.005) {
        classification = 'Saddle Point (Horizontal Tangent, D < 0)';
      } else {
        classification = 'Inconclusive / Higher-Order Flat (D ≈ 0)';
      }
    } else {
      if (D < -0.01) {
        classification = 'Hyperbolic Point (Saddle-Curvature, D < 0)';
      } else if (D > 0.01) {
        classification = 'Elliptic Point (Bowl-Curvature, D > 0)';
      }
    }

    setEvalResult({
      z0: Number(z0.toFixed(4)),
      fx: Number(fx.toFixed(4)),
      fy: Number(fy.toFixed(4)),
      fxx: Number(fxx.toFixed(3)),
      fyy: Number(fyy.toFixed(3)),
      fxy: Number(fxy.toFixed(3)),
      D: Number(D.toFixed(3)),
      classification,
    });

    // Update glowing point marker
    if (pointMarkerMeshRef.current) {
      scene.remove(pointMarkerMeshRef.current);
      pointMarkerMeshRef.current.geometry.dispose();
      (pointMarkerMeshRef.current.material as THREE.Material).dispose();
      pointMarkerMeshRef.current = null;
    }

    const sphereGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: isCritical ? 0xef4444 : 0xf59e0b,
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    // In Three.js: x is X, y is Z (math y), z is Y (math z)
    sphere.position.set(x0, z0, y0);
    scene.add(sphere);
    pointMarkerMeshRef.current = sphere;

    // Update 3D Tangent Plane Mesh: z = z0 + fx*(x - x0) + fy*(y - y0)
    if (tangentPlaneMeshRef.current) {
      scene.remove(tangentPlaneMeshRef.current);
      tangentPlaneMeshRef.current.geometry.dispose();
      (tangentPlaneMeshRef.current.material as THREE.Material).dispose();
      tangentPlaneMeshRef.current = null;
    }

    if (showTangentPlane) {
      const planeSpan = 1.8;
      const planeGeom = new THREE.PlaneGeometry(planeSpan, planeSpan, 4, 4);
      planeGeom.rotateX(-Math.PI / 2);

      const pPos = planeGeom.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        const px = pPos.getX(i);
        const py = pPos.getZ(i);
        const pz = z0 + fx * px + fy * py;
        pPos.setXYZ(i, x0 + px, pz, y0 + py);
      }
      planeGeom.computeVertexNormals();

      const planeMat = new THREE.MeshStandardMaterial({
        color: isCritical ? 0xef4444 : 0x06b6d4,
        transparent: true,
        opacity: isCritical ? 0.55 : 0.45,
        side: THREE.DoubleSide,
        roughness: 0.2,
      });

      const planeMesh = new THREE.Mesh(planeGeom, planeMat);
      scene.add(planeMesh);
      tangentPlaneMeshRef.current = planeMesh;
    }
  }, [expression, x0, y0, showTangentPlane]);

  // Preset Selection Handler
  const handleSelectPreset = (p: Preset3D) => {
    setSelectedPreset(p.id);
    setExpression(p.expr);
    setCustomInput(p.expr);
    setDomain(p.domain);
    setX0(p.defaultPoint[0]);
    setY0(p.defaultPoint[1]);
  };

  // Custom Equation Submit
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setExpression(customInput.trim());
    setSelectedPreset('custom');
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(5.5, 6, 7.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/90 text-slate-100 shadow-[0_0_35px_-5px_rgba(6,182,212,0.15)] overflow-hidden space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              Interactive 3D Multivariable Engine
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Three.js WebGL
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            3D Surface Grapher &amp; Tangent Plane Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Rotate (Left Drag), Pan (Right Drag), Zoom (Scroll). Inspect critical points, Hessian
            curvature, and tangent planes in live 3D space.
          </p>
        </div>

        {/* Viewport Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRotating((v) => !v)}
            aria-label={isRotating ? 'Pause auto-rotation' : 'Play auto-rotation'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isRotating ? 'Spinning' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            aria-label="Reset 3D camera angle"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Palette Collapse Button */}
          <button
            type="button"
            onClick={() => setControlsCollapsed((v) => !v)}
            aria-label={controlsCollapsed ? 'Expand control palette' : 'Collapse control palette'}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-colors"
          >
            {controlsCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            <span>{controlsCollapsed ? 'Show Controls' : 'Full Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Preset Surfaces Tray (Collapsible) */}
      {!controlsCollapsed && (
        <div className="px-4 sm:px-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Syllabus Presets &amp; Exam Slide Surfaces
            </span>
            <button
              type="button"
              onClick={() => setPresetsCollapsed((v) => !v)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              {presetsCollapsed ? (
                <>
                  <span>Show Presets</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Hide Presets</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {!presetsCollapsed && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {PRESETS_3D.map((p) => {
                const active = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between gap-1.5 ${
                      active
                        ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{p.name}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono truncate">
                      {p.expr}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main 3D Canvas Viewport */}
      <div className="relative mx-4 sm:mx-5 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 shadow-inner">
        <div ref={mountRef} className="w-full h-[480px] cursor-grab active:cursor-grabbing" />

        {/* 3D HUD Overlay: Current Classification & Coordinates */}
        <div className="absolute top-3 left-3 pointer-events-none space-y-1.5">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-xs shadow-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-cyan-300 font-bold">z = {expression}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300 shadow-md">
            <div>
              Tangent Point: <span className="font-mono text-amber-300 font-bold">({x0.toFixed(2)}, {y0.toFixed(2)})</span>
            </div>
            <div>
              Elevation: <span className="font-mono text-emerald-300 font-bold">z₀ = {evalResult.z0}</span>
            </div>
          </div>
        </div>

        {/* 3D Legend & Colormap Indicator */}
        <div className="absolute bottom-3 left-3 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400">
          <span>Min (Indigo)</span>
          <div className="w-20 h-2 rounded bg-gradient-to-r from-blue-700 via-cyan-400 via-emerald-400 via-amber-400 to-rose-500" />
          <span>Max (Rose)</span>
        </div>

        {/* Floating Quick Toggles */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowWireframe((v) => !v)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1 backdrop-blur-md ${
              showWireframe
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTangentPlane((v) => !v)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1 backdrop-blur-md ${
              showTangentPlane
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            <span>Tangent Plane</span>
          </button>
        </div>
      </div>

      {/* Collapsible Quantitative Analysis & Input Palette */}
      {!controlsCollapsed && (
        <div className="p-4 sm:p-5 pt-0 space-y-4">
          {/* Custom Equation Bar */}
          <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[240px] relative">
              <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-cyan-400">
                f(x, y) =
              </span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. x^2 - y^2 or x*y*(1 - x - y)"
                className="w-full pl-20 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs font-mono text-white placeholder-slate-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-colors"
            >
              Plot 3D Surface
            </button>
          </form>

          {parseError && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {parseError}
            </div>
          )}

          {/* Dual Sliders: Tangent Point (x0, y0) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Evaluate Point x₀:</span>
                <span className="font-mono text-amber-300 font-bold">{x0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={domain[0]}
                max={domain[1]}
                step="0.05"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">Evaluate Point y₀:</span>
                <span className="font-mono text-amber-300 font-bold">{y0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={domain[0]}
                max={domain[1]}
                step="0.05"
                value={y0}
                onChange={(e) => setY0(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Quantitative Calculus Readout: Partials & Hessian Discriminant */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400">Elevation z₀</div>
              <div className="text-base font-black font-mono text-white mt-0.5">
                {evalResult.z0}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">f(x₀, y₀)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400">Gradient Slope</div>
              <div className="text-base font-black font-mono text-cyan-300 mt-0.5">
                ({evalResult.fx}, {evalResult.fy})
              </div>
              <div className="text-[10px] text-slate-500 font-mono">(∂f/∂x, ∂f/∂y)</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400">Second Partials</div>
              <div className="text-sm font-black font-mono text-indigo-300 mt-0.5">
                fxx={evalResult.fxx}, fyy={evalResult.fyy}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">fxy={evalResult.fxy}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="text-[11px] font-semibold text-amber-300">Hessian D</div>
              <div
                className={`text-base font-black font-mono mt-0.5 ${
                  evalResult.D > 0
                    ? 'text-emerald-400'
                    : evalResult.D < 0
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }`}
              >
                D = {evalResult.D}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">fxx·fyy - (fxy)²</div>
            </div>
          </div>

          {/* Classification Banner */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-500/40 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Point Nature:</span>
              <span className="font-extrabold text-cyan-300">{evalResult.classification}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Tangent Plane: z = {evalResult.z0} + {evalResult.fx}(x - {x0.toFixed(2)}) + {evalResult.fy}(y - {y0.toFixed(2)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
