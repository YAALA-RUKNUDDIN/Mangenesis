import { useEffect, useState, useRef } from 'react';

export default function AnimatedNumber({ value, duration = 800, prefix = '', suffix = '', className = '' }) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValRef = useRef(value);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const startValue = typeof displayValue === 'number' ? displayValue : 0;
    const endValue = typeof value === 'number' ? value : parseFloat(value) || 0;
    startValRef.current = startValue;
    startTimeRef.current = null;

    if (startValue === endValue) return;

    let animFrameId;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValRef.current + (endValue - startValRef.current) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(animate);
      }
    };

    animFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameId);
  }, [value, duration]);

  const formatted = typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue;

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
