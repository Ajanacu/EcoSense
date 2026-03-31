import { useProfile } from '../hooks/useProfile';
import { useCalculations } from '../hooks/useCalculations';
import { Users, TrendingDown, Target, Zap } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function CommunityInsights() {
  const { profile } = useProfile();
  const calculations = useCalculations(profile);

  // Derive an assumed "State Average" based on their house size & occupants
  const getAverageKwh = () => {
    let base = 250;
    if (profile?.houseType === '1bhk') base = 150;
    if (profile?.houseType === '3bhk') base = 400;
    if (profile?.houseType === '4bhk+') base = 650;
    
    // Adjust slightly by occupants
    base += (profile?.occupants || 2) * 30;
    return base;
  };

  const stateAvg = getAverageKwh();
  const userUsage = calculations?.monthlyKwh || 0;
  
  const isBetter = userUsage < stateAvg;
  const percentDiff = Math.abs((userUsage - stateAvg) / stateAvg * 100).toFixed(0);

  // Generate localized tips based on their actual selected appliances
  const generateTips = () => {
    const tips = [];
    const hasAc = profile?.appliances?.some(a => ['ac10', 'ac15', 'ac20'].includes(a.id));
    const hasGeyser = profile?.appliances?.some(a => a.id === 'geyser');
    const hasFridge = profile?.appliances?.some(a => a.id === 'refrigerator');

    if (hasAc) {
      tips.push({
        title: "AC Temperature Optimization",
        desc: "Over 60% of homes in your state run the AC at 18-20°C. Raising it to 24°C saves you ₹350/month and prolongs compressor life.",
        effort: "Easy", color: "text-emerald-400", border: "border-emerald-400/20"
      });
    }
    if (hasGeyser) {
      tips.push({
        title: "Smart Geyser Timing",
        desc: "Turn off your geyser immediately after use instead of leaving it idle. This prevents thermal loss and drops your bill by 8-10%.",
        effort: "Medium", color: "text-blue-400", border: "border-blue-400/20"
      });
    }
    if (hasFridge) {
      tips.push({
        title: "Defrost & Clearance",
        desc: "Ensure your refrigerator is at least 3 inches away from the wall to let condenser coils breathe. Top 10% efficient homes do this weekly.",
        effort: "Easy", color: "text-accent", border: "border-accent/20"
      });
    }
    // Fallback if none matched
    if (tips.length === 0) {
      tips.push({
        title: "Phantom Load Elimination",
        desc: "Unplug standby electronics (TVs, chargers) before sleeping. This alone can cut your bill by 5%.",
        effort: "Easy", color: "text-yellow-400", border: "border-yellow-400/20"
      });
    }
    return tips;
  };

  const tips = generateTips();

  const chartData = {
    labels: ['Your Home', `Avg ${profile?.houseType.toUpperCase()} in ${profile?.state}`],
    datasets: [
      {
        label: 'Monthly Usage (kWh)',
        data: [userUsage, stateAvg],
        backgroundColor: [
          isBetter ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
          'rgba(75, 85, 99, 0.6)'
        ],
        borderColor: [
          isBetter ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9ca3af' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { weight: 'bold' } }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2 flex flex-wrap gap-3 items-center drop-shadow-sm">
          <Users className="text-blue-400 h-10 w-10 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" /> Community Insights
        </h1>
        <p className="text-gray-400 font-medium">See how you stack up against similar homes in {profile?.state}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden stagger-1 shadow-[0_4px_30px_rgba(0,0,0,0.2)] text-center flex flex-col items-center justify-center">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 ${isBetter ? 'bg-accent' : 'bg-danger'} animate-pulse`}></div>
          <Target className={`w-12 h-12 mb-4 drop-shadow-lg ${isBetter ? 'text-accent' : 'text-danger'}`} />
          <h2 className="text-xl font-bold text-white mb-2 relative z-10">Percentile Rank</h2>
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 tracking-tighter relative z-10 drop-shadow-md mb-3">
             {isBetter ? `Top ${100 - parseInt(percentDiff)}%` : `Bottom ${parseInt(percentDiff)}%`}
          </div>
          <p className="text-gray-400 text-sm font-medium relative z-10">
            {isBetter 
              ? `Great job! You use ${percentDiff}% LESS energy than the local average.`
              : `You use ${percentDiff}% MORE energy than similar homes in your area.`}
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl stagger-2">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
            Benchmarking
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Monthly KWh</span>
          </h2>
          <div className="h-48 relative">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl stagger-3">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Zap className="text-yellow-400 w-6 h-6" /> Profile-Matched Strategies
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {tips.map((tip, idx) => (
            <div key={idx} className={`bg-navy/50 backdrop-blur-md border ${tip.border} p-5 rounded-2xl flex items-start gap-4 transition-all hover:bg-white/5 hover:-translate-y-1`}>
              <div className={`p-3 rounded-full bg-white/5 ${tip.color} ${tip.border} border`}>
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-gray-100">{tip.title}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${tip.color} bg-white/5 border ${tip.border}`}>{tip.effort}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
