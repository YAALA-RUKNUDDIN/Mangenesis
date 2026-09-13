import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Layers, Sparkles, Eye, Compass, RefreshCw, ZoomIn, Info } from 'lucide-react';

/**
 * SubsurfaceStrata3D:
 * Dedicated 3D Subsurface Geological Core & Volumetric Ore Body Explorer for Reserve Intelligence.
 * Completely replaces repetitive 2D maps with interactive 3D strata slicing,
 * crystalline manganese veins, and clickable diamond drill-hole assay cores.
 */
export default function SubsurfaceStrata3D({
  selectedZone = null,
  onSelectZone = null,
  height = '580px',
}) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);

  const [sliceDepth, setSliceDepth] = useState(45); // 0 to 100%
  const [activeLayerFilter, setActiveLayerFilter] = useState('all');
  const [wireframeMode, setWireframeMode] = useState(false);
  const [selectedCore, setSelectedCore] = useState(null);
  const [isRotating, setIsRotating] = useState(true);

  // Drill Hole Assay Mock Data
  const drillHoles = [
    { id: 'DH-101', x: -18, z: -12, depth: '142m', mnGrade: '46.8%', feGrade: '6.2%', rock: 'High-Grade Braunite', status: 'Proven' },
    { id: 'DH-102', x: 8, z: -20, depth: '168m', mnGrade: '48.2%', feGrade: '5.1%', rock: 'Crystalline Pyrolusite', status: 'Proven' },
    { id: 'DH-103', x: 22, z: 6, depth: '124m', mnGrade: '39.4%', feGrade: '9.8%', rock: 'Siliceous Mansar Ore', status: 'Indicated' },
    { id: 'DH-104', x: -6, z: 18, depth: '185m', mnGrade: '44.1%', feGrade: '7.4%', rock: 'Braunite-Gondite Band', status: 'Proven' },
    { id: 'DH-105', x: -24, z: 22, depth: '98m', mnGrade: '32.6%', feGrade: '12.0%', rock: 'Ferro-Manganese Transition', status: 'Inferred' },
    { id: 'DH-106', x: 16, z: -4, depth: '210m', mnGrade: '51.5%', feGrade: '4.2%', rock: 'Deep High-Purity Lens', status: 'Strategic' },
  ];

  const strataMeshesRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0d14);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(55, 45, 65);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 180;
    controls.minDistance = 15;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controlsRef.current = controls;

    // 4. Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambLight);

    const dirLight1 = new THREE.DirectionalLight(0xc7b59f, 2.2);
    dirLight1.position.set(40, 60, 40);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    dirLight2.position.set(-40, -20, -30);
    scene.add(dirLight2);

    // 5. Build Subsurface Geological Strata Block
    const blockSize = { x: 50, z: 45 };
    const strataLayers = [
      { id: 'topsoil', name: 'Overburden / Quartzite Capping', yTop: 12, yBottom: 6, color: 0x3d352e, opacity: 0.85 },
      { id: 'schist', name: 'Mansar Host Schist', yTop: 6, yBottom: -2, color: 0x242e38, opacity: 0.88 },
      { id: 'ore', name: 'Manganese Braunite Ore Body', yTop: -2, yBottom: -12, color: 0x7e22ce, emissive: 0x581c87, opacity: 0.96, isOre: true },
      { id: 'basement', name: 'Gondite Silicate Basement', yTop: -12, yBottom: -22, color: 0x181e27, opacity: 0.9 },
    ];

    const layerGroup = new THREE.Group();
    strataMeshesRef.current = [];

    strataLayers.forEach((layer) => {
      const height = layer.yTop - layer.yBottom;
      const geo = new THREE.BoxGeometry(blockSize.x, height, blockSize.z, 16, 4, 16);
      
      // Material with glowing veins for ore
      const mat = new THREE.MeshStandardMaterial({
        color: layer.color,
        emissive: layer.emissive || 0x000000,
        emissiveIntensity: layer.isOre ? 0.6 : 0,
        roughness: layer.isOre ? 0.35 : 0.75,
        metalness: layer.isOre ? 0.65 : 0.15,
        transparent: true,
        opacity: layer.opacity,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = (layer.yTop + layer.yBottom) / 2;
      mesh.userData = { layerId: layer.id, initialY: mesh.position.y, height };
      layerGroup.add(mesh);
      strataMeshesRef.current.push({ mesh, layer });
    });

    scene.add(layerGroup);

    // 6. Subsurface Crystalline Ore Nodes (Floating embedded crystals in ore zone)
    const crystalGeo = new THREE.OctahedronGeometry(1.6, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xe9d5ff,
      emissive: 0xa855f7,
      emissiveIntensity: 1.2,
      roughness: 0.15,
      metalness: 0.9,
    });

    const crystalGroup = new THREE.Group();
    for (let i = 0; i < 28; i++) {
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(
        (Math.random() - 0.5) * 44,
        -2 - Math.random() * 9,
        (Math.random() - 0.5) * 40
      );
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = Math.random() * 0.8 + 0.6;
      crystal.scale.set(s, s, s);
      crystalGroup.add(crystal);
    }
    scene.add(crystalGroup);

    // 7. Drill Core Holes (Interactive Vertical Cylinders)
    const drillGroup = new THREE.Group();
    const hitMeshes = [];

    drillHoles.forEach((dh) => {
      const coreH = 34;
      const coreGeo = new THREE.CylinderGeometry(0.7, 0.7, coreH, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      });

      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(dh.x, -4, dh.z);
      coreMesh.userData = { dhData: dh };
      drillGroup.add(coreMesh);
      hitMeshes.push(coreMesh);

      // Top Beacon Ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.15, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(dh.x, 13.5, dh.z);
      drillGroup.add(ringMesh);

      // Pulsing Marker
      const beaconGeo = new THREE.SphereGeometry(0.8, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(dh.x, 14.5, dh.z);
      drillGroup.add(beaconMesh);
    });

    scene.add(drillGroup);

    // 8. Grid Helper Base
    const grid = new THREE.GridHelper(70, 20, 0xc7b59f, 0x27272a);
    grid.position.y = -22.5;
    scene.add(grid);

    // 9. Raycasting for Clicking Drill Holes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hitMeshes);
      if (intersects.length > 0) {
        const dh = intersects[0].object.userData.dhData;
        setSelectedCore(dh);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // 10. Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && controls) {
        layerGroup.rotation.y += 0.002;
        drillGroup.rotation.y += 0.002;
        crystalGroup.rotation.y += 0.002;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update wireframe mode
  useEffect(() => {
    strataMeshesRef.current.forEach(({ mesh }) => {
      mesh.material.wireframe = wireframeMode;
    });
  }, [wireframeMode]);

  // Update layer opacity/visibility on filter
  useEffect(() => {
    strataMeshesRef.current.forEach(({ mesh, layer }) => {
      if (activeLayerFilter === 'all') {
        mesh.visible = true;
        mesh.material.opacity = layer.opacity;
      } else if (activeLayerFilter === layer.id) {
        mesh.visible = true;
        mesh.material.opacity = 1.0;
      } else {
        mesh.visible = true;
        mesh.material.opacity = 0.15; // translucent ghosting
      }
    });
  }, [activeLayerFilter]);

  // Handle Depth Slicing
  useEffect(() => {
    // Slices from top down
    const cutY = 12 - (sliceDepth / 100) * 34;
    strataMeshesRef.current.forEach(({ mesh, layer }) => {
      if (layer.yBottom > cutY) {
        mesh.visible = false; // sliced away
      } else {
        mesh.visible = true;
      }
    });
  }, [sliceDepth]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#262F3D] bg-[#0A0D14] shadow-2xl select-none" style={{ height }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls Overlay (OriginKit / Lightwind Style) */}
      <div className="absolute top-4 inset-x-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#131824]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            3D Subsurface Strata & Ore Body Explorer
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            VOLUMETRIC
          </span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              isRotating
                ? 'bg-[#C7B59F]/20 text-[#E8DFD1] border-[#C7B59F]/40 shadow-sm'
                : 'bg-[#131824]/80 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <RefreshCw size={12} className={isRotating ? 'animate-spin' : ''} />
            <span>{isRotating ? 'AUTO-ROTATE' : 'LOCKED'}</span>
          </button>

          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
              wireframeMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-[#131824]/80 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Layers size={12} />
            <span>{wireframeMode ? 'SOLID' : 'ISOSURFACE'}</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Tabs (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap items-center gap-1.5 bg-[#131824]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 pointer-events-auto">
        {[
          { id: 'all', label: 'All Strata' },
          { id: 'ore', label: 'Manganese Lenses (Braunite)' },
          { id: 'schist', label: 'Host Schist' },
          { id: 'topsoil', label: 'Overburden' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveLayerFilter(f.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeLayerFilter === f.id
                ? 'bg-gradient-to-r from-[#C7B59F] to-[#A855F7] text-black font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Depth Slicing Slider (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-10 bg-[#131824]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 pointer-events-auto flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Depth Slice:</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliceDepth}
          onChange={(e) => setSliceDepth(Number(e.target.value))}
          className="w-28 accent-[#C7B59F] cursor-pointer"
        />
        <span className="text-xs font-mono font-bold text-[#E8DFD1] w-10 text-right">
          {Math.round((sliceDepth / 100) * 220)}m
        </span>
      </div>

      {/* Selected Drill Core Popup Card */}
      {selectedCore && (
        <div className="absolute top-16 right-4 z-20 w-72 p-4 rounded-2xl bg-[#0e131f]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-white font-mono">{selectedCore.id} Assay Log</span>
            </div>
            <button
              onClick={() => setSelectedCore(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Formation:</span>
              <span className="font-semibold text-white">{selectedCore.rock}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Mn Grade:</span>
              <span className="font-mono font-bold text-purple-400">{selectedCore.mnGrade}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fe Contaminant:</span>
              <span className="font-mono font-semibold text-amber-400">{selectedCore.feGrade}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Hole Depth:</span>
              <span className="font-mono text-slate-200">{selectedCore.depth}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Reserve Class:</span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                {selectedCore.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
