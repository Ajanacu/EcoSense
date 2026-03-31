import { useProfile } from '../hooks/useProfile';
import { useCalculations } from '../hooks/useCalculations';
import { Line, Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement } from 'chart.js';
import { Trees, Plane, Car, Smartphone } from 'lucide-react';

ChartJS.register(ArcElement);

export default function CarbonTracker() {
  const { profile } = useProfile();
  const calculations = useCalculations(profile);
  const [savingsCounter, setSavingsCounter] = useState(0);

  useEffect(() => {
    if (!profile || !profile.joinDate) return;
    const daysSince = Math.max(1, Math.floor((new Date() - new Date(profile.joinDate)) / (1000 * 60 * 60 * 24)));
    const avgDailyIndia = 6.6; // ~200kg / 30 days
    const savings = Math.max(0, (avgDailyIndia - calculations.dailyCO2) * daysSince);
    let start = 0;
    const interval = setInterval(() => {
      start += Math.max(0.1, savings / 20);
      if (start >= savings) {
        setSavingsCounter(savings);
        clearInterval(interval);
      } else {
        setSavingsCounter(start);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [profile, calculations]);

  if (!calculations) return null;

  const monthlyCO2 = calculations.dailyCO2 * 30;
  
  // Trend Chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = {
    labels: months,
    datasets: [
      {
        label: 'Your Estimate',
        data: months.map((_, i) => i > 5 ? monthlyCO2 : monthlyCO2 * 1.2),
        borderColor: '#10B981',
        tension: 0.4,
      },
      {
        label: 'National Avg',
        data: months.map(() => 200),
        borderColor: '#4b5563',
        borderDash: [5, 5],
        tension: 0,
      }
    ]
  };

  // Donut Chart Room Default Mapping
  const roomData = { 'Living Room': 0, 'Kitchen': 0, 'Bedroom': 0, 'Bathroom': 0 };
  calculations.breakdown.forEach(app => {
    const kwh = app.dailyKwh;
    if (['ac15', 'led'].includes(app.id)) roomData['Bedroom'] += kwh;
    else if (['fridge', 'microwave', 'induction', 'mixer'].includes(app.id)) roomData['Kitchen'] += kwh;
    else if (['geyser', 'wm'].includes(app.id)) roomData['Bathroom'] += kwh;
    else roomData['Living Room'] += kwh;
  });

  const donutChart = {
    labels: Object.keys(roomData),
    datasets: [{
      data: Object.values(roomData).map(v => v * 30 * 0.82), // to Monthly CO2
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'],
      borderWidth: 0,
    }]
  };

  const equivalents = [
    { icon: Car, label: 'Km Driven', value: (monthlyCO2 / 0.12).toFixed(0), color: 'text-blue-400' },
    { icon: Trees, label: 'Trees Needed', value: (monthlyCO2 / 21).toFixed(1), color: 'text-accent' },
    { icon: Plane, label: 'Flights (MUM-DEL)', value: (monthlyCO2 / 180).toFixed(2), color: 'text-orange-400' },
    { icon: Smartphone, label: 'Phones Charged', value: Math.floor(monthlyCO2 / 0.008).toLocaleString(), color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2 drop-shadow-sm">Carbon Impact</h1>
        <p className="text-gray-400">Track and offset your household carbon footprint.</p>
      </header>

      <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] border-accent/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        <div className="text-center relative z-10">
          <p className="text-gray-300 mb-2 font-semibold tracking-wider uppercase text-sm">CO₂ Avoided Since Sign-up</p>
          <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-accent via-teal-400 to-blue-500 tracking-tighter drop-shadow-lg">
            {savingsCounter.toFixed(1)} <span className="text-4xl font-bold text-gray-500/50">kg</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {equivalents.map((eq, i) => {
          const Icon = eq.icon;
          return (
            <div key={i} className={`glass-card glass-card-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center stagger-${i+1}`}>
              <Icon className={`w-10 h-10 mb-4 drop-shadow-[0_0_10px_currentColor] ${eq.color}`} />
              <p className="text-sm font-medium text-gray-400 mb-2 tracking-wide">{eq.label}</p>
              <p className="text-3xl font-extrabold premium-gradient-text from-white to-gray-400">{eq.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 glass-card glass-card-hover p-6 rounded-2xl stagger-1">
          <h3 className="text-xl font-bold text-white mb-6">Emissions Trend</h3>
          <div className="h-64">
             <Line data={trendData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#e5e7eb' } } }, scales: { x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } } } }} />
          </div>
        </div>
        <div className="glass-card glass-card-hover p-6 rounded-2xl stagger-2">
          <h3 className="text-xl font-bold text-white mb-6">Footprint by Zone</h3>
          <div className="h-64 flex justify-center pb-4">
             <Doughnut data={donutChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 20 } } }, cutout: '75%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
