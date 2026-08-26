import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  ShieldAlert,
  Zap,
  Radio,
  Bell,
  Sparkles,
  Layers,
  X,
  CircleDollarSign,
} from 'lucide-react';
import { navItems } from '../../data/mockData';
import { useScenario } from '../../context/ScenarioContext';

const iconMap = {
  'command-center': LayoutDashboard,
  'reserve-intelligence': Map,
  'production-forecast': TrendingUp,
  'risk-analysis': ShieldAlert,
  'action-center': Zap,
  'alert-center': Bell,
  'roi-dashboard': CircleDollarSign,
};

export default function Sidebar() {
  const { mobileMenuOpen, setMobileMenuOpen } = useScenario();

  const sidebarContent = (
    <div className="w-[270px] h-full bg-[#0A0E17] border-r border-slate-800/80 flex flex-col z-30 select-none shadow-2xl relative">
      {/* Brand Header */}
      <div className="h-16 min-h-[64px] flex items-center justify-between px-5 border-b border-slate-800/80 bg-[#0A0E17]">
        <div className="flex items-center gap-3">
          {/* Glowing Brand Emblem */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-blue">
            <div className="w-full h-full bg-[#0E131F] rounded-[11px] flex items-center justify-center">
              <span className="font-display font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                M
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-white">
                MANGENESIS
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-normal">
              MOIL &bull; Ministry of Steel
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Section Header */}
      <div className="px-4 pt-5 pb-2">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400 px-2.5 mb-1.5 font-bold">
          <span>Control Platform</span>
          <span className="text-[9px] text-blue-400 font-mono">Live</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.id] || Layers;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/15 via-blue-500/10 to-transparent text-white font-semibold border-l-2 border-blue-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Live System Telemetry Card */}
      <div className="p-4 border-t border-slate-800/80 bg-[#080B11]/90">
        <div className="p-3 rounded-xl bg-[#0E131F] border border-slate-800 flex items-center justify-between text-xs shadow-card">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="absolute w-4 h-4 rounded-full bg-emerald-400/20 animate-ping" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-200 leading-none">Space Telemetry</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Sentinel-2 &bull; 10m</div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            SYNCED
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile/tablet) */}
      <aside className="hidden lg:flex shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[3000] lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="relative z-10 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
