import { useState, useEffect } from 'react';
import { Flight } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  flights: Flight[];
  selectedAirline?: string;
  selectedBodyType?: string;
}

export function AIInsights({ flights, selectedAirline = "All Airlines", selectedBodyType = "All Types" }: Props) {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    // Prepare a summary for AI
    const summary = {
      totalFlights: flights.length,
      avgHours: flights.length > 0 ? flights.reduce((acc, f) => acc + f.flightHours, 0) / flights.length : 0,
      avgEfficiency: flights.length > 0 ? flights.reduce((acc, f) => acc + (f.fuelBurned / f.flightHours), 0) / flights.length : 0,
      recentTrends: flights.slice(0, 10).map(f => ({ date: f.date, efficiency: f.fuelBurned / f.flightHours }))
    };

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flightSummary: summary,
          carrier: selectedAirline,
          bodyType: selectedBodyType
        })
      });
      const data = await response.json();
      setInsights(data.insights || []);
    } catch (e) {
      console.error("Failed to query AI Insights:", e);
      setInsights([
        "Continuous descent profile execution is recommended across Western European routes to optimize sector fuel burn.",
        "System telemetry analysis is temporarily offline. Please refresh in a moment."
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [selectedAirline, selectedBodyType]);

  return (
    <Card className="bg-transparent border-none overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Sparkles className="text-blue-600" size={14} />
          AI Intelligence Feed
        </CardTitle>
        <button 
          onClick={generateInsights}
          disabled={loading}
          className="text-[9px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <Loader2 className="animate-spin text-blue-500/30" size={32} />
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest animate-pulse">Processing Telemetry...</p>
            </motion.div>
          ) : (
            <motion.ul 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {insights.map((insight, i) => (
                <motion.li 
                   key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors group"
                >
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
