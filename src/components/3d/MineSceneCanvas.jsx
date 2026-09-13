import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createMinePitTerrain } from './terrain/MinePitTerrain';
import { createOreVeinModel } from './geology/OreVeinModel';
import { createFleetSimulation } from './telematics/FleetTrucks';
import { createSatellitePass } from './satellites/SatellitePass';
import { createZoneBeacons } from './markers/ZoneBeacon3D';
import CameraControlsHUD from './controls/CameraControlsHUD';
import { Activity, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

/**
 * High-Performance 3D Digital Twin Command Canvas for MANGENESIS.
 * Renders interactive WebGL procedural open-pit mine, subterranean manganese ore lenses,
 * animated fleet haulage trucks, and orbital satellite surveillance passes.
 */
export default function MineSceneCanvas({
  className = '',
  selectedZoneId = null,
  onSelectZone = null,
  highlightMode = 'default',
  showTelemetryHUD = true,
  height = '620px',
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Dynamic Scene Asset Refs
  const updatablesRef = useRef([]);
  const interactiveObjectsRef = useRef([]);
  const targetCameraPosRef = useRef(null);
  const targetLookAtRef = useRef(new THREE.Vector3(0, -8, 0));

  // UI State
  const [activePreset, setActivePreset] = useState('pit');
  const [activeMode, setActiveMode] = useState('day');
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Camera Bookmark Definitions
  const cameraPresets = {
    orbital: { pos: new THREE.Vector3(80, 85, 75), target: new THREE.Vector3(0, -5, 0) },
    pit: { pos: new THREE.Vector3(58, 48, 58), target: new THREE.Vector3(0, -8, 0) },
    subsurface: { pos: new THREE.Vector3(32, -4, 38), target: new THREE.Vector3(2, -18, -2) },
    haulroad: { pos: new THREE.Vector3(-24, 6, 42), target: new THREE.Vector3(-8, -10, 12) },
    drillsite: { pos: new THREE.Vector3(38, 12, 18), target: new THREE.Vector3(18, -4, 2) },
  };

  const handleSelectPreset = useCallback((presetKey) => {
    setActivePreset(presetKey);
    const cfg = cameraPresets[presetKey];
    if (cfg && controlsRef.current) {
      targetCameraPosRef.current = cfg.pos.clone();
      targetLookAtRef.current = cfg.target.clone();
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(activeMode === 'thermal' ? 0x0A0612 : 0x070A10);
    scene.fog = new THREE.FogExp2(activeMode === 'thermal' ? 0x0A0612 : 0x070A10, 0.0055);

    // 2. Camera
    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 1, 1000);
    camera.position.set(58, 48, 58);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and high-dpi support
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow peeking slightly below horizon for underground
    controls.minDistance = 15;
    controls.maxDistance = 240;
    controls.target.set(0, -8, 0);
    controlsRef.current = controls;

    // 5. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, activeMode === 'night' ? 0.3 : 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFAF0, activeMode === 'night' ? 0.4 : 1.6);
    sunLight.position.set(60, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Cyan Fill Light from South
    const fillLight = new THREE.DirectionalLight(0x06B6D4, 0.5);
    fillLight.position.set(-50, 40, -40);
    scene.add(fillLight);

    // Purple Emissive Rim Accent Light
    const accentLight = new THREE.PointLight(0xA855F7, 2.0, 120);
    accentLight.position.set(0, -10, 0);
    scene.add(accentLight);

    // 6. Build Procedural Scene Geometry
    const updatables = [];

    // Mine Pit Terrain
    const terrainGroup = createMinePitTerrain({
      showContours: true,
      mode: activeMode,
    });
    scene.add(terrainGroup);

    // Subsurface Ore Vein Bodies
    const oreGroup = createOreVeinModel({
      xRay: activePreset === 'subsurface' || activeMode === 'thermal',
      gradeCutoff: 30,
    });
    scene.add(oreGroup);

    // Fleet Haulage Simulation
    const haulRoadCurve = terrainGroup.userData.haulRoadCurve;
    const fleetGroup = createFleetSimulation(haulRoadCurve);
    scene.add(fleetGroup);
    if (fleetGroup.userData.update) updatables.push(fleetGroup.userData.update);

    // Orbital Satellite Surveillance
    const satGroup = createSatellitePass({
      showLaser: true,
      mode: activeMode,
    });
    scene.add(satGroup);
    if (satGroup.userData.update) updatables.push(satGroup.userData.update);

    // Holographic Zone Beacons
    const beaconGroup = createZoneBeacons(null, onSelectZone);
    scene.add(beaconGroup);
    if (beaconGroup.userData.update) updatables.push(beaconGroup.userData.update);
    interactiveObjectsRef.current = beaconGroup.userData.interactiveMeshes || [];

    updatablesRef.current = updatables;

    // 7. Raycasting for Zone Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.zoneData) {
          setHoveredZone(hit.userData.zoneData);
          setTooltipPos({ x: e.clientX - rect.left + 15, y: e.clientY - rect.top - 15 });
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredZone(null);
      renderer.domElement.style.cursor = 'default';
    };

    const handlePointerClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.zoneData) {
          onSelectZone?.(hit.userData.zoneData);
          // Focus camera on clicked zone
          const z = hit.userData.zoneData;
          targetCameraPosRef.current = new THREE.Vector3(z.x + 18, z.y + 14, z.z + 18);
          targetLookAtRef.current = new THREE.Vector3(z.x, z.y, z.z);
        }
      }
    };

    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('pointermove', handlePointerMove);
    canvasEl.addEventListener('click', handlePointerClick);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // 9. Animation Render Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update animated assets
      updatablesRef.current.forEach((fn) => fn(delta));

      // Smooth camera interpolation towards target presets
      if (targetCameraPosRef.current) {
        camera.position.lerp(targetCameraPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);

        if (camera.position.distanceTo(targetCameraPosRef.current) < 0.2) {
          targetCameraPosRef.current = null;
        }
      }

      // Auto-Orbit
      if (isAutoRotate && !targetCameraPosRef.current) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
      } else {
        controls.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      canvasEl.removeEventListener('pointermove', handlePointerMove);
      canvasEl.removeEventListener('click', handlePointerClick);

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeMode, isAutoRotate]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-750/60 bg-[#070A10] shadow-2xl transition-all duration-300 ${
        isExpanded ? 'fixed inset-0 z-50 rounded-none h-screen border-none' : className
      }`}
      style={{ height: isExpanded ? '100vh' : height }}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />

      {/* Floating HUD Controls */}
      <CameraControlsHUD
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
        isExpanded={isExpanded}
        onToggleExpanded={() => setIsExpanded(!isExpanded)}
      />

      {/* Hover Zone Tooltip */}
      {hoveredZone && (
        <div
          className="absolute z-30 pointer-events-none p-3 rounded-xl bg-[#0B0F19]/90 backdrop-blur-xl border border-blue-500/40 shadow-2xl transition-all duration-100"
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: `#${hoveredZone.color?.toString(16) || '10B981'}` }}
            />
            <span className="font-semibold text-xs text-white">{hoveredZone.name}</span>
          </div>
          <div className="text-[11px] text-slate-300 flex items-center gap-2">
            <span className="text-purple-400 font-mono font-bold">{hoveredZone.grade}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{hoveredZone.desc}</span>
          </div>
          <div className="text-[10px] text-blue-400 mt-1 flex items-center gap-1 font-mono">
            <Navigation size={10} /> Click to focus camera & load analytics
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD Overlay */}
      {showTelemetryHUD && (
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Spatial Coordinates & Orbital Status */}
          <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-[#0B0F19]/85 backdrop-blur-xl border border-slate-750/70 shadow-2xl pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                MOIL DIGITAL TWIN v2.4
              </span>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="text-[11px] font-mono text-slate-400 hidden sm:flex items-center gap-2">
              <span>LAT 21.155° N</span>
              <span>LON 79.090° E</span>
              <span>ELEV 342m AMSL</span>
            </div>
          </div>

          {/* Live Sensor Metrics */}
          <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-[#0B0F19]/85 backdrop-blur-xl border border-slate-750/70 shadow-2xl pointer-events-auto ml-auto">
            <div className="flex items-center gap-1.5 text-xs text-purple-300">
              <Sparkles size={13} className="text-purple-400" />
              <span className="font-mono font-semibold">46.8% Braunite Peak</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-blue-300">
              <Activity size={13} className="text-blue-400" />
              <span className="font-mono">3 Haul Trucks Active</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300">
              <ShieldAlert size={13} className="text-emerald-400" />
              <span className="font-mono">Slope FOS 1.48 (Stable)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
