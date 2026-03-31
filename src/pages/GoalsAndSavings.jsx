import { useState } from 'react';
import { Medal, Flame, Target as TargetIcon, CheckCircle2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

const BADGES = [
  { id: 'first_login', name: 'Starter', desc: 'Completed setup', icon: '🌱', earned: true },
  { id: 'first_rec', name: 'Action Taker', desc: 'Followed 1st tip', icon: '💡', earned: true },
  { id: 'savings_500', name: 'Saver', desc: 'Saved ₹500', icon: '💰', earned: false },
  { id: 'streak_3', name: 'Consistent', desc: '3 Month Streak', icon: '🔥', earned: false },
  { id: 'warrior', name: 'Carbon Warrior', desc: 'Avoided 50kg CO₂', icon: '🌍', earned: true },
];

export default function GoalsAndSavings() {
  const [goal, setGoal] = useState(() => localStorage.getItem('ecosense_goal') || '10');
  const [progressValue, setProgressValue] = useState(60); // Mock 60% progress
  const [streak] = useState(1);

  const saveGoal = (v) => {
    localStorage.setItem('ecosense_goal', v);
    setGoal(v);
  };

  const chartData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Savings (₹)',
      data: [150, 220, 280, 260, 390, 450],
      backgroundColor: '#10B981',
      borderRadius: 4
    }]
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2 flex flex-wrap gap-3 items-center drop-shadow-sm">
          <TargetIcon className="text-purple-500 h-10 w-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" /> Goals & Rewards
        </h1>
        <p className="text-gray-400 font-medium">Gamify your energy savings journey.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Goal Setter */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden stagger-1 hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)] transition-all">
          <div className="flex justify-between items-start mb-6 z-10 relative">
            <div>
              <h2 className="text-xl font-semibold text-white">Monthly Target</h2>
              <p className="text-sm text-gray-400">Reduce bill by {goal}%</p>
            </div>
            <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-bold">
              <Flame className="w-4 h-4" /> {streak} Month Streak
            </div>
          </div>

          <div className="relative w-40 h-40 mx-auto my-6 z-10 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" className="stroke-gray-800 stroke-[12px] fill-transparent" />
               <circle cx="80" cy="80" r="70" className="stroke-accent stroke-[12px] fill-transparent transition-all duration-1000 origin-center" strokeDasharray={2 * Math.PI * 70} strokeDashoffset={(2 * Math.PI * 70) * (1 - progressValue / 100)} />
             </svg>
             <div className="absolute flex flex-col items-center">
               <span className="text-4xl font-bold text-white">{progressValue}%</span>
             </div>
          </div>

          <div className="mt-6 z-10 relative">
            <label className="text-sm text-gray-400 block mb-2">Adjust Target (%)</label>
            <input type="range" min="5" max="30" step="5" value={goal} onChange={e => saveGoal(e.target.value)} className="w-full accent-purple-500" />
            <button 
              onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
              className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-5 h-5 text-accent group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Mark latest tip followed
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-3xl h-full stagger-2">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Medal className="text-yellow-500 w-8 h-8 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" /> Milestones</h2>
             <div className="flex flex-wrap gap-4">
                {BADGES.map((b, i) => (
                  <div key={b.id} className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 w-32 relative text-center transition-all duration-300 hover:-translate-y-1 stagger-${(i%4)+1} ${b.earned ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-transparent shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/5 bg-white/5 opacity-60 grayscale'}`}>
                    <span className="text-4xl mb-3 drop-shadow-md">{b.icon}</span>
                    <span className="text-sm font-bold text-white leading-tight">{b.name}</span>
                    <span className="text-[11px] font-medium text-gray-400 mt-1">{b.desc}</span>
                    {!b.earned && <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px] rounded-xl" />}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl mt-6 stagger-3">
        <h2 className="text-2xl font-bold text-white mb-6">Savings History</h2>
        <div className="h-64">
           <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#1f2937' }, ticks: { color: '#e5e7eb' } } } }} />
        </div>
      </div>

    </div>
  );
}
