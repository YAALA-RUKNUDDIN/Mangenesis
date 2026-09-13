import * as THREE from 'three';

/**
 * Creates 3D fleet telematics simulation.
 * Features animated Komatsu/CAT haulage dump trucks traveling along the haul road,
 * dynamic headlights, and pit-floor excavator machinery.
 */
export function createFleetSimulation(haulRoadCurve) {
  const group = new THREE.Group();
  group.name = 'FleetSimulationGroup';

  if (!haulRoadCurve) return group;

  // Truck Builder Helper
  function buildDumpTruck(color = 0xF59E0B) {
    const truck = new THREE.Group();

    // Main Chassis
    const chassisGeom = new THREE.BoxGeometry(2.4, 0.8, 4.2);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.8;
    truck.add(chassis);

    // Cab
    const cabGeom = new THREE.BoxGeometry(1.4, 1.2, 1.6);
    const cabMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
    const cab = new THREE.Mesh(cabGeom, cabMat);
    cab.position.set(-0.4, 1.6, 1.0);
    truck.add(cab);

    // Cab Glass Windshield
    const glassGeom = new THREE.BoxGeometry(1.2, 0.6, 0.2);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.1, metalness: 0.9 });
    const glass = new THREE.Mesh(glassGeom, glassMat);
    glass.position.set(-0.4, 1.7, 1.85);
    truck.add(glass);

    // Dump Bed
    const bedGeom = new THREE.BoxGeometry(2.2, 1.4, 2.6);
    const bedMat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
    const bed = new THREE.Mesh(bedGeom, bedMat);
    bed.position.set(0, 1.8, -0.7);
    bed.rotation.x = 0.05;
    truck.add(bed);

    // Manganese Ore Payload inside Bed
    const payloadGeom = new THREE.DodecahedronGeometry(0.9, 1);
    payloadGeom.scale(1.8, 0.7, 1.8);
    const payloadMat = new THREE.MeshStandardMaterial({ color: 0x581C87, roughness: 0.9 });
    const payload = new THREE.Mesh(payloadGeom, payloadMat);
    payload.position.set(0, 2.3, -0.7);
    truck.add(payload);

    // 6 Giant Mining Tires
    const tireGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.5, 16);
    tireGeom.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.9 });

    const tirePositions = [
      [-1.3, 0.65, 1.2],
      [1.3, 0.65, 1.2],
      [-1.3, 0.65, -0.5],
      [1.3, 0.65, -0.5],
      [-1.3, 0.65, -1.5],
      [1.3, 0.65, -1.5],
    ];

    tirePositions.forEach((pos) => {
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.position.set(...pos);
      truck.add(tire);
    });

    // Headlights (Spotlights)
    const headlightGeom = new THREE.SphereGeometry(0.15, 8, 8);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
    const hl1 = new THREE.Mesh(headlightGeom, headlightMat);
    hl1.position.set(-0.8, 1.1, 2.15);
    const hl2 = new THREE.Mesh(headlightGeom, headlightMat);
    hl2.position.set(0.8, 1.1, 2.15);
    truck.add(hl1);
    truck.add(hl2);

    return truck;
  }

  // Active Haulage Fleet
  const trucksData = [
    { id: 'TRUCK-01', t: 0.12, speed: 0.015, color: 0xF59E0B, payload: '65T High Grade' },
    { id: 'TRUCK-02', t: 0.45, speed: 0.012, color: 0xEAB308, payload: '60T Medium Grade' },
    { id: 'TRUCK-03', t: 0.78, speed: 0.018, color: 0xF97316, payload: 'Empty (Descending)' },
  ];

  const truckMeshes = trucksData.map((data) => {
    const mesh = buildDumpTruck(data.color);
    mesh.userData = { ...data };
    group.add(mesh);
    return mesh;
  });

  // Pit Floor Excavator Shovel
  const excavator = new THREE.Group();
  const trackGeom = new THREE.BoxGeometry(3.5, 0.9, 4.5);
  const trackMat = new THREE.MeshStandardMaterial({ color: 0x1E293B });
  excavator.add(new THREE.Mesh(trackGeom, trackMat));

  const bodyGeom = new THREE.BoxGeometry(3.0, 1.8, 3.2);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.set(0, 1.4, 0);
  excavator.add(body);

  const boomGeom = new THREE.CylinderGeometry(0.3, 0.4, 5.0, 8);
  boomGeom.translate(0, 2.5, 0);
  boomGeom.rotateX(Math.PI / 4);
  const boomMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
  const boom = new THREE.Mesh(boomGeom, boomMat);
  boom.position.set(0, 1.8, 1.2);
  excavator.add(boom);

  excavator.position.set(-6, -14.8, 3);
  excavator.rotation.y = -0.6;
  group.add(excavator);

  // Animation Updater function
  function update(delta = 0.016) {
    truckMeshes.forEach((mesh) => {
      let t = mesh.userData.t + (mesh.userData.speed * delta);
      if (t > 1) t = 0;
      mesh.userData.t = t;

      const pos = haulRoadCurve.getPointAt(t);
      const tangent = haulRoadCurve.getTangentAt(t);

      mesh.position.copy(pos);
      // Align truck heading with road curve tangent
      const target = pos.clone().add(tangent);
      mesh.lookAt(target);
    });

    // Subtle excavator boom sway
    boom.rotation.z = Math.sin(Date.now() * 0.001) * 0.08;
  }

  group.userData.update = update;
  return group;
}
