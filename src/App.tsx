/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { generateMockFlights, AIRCRAFT_LIST } from './mockData';
import { PerformanceCharts } from './components/PerformanceCharts';
import { FlightLog } from './components/FlightLog';
import { AIInsights } from './components/AIInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, Fuel, Activity, LayoutDashboard, History, Settings, Info, Sun, Moon, Navigation, Menu, X, Filter, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [flights, setFlights] = useState(() => generateMockFlights(300));
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAirline, setSelectedAirline] = useState<string>('All Airlines');
  const [selectedBodyType, setSelectedBodyType] = useState<string>('All Types');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Settings State variables
  const [useMetric, setUseMetric] = useState<boolean>(true);
  const [maintenanceThreshold, setMaintenanceThreshold] = useState<number>(25000);
  const [fuelWideThreshold, setFuelWideThreshold] = useState<number>(8000);
  const [fuelNarrowThreshold, setFuelNarrowThreshold] = useState<number>(3000);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Manual Flight form state
  const [manualAirline, setManualAirline] = useState<string>('Singapore Airlines');
  const [manualAircraftId, setManualAircraftId] = useState<string>('SQ-A350-1');
  const [manualFlightId, setManualFlightId] = useState<string>('SQ991');
  const [manualOrigin, setManualOrigin] = useState<string>('SIN');
  const [manualDestination, setManualDestination] = useState<string>('JFK');
  const [manualHours, setManualHours] = useState<number>(14.5);
  const [manualFuel, setManualFuel] = useState<number>(84000);
  const [manualPayload, setManualPayload] = useState<number>(32000);

  // Trigger auto-dismiss toast
  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => {
        setNotificationToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // Adjust manual aircraft id when manual airline changes
  useEffect(() => {
    const matchingAirplanes = AIRCRAFT_LIST.filter(a => a.airline === manualAirline);
    if (matchingAirplanes.length > 0) {
      setManualAircraftId(matchingAirplanes[0].id);
      const prefix = manualAirline === 'Singapore Airlines' ? 'SQ' :
                     manualAirline === 'Lufthansa' ? 'LH' :
                     manualAirline === 'Cathay Pacific' ? 'CX' : 'BA';
      setManualFlightId(`${prefix}${Math.floor(100 + Math.random() * 899)}`);
    }
  }, [manualAirline]);
  
  // Close sidebar when clicking a link on mobile
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Prevent scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [sidebarOpen]);

  const filteredFlights = useMemo(() => {
    return flights.filter(f => {
      const airlineMatch = selectedAirline === 'All Airlines' || f.airline === selectedAirline;
      const aircraft = AIRCRAFT_LIST.find(a => a.id === f.aircraftId);
      const bodyTypeMatch = selectedBodyType === 'All Types' || aircraft?.bodyType === selectedBodyType;
      return airlineMatch && bodyTypeMatch;
    });
  }, [flights, selectedAirline, selectedBodyType]);

  const filteredAircraft = useMemo(() => {
    return AIRCRAFT_LIST.filter(a => {
      const airlineMatch = selectedAirline === 'All Airlines' || a.airline === selectedAirline;
      const bodyTypeMatch = selectedBodyType === 'All Types' || a.bodyType === selectedBodyType;
      return airlineMatch && bodyTypeMatch;
    });
  }, [selectedAirline, selectedBodyType]);

  const stats = useMemo(() => {
    const totalHours = filteredFlights.reduce((acc, f) => acc + f.flightHours, 0);
    const totalFuelKg = filteredFlights.reduce((acc, f) => acc + f.fuelBurned, 0);
    const convertedFuel = useMetric ? totalFuelKg : totalFuelKg * 2.20462;
    const avgEfficiency = totalHours > 0 ? convertedFuel / totalHours : 0;
    
    return {
      totalHours: Math.round(totalHours),
      totalFuel: Math.round(convertedFuel),
      avgEfficiency: Math.round(avgEfficiency),
      activeAircraft: filteredAircraft.filter(a => a.status === 'active').length,
      totalFleet: filteredAircraft.length
    };
  }, [filteredFlights, filteredAircraft, useMetric]);

  const airlines = useMemo(() => ['All Airlines', 'Singapore Airlines', 'Lufthansa', 'Cathay Pacific', 'British Airways'], []);
  const bodyTypes = useMemo(() => ['All Types', 'Wide Body', 'Narrow Body'], []);

  // Pre-calculate counts for filters to avoid filtering logic inside the render loops
  const airlineCounts = useMemo(() => {
    return airlines.reduce((acc, airline) => {
      acc[airline] = AIRCRAFT_LIST.filter(a => airline === 'All Airlines' || a.airline === airline).length;
      return acc;
    }, {} as Record<string, number>);
  }, [airlines]);

  const bodyTypeCounts = useMemo(() => {
    return bodyTypes.reduce((acc, type) => {
      acc[type] = AIRCRAFT_LIST.filter(a => 
        (selectedAirline === 'All Airlines' || a.airline === selectedAirline) && 
        (type === 'All Types' || a.bodyType === type)
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [bodyTypes, selectedAirline]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'fleet', label: 'Fleet Status', icon: Plane },
    { id: 'logs', label: 'Flight Logs', icon: History },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar / Navigation Rail */}
      <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 flex flex-col py-8 z-[60] border-r border-slate-800 shadow-2xl transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Plane size={24} />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-white font-display font-bold text-lg leading-tight truncate tracking-tight">GlobalFleet</h2>
              <p className="text-blue-400 font-mono text-[9px] uppercase tracking-[0.2em] font-bold opacity-80">Command Center</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                activeTab === item.id 
                  ? 'bg-white/10 text-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-blue-400' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-medium text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop-only Filters in Sidebar */}
        <div className="hidden lg:block px-4 space-y-4 mt-8">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Carrier</p>
            <div className="relative">
              <select 
                value={selectedAirline}
                onChange={(e) => setSelectedAirline(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
              >
                {airlines.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Aircraft Type</p>
            <div className="relative">
              <select 
                value={selectedBodyType}
                onChange={(e) => setSelectedBodyType(e.target.value)}
                className="w-full bg-slate-800 text-white text-xs p-2 rounded-lg border border-white/10 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
              >
                {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto px-4 pb-8">
          <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-600/20">
            <p className="text-[10px] text-blue-400 uppercase font-bold mb-1 tracking-widest">Fleet Version</p>
            <p className="text-white font-mono text-xs font-bold">V 2.4.0 <span className="text-[9px] opacity-50 ml-1">STABLE</span></p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:pl-64 transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm sm:text-base md:text-lg font-display font-bold tracking-tight text-slate-900 truncate max-w-[280px] sm:max-w-none">
              Fleet Analysis <span className="text-slate-400 font-normal mx-1 hidden sm:inline">/</span> 
              <span className="text-blue-600 block sm:inline truncate">{selectedAirline}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all border shrink-0 flex items-center gap-2 relative ${
                filtersOpen 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400'
              }`}
            >
              <Filter size={18} />
              {(selectedAirline !== 'All Airlines' || selectedBodyType !== 'All Types') && !filtersOpen && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-bold text-emerald-600">Operational</p>
              </div>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-lg shrink-0">
              GF
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
          {/* Collapsible Filters (Mobile/Tablet only) */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="lg:hidden overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Carriers</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {airlines.map((airline) => (
                        <button
                          key={airline}
                          onClick={() => setSelectedAirline(airline)}
                          className={`px-4 py-2 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-2 ${
                            selectedAirline === airline
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-blue-400'
                          }`}
                        >
                          {airline === 'All Airlines' ? 'All' : airline}
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                            selectedAirline === airline ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-400'
                          }`}>
                            {airlineCounts[airline]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Aircraft Configuration</p>
                    <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 w-fit">
                      {bodyTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedBodyType(type)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                            selectedBodyType === type
                              ? 'bg-white text-blue-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {type === 'All Types' ? 'All' : type.split(' ')[0]}
                          <span className="opacity-50 text-[8px]">{bodyTypeCounts[type]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="overflow-x-auto pb-1 -mb-1 scrollbar-hide">
                <TabsList className="bg-slate-100 p-1 border border-slate-200 whitespace-nowrap inline-flex">
                  <TabsTrigger value="overview" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="fleet" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">Fleet Status</TabsTrigger>
                  <TabsTrigger value="logs" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">Flight Logs</TabsTrigger>
                  <TabsTrigger value="performance" className="px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">Performance</TabsTrigger>
                </TabsList>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-widest text-right">
                Real-time Feed: {new Date().toLocaleTimeString()}
              </div>
            </div>

            <TabsContent value="overview" className="space-y-6 sm:space-y-8 outline-none">
              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: 'Flight Hours', value: stats.totalHours.toLocaleString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Fuel Consumed', value: `${stats.totalFuel.toLocaleString()} ${useMetric ? 'kg' : 'lbs'}`, icon: Fuel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Efficiency', value: `${stats.avgEfficiency.toLocaleString()} ${useMetric ? 'kg/hr' : 'lbs/hr'}`, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Active Fleet', value: `${stats.activeAircraft} / ${stats.totalFleet}`, icon: Plane, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all">
                      <CardContent className="p-5 sm:p-6 flex items-center gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shadow-sm shrink-0`}>
                          <stat.icon size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight">{stat.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                  <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm overflow-hidden">
                    <PerformanceCharts flights={filteredFlights} useMetric={useMetric} />
                  </div>
                  <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm overflow-hidden">
                    <FlightLog 
                      flights={filteredFlights.slice(0, 10)} 
                      useMetric={useMetric}
                      fuelWideThreshold={fuelWideThreshold}
                      fuelNarrowThreshold={fuelNarrowThreshold}
                    />
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                  <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm overflow-hidden">
                    <AIInsights 
                      flights={filteredFlights} 
                      selectedAirline={selectedAirline} 
                      selectedBodyType={selectedBodyType} 
                    />
                  </div>
                  <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                    <CardHeader className="p-5 sm:p-6 pb-2">
                      <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Maintenance & Threshold Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-4 max-h-[350px] overflow-y-auto scrollbar-none">
                      {(() => {
                        const alertFleet = filteredAircraft.filter(a => {
                          const progress = (a.totalHours / maintenanceThreshold) * 100;
                          return progress >= 90 || a.status === 'maintenance';
                        });

                        if (alertFleet.length === 0) {
                          return (
                            <div className="text-center py-6">
                              <p className="text-xs text-slate-400">All aircraft operating within safe utilization thresholds.</p>
                            </div>
                          );
                        }

                        return alertFleet.map(aircraft => {
                          const progress = Math.min(100, Math.round((aircraft.totalHours / maintenanceThreshold) * 100));
                          return (
                            <div key={aircraft.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                              <div className="min-w-0 flex-1 pr-2">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                  {aircraft.registration}
                                  <span className="text-[8px] text-slate-400 font-mono ml-2">[{aircraft.airline}]</span>
                                </p>
                                <p className="text-[9px] text-slate-500 uppercase font-mono mt-0.5 truncate">
                                  {aircraft.model}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                  <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                    <div className={`h-full ${progress >= 100 ? "bg-red-500 animate-pulse" : "bg-orange-500"}`} style={{ width: `${progress}%` }} />
                                  </div>
                                  <span className="text-[8px] font-bold text-slate-500 font-mono">{progress}% Limit</span>
                                </div>
                              </div>
                              <Badge 
                                variant="outline"
                                className={`text-[8px] uppercase font-mono border-none shrink-0 ${
                                  progress >= 100 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                }`}
                              >
                                {progress >= 100 ? 'overdue' : 'inspection'}
                              </Badge>
                            </div>
                          );
                        });
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fleet" className="outline-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAircraft.map((aircraft, i) => (
                  <motion.div
                    key={aircraft.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-white border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group rounded-3xl">
                      <div className={`h-1 w-full ${aircraft.status === 'active' ? 'bg-emerald-500' : aircraft.status === 'maintenance' ? 'bg-orange-500' : 'bg-red-500'}`} />
                      <CardHeader className="pb-2 p-5 sm:p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <CardTitle className="text-base sm:text-lg font-display font-bold text-slate-900">{aircraft.registration}</CardTitle>
                            <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider truncate">{aircraft.airline} • {aircraft.model}</p>
                          </div>
                          <Badge className={`uppercase text-[8px] font-mono border-none shrink-0 ${
                            aircraft.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {aircraft.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 sm:p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Total Hours</p>
                            <p className="text-xs sm:text-sm font-mono font-bold text-slate-900">{aircraft.totalHours.toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Total Cycles</p>
                            <p className="text-xs sm:text-sm font-mono font-bold text-slate-900">{aircraft.totalCycles.toLocaleString()}</p>
                          </div>
                        </div>
                        {(() => {
                          const progress = Math.min(100, Math.round((aircraft.totalHours / maintenanceThreshold) * 100));
                          const needsCheck = progress >= 90;
                          return (
                            <div className="space-y-2">
                              <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest">
                                <span className="text-slate-400">Maintenance Progress</span>
                                <span className={needsCheck ? "text-red-500 font-bold" : "text-blue-600 font-bold"}>
                                  {progress}% {progress >= 100 ? "(REQD)" : ""}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    progress >= 100 
                                      ? "bg-red-600 animate-pulse" 
                                      : progress >= 90 
                                        ? "bg-orange-500" 
                                        : "bg-blue-500"
                                  }`} 
                                  style={{ width: `${progress}%` }} 
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="outline-none">
              <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm overflow-hidden">
                <FlightLog 
                  flights={filteredFlights} 
                  useMetric={useMetric}
                  fuelWideThreshold={fuelWideThreshold}
                  fuelNarrowThreshold={fuelNarrowThreshold}
                />
              </div>
            </TabsContent>

            <TabsContent value="performance" className="outline-none">
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-1 border border-slate-200 shadow-sm overflow-hidden">
                  <PerformanceCharts flights={filteredFlights} useMetric={useMetric} />
                </div>
                <Card className="bg-white border-slate-200 shadow-sm rounded-3xl">
                  <CardHeader className="p-6">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Efficiency Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <p className="text-sm text-slate-500 leading-relaxed">Detailed performance metrics and historical trends are being processed for the selected fleet. System is analyzing fuel burn variance across regional and long-haul sectors.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="outline-none space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 animate-fade-in">
                {/* Global Operational Settings */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-5 sm:p-6 pb-2 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <Settings className="text-blue-500" size={18} />
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Operational Configurations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-6">
                      
                      {/* Measurement System setting */}
                      <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Measurement Units</label>
                            <p className="text-[10px] text-slate-400 mt-0.5">Global label for weights and efficiency factors.</p>
                          </div>
                          <div className="flex bg-slate-100 rounded-full p-0.5 border border-slate-200 w-fit">
                            <button
                              type="button"
                              onClick={() => {
                                setUseMetric(true);
                                setNotificationToast("Measurement standard adjusted to Metric System (kilograms).");
                              }}
                              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${useMetric ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                            >
                              Metric (kg)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUseMetric(false);
                                setNotificationToast("Measurement standard adjusted to Imperial System (pounds).");
                              }}
                              className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${!useMetric ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
                            >
                              Imperial (lbs)
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scheduled Maintenance Threshold */}
                      <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">C-Check Target Threshold</label>
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{maintenanceThreshold.toLocaleString()} hrs</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Modify maximum safe hours limit. Fleet units exceeding 90% of this figure will request inspect alerts.</p>
                        <input
                          type="range"
                          min="15000"
                          max="35000"
                          step="1000"
                          value={maintenanceThreshold}
                          onChange={(e) => {
                            setMaintenanceThreshold(Number(e.target.value));
                          }}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 border border-slate-200"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                          <span>15,000 hrs</span>
                          <span>25,000 hrs</span>
                          <span>35,000 hrs</span>
                        </div>
                      </div>

                      {/* Wide-body Fuel Limit */}
                      <div className="space-y-3 pb-4 border-b border-slate-100">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Wide-Body Fuel Limit</label>
                          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                            {useMetric ? `${fuelWideThreshold} kg/hr` : `${Math.round(fuelWideThreshold * 2.20462)} lbs/hr`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Highlights flight logs exceeding hourly average fuel burn parameters.</p>
                        <input
                          type="range"
                          min="5000"
                          max="15000"
                          step="500"
                          value={fuelWideThreshold}
                          onChange={(e) => setFuelWideThreshold(Number(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-200"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                          <span>5,000</span>
                          <span>10,000</span>
                          <span>15,000</span>
                        </div>
                      </div>

                      {/* Narrow-body Fuel Limit */}
                      <div className="space-y-3 pb-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Narrow-Body Fuel Limit</label>
                          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                            {useMetric ? `${fuelNarrowThreshold} kg/hr` : `${Math.round(fuelNarrowThreshold * 2.20462)} lbs/hr`}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Stipulates trigger flag for narrow-body routes exceeding ideal burn parameters.</p>
                        <input
                          type="range"
                          min="1500"
                          max="5000"
                          step="100"
                          value={fuelNarrowThreshold}
                          onChange={(e) => setFuelNarrowThreshold(Number(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-200"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-slate-400">
                          <span>1,500</span>
                          <span>3,200</span>
                          <span>5,000</span>
                        </div>
                      </div>

                    </CardContent>
                  </Card>

                  {/* Seed and Simulation actions */}
                  <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-5 border-b border-slate-50">
                      <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Telemetry Log Database</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3">
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Re-seed logs or inject anomalies to immediately verify threshold notifications and fuel charts.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const anomalousFlights = [
                              {
                                id: 'SQ982',
                                date: new Date().toISOString().split('T')[0],
                                airline: 'Singapore Airlines',
                                aircraftId: 'SQ-A380-1',
                                origin: 'SIN',
                                destination: 'LHR',
                                departureTime: '08:15',
                                arrivalTime: '21:00',
                                flightHours: 12.5,
                                cycles: 1,
                                fuelBurned: 165000,
                                payload: 42000,
                                status: 'completed' as const
                              },
                              {
                                id: 'LH450',
                                date: new Date().toISOString().split('T')[0],
                                airline: 'Lufthansa',
                                aircraftId: 'LH-A320-1',
                                origin: 'FRA',
                                destination: 'MUC',
                                departureTime: '09:00',
                                arrivalTime: '10:15',
                                flightHours: 1.25,
                                fuelBurned: 14500,
                                cycles: 1,
                                payload: 16500,
                                status: 'completed' as const
                              },
                              {
                                id: 'BA223',
                                date: new Date().toISOString().split('T')[0],
                                airline: 'British Airways',
                                aircraftId: 'BA-A350-1',
                                origin: 'LHR',
                                destination: 'JFK',
                                departureTime: '11:30',
                                arrivalTime: '19:15',
                                flightHours: 7.75,
                                fuelBurned: 89000,
                                cycles: 1,
                                payload: 31000,
                                status: 'completed' as const
                              }
                            ];
                            setFlights(prev => [...anomalousFlights, ...prev]);
                            setNotificationToast("Injected 3 fuel burn anomalies into databases successfully!");
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[9px] font-bold uppercase tracking-wider rounded-2xl transition-all shadow-sm active:scale-95"
                        >
                          <Activity size={12} />
                          Inject Bad Data
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFlights(generateMockFlights(300));
                            setNotificationToast("Database successfully re-seeded with 300 logs.");
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-bold uppercase tracking-wider rounded-2xl transition-all shadow-sm active:scale-95"
                        >
                          <Clock size={12} />
                          Reset Dispatch
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Interactive manual dispatch tool */}
                <div className="lg:col-span-7">
                  <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="p-5 sm:p-6 pb-2 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <Plane className="text-blue-500" size={18} />
                        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Manual Flight Dispatcher</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6">
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-6">Dispatch a custom flight sector log manually. Dynamic data immediately propagates back to recent logs, average metrics, maps, and efficiency indicators.</p>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const aircraft = AIRCRAFT_LIST.find(a => a.id === manualAircraftId);
                        if (!aircraft) return;

                        const newFlight = {
                          id: manualFlightId,
                          date: new Date().toISOString().split('T')[0],
                          airline: manualAirline,
                          aircraftId: manualAircraftId,
                          origin: manualOrigin.toUpperCase(),
                          destination: manualDestination.toUpperCase(),
                          departureTime: '12:00',
                          arrivalTime: '14:30',
                          flightHours: Number(manualHours),
                          cycles: 1,
                          fuelBurned: Number(manualFuel),
                          payload: Number(manualPayload),
                          status: 'scheduled' as const
                        };

                        setFlights(prev => [newFlight, ...prev]);
                        setNotificationToast(`Flight ${manualFlightId} dispatched to queue successfully!`);
                        
                        const prefix = manualAirline === 'Singapore Airlines' ? 'SQ' :
                                       manualAirline === 'Lufthansa' ? 'LH' :
                                       manualAirline === 'Cathay Pacific' ? 'CX' : 'BA';
                        setManualFlightId(`${prefix}${Math.floor(100 + Math.random() * 899)}`);
                      }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 font-sans">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Carrier / Airline</label>
                            <select
                              value={manualAirline}
                              onChange={(e) => setManualAirline(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-medium text-slate-800"
                            >
                              <option value="Singapore Airlines">Singapore Airlines</option>
                              <option value="Lufthansa">Lufthansa</option>
                              <option value="Cathay Pacific">Cathay Pacific</option>
                              <option value="British Airways">British Airways</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Aircraft Tail Registration</label>
                            <select
                              value={manualAircraftId}
                              onChange={(e) => setManualAircraftId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono font-medium text-slate-800"
                            >
                              {AIRCRAFT_LIST.filter(a => a.airline === manualAirline).map(a => (
                                <option key={a.id} value={a.id}>{a.registration} ({a.model})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400 font-mono">Flight No.</label>
                            <input
                              type="text"
                              value={manualFlightId}
                              onChange={(e) => setManualFlightId(e.target.value.toUpperCase())}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Origin IATA</label>
                            <input
                              type="text"
                              value={manualOrigin}
                              maxLength={3}
                              onChange={(e) => setManualOrigin(e.target.value.toUpperCase())}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono uppercase"
                              placeholder="SIN"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Dest IATA</label>
                            <input
                              type="text"
                              value={manualDestination}
                              maxLength={3}
                              onChange={(e) => setManualDestination(e.target.value.toUpperCase())}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono uppercase"
                              placeholder="JFK"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Hours</label>
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              max="18"
                              value={manualHours}
                              onChange={(e) => {
                                const hrs = Number(e.target.value);
                                setManualHours(hrs);
                                const aircraftInstance = AIRCRAFT_LIST.find(a => a.id === manualAircraftId);
                                if (aircraftInstance) {
                                  setManualFuel(Math.round(hrs * aircraftInstance.fuelEfficiency));
                                }
                              }}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Fuel Consumed</label>
                            <input
                              type="number"
                              min="100"
                              max="300000"
                              value={manualFuel}
                              onChange={(e) => setManualFuel(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-slate-400">Cargo Payload (kg)</label>
                            <input
                              type="number"
                              min="500"
                              max="150000"
                              value={manualPayload}
                              onChange={(e) => setManualPayload(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-2xl outline-none focus:border-blue-500 transition-colors font-mono"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
                        >
                          <Plane size={14} />
                          Dispatch Sector Flight Log
                        </button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Toast Notification overlay */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 bg-slate-900 border border-slate-850 text-white px-5 py-4 rounded-3xl shadow-2xl z-[999] flex items-center gap-3 max-w-sm"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping shrink-0" />
            <p className="text-xs font-medium tracking-wide leading-relaxed font-sans">{notificationToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
