import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Leaf, Sun, Calculator, Target, Users } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/community', label: 'Community Insights', icon: Users },
  { path: '/carbon', label: 'Carbon Tracker', icon: Leaf },
  { path: '/solar', label: 'Solar Estimator', icon: Sun },
  { path: '/simulator', label: 'Bill Simulator', icon: Calculator },
  { path: '/goals', label: 'Goals & Savings', icon: Target },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-surface/60 backdrop-blur-2xl border-r border-white/10 sticky top-0 relative overflow-hidden">
      <div className="absolute top-0 -left-10 w-40 h-40 bg-accent/10 rounded-full mix-blend-multiply filter blur-2xl opacity-50 z-0"></div>
      <div className="p-6 relative z-10">
        <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          EcoSense
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative z-10 overflow-hidden ${
                  isActive 
                    ? 'bg-accent/20 text-accent font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-accent/30' 
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
