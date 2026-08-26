import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  ShieldAlert,
  Zap,
  Bell,
  CircleDollarSign,
} from 'lucide-react';
import { navItems } from '../../data/mockData';

const iconMap = {
  'command-center': LayoutDashboard,
  'reserve-intelligence': Map,
  'production-forecast': TrendingUp,
  'risk-analysis': ShieldAlert,
  'action-center': Zap,
  'alert-center': Bell,
  'roi-dashboard': CircleDollarSign,
};

const shortLabels = {
  'command-center': 'Command',
  'reserve-intelligence': 'Reserves',
  'production-forecast': 'Forecast',
  'risk-analysis': 'Risk',
  'action-center': 'Actions',
  'alert-center': 'Alerts',
  'roi-dashboard': 'ROI',
};

export default function MobileNav() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[2500] bg-[#131720]/95 backdrop-blur-xl border-t border-[#262F3D] py-1.5 px-2 select-none shadow-2xl safe-bottom">
      <nav className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.id] || LayoutDashboard;
          const label = shortLabels[item.id] || item.label;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 min-w-[50px] relative ${
                  isActive
                    ? 'text-[#E8DFD1] font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative p-1 rounded-lg transition-transform ${isActive ? 'bg-[#1A202C] scale-105 border border-[#C7B59F]/30' : ''}`}>
                    <Icon
                      size={18}
                      className={isActive ? 'text-[#E8DFD1]' : 'text-slate-400'}
                    />
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#C7B59F]" />
                    )}
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none truncate max-w-[58px]">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
