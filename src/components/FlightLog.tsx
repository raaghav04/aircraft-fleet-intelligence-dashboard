import { Flight } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIRCRAFT_LIST } from '../mockData';
import { AlertTriangle } from 'lucide-react';

interface Props {
  flights: Flight[];
  useMetric?: boolean;
  fuelWideThreshold?: number;
  fuelNarrowThreshold?: number;
}

export function FlightLog({ 
  flights, 
  useMetric = true, 
  fuelWideThreshold = 8000, 
  fuelNarrowThreshold = 3000 
}: Props) {
  return (
    <div className="overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Recent Flight Logs</h3>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="min-w-[600px] sm:min-w-0">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="w-[80px] sm:w-[100px] font-mono text-[9px] uppercase tracking-widest text-slate-400">ID</TableHead>
                <TableHead className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Date</TableHead>
                <TableHead className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Route</TableHead>
                <TableHead className="hidden md:table-cell font-mono text-[9px] uppercase tracking-widest text-slate-400">Aircraft</TableHead>
                <TableHead className="text-right font-mono text-[9px] uppercase tracking-widest text-slate-400">Hours</TableHead>
                <TableHead className="hidden sm:table-cell text-right font-mono text-[9px] uppercase tracking-widest text-slate-400">Fuel ({useMetric ? 'kg' : 'lbs'})</TableHead>
                <TableHead className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => {
                // Find aircraft to check if it exceeds threshold (wide elements vs narrow elements)
                const aircraft = AIRCRAFT_LIST.find(a => a.id === flight.aircraftId);
                const isWide = aircraft ? aircraft.bodyType === 'Wide Body' : true;
                const activeThreshold = isWide ? fuelWideThreshold : fuelNarrowThreshold;
                const burnRate = flight.flightHours > 0 ? (flight.fuelBurned / flight.flightHours) : 0;
                const isOverThreshold = burnRate > activeThreshold;

                return (
                  <TableRow key={flight.id} className="border-slate-100 hover:bg-slate-50 transition-colors group">
                    <TableCell className="font-mono text-[10px] sm:text-[11px] font-bold text-blue-600">{flight.id}</TableCell>
                    <TableCell className="text-[10px] sm:text-[11px] text-slate-500 font-mono">{flight.date}</TableCell>
                    <TableCell className="text-[10px] sm:text-[11px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {flight.origin} <span className="text-slate-200 font-normal mx-0.5 sm:mx-1">→</span> {flight.destination}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-[11px] font-mono text-slate-500">{flight.aircraftId}</TableCell>
                    <TableCell className="text-right text-[10px] sm:text-[11px] font-mono text-slate-900">{flight.flightHours}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right text-[11px] font-mono">
                      <div className="flex items-center justify-end gap-1.5 font-mono">
                        {isOverThreshold && (
                          <AlertTriangle 
                            size={12} 
                            className="text-amber-500 animate-pulse shrink-0 cursor-help" 
                            title={`Inefficient Sector: ${Math.round(burnRate).toLocaleString()} kg/hr exceeding threshold (${activeThreshold} kg/hr)`} 
                          />
                        )}
                        <span className={isOverThreshold ? "text-amber-700 font-bold" : "text-slate-900"}>
                          {Math.round(useMetric ? flight.fuelBurned : flight.fuelBurned * 2.20462).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`text-[8px] sm:text-[9px] px-2 py-0 h-4 sm:h-5 font-bold uppercase tracking-wider border-none ${
                          flight.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          flight.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        {flight.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
