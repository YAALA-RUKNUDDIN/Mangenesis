import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Check, Sparkles } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

export default function ZoneInfoPanel({ zone, onClose }) {
  const [isScheduled, setIsScheduled] = useState(false);

  if (!zone) return null;

  const handlePrioritize = () => {
    setIsScheduled(true);
    setTimeout(() => setIsScheduled(false), 4000);
  };

  return (
    <AnimatePresence>
      <motion.div
        key={zone.id}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.15 }}
        className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-16 z-[1050] sm:w-84 max-w-sm bg-[#131720] border border-[#262F3D] rounded-2xl p-4 shadow-2xl pointer-events-auto max-h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#262F3D]">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-400" />
            <div>
              <h3 className="text-xs font-semibold text-slate-100">{zone.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono">Manganese Exploration Sector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1A202C] transition-colors cursor-pointer"
            title="Close Zone Panel"
          >
            <X size={14} />
          </button>
        </div>

        {/* Probability Section */}
        <div className="py-3 border-b border-[#262F3D]">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span>Manganese Ore Deposit Probability</span>
            <span className="font-mono text-slate-500 text-[9px]">XGBoost AI</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span
              className="text-2xl font-bold font-mono leading-none"
              style={{ color: zone.color }}
            >
              {zone.probability}%
            </span>
            <StatusBadge level={zone.priority} size="sm" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {zone.probability >= 70
              ? 'High commercial feasibility: immediate diamond core drilling recommended.'
              : zone.probability >= 40
              ? 'Moderate mineral indicator: geophysical resistivity survey recommended.'
              : 'Low probability: barren host formation, retain as infrastructure buffer.'}
          </div>
        </div>

        {/* Geological Host */}
        <div className="py-2.5 border-b border-[#262F3D] text-xs">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
            Geological Formation
          </div>
          <div className="text-slate-200 font-medium text-[11px]">
            {zone.geological_formation || 'Sausar Group (Mansar Formation)'}
          </div>
        </div>

        {/* Space & Exploration Indicators */}
        <div className="py-2.5 border-b border-[#262F3D] text-xs">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles size={11} className="text-blue-400" />
            <span>AI Space & Assay Evidence</span>
          </div>
          <ul className="space-y-1.5">
            {(zone.indicators || [
              'Multispectral shortwave infrared (SWIR) alteration anomaly',
              'Thermal inertia contrast indicating high-density ore body',
              'Spatial alignment with regional Gondite strike axis'
            ]).map((ind, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <span>{ind}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            onClick={handlePrioritize}
            disabled={isScheduled}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
              isScheduled
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue'
            }`}
          >
            {isScheduled ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span>Survey Target Scheduled!</span>
              </>
            ) : (
              <>
                <span>Target Drill Rig Schedule</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
