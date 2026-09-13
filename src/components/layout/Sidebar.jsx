import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Box,
  TrendingUp,
  ShieldAlert,
  Zap,
  Bell,
  Sparkles,
  Layers,
  X,
  CircleDollarSign,
  Truck,
  FileCheck2,
  BrainCircuit,
  History,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { navItems } from '../../data/mockData';
import { useScenario } from '../../context/ScenarioContext';

// Enterprise Operational Icons mapping
const iconMap = {
  'command-center': LayoutDashboard,
  'digital-twin': Layers,
  'reserve-intelligence': Box,
  'production-forecast': TrendingUp,
  'equipment': Truck,
  'safety': ShieldAlert,
  'incidents': FileCheck2,
  'ai-intelligence': BrainCircuit,
  'risk-analysis': ShieldCheck,
  'action-center': Zap,
  'alert-center': Bell,
  'roi-dashboard': CircleDollarSign,
  'audit-log': History,
  'architecture': Network,
};

// Mineral Beige & Industrial Slate color tones (strictly zero purple/indigo)
const iconThemeMap = {
  'command-center': { from: '#C7B59F', to: '#E8DFD1', glow: 'rgba(199, 181, 159, 0.35)' },
  'digital-twin': { from: '#38BDF8', to: '#7DD3FC', glow: 'rgba(56, 189, 248, 0.35)' },
  'reserve-intelligence': { from: '#D9CBBA', to: '#F5EFE6', glow: 'rgba(217, 203, 186, 0.35)' },
  'production-forecast': { from: '#0284C7', to: '#38BDF8', glow: 'rgba(2, 132, 199, 0.35)' },
  'equipment': { from: '#F59E0B', to: '#FCD34D', glow: 'rgba(245, 158, 11, 0.35)' },
  'safety': { from: '#EF4444', to: '#F87171', glow: 'rgba(239, 68, 68, 0.35)' },
  'incidents': { from: '#FB923C', to: '#FDBA74', glow: 'rgba(251, 146, 60, 0.35)' },
  'ai-intelligence': { from: '#C7B59F', to: '#E8DFD1', glow: 'rgba(199, 181, 159, 0.4)' },
  'risk-analysis': { from: '#E11D48', to: '#FB7185', glow: 'rgba(225, 29, 72, 0.35)' },
  'action-center': { from: '#EAB308', to: '#FDE047', glow: 'rgba(234, 179, 8, 0.35)' },
  'alert-center': { from: '#F97316', to: '#FB923C', glow: 'rgba(249, 115, 22, 0.35)' },
  'roi-dashboard': { from: '#10B981', to: '#34D399', glow: 'rgba(16, 185, 129, 0.35)' },
  'audit-log': { from: '#94A3B8', to: '#CBD5E1', glow: 'rgba(148, 163, 184, 0.35)' },
  'architecture': { from: '#64748B', to: '#94A3B8', glow: 'rgba(100, 116, 139, 0.35)' },
};

export default function Sidebar() {
  const { mobileMenuOpen, setMobileMenuOpen, simulationActive } = useScenario();

  // Group items by category for clean information architecture
  const categories = ['Operations', 'Assets & Safety', 'Decision Engine', 'Governance & Value'];

  const sidebarContent = (
    <div className="w-[280px] h-full bg-[#0B0E17]/95 backdrop-blur-2xl border-r border-[#262F3D]/80 flex flex-col z-30 select-none shadow-2xl relative">
      {/* Brand Header with Mineral Beige Core Emblem */}
      <div className="h-18 min-h-[72px] flex items-center justify-between px-5 border-b border-[#262F3D]/80 bg-[#0E121F]/80">
        <Link
          to="/command-center"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3.5 group cursor-pointer"
          title="MANGENESIS Mining Decision Platform"
        >
          {/* Mineral Beige & Industrial Slate Core Emblem */}
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C7B59F] via-[#8C7A6B] to-[#262F3D] p-[1.5px] shadow-lg shadow-[#C7B59F]/15 group-hover:shadow-[#C7B59F]/30 transition-all duration-300 transform-gpu group-hover:scale-105">
            <div className="w-full h-full bg-[#0D111C] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C7B59F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="font-display font-black text-base text-[#E8DFD1] tracking-wider relative z-10 group-hover:text-white transition-colors">
                M
              </span>
            </div>
            {/* Status Pulse Dot */}
            <span
              className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0D111C] ${
                simulationActive ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm tracking-wide text-white group-hover:text-[#E8DFD1] transition-colors">
                MANGENESIS
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#C7B59F]/15 text-[#D9CBBA] border border-[#C7B59F]/30">
                AI OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">
              MOIL &bull; Decision Intelligence
            </p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
        {categories.map((cat) => {
          const itemsInCat = navItems.filter((i) => i.category === cat);
          if (!itemsInCat || itemsInCat.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              <div className="px-3 py-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                <span>{cat}</span>
              </div>

              {itemsInCat.map((item) => {
                const Icon = iconMap[item.id] || Layers;
                const theme = iconThemeMap[item.id] || {
                  from: '#C7B59F',
                  to: '#E8DFD1',
                  glow: 'rgba(199, 181, 159, 0.4)',
                };

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-white/[0.09] to-white/[0.02] text-white font-semibold border border-[#C7B59F]/30 shadow-lg shadow-black/40'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Left Active Laser Indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activePill"
                            className="absolute left-0 inset-y-1.5 w-1 rounded-r-full bg-[#C7B59F] shadow-[0_0_10px_#C7B59F]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}

                        {/* Interactive Icon Box */}
                        <div
                          className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 ${
                            isActive
                              ? 'bg-[#182032] border border-[#C7B59F]/40 shadow-sm'
                              : 'bg-[#121624] border border-white/5 group-hover:border-white/20 group-hover:bg-[#182032]'
                          }`}
                          style={{
                            boxShadow: isActive ? `0 0 12px -2px ${theme.glow}` : 'none',
                          }}
                        >
                          <Icon
                            size={14}
                            style={{
                              color: isActive ? theme.to : undefined,
                            }}
                            className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}
                          />
                        </div>

                        {/* Nav Label */}
                        <span className="truncate tracking-wide text-xs">{item.label}</span>

                        {/* Active Indicator Pulse Ring */}
                        {isActive && (
                          <div className="ml-auto flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C7B59F] shadow-[0_0_6px_#C7B59F]" />
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom Live System Telemetry Card */}
      <div className="p-3 border-t border-[#262F3D]/80 bg-[#0A0D15]/90 space-y-2">
        {/* Closed-Loop Engine Status Card */}
        <div className="p-2.5 rounded-xl bg-[#131926] border border-[#262F3D] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full ${simulationActive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className={`absolute w-3.5 h-3.5 rounded-full ${simulationActive ? 'bg-amber-400/25 animate-ping' : 'bg-emerald-400/25 animate-ping'}`} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white font-mono">
                {simulationActive ? 'DEMO SIMULATION' : 'DECISION LOOP'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {simulationActive ? 'Telemetry Anomaly Injected' : 'Closed-Loop Active &bull; <120ms'}
              </div>
            </div>
          </div>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold ${
              simulationActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {simulationActive ? 'ACTIVE' : 'READY'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 h-full"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
