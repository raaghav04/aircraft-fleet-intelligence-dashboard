import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  AreaChart, Area 
} from 'recharts';
import { Flight } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  flights: Flight[];
  useMetric?: boolean;
}

function ResponsiveChartContainer({ children }: { children: (width: number, height: number) => React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '250px' }}>
      {dimensions.width > 0 && dimensions.height > 0 ? (
        children(dimensions.width, dimensions.height)
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-400">
          Measuring container...
        </div>
      )}
    </div>
  );
}

export function PerformanceCharts({ flights, useMetric = true }: Props) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Aggregate data by date
  const dailyData = React.useMemo(() => {
    return flights.reduce((acc: any[], flight) => {
      const existing = acc.find(d => d.date === flight.date);
      if (existing) {
        existing.hours += flight.flightHours;
        existing.fuel += flight.fuelBurned;
        existing.count += 1;
      } else {
        acc.push({ date: flight.date, hours: flight.flightHours, fuel: flight.fuelBurned, count: 1 });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-14);
  }, [flights]);

  const efficiencyData = dailyData.map(d => {
    const fuelVal = useMetric ? d.fuel : d.fuel * 2.20462;
    return {
      ...d,
      efficiency: Number((fuelVal / d.hours).toFixed(1))
    };
  });

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4">
        <div className="h-[280px] sm:h-[320px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl text-xs font-mono text-slate-400">
          Preparing Utilization Analytics...
        </div>
        <div className="h-[280px] sm:h-[320px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl text-xs font-mono text-slate-400">
          Preparing Efficiency Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-4">
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden border">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Utilization (Flight Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] sm:h-[320px] w-full relative overflow-hidden px-2 sm:px-4">
          <ResponsiveChartContainer>
            {(width, height) => (
              <BarChart width={width} height={height} data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'JetBrains Mono' }} 
                  tickFormatter={(str) => {
                    try {
                      const date = new Date(str);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    } catch {
                      return str;
                    }
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'JetBrains Mono' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px', 
                    fontSize: '10px', 
                    fontFamily: 'JetBrains Mono', 
                    color: '#0F172A',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            )}
          </ResponsiveChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden border">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Fuel Efficiency ({useMetric ? 'kg/hr' : 'lbs/hr'})
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[280px] sm:h-[320px] w-full relative overflow-hidden px-2 sm:px-4">
          <ResponsiveChartContainer>
            {(width, height) => (
              <AreaChart width={width} height={height} data={efficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'JetBrains Mono' }} 
                  tickFormatter={(str) => {
                    try {
                      const date = new Date(str);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    } catch {
                      return str;
                    }
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748B', fontFamily: 'JetBrains Mono' }} 
                  domain={['auto', 'auto']} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px', 
                    fontSize: '10px', 
                    fontFamily: 'JetBrains Mono', 
                    color: '#0F172A',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#F97316" 
                  strokeWidth={3} 
                  fill="url(#areaGradient)"
                  dot={{ r: 3, fill: '#F97316', strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            )}
          </ResponsiveChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
