export interface Flight {
  id: string;
  date: string;
  airline: string;
  aircraftId: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  flightHours: number;
  cycles: number;
  fuelBurned: number; // in kg or lbs
  payload: number; // in kg
  status: 'completed' | 'scheduled' | 'delayed';
}

export interface Aircraft {
  id: string;
  airline: string;
  model: string;
  bodyType: 'Wide Body' | 'Narrow Body';
  registration: string;
  totalHours: number;
  totalCycles: number;
  nextMaintenance: string;
  status: 'active' | 'maintenance' | 'grounded';
  fuelEfficiency: number; // average fuel/hour
}

export interface UtilizationMetric {
  date: string;
  hours: number;
  efficiency: number;
}

export interface LiveFlight {
  icao24: string;
  callsign: string;
  origin_country: string;
  longitude: number;
  latitude: number;
  altitude: number;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  last_update: number;
}

export interface FlightAlert {
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  aircraft: string;
  message: string;
  timestamp: number;
}
