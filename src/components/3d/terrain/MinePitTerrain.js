import * as THREE from 'three';

/**
 * Creates the procedural 3D Open-Pit Mine Terrain.
 * Features concentric terraced benches, a winding spiral haul road,
 * realistic mineralized vertex colors, and a water sump at the pit floor.
 */
export function createMinePitTerrain({ showContours = true, mode = 'day' } = {}) {
  const group = new THREE.Group();
  group.name = 'MinePitTerrainGroup';

  // Dimensions
  const rimRadius = 80;
  const segments = 96;
  const benchLevels = [
    { r: 75, y: 0, color: [0.18, 0.22, 0.28] },       // Surface Plateau
    { r: 66, y: -2.5, color: [0.22, 0.20, 0.25] },    // Bench 1 (Overburden)
    { r: 56, y: -5.0, color: [0.24, 0.18, 0.28] },    // Bench 2 (Low-grade Mn)
    { r: 45, y: -8.0, color: [0.30, 0.16, 0.35] },    // Bench 3 (Medium-grade Mn)
    { r: 33, y: -11.5, color: [0.38, 0.14, 0.44] },   // Bench 4 (High-grade Braunite)
    { r: 20, y: -15.0, color: [0.45, 0.12, 0.52] },   // Bench 5 (Ultra-pure Pyrolusite)
    { r: 0,  y: -15.5, color: [0.12, 0.14, 0.20] }    // Pit Floor / Sump
  ];

  // 1. Build concentric stepped open-pit mesh
  const geom = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  // Generate rings
  benchLevels.forEach((level, ringIdx) => {
    const isCenter = level.r === 0;
    const count = isCenter ? 1 : segments;

    for (let i = 0; i < count; i++) {
      let x = 0;
      let z = 0;
      if (!isCenter) {
        const angle = (i / segments) * Math.PI * 2;
        // Introduce subtle organic irregularity to the pit edge
        const noise = Math.sin(angle * 5) * 1.5 + Math.cos(angle * 3) * 0.8;
        const r = level.r + noise;
        x = Math.cos(angle) * r;
        z = Math.sin(angle) * r;
      }

      // Elevation with slight bench beveling
      const y = level.y;

      vertices.push(x, y, z);

      // Manganese mineralized color tinting
      let [cr, cg, cb] = level.color;
      if (mode === 'thermal') {
        // Thermal IR: hotter deeper rock / machine activity
        const heat = Math.min(1, Math.abs(level.y) / 15);
        cr = 0.8 * heat + 0.1;
        cg = 0.2 * (1 - heat);
        cb = 0.3;
      } else if (mode === 'radar') {
        // Cyan SAR radar reflectivity
        cr = 0.05;
        cg = 0.4 + (ringIdx * 0.08);
        cb = 0.6 + (ringIdx * 0.05);
      }

      colors.push(cr, cg, cb);
      normals.push(0, 1, 0); // Will recalculate vertex normals
      uvs.push((x / (rimRadius * 2)) + 0.5, (z / (rimRadius * 2)) + 0.5);
    }
  });

  // Connect rings with triangle strips
  let currentOffset = 0;
  for (let ringIdx = 0; ringIdx < benchLevels.length - 1; ringIdx++) {
    const isNextCenter = (ringIdx + 1) === (benchLevels.length - 1);
    const ringStart = currentOffset;
    const nextRingStart = ringStart + segments;

    if (!isNextCenter) {
      for (let i = 0; i < segments; i++) {
        const nextI = (i + 1) % segments;

        const a = ringStart + i;
        const b = ringStart + nextI;
        const c = nextRingStart + i;
        const d = nextRingStart + nextI;

        // Two triangles per quad
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
      currentOffset += segments;
    } else {
      // Connect to center point
      const centerIdx = nextRingStart;
      for (let i = 0; i < segments; i++) {
        const nextI = (i + 1) % segments;
        indices.push(ringStart + i, centerIdx, ringStart + nextI);
      }
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.25,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(geom, terrainMat);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  group.add(terrainMesh);

  // 2. Winding Spiral Haul Road
  const roadCurvePoints = [];
  const roadTurns = 2.2;
  const roadPointsCount = 120;
  for (let i = 0; i <= roadPointsCount; i++) {
    const t = i / roadPointsCount;
    const angle = t * Math.PI * 2 * roadTurns;
    const r = 73 - (t * 52); // Starts near rim (73) and winds down to sump (21)
    const y = 0.2 - (t * 15.2);
    roadCurvePoints.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const roadCurve = new THREE.CatmullRomCurve3(roadCurvePoints);

  // Road geometry ribbon
  const roadGeom = new THREE.TubeGeometry(roadCurve, 100, 1.8, 4, false);
  const roadMat = new THREE.MeshStandardMaterial({
    color: mode === 'thermal' ? 0xF59E0B : 0x2A3444,
    roughness: 0.9,
    metalness: 0.1,
  });
  const roadMesh = new THREE.Mesh(roadGeom, roadMat);
  roadMesh.receiveShadow = true;
  group.add(roadMesh);

  // Store road curve for fleet truck animation
  group.userData.haulRoadCurve = roadCurve;

  // 3. Bench Contour Wireframe Overlays
  if (showContours) {
    const contourMat = new THREE.LineBasicMaterial({
      color: mode === 'radar' ? 0x06B6D4 : 0x6366F1,
      transparent: true,
      opacity: 0.45,
    });

    benchLevels.forEach((level) => {
      if (level.r === 0) return;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const noise = Math.sin(angle * 5) * 1.5 + Math.cos(angle * 3) * 0.8;
        const r = level.r + noise;
        pts.push(new THREE.Vector3(Math.cos(angle) * r, level.y + 0.05, Math.sin(angle) * r));
      }
      const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
      const contourLine = new THREE.Line(lineGeom, contourMat);
      group.add(contourLine);
    });
  }

  // 4. Sump Water Layer at Bottom of Pit
  const sumpGeom = new THREE.CircleGeometry(19.5, 32);
  sumpGeom.rotateX(-Math.PI / 2);
  const sumpMat = new THREE.MeshStandardMaterial({
    color: mode === 'radar' ? 0x0284C7 : 0x0F2942,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  });
  const sumpMesh = new THREE.Mesh(sumpGeom, sumpMat);
  sumpMesh.position.y = -15.1;
  group.add(sumpMesh);

  return group;
}
