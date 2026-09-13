import * as THREE from 'three';

/**
 * Creates 3D subterranean manganese ore deposit models.
 * Features glowing high-grade pyrolusite and braunite veins,
 * exploration drill boreholes, and geological stratigraphic layers.
 */
export function createOreVeinModel({ xRay = false, gradeCutoff = 30 } = {}) {
  const group = new THREE.Group();
  group.name = 'OreVeinModelGroup';

  // Subterranean Ore Bodies (Braunite / Psilomelane / Pyrolusite)
  // Situated at depths from y = -8 to y = -28
  const oreDeposits = [
    {
      name: 'North Braunite Main Lens',
      pos: [18, -12, -15],
      scale: [22, 5, 14],
      rot: [0.15, 0.4, -0.1],
      grade: 44.8,
      color: 0xC084FC, // high grade neon purple
    },
    {
      name: 'Central Pyrolusite Seam',
      pos: [-10, -17, 8],
      scale: [28, 4, 18],
      rot: [-0.2, -0.3, 0.15],
      grade: 48.2,
      color: 0xE879F9, // ultra-high grade magenta
    },
    {
      name: 'East Psilomelane Secondary Pocket',
      pos: [28, -20, 22],
      scale: [16, 6, 12],
      rot: [0.3, 0.2, -0.2],
      grade: 36.5,
      color: 0x818CF8, // medium grade violet blue
    },
    {
      name: 'Deep Basal Manganese Extension',
      pos: [-5, -26, -10],
      scale: [32, 7, 24],
      rot: [0.05, 0.6, 0.0],
      grade: 42.1,
      color: 0xA855F7,
    },
  ];

  oreDeposits.forEach((dep) => {
    if (dep.grade < gradeCutoff) return;

    // Organic ore lens mesh
    const oreGeom = new THREE.DodecahedronGeometry(1, 2);
    oreGeom.scale(dep.scale[0] / 2, dep.scale[1] / 2, dep.scale[2] / 2);

    const oreMat = new THREE.MeshStandardMaterial({
      color: dep.color,
      emissive: dep.color,
      emissiveIntensity: xRay ? 0.6 : 0.2,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: xRay ? 0.85 : 0.45,
    });

    const oreMesh = new THREE.Mesh(oreGeom, oreMat);
    oreMesh.position.set(...dep.pos);
    oreMesh.rotation.set(...dep.rot);
    oreMesh.userData = { isOreVein: true, ...dep };
    group.add(oreMesh);

    // Glowing lattice cage around high-grade deposits
    const wireGeom = new THREE.WireframeGeometry(oreGeom);
    const wireMat = new THREE.LineBasicMaterial({
      color: dep.color,
      transparent: true,
      opacity: xRay ? 0.7 : 0.25,
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    wireMesh.position.copy(oreMesh.position);
    wireMesh.rotation.copy(oreMesh.rotation);
    group.add(wireMesh);
  });

  // Exploration Drill Hole Core Cylinders
  const drillHoles = [
    { id: 'DH-01', x: 15, z: -10, depth: 30, grade: '46.2% Mn' },
    { id: 'DH-02', x: -8, z: 12, depth: 35, grade: '48.9% Mn' },
    { id: 'DH-03', x: 25, z: 18, depth: 28, grade: '38.4% Mn' },
    { id: 'DH-04', x: -20, z: -15, depth: 32, grade: '41.5% Mn' },
    { id: 'DH-05', x: 2, z: 2, depth: 40, grade: '49.1% Mn' },
  ];

  drillHoles.forEach((dh) => {
    const drillGeom = new THREE.CylinderGeometry(0.35, 0.35, dh.depth, 16);
    drillGeom.translate(0, -dh.depth / 2, 0); // Bore downwards from surface

    const drillMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x0284C7,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.8,
    });

    const drillMesh = new THREE.Mesh(drillGeom, drillMat);
    drillMesh.position.set(dh.x, 0, dh.z);
    drillMesh.userData = { isDrillHole: true, ...dh };
    group.add(drillMesh);

    // Surface Collar Marker Ring
    const collarGeom = new THREE.RingGeometry(0.6, 1.2, 16);
    collarGeom.rotateX(-Math.PI / 2);
    const collarMat = new THREE.MeshBasicMaterial({
      color: 0x06B6D4,
      side: THREE.DoubleSide,
    });
    const collarMesh = new THREE.Mesh(collarGeom, collarMat);
    collarMesh.position.set(dh.x, 0.1, dh.z);
    group.add(collarMesh);
  });

  return group;
}
