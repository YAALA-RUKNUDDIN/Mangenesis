import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Layers,
  Sparkles,
  Compass,
  RefreshCw,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
  Box,
} from 'lucide-react';

/**
 * Procedural PBR Texture Generators for Real-Life Geological Strata
 */
function createRockTexture(baseColor = '#3a342d', veinColor = '#5c5245', noiseFreq = 24) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal strata sedimentary banding
  for (let y = 0; y < 512; y += 4) {
    const bandAlpha = Math.sin(y * 0.05) * 0.15 + Math.random() * 0.1;
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0, bandAlpha)})`;
    ctx.fillRect(0, y, 512, 4);
  }

  // Organic mineral vein noise & fractures
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let j = 0; j < 8; j++) {
      x += (Math.random() - 0.5) * 45;
      y += (Math.random() - 0.5) * 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Micro surface grain
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 25;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createOreTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Dark metallic Pyrolusite / Braunite base
  ctx.fillStyle = '#1c1524';
  ctx.fillRect(0, 0, 512, 512);

  // Intense crystalline manganese streaks (deep violet, silver-black, metallic amber)
  for (let i = 0; i < 60; i++) {
    const grad = ctx.createLinearGradient(0, 0, 200, 200);
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.5)');
    grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)');
    grad.addColorStop(1, 'rgba(30, 20, 45, 0.1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 80 + 20,
      Math.random() * 25 + 5,
      Math.random() * Math.PI,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export default function RealLifeGeological3D({
  selectedZone = null,
  onSelectZone = null,
  height = '640px',
  selectedStrata = 'all',
  depthSlice = 72,
  onSelectCore = null,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  const [sliceDepth, setSliceDepth] = useState(30); // 0% to 100%
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCore, setSelectedCore] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const [viewMode, setViewMode] = useState('lithology'); // 'lithology' | 'block_model' | 'surface'

  useEffect(() => {
    if (selectedStrata) setActiveFilter(selectedStrata);
  }, [selectedStrata]);

  useEffect(() => {
    if (depthSlice !== undefined) setSliceDepth(Math.round((depthSlice / 120) * 100));
  }, [depthSlice]);

  useEffect(() => {
    if (onSelectCore && selectedCore) onSelectCore(selectedCore);
  }, [selectedCore, onSelectCore]);

  const strataMeshesRef = useRef([]);
  const voxelGroupRef = useRef(null);

  // Drill Hole Stations
  const drillHoles = [
    { id: 'DH-101', x: -22, z: -16, depth: '142m', mnGrade: '46.8%', feGrade: '6.2%', rock: 'High-Grade Braunite', status: 'Proven Core' },
    { id: 'DH-102', x: 12, z: -20, depth: '168m', mnGrade: '48.2%', feGrade: '5.1%', rock: 'Crystalline Pyrolusite', status: 'Proven Core' },
    { id: 'DH-103', x: 24, z: 10, depth: '124m', mnGrade: '39.4%', feGrade: '9.8%', rock: 'Mansar Quartzite Schist', status: 'Indicated' },
    { id: 'DH-104', x: -8, z: 22, depth: '185m', mnGrade: '44.1%', feGrade: '7.4%', rock: 'Gondite Manganese Seam', status: 'Proven Core' },
    { id: 'DH-105', x: -26, z: 18, depth: '98m', mnGrade: '32.6%', feGrade: '12.0%', rock: 'Transition Ore Zone', status: 'Inferred' },
    { id: 'DH-106', x: 18, z: -6, depth: '210m', mnGrade: '51.5%', feGrade: '4.2%', rock: 'Ultra-Pure Deep Lens', status: 'Strategic' },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Cinematic Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080b12);
    scene.fog = new THREE.FogExp2(0x080b12, 0.0075);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(65, 50, 75);
    cameraRef.current = camera;

    // 3. Renderer with PBR Tonemapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 25;
    controls.maxDistance = 190;
    controls.target.set(0, -5, 0);
    controlsRef.current = controls;

    // 5. Realistic Geological Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambLight);

    // Warm Sun Directional Light (simulating natural sun on quarry)
    const sunLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    sunLight.position.set(60, 90, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Subtle Cyan Fill Light from underneath/ground reflection
    const groundFill = new THREE.DirectionalLight(0x06b6d4, 0.8);
    groundFill.position.set(-50, -40, -40);
    scene.add(groundFill);

    // Violet Accent Specular Light for Manganese Ore Highlights
    const oreAccentLight = new THREE.PointLight(0xc084fc, 2.5, 90);
    oreAccentLight.position.set(0, -6, 0);
    scene.add(oreAccentLight);

    // 6. Textures
    const topsoilTex = createRockTexture('#4a3c2c', '#6d5a43');
    const schistTex = createRockTexture('#2a323d', '#3f4b5a');
    const oreTex = createOreTexture();
    const basementTex = createRockTexture('#1e242d', '#2c3542');

    // 7. Realistic Stratified Geological Terrain Block
    const geologyGroup = new THREE.Group();
    geologyGroup.name = 'GeologyGroup';
    strataMeshesRef.current = [];

    const strataDefs = [
      {
        id: 'topsoil',
        name: 'Weathered Quartzite Overburden (0m - 35m)',
        yTop: 16,
        yBottom: 8,
        texture: topsoilTex,
        roughness: 0.9,
        metalness: 0.1,
        bumpScale: 0.08,
      },
      {
        id: 'schist',
        name: 'Mansar Muscovite-Schist (35m - 90m)',
        yTop: 8,
        yBottom: -2,
        texture: schistTex,
        roughness: 0.75,
        metalness: 0.2,
        bumpScale: 0.12,
      },
      {
        id: 'ore',
        name: 'High-Grade Braunite / Pyrolusite Ore Body (90m - 160m)',
        yTop: -2,
        yBottom: -14,
        texture: oreTex,
        roughness: 0.35,
        metalness: 0.75,
        bumpScale: 0.25,
        isOre: true,
      },
      {
        id: 'basement',
        name: 'Gondite Silicate Basement Bedrock (160m - 240m)',
        yTop: -14,
        yBottom: -24,
        texture: basementTex,
        roughness: 0.85,
        metalness: 0.15,
        bumpScale: 0.1,
      },
    ];

    const blockWidth = 56;
    const blockDepth = 52;

    strataDefs.forEach((layer) => {
      const layerHeight = layer.yTop - layer.yBottom;
      const geo = new THREE.BoxGeometry(blockWidth, layerHeight, blockDepth, 32, 6, 32);

      // Procedural rock fracture displacement on vertices
      const posAttr = geo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i);
        const vy = posAttr.getY(i);
        const vz = posAttr.getZ(i);

        // Add subtle organic rocky irregularity to edges
        if (Math.abs(vx) > (blockWidth / 2 - 1) || Math.abs(vz) > (blockDepth / 2 - 1)) {
          const edgeNoise = (Math.sin(vy * 0.8) + Math.cos(vz * 0.6)) * 0.6;
          posAttr.setX(i, vx + edgeNoise * 0.4);
          posAttr.setZ(i, vz + edgeNoise * 0.4);
        }
      }
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        map: layer.texture,
        roughness: layer.roughness,
        metalness: layer.metalness,
        bumpMap: layer.texture,
        bumpScale: layer.bumpScale,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = (layer.yTop + layer.yBottom) / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { layerId: layer.id, yTop: layer.yTop, yBottom: layer.yBottom };

      geologyGroup.add(mesh);
      strataMeshesRef.current.push({ mesh, def: layer });
    });

    scene.add(geologyGroup);

    // 8. Volumetric Block Model / Interpolated Ore Voxels (Alternative View Mode)
    const voxelGroup = new THREE.Group();
    voxelGroup.name = 'VoxelBlockModel';
    voxelGroup.visible = false;
    voxelGroupRef.current = voxelGroup;

    const voxelGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const voxelMatLow = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const voxelMatMed = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const voxelMatHigh = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.6 });
    const voxelMatUltra = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.8 });

    for (let x = -22; x <= 22; x += 3.2) {
      for (let z = -20; z <= 20; z += 3.2) {
        for (let y = -13; y <= -2; y += 3.2) {
          // Distance from center lens
          const dist = Math.sqrt(x * x + (y + 8) * (y + 8) * 4 + z * z);
          if (dist < 26) {
            let mat = voxelMatLow;
            if (dist < 10) mat = voxelMatUltra;
            else if (dist < 16) mat = voxelMatHigh;
            else if (dist < 21) mat = voxelMatMed;

            const voxel = new THREE.Mesh(voxelGeo, mat);
            voxel.position.set(x, y, z);
            voxelGroup.add(voxel);
          }
        }
      }
    }
    scene.add(voxelGroup);

    // 9. Realistic Diamond Core Drill Stations & Rigs
    const drillGroup = new THREE.Group();
    const hitTargets = [];

    drillHoles.forEach((dh) => {
      const stationGroup = new THREE.Group();
      stationGroup.position.set(dh.x, 0, dh.z);

      // Realistic Metallic Drill Derrick Rig on Surface
      const derrickGeo = new THREE.ConeGeometry(2.2, 7.5, 4, 1, true);
      const derrickMat = new THREE.MeshStandardMaterial({
        color: 0xd4d4d8,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true,
      });
      const derrick = new THREE.Mesh(derrickGeo, derrickMat);
      derrick.position.y = 16 + 3.75;
      stationGroup.add(derrick);

      // Warning beacon light on top of derrick
      const beaconLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
      );
      beaconLight.position.y = 16 + 7.5;
      stationGroup.add(beaconLight);

      // Segmented Realistic Subterranean Drill Barrel (Cylinder cutting through rock)
      const coreH = 38;
      const coreGeo = new THREE.CylinderGeometry(0.55, 0.55, coreH, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x71717a,
        metalness: 0.95,
        roughness: 0.15,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = -3;
      coreMesh.userData = { dhData: dh };
      stationGroup.add(coreMesh);
      hitTargets.push(coreMesh);

      // Glowing depth markers on the drill string
      for (let markY = -13; markY <= 15; markY += 7) {
        const ringGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: markY < -2 ? 0xa855f7 : 0x06b6d4 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = markY;
        stationGroup.add(ringMesh);
      }

      drillGroup.add(stationGroup);
    });

    scene.add(drillGroup);

    // 10. Datum Elevation Base Grid
    const datumGrid = new THREE.GridHelper(80, 24, 0xc7b59f, 0x1f293d);
    datumGrid.position.y = -24.5;
    scene.add(datumGrid);

    // 11. Raycasting for Clicking Drill Holes
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hitTargets);
      if (intersects.length > 0) {
        const dh = intersects[0].object.userData.dhData;
        setSelectedCore(dh);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // 12. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 13. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isRotating && controls) {
        geologyGroup.rotation.y += 0.0018;
        drillGroup.rotation.y += 0.0018;
        if (voxelGroup.visible) voxelGroup.rotation.y += 0.0018;
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

  // Update Depth Slicing
  useEffect(() => {
    // 0 to 100% slices from y = 16 down to y = -24
    const currentCutY = 16 - (sliceDepth / 100) * 40;

    strataMeshesRef.current.forEach(({ mesh, def }) => {
      if (def.yBottom > currentCutY) {
        mesh.visible = false;
      } else {
        mesh.visible = true;
      }
    });
  }, [sliceDepth]);

  // Update Layer Filter
  useEffect(() => {
    strataMeshesRef.current.forEach(({ mesh, def }) => {
      const isMatch =
        activeFilter === 'all' ||
        (activeFilter === 'braunite' && (def.id === 'ore' || def.isOre)) ||
        (activeFilter === 'schist' && def.id === 'schist') ||
        (activeFilter === 'quartzite' && def.id === 'topsoil') ||
        activeFilter === def.id;

      if (isMatch) {
        mesh.visible = true;
        mesh.material.opacity = 1.0;
        mesh.material.transparent = false;
      } else {
        mesh.visible = true;
        mesh.material.transparent = true;
        mesh.material.opacity = 0.15; // Translucent ghosting for contrast
      }
    });
  }, [activeFilter]);

  // Update View Mode (Lithology vs Voxel Block Model)
  useEffect(() => {
    if (!voxelGroupRef.current) return;

    if (viewMode === 'block_model') {
      voxelGroupRef.current.visible = true;
      strataMeshesRef.current.forEach(({ mesh }) => {
        mesh.material.transparent = true;
        mesh.material.opacity = 0.12;
      });
    } else {
      voxelGroupRef.current.visible = false;
      strataMeshesRef.current.forEach(({ mesh, def }) => {
        if (activeFilter === 'all' || activeFilter === def.id) {
          mesh.material.transparent = false;
          mesh.material.opacity = 1.0;
        }
      });
    }
  }, [viewMode, activeFilter]);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#080B12] shadow-2xl select-none group"
      style={{ height }}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Modern Header Pill (OriginKit / Lightwind Style) */}
      <div className="absolute top-5 inset-x-6 flex items-center justify-between gap-4 pointer-events-none z-10">
        <div className="flex items-center gap-3 bg-[#0d121f]/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/15 shadow-xl pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Volumetric Geological Strata Core
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              PBR Lithology &bull; UNFC 111 Core
            </span>
          </div>
        </div>

        {/* View Mode & Rotation Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-1 rounded-2xl bg-[#0d121f]/80 backdrop-blur-xl border border-white/15 flex items-center gap-1 shadow-xl">
            <button
              onClick={() => setViewMode('lithology')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                viewMode === 'lithology'
                  ? 'bg-gradient-to-r from-[#C7B59F] to-amber-200 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              LITHOLOGY
            </button>
            <button
              onClick={() => setViewMode('block_model')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                viewMode === 'block_model'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VOXEL ORE BLOCKS
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl shadow-xl ${
              isRotating
                ? 'bg-[#C7B59F]/20 border-[#C7B59F]/40 text-[#E8DFD1]'
                : 'bg-[#0d121f]/80 border-white/15 text-slate-400 hover:text-white'
            }`}
            title="Toggle 3D Rotation"
          >
            <RefreshCw size={14} className={isRotating ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stratigraphic Filter Chips (Bottom Left Floating Pill) */}
      <div className="absolute bottom-5 left-6 z-10 flex flex-wrap items-center gap-1.5 bg-[#0d121f]/85 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 pointer-events-auto shadow-2xl">
        {[
          { id: 'all', label: 'All Strata' },
          { id: 'ore', label: 'Manganese Lenses (Braunite)' },
          { id: 'schist', label: 'Mansar Schist' },
          { id: 'topsoil', label: 'Quartzite Cap' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeFilter === chip.id
                ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Depth Slicing Slider (Bottom Right Floating Pill) */}
      <div className="absolute bottom-5 right-6 z-10 bg-[#0d121f]/85 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/15 pointer-events-auto shadow-2xl flex items-center gap-3">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Depth Slice:
        </span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliceDepth}
          onChange={(e) => setSliceDepth(Number(e.target.value))}
          className="w-32 accent-[#C7B59F] cursor-pointer"
        />
        <span className="text-xs font-mono font-bold text-white w-12 text-right">
          {Math.round((sliceDepth / 100) * 240)}m
        </span>
      </div>

      {/* Drill Core Inspector Card Popup */}
      {selectedCore && (
        <div className="absolute top-20 right-6 z-20 w-80 p-5 rounded-3xl bg-[#0e1322]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white font-mono">{selectedCore.id} Diamond Core</span>
            </div>
            <button
              onClick={() => setSelectedCore(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Lithology Band:</span>
              <span className="font-semibold text-white">{selectedCore.rock}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Mn Ore Grade:</span>
              <span className="font-mono font-bold text-purple-400 text-sm">{selectedCore.mnGrade}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Fe Impurity:</span>
              <span className="font-mono font-semibold text-amber-400">{selectedCore.feGrade}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Hole Intercept:</span>
              <span className="font-mono text-slate-200">{selectedCore.depth}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Confidence Tier:</span>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                {selectedCore.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
