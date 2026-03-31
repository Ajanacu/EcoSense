import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-navy text-gray-100 font-sans relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
      
      <div className="flex w-full z-10">
        <Sidebar />
        <main className="flex-1 w-full pb-16 md:pb-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
