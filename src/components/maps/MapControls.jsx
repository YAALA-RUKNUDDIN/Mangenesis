import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Eye, EyeOff, ChevronDown, X } from 'lucide-react';

export default function MapControls({ layers, onToggleLayer }) {
  const [isOpen, setIsOpen] = useState(true);
  const activeCount = layers.filter((l) => l.active).length;

  return (
    <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="layers-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="bg-[#0F121A] border border-[#303A50] rounded-xl p-3 w-52 shadow-2xl"
            style={{ backgroundColor: '#0F121A' }}
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#242C3E] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Layers size={13} className="text-accent" />
                <span className="text-xs font-semibold uppercase tracking-wide">Map Layers</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize Layers"
              >
                <X size={13} />
              </button>
            </div>

            <div className="space-y-1">
              {layers.map((layer) => {
                const isActive = layer.active;
                return (
                  <button
                    key={layer.id}
                    onClick={() => onToggleLayer(layer.id)}
                    className={`w-full flex items-center justify-between text-left px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#1C2230] text-slate-100 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#151923]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {isActive ? (
                        <Eye size={13} className="text-accent" />
                      ) : (
                        <EyeOff size={13} className="text-slate-500" />
                      )}
                      <span>{layer.name}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-accent/15 text-accent border border-accent/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="layers-button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-[#0F121A] hover:bg-[#151923] border border-[#303A50] rounded-lg px-3 py-2 text-xs font-medium text-slate-200 shadow-2xl transition-colors cursor-pointer"
            style={{ backgroundColor: '#0F121A' }}
          >
            <Layers size={14} className="text-accent" />
            <span>Map Layers ({activeCount})</span>
            <ChevronDown size={13} className="text-slate-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
