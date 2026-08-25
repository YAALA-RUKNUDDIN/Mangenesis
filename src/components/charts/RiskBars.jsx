import { motion } from 'framer-motion';

export default function RiskBars({ drivers = [] }) {
  return (
    <div className="space-y-3">
      {drivers.map((driver, index) => (
        <div key={driver.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">{driver.name}</span>
            <span className="font-mono font-semibold" style={{ color: driver.color }}>
              {driver.percentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 border border-slate-700/80 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${driver.percentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: driver.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
