import { useState } from 'react';
import { getAiModel } from '../config/gemini';
import { Bot, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function AiAdvisor({ profile, calculations }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!profile || !calculations) return;
    
    setLoading(true);
    setError(null);
    try {
      const model = getAiModel();
      const prompt = `You are an expert home energy advisor. The user lives in ${profile.state || 'India'}, in a ${profile.houseType || 'home'} with ${profile.occupants || 2} occupants. 
      Their estimated monthly usage is ${calculations.monthlyKwh?.toFixed(1) || 0} kWh, costing approx ₹${calculations.monthlyBill?.toFixed(0) || 0}. 
      Their daily CO2 footprint is ${calculations.dailyCO2?.toFixed(1) || 0} kg. 
      They have the following appliances: ${profile.appliances?.map(a => a.name).join(', ') || 'basic appliances'}.
      
      Give 3 short, actionable, personalized bullet points to help them reduce their energy consumption. Format as simple text without markdown headers, just 3 bullet points starting with '• '. Keep it strictly under 100 words combined. Make it specific to their appliances.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setInsights(text.split('\n').filter(line => line.trim().length > 0));
    } catch (err) {
      console.error(err);
      setError("Unable to generate insights. Ensure your VITE_GEMINI_API_KEY is correctly configured in your .env file and restart the development server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl relative overflow-hidden mt-6 mb-6 stagger-4">
      {/* Background glow base */}
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative z-10 mb-2">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Bot className="text-purple-400 w-6 h-6" />
            AI Energy Advisor
          </h2>
          <p className="text-gray-400 text-sm mt-1">Get personalized, AI-driven insights to lower your bill and carbon footprint.</p>
        </div>
        
        <button 
          onClick={fetchInsights} 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-1 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 border border-white/10 shrink-0"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Ask AI
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-400 text-sm mt-4 relative z-10">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading && !error && (
        <div className="space-y-3 mt-6 animate-pulse relative z-10">
          <div className="h-4 bg-white/5 rounded w-3/4"></div>
          <div className="h-4 bg-white/5 rounded w-full"></div>
          <div className="h-4 bg-white/5 rounded w-5/6"></div>
        </div>
      )}

      {insights && !loading && !error && (
        <div className="mt-6 space-y-3 relative z-10">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-purple-400 mt-0.5 shrink-0 text-xl leading-none">•</span>
              <p className="text-gray-300 text-sm leading-relaxed">{insight.replace(/^•\s*/, '')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
