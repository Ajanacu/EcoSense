import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Leaf, Sun, Calculator, Target, Users } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dash', icon: LayoutDashboard },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/carbon', label: 'Carbon', icon: Leaf },
  { path: '/solar', label: 'Solar', icon: Sun },
  { path: '/simulator', label: 'Sim', icon: Calculator },
  { path: '/goals', label: 'Goals', icon: Target },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-surface/80 backdrop-blur-2xl border-t border-white/10 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                  isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'text-gray-400 hover:text-gray-300'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
