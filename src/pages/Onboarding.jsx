import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { STATES, DEFAULT_APPLIANCES } from '../utils/constants';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  // Step 1 State
  const [stateName, setStateName] = useState(STATES[0]);
  const [rooms, setRooms] = useState(2);
  const [occupants, setOccupants] = useState(3);
  const [houseType, setHouseType] = useState('Apartment');

  // Step 2 State
  const [appliances, setAppliances] = useState([]);
  
  // Step 3 State
  const [peakTime, setPeakTime] = useState('Evening');
  const [wfh, setWfh] = useState('No');
  const [solar, setSolar] = useState('No');

  const handleToggleAppliance = (app) => {
    const exists = appliances.find(a => a.id === app.id);
    if (exists) {
      setAppliances(appliances.filter(a => a.id !== app.id));
    } else {
      setAppliances([...appliances, { ...app, hours: 2, starRating: app.hasStarRating ? 3 : null }]);
    }
  };

  const updateApplianceHours = (id, hours) => {
    setAppliances(appliances.map(a => a.id === id ? { ...a, hours: parseFloat(hours) } : a));
  };

  const updateStarRating = (id, stars) => {
    setAppliances(appliances.map(a => a.id === id ? { ...a, starRating: parseInt(stars) } : a));
  };

  const finishOnboarding = () => {
    const profile = {
      state: stateName,
      rooms,
      occupants,
      houseType,
      appliances,
      peakTime,
      wfh,
      solar,
      joinDate: new Date().toISOString()
    };
    saveProfile(profile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden z-10">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="glass-card rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl relative z-10 animate-fade-in-up">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-200 mb-3 drop-shadow-sm">Welcome to EcoSense</h1>
          <p className="text-gray-400 font-medium tracking-wide">Let's personalize your energy saving journey.</p>
        </div>

        <div className="flex gap-3 mb-10">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-gradient-to-r from-accent to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-xl font-semibold mb-4 text-white">Household Basics</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Indian State</label>
              <select 
                value={stateName} 
                onChange={e => setStateName(e.target.value)}
                className="w-full bg-navy border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-accent"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Rooms ({rooms})</label>
                <input type="range" min="1" max="10" value={rooms} onChange={e => setRooms(parseInt(e.target.value))} className="w-full accent-accent" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Occupants ({occupants})</label>
                <input type="range" min="1" max="10" value={occupants} onChange={e => setOccupants(parseInt(e.target.value))} className="w-full accent-accent" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">House Type</label>
              <div className="flex gap-4">
                {['Apartment', 'Independent House', 'Villa'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setHouseType(t)}
                    className={`flex-1 py-3 px-2 rounded-xl border text-sm transition-colors ${houseType === t ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up max-h-[60vh] overflow-y-auto pr-3 hide-scrollbar">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Appliance Inventory</h2>
            <div className="space-y-4">
              {DEFAULT_APPLIANCES.map(app => {
                const isSelected = appliances.some(a => a.id === app.id);
                const currentApp = appliances.find(a => a.id === app.id);
                return (
                  <div key={app.id} className={`p-5 rounded-2xl border transition-all duration-300 ${isSelected ? 'border-accent/50 bg-accent/10 shadow-[0_4px_20px_rgba(16,185,129,0.15)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => handleToggleAppliance(app)}>
                      <span className={`font-semibold ${isSelected ? 'text-accent' : 'text-gray-200'}`}>{app.name}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-accent bg-accent drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'border-gray-500'}`}>
                        {isSelected && <div className="w-2 h-2 bg-navy rounded-full" />}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-4 space-y-4 pl-2 border-l-2 border-gray-700">
                        <div>
                          <label className="text-xs text-gray-400">Daily Usage: {currentApp.hours} hrs</label>
                          <input type="range" min="0" max="16" step="0.5" value={currentApp.hours} onChange={e => updateApplianceHours(app.id, e.target.value)} className="w-full accent-accent mt-2" />
                        </div>
                        {currentApp.hasStarRating && (
                          <div>
                            <label className="text-xs text-gray-400">Star Rating: {currentApp.starRating} Stars</label>
                            <input type="range" min="1" max="5" step="1" value={currentApp.starRating} onChange={e => updateStarRating(app.id, e.target.value)} className="w-full accent-accent mt-2" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Usage Habits</h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Peak Usage Time</label>
              <div className="grid grid-cols-2 gap-4">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setPeakTime(t)}
                    className={`py-3 rounded-xl border text-sm transition-colors ${peakTime === t ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Work From Home</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} onClick={() => setWfh(v)} className={`flex-1 py-2 rounded-lg border ${wfh === v ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-400'}`}>{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Solar Installed</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(v => (
                    <button key={v} onClick={() => setSolar(v)} className={`flex-1 py-2 rounded-lg border ${solar === v ? 'border-accent bg-accent/10 text-accent' : 'border-gray-700 text-gray-400'}`}>{v}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-between pt-6 border-t border-white/10">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-semibold">Back</button>
          ) : <div />}
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : finishOnboarding()} 
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent to-emerald-400 text-navy font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5"
          >
            {step < 3 ? 'Continue' : 'Finish Setup'}
          </button>
        </div>
      </div>
    </div>
  );
}
