import { useProfile } from '../hooks/useProfile';
import { useCalculations } from '../hooks/useCalculations';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { profile } = useProfile();
  const calculations = useCalculations(profile);

  if (!calculations) return <div className="p-8 text-center text-gray-400">Loading Dashboard...</div>;

  const { dailyKwh, monthlyBill, dailyCO2, grade, breakdown } = calculations;

  // Appliance Chart Data
  const applianceData = {
    labels: breakdown.map(a => a.name),
    datasets: [{
      label: 'Daily kWh',
      data: breakdown.map(a => a.dailyKwh),
      backgroundColor: breakdown.map(a => 
        a.dailyKwh > 3 ? '#EF4444' : a.dailyKwh >= 1 ? '#F59E0B' : '#10B981'
      ),
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
      y: { grid: { display: false }, ticks: { color: '#e5e7eb' } }
    }
  };

  // Forecast Chart Data
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const forecastData = {
    labels,
    datasets: [
      {
        label: 'Est. Usage',
        data: labels.map((_, i) => dailyKwh * (i >= 5 && profile.appliances.some(a => ['ac15', 'geyser'].includes(a.id)) ? 1.2 : 1)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Target (-20%)',
        data: labels.map(() => dailyKwh * 0.8),
        borderColor: '#10B981',
        borderDash: [5, 5],
        tension: 0,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#e5e7eb' } } },
    scales: {
      x: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: '#1f2937' }, ticks: { color: '#9ca3af' } }
    }
  };

  const hasHighRiskWeekend = profile.appliances.some(a => ['ac15', 'geyser'].includes(a.id));

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2 drop-shadow-sm">My Dashboard</h1>
        <p className="text-gray-400">Welcome home. Here is a summary of your energy usage.</p>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Usage", value: `${dailyKwh.toFixed(1)} kWh`, color: 'text-blue-400', glow: 'drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]' },
          { label: "Monthly Est.", value: `₹${monthlyBill.toFixed(0)}`, color: 'text-accent', glow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' },
          { label: "Daily CO₂", value: `${dailyCO2.toFixed(1)} kg`, color: 'text-teal-300', glow: 'drop-shadow-[0_0_15px_rgba(94,234,212,0.5)]' },
          { label: "Efficiency Grade", value: grade, color: grade.includes('A') ? 'text-accent' : grade.includes('B') ? 'text-blue-400' : 'text-danger', glow: 'drop-shadow-[0_0_15px_currentColor]' }
        ].map((m, i) => (
          <div key={i} className={`glass-card glass-card-hover p-6 rounded-2xl stagger-${i+1}`}>
            <h3 className="text-sm text-gray-300 mb-2 font-medium bg-white/5 inline-block px-3 py-1 rounded-full">{m.label}</h3>
            <p className={`text-3xl md:text-4xl font-extrabold mt-3 ${m.color} ${m.glow}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Breakdown */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl stagger-2">
          <h2 className="text-xl font-bold mb-6 flex justify-between items-center text-white">
            Appliance Breakdown
            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">Daily kWh</span>
          </h2>
          <div className="h-64">
            <Bar data={applianceData} options={chartOptions} />
          </div>
        </div>

        {/* Forecast Line Chart */}
        <div className="glass-card glass-card-hover p-6 rounded-2xl relative stagger-3">
          <h2 className="text-xl font-bold mb-6 flex justify-between items-center text-white">
            7-Day Forecast
            {hasHighRiskWeekend && (
              <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-xs font-bold border border-warning/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse">
                High Risk Weekend
              </span>
            )}
          </h2>
          <div className="h-64">
            <Line data={forecastData} options={lineOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
