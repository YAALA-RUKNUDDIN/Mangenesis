import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, ChevronUp, Layers } from 'lucide-react';

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="legend-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-xl p-3.5 shadow-2xl min-w-[240px] max-w-[280px]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2.5">
              <div>
                <div className="text-[11px] font-semibold text-zinc-100 flex items-center gap-1.5">
                  <Layers size={13} className="text-zinc-300" />
                  <span>Manganese Ore Reserve Probability</span>
                </div>
                <div className="text-[9px] text-zinc-400 font-mono mt-0.5">
                  AI-derived deposit presence confidence
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Minimize Legend"
              >
                <X size={12} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div>
                  <div className="text-zinc-200 font-medium text-[11px]">
                    High Potential (70–100%)
                  </div>
                  <div className="text-[10px] text-emerald-400/90 font-mono">
                    Commercial Mn Ore Strike (Drill Target)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 mt-0.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <div>
                  <div className="text-zinc-200 font-medium text-[11px]">
                    Medium Potential (40–70%)
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono">
                    Moderate Mineralization (Survey Needed)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-300 font-medium text-[11px]">
                    Low Potential (0–40%)
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    Barren Host Rock (Mine Buffer)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                <span>Diamond Core Assay Pin:</span>
                <span className="text-zinc-200 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rotate-45 bg-blue-500 inline-block" />
                  % Mn Grade
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="legend-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 shadow-xl transition-colors cursor-pointer"
          >
            <Info size={13} className="text-zinc-400" />
            <span className="text-[11px] font-medium">Map Legend</span>
            <ChevronUp size={13} className="text-zinc-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
