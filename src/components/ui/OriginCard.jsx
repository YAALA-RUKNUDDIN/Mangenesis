import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * OriginCard (inspired by originkit.dev & lightwind.com)
 * High-end 3D perspective card with:
 * - Dynamic 3D tilt tracking cursor position
 * - Cursor-following radial gradient spotlight
 * - Cybernetic glassmorphic glow border
 * - Smooth spring physics on exit
 */
export default function OriginCard({
  children,
  className = '',
  glowColor = 'rgba(199, 181, 159, 0.15)',
  borderColor = 'rgba(199, 181, 159, 0.25)',
  spotlightColor = 'rgba(255, 255, 255, 0.08)',
  tiltStrength = 8,
  onClick,
}) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -tiltStrength;
    const rY = ((x - centerX) / centerX) * tiltStrength;

    setRotateX(rX);
    setRotateY(rY);
    setSpotlightPos({ x, y, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.5 }}
        className={`relative overflow-hidden rounded-2xl bg-[#0e131f]/85 backdrop-blur-xl border transition-colors duration-300 ${className}`}
        style={{
          borderColor,
          boxShadow: `0 12px 32px -10px rgba(0, 0, 0, 0.8), 0 0 20px -5px ${glowColor}`,
        }}
      >
        {/* Cursor Spotlight Layer */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            opacity: spotlightPos.opacity,
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${spotlightColor}, transparent 70%)`,
          }}
        />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C7B59F]/40 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-20 h-full">{children}</div>
      </motion.div>
    </div>
  );
}
