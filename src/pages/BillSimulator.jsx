import { useState, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useCalculations } from '../hooks/useCalculations';
import { DEFAULT_SUN_HOURS, PEAK_SUN_HOURS, EMISSION_FACTOR } from '../utils/constants';

export default function BillSimulator() {
  const { profile } = useProfile();
  const calculations = useCalculations(profile);

  const [acTemp, setAcTemp] = useState(24);
  const [acUsage, setAcUsage] = useState(profile?.appliances.find(a => a.id === 'ac15')?.hours || 6);
  const [isAc5Star, setIsAc5Star] = useState(profile?.appliances.find(a => a.id === 'ac15')?.starRating >= 4);
  const [goSolar, setGoSolar] = useState(false);

  const simulatedBill = useMemo(() => {
    let monthlyKwh = calculations.monthlyKwh;
    const acOriginal = profile.appliances.find(a => a.id === 'ac15');
    
    if (acOriginal) {
      // Remove original AC impact
      const origKwh = (acOriginal.wattage * acOriginal.hours) / 1000 * 30;
      monthlyKwh -= origKwh;
      
      // Calculate new AC impact
      let newWattage = isAc5Star ? 900 : 1800;
      // temperature factor: each degree above 24 = 6% savings, below 24 = 6% increase
      const tempFactor = 1 - ((acTemp - 24) * 0.06); 
      newWattage = newWattage * tempFactor;

      const newKwh = (newWattage * acUsage) / 1000 * 30;
      monthlyKwh += newKwh;
    }

    let calculatedBill = monthlyKwh * (calculations.monthlyBill / calculations.monthlyKwh);

    if (goSolar) {
      const peakHours = PEAK_SUN_HOURS[profile.state] || DEFAULT_SUN_HOURS;
      const annualSolarGen = 2 * peakHours * 365 * 0.8; // Assume 2kW standard recommended system for simulation
      const monthlySolarGen = annualSolarGen / 12;
      monthlyKwh -= monthlySolarGen;
      if (monthlyKwh < 0) monthlyKwh = 0;
      calculatedBill = monthlyKwh * (calculations.monthlyBill / calculations.monthlyKwh);
    }

    return calculatedBill;
  }, [acTemp, acUsage, isAc5Star, goSolar, profile, calculations]);

  const diff = calculations.monthlyBill - simulatedBill;
  const isSavings = diff > 0;

  return (
    <div className="space-y-6 animate-fade-in-up pb-20 relative z-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-2 drop-shadow-sm">Live Bill Simulator</h1>
        <p className="text-gray-400">Move the sliders to instantly see the impact on your wallet.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center stagger-1 relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 ${isSavings ? 'bg-accent' : 'bg-danger'}`}></div>
          <p className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-4 relative z-10">Simulated Monthly Bill</p>
          <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-6 drop-shadow-2xl relative z-10">
            <span className="text-5xl font-bold text-gray-500/50 -mr-2">₹</span>
            {simulatedBill.toFixed(0)}
          </div>
          
          <div className={`px-8 py-3 rounded-full font-bold tracking-wide border shadow-lg relative z-10 transition-all ${isSavings ? 'bg-accent/20 text-accent border-accent/40 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-danger/20 text-danger border-danger/40 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}>
            {Math.abs(diff) < 1 ? 'No change' : `${isSavings ? '-' : '+'} ₹${Math.abs(diff).toFixed(0)} vs Current (₹${calculations.monthlyBill.toFixed(0)})`}
          </div>
        </div>

        <div className="space-y-6 stagger-2">
          <div className="glass-card p-8 rounded-3xl">
            <div className="mb-6">
              <label className="flex justify-between text-sm text-gray-300 font-medium mb-3">
                <span>AC Temperature</span>
                <span className="text-accent">{acTemp}°C</span>
              </label>
              <input type="range" min="16" max="28" value={acTemp} onChange={e => setAcTemp(parseInt(e.target.value))} className="w-full accent-accent" />
            </div>
            
            <div className="mb-6">
              <label className="flex justify-between text-sm text-gray-300 font-medium mb-3">
                <span>AC Usage (Hours/Day)</span>
                <span className="text-blue-400">{acUsage} hrs</span>
              </label>
              <input type="range" min="0" max="16" value={acUsage} onChange={e => setAcUsage(parseInt(e.target.value))} className="w-full accent-blue-400" />
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-800 mt-4">
              <span className="text-sm font-medium text-white">Using 5-Star Rating AC</span>
              <button 
                onClick={() => setIsAc5Star(!isAc5Star)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isAc5Star ? 'bg-accent' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isAc5Star ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-800">
              <span className="text-sm font-medium text-yellow-500">Go Solar (Assume 2kW System)</span>
              <button 
                onClick={() => setGoSolar(!goSolar)}
                className={`w-12 h-6 rounded-full transition-colors relative ${goSolar ? 'bg-yellow-500' : 'bg-gray-600'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${goSolar ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
