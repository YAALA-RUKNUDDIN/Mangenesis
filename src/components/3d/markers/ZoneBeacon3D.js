import * as THREE from 'three';

/**
 * Creates interactive 3D holographic beacons for mine zones (Zone A to F).
 * Features vertical laser pillars, rotating target rings, glowing status orbs,
 * and metadata properties for Raycasting interaction.
 */
export function createZoneBeacons(zonesData, onSelectZone) {
  const group = new THREE.Group();
  group.name = 'ZoneBeaconsGroup';

  // Fallback / default mine zones with 3D spatial coordinates
  const defaultZones = [
    {
      id: 'ZONE-A',
      name: 'North Pit (Zone A)',
      x: 12,
      y: -6.0,
      z: -22,
      status: 'active',
      grade: '46.8% Mn',
      color: 0x10B981, // Emerald (Active extraction)
      desc: 'Active High-Grade Braunite Seam',
    },
    {
      id: 'ZONE-B',
      name: 'East Ridge (Zone B)',
      x: 32,
      y: -3.0,
      z: 8,
      status: 'exploration',
      grade: '41.2% Mn',
      color: 0x06B6D4, // Cyan (Drill Core Exploration)
      desc: 'NASA GPM Radar Satellite Sector',
    },
    {
      id: 'ZONE-C',
      name: 'Deep Core Sump (Zone C)',
      x: 0,
      y: -14.8,
      z: 0,
      status: 'warning',
      grade: '49.4% Mn',
      color: 0xF59E0B, // Amber (Waterlogging Risk)
      desc: 'Pit Bottom Sump & Dewatering Station',
    },
    {
      id: 'ZONE-D',
      name: 'West Highwall (Zone D)',
      x: -30,
      y: -4.5,
      z: -14,
      status: 'danger',
      grade: '38.0% Mn',
      color: 0xEF4444, // Rose Red (Slope Stability Risk)
      desc: 'Geotechnical InSAR Displacement Sensor',
    },
    {
      id: 'ZONE-E',
      name: 'South Haul Ramp (Zone E)',
      x: -12,
      y: -8.0,
      z: 28,
      status: 'active',
      grade: '43.5% Mn',
      color: 0xA855F7, // Purple (Fleet Corridor)
      desc: 'Heavy Telematics Haulage Way',
    },
  ];

  const zones = zonesData || defaultZones;
  const interactiveMeshes = [];

  zones.forEach((zone) => {
    const beacon = new THREE.Group();
    beacon.position.set(zone.x, zone.y, zone.z);

    // 1. Vertical Laser Pillar
    const pillarHeight = 14;
    const pillarGeom = new THREE.CylinderGeometry(0.12, 0.25, pillarHeight, 12);
    pillarGeom.translate(0, pillarHeight / 2, 0);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: zone.color,
      transparent: true,
      opacity: 0.6,
    });
    const pillar = new THREE.Mesh(pillarGeom, pillarMat);
    beacon.add(pillar);

    // 2. Holographic Floating Target Ring at Top
    const ringGeom = new THREE.RingGeometry(1.6, 2.0, 32);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: zone.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.position.y = pillarHeight;
    beacon.add(ring);

    // 3. Central Pulsing Status Orb (Raycast Click Target)
    const orbGeom = new THREE.SphereGeometry(0.9, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: zone.color,
      emissive: zone.color,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const orb = new THREE.Mesh(orbGeom, orbMat);
    orb.position.y = pillarHeight;
    orb.userData = { isZoneBeacon: true, zoneData: zone };
    beacon.add(orb);
    interactiveMeshes.push(orb);

    // 4. Ground Anchor Base Ring
    const baseGeom = new THREE.RingGeometry(1.0, 2.5, 24);
    baseGeom.rotateX(-Math.PI / 2);
    const baseMat = new THREE.MeshBasicMaterial({
      color: zone.color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = 0.1;
    beacon.add(baseMesh);

    // Store references for animation
    beacon.userData = { ring, orb, pillar, baseMesh, initialY: pillarHeight };
    group.add(beacon);
  });

  // Animation Update
  function update(delta = 0.016) {
    const time = Date.now() * 0.002;
    group.children.forEach((beacon, idx) => {
      if (!beacon.userData.ring) return;
      // Rotate target ring
      beacon.userData.ring.rotation.y += 0.02;
      // Bob orb vertically
      beacon.userData.orb.position.y = beacon.userData.initialY + Math.sin(time + idx) * 0.4;
      // Pulse ground base ring
      const s = 1 + Math.sin(time * 1.5 + idx) * 0.15;
      beacon.userData.baseMesh.scale.set(s, s, s);
    });
  }

  group.userData.update = update;
  group.userData.interactiveMeshes = interactiveMeshes;

  return group;
}
