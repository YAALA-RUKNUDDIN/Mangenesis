import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * GlobalBackgroundCanvas:
 * Renders an ambient, continuous 3D spatial field behind the entire MANGENESIS platform.
 * Features an interactive manganese crystalline particle grid, volumetric depth lines,
 * and gentle parallax response to mouse cursor movement.
 */
export default function GlobalBackgroundCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 240;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. Particle Grid (Subterranean Mineral Constellation)
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    // Palette: Deep Obsidian, Warm Sand (#C7B59F), Neon Cyan (#06B6D4), Manganese Violet (#A855F7)
    const colorA = new THREE.Color('#C7B59F');
    const colorB = new THREE.Color('#06B6D4');
    const colorC = new THREE.Color('#A855F7');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 350;

      // Color variation
      const rand = Math.random();
      const c = rand < 0.4 ? colorA : rand < 0.7 ? colorB : colorC;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      scales[i] = Math.random() * 2.5 + 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular soft glow texture for points
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(215,195,170,0.8)');
    grad.addColorStop(0.8, 'rgba(168,85,247,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const pointTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4.5,
      map: pointTexture,
      transparent: true,
      opacity: 0.55,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Subtle 3D Topographic Wireframe Horizon
    const planeGeo = new THREE.PlaneGeometry(800, 600, 32, 24);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x221a2c,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const horizonMesh = new THREE.Mesh(planeGeo, planeMat);
    horizonMesh.rotation.x = -Math.PI * 0.35;
    horizonMesh.position.y = -130;
    horizonMesh.position.z = -50;
    scene.add(horizonMesh);

    // 5. Parallax Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 0.6;
      camera.position.y = -targetY * 0.6;
      camera.lookAt(0, 0, 0);

      // Slow organic rotation
      particles.rotation.y = elapsed * 0.025;
      particles.rotation.x = Math.sin(elapsed * 0.03) * 0.05;

      // Gentle undulating horizon grid
      horizonMesh.position.z = -50 + Math.sin(elapsed * 0.5) * 8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      pointTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.85 }}
    />
  );
}
