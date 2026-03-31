import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useCalculations } from '../hooks/useCalculations';
import { PEAK_SUN_HOURS, DEFAULT_SUN_HOURS, EMISSION_FACTOR } from '../utils/constants';
import { Sun, ShieldCheck } from 'lucide-react';
import { Bar } from 'react-chartjs-2';

export default function SolarEstimator() {
  const { profile } = useProfile();
  const calculations = useCalculations(profile);
  
  const [area, setArea] = useState(250);
  const [result, setResult] = useState(null);

  const calculateSolar = () => {
    const tariff = calculations.monthlyBill / calculations.monthlyKwh;
    const peakHours = PEAK_SUN_HOURS[profile.state] || DEFAULT_SUN_HOURS;
    
    // Max capacity based on area (1kW ~ 100 sq.ft)
    const maxCapacityKwByArea = area / 100;
    
    // Recommended capacity based on usage
    let recCapacityKw = calculations.monthlyBill / (tariff * peakHours * 30);
    recCapacityKw = Math.round(recCapacityKw * 2) / 2; // Nearest 0.5 kW
    if (recCapacityKw > maxCapacityKwByArea) recCapacityKw = maxCapacityKwByArea;

    const annualGen = recCapacityKw * peakHours * 365 * 0.8;
    const annualSavings = annualGen * tariff;
    const systemCost = recCapacityKw * 55000;
    const payback = systemCost / annualSavings;
    const annualCO2 = annualGen * EMISSION_FACTOR;

    setResult({ recCapacityKw, annualGen, annualSavings, systemCost, payback, annualCO2 });
  };

  const chartData = {
    labels: ['Current', 'With Solar'],
    datasets: [{
      label: 'Annual Bill (₹)',
      data: [calculations.monthlyBill * 12, Math.max(0, (calculations.monthlyBill * 12) - (result?.annualSavings || 0))],
      backgroundColor: ['#ef4444', '#10b981'],
      borderRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { color: '#9ca3af' } }, y: { grid: { color: '#1f2937' }, ticks: { color: '#e5e7eb' } } }
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8 p-8 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-3xl border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse"></div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-2 flex items-center gap-3 relative z-10">
          <Sun className="h-10 w-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" /> Solar Potential Estimator
        </h1>
        <p className="text-gray-300 relative z-10 font-medium tracking-wide">Find out how much you can save with rooftop solar panels in {profile?.state}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="glass-card p-8 rounded-3xl relative stagger-1">
          <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Your Details</h2>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Available Rooftop Area (sq. ft.)</label>
              <input 
                type="number" 
                value={area} 
                onChange={e => setArea(e.target.value)} 
                className="w-full bg-navy/50 backdrop-blur-md border border-gray-700/50 rounded-xl px-5 py-4 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium"
                min="50"
              />
            </div>
            <div>
              <label className="text-sm font-bold tracking-wide uppercase text-gray-400 block mb-2">Monthly Electricity Bill</label>
              <input 
                type="text" 
                readOnly 
                value={`₹${calculations?.monthlyBill.toFixed(0)}`}
                className="w-full bg-white/5 backdrop-blur-md border border-white/5 rounded-xl px-5 py-4 text-gray-300 font-bold cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-3 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 p-4 rounded-xl text-sm font-semibold mt-2 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
              <ShieldCheck className="w-6 h-6" /> Net Metering Available in {profile?.state}
            </div>
            <button 
              onClick={calculateSolar}
              className="w-full py-4 mt-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-navy font-black text-lg tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1"
            >
              Calculate Potential
            </button>
          </div>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="glass-card glass-card-hover p-8 rounded-3xl flex flex-col justify-between stagger-2 border-accent/20">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Estimated Impact</h2>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">Rec. Capacity</p>
                  <p className="text-2xl font-extrabold text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{result.recCapacityKw.toFixed(1)} kW</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">System Cost</p>
                  <p className="text-2xl font-extrabold text-white">₹{result.systemCost.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">Annual Savings</p>
                  <p className="text-2xl font-extrabold premium-gradient-text from-accent to-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">₹{result.annualSavings.toLocaleString(0)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-1">Payback Period</p>
                  <p className="text-2xl font-extrabold text-white">{result.payback.toFixed(1)} <span className="text-sm font-semibold text-gray-400">Yrs</span></p>
                </div>
              </div>
            </div>
            
            <div className="h-48 mt-4 pt-6 border-t border-white/10">
              <Bar data={chartData} options={options} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
