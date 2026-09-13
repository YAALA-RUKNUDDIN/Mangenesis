import * as THREE from 'three';

/**
 * Creates 3D orbital satellites (Sentinel-2, Landsat-9, NASA GPM).
 * Features orbiting satellite bus, solar panels, high-frequency radar scanning frustum cones,
 * and ground sweeping radar footprint grid.
 */
export function createSatellitePass({ showLaser = true, mode = 'day' } = {}) {
  const group = new THREE.Group();
  group.name = 'SatellitePassGroup';

  // Satellite Bus Model
  const satGroup = new THREE.Group();

  // Central Gold-Foil Core Body
  const busGeom = new THREE.BoxGeometry(2.4, 2.0, 3.2);
  const busMat = new THREE.MeshStandardMaterial({
    color: 0xFBBF24,
    metalness: 0.9,
    roughness: 0.2,
  });
  const bus = new THREE.Mesh(busGeom, busMat);
  satGroup.add(bus);

  // Solar Array Wings (Left & Right)
  const solarGeom = new THREE.BoxGeometry(9.0, 0.1, 2.2);
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1E3A8A, // dark blue photovoltaic cell
    metalness: 0.8,
    roughness: 0.3,
  });

  const leftWing = new THREE.Mesh(solarGeom, solarMat);
  leftWing.position.x = -6.0;
  satGroup.add(leftWing);

  const rightWing = new THREE.Mesh(solarGeom, solarMat);
  rightWing.position.x = 6.0;
  satGroup.add(rightWing);

  // High-Gain Parabolic Dish Antenna
  const dishGeom = new THREE.ConeGeometry(1.2, 0.6, 16, 1, true);
  dishGeom.rotateX(Math.PI);
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.7 });
  const dish = new THREE.Mesh(dishGeom, dishMat);
  dish.position.set(0, -1.2, 0.8);
  satGroup.add(dish);

  // Optical SWIR / TIR Sensor Pod
  const sensorGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16);
  const sensorMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
  const sensor = new THREE.Mesh(sensorGeom, sensorMat);
  sensor.position.set(0, -1.2, -0.6);
  satGroup.add(sensor);

  // High Orbit Position
  satGroup.position.set(25, 45, 20);
  satGroup.lookAt(0, -8, 0);
  group.add(satGroup);

  // Sweeping Conical Radar/Laser Scanning Frustum
  let laserCone;
  if (showLaser) {
    const coneHeight = 60;
    const coneRadius = 38;
    const coneGeom = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
    coneGeom.translate(0, -coneHeight / 2, 0);
    coneGeom.rotateX(Math.PI / 2);

    const laserMat = new THREE.MeshBasicMaterial({
      color: mode === 'thermal' ? 0xF43F5E : 0x06B6D4,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    laserCone = new THREE.Mesh(coneGeom, laserMat);
    satGroup.add(laserCone);
  }

  // Ground Radar Footprint Ring
  const footprintGeom = new THREE.RingGeometry(25, 26.5, 64);
  footprintGeom.rotateX(-Math.PI / 2);
  const footprintMat = new THREE.MeshBasicMaterial({
    color: mode === 'thermal' ? 0xF43F5E : 0x06B6D4,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const footprint = new THREE.Mesh(footprintGeom, footprintMat);
  footprint.position.y = 0.2;
  group.add(footprint);

  // Orbital Path Wireframe Guide
  const orbitRadius = 55;
  const orbitPts = [];
  for (let i = 0; i <= 64; i++) {
    const th = (i / 64) * Math.PI * 2;
    orbitPts.push(new THREE.Vector3(Math.cos(th) * orbitRadius, 45 + Math.sin(th) * 10, Math.sin(th) * orbitRadius));
  }
  const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPts);
  const orbitMat = new THREE.LineDashedMaterial({
    color: 0x38BDF8,
    dashSize: 3,
    gapSize: 2,
    transparent: true,
    opacity: 0.35,
  });
  const orbitLine = new THREE.Line(orbitGeom, orbitMat);
  orbitLine.computeLineDistances();
  group.add(orbitLine);

  // Animation Update
  function update(delta = 0.016) {
    const time = Date.now() * 0.0004;
    satGroup.position.x = Math.cos(time) * orbitRadius;
    satGroup.position.z = Math.sin(time) * orbitRadius;
    satGroup.position.y = 45 + Math.sin(time) * 10;
    satGroup.lookAt(0, -8, 0);

    // Ground footprint tracks satellite sub-nadir point
    footprint.position.x = Math.cos(time) * 15;
    footprint.position.z = Math.sin(time) * 15;

    // Pulse footprint scale
    const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.05;
    footprint.scale.set(pulse, pulse, pulse);
  }

  group.userData.update = update;
  return group;
}
