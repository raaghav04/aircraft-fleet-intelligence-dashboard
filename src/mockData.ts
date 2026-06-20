import { Flight, Aircraft } from './types';
import { subDays, format, addHours } from 'date-fns';

export const AIRCRAFT_LIST: Aircraft[] = [
  // Singapore Airlines (9V-*)
  { id: 'SQ-A380-1', airline: 'Singapore Airlines', model: 'Airbus A380-800', bodyType: 'Wide Body', registration: '9V-SKU', totalHours: 25400, totalCycles: 4200, nextMaintenance: '2026-05-20', status: 'active', fuelEfficiency: 12000 },
  { id: 'SQ-A380-2', airline: 'Singapore Airlines', model: 'Airbus A380-800', bodyType: 'Wide Body', registration: '9V-SKV', totalHours: 24800, totalCycles: 4100, nextMaintenance: '2026-06-15', status: 'active', fuelEfficiency: 12000 },
  { id: 'SQ-A350-1', airline: 'Singapore Airlines', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: '9V-SGA', totalHours: 12200, totalCycles: 1800, nextMaintenance: '2026-04-25', status: 'active', fuelEfficiency: 5800 },
  { id: 'SQ-A350-2', airline: 'Singapore Airlines', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: '9V-SGB', totalHours: 11500, totalCycles: 1700, nextMaintenance: '2026-06-12', status: 'active', fuelEfficiency: 5800 },
  { id: 'SQ-A350-3', airline: 'Singapore Airlines', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: '9V-SMD', totalHours: 9800, totalCycles: 1450, nextMaintenance: '2026-07-20', status: 'active', fuelEfficiency: 5800 },
  { id: 'SQ-B777-1', airline: 'Singapore Airlines', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: '9V-SWB', totalHours: 21000, totalCycles: 3500, nextMaintenance: '2026-05-30', status: 'active', fuelEfficiency: 7200 },
  { id: 'SQ-B777-2', airline: 'Singapore Airlines', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: '9V-SWC', totalHours: 20500, totalCycles: 3400, nextMaintenance: '2026-08-10', status: 'active', fuelEfficiency: 7200 },
  { id: 'SQ-B787-1', airline: 'Singapore Airlines', model: 'Boeing 787-10', bodyType: 'Wide Body', registration: '9V-SCA', totalHours: 8400, totalCycles: 1400, nextMaintenance: '2026-07-05', status: 'active', fuelEfficiency: 5200 },
  { id: 'SQ-B787-2', airline: 'Singapore Airlines', model: 'Boeing 787-10', bodyType: 'Wide Body', registration: '9V-SCB', totalHours: 7900, totalCycles: 1300, nextMaintenance: '2026-09-12', status: 'active', fuelEfficiency: 5200 },
  { id: 'SQ-B737-1', airline: 'Singapore Airlines', model: 'Boeing 737-8 MAX', bodyType: 'Narrow Body', registration: '9V-MBA', totalHours: 4200, totalCycles: 1200, nextMaintenance: '2026-08-15', status: 'active', fuelEfficiency: 2400 },
  { id: 'SQ-B737-2', airline: 'Singapore Airlines', model: 'Boeing 737-8 MAX', bodyType: 'Narrow Body', registration: '9V-MBB', totalHours: 3800, totalCycles: 1100, nextMaintenance: '2026-09-20', status: 'active', fuelEfficiency: 2400 },
  { id: 'SQ-B737-3', airline: 'Singapore Airlines', model: 'Boeing 737-8 MAX', bodyType: 'Narrow Body', registration: '9V-MBC', totalHours: 3500, totalCycles: 1050, nextMaintenance: '2026-10-05', status: 'active', fuelEfficiency: 2400 },
  { id: 'SQ-A350-ULR', airline: 'Singapore Airlines', model: 'Airbus A350-900ULR', bodyType: 'Wide Body', registration: '9V-SGE', totalHours: 14500, totalCycles: 950, nextMaintenance: '2026-11-20', status: 'active', fuelEfficiency: 5900 },
  
  // Lufthansa (D-*)
  { id: 'LH-A380-1', airline: 'Lufthansa', model: 'Airbus A380-800', bodyType: 'Wide Body', registration: 'D-AIMK', totalHours: 28500, totalCycles: 4800, nextMaintenance: '2026-05-15', status: 'active', fuelEfficiency: 12200 },
  { id: 'LH-B747-1', airline: 'Lufthansa', model: 'Boeing 747-8i', bodyType: 'Wide Body', registration: 'D-ABYA', totalHours: 22100, totalCycles: 3800, nextMaintenance: '2026-05-10', status: 'active', fuelEfficiency: 10500 },
  { id: 'LH-B747-2', airline: 'Lufthansa', model: 'Boeing 747-8i', bodyType: 'Wide Body', registration: 'D-ABYB', totalHours: 21500, totalCycles: 3700, nextMaintenance: '2026-06-15', status: 'active', fuelEfficiency: 10500 },
  { id: 'LH-B747-3', airline: 'Lufthansa', model: 'Boeing 747-400', bodyType: 'Wide Body', registration: 'D-ABTK', totalHours: 32000, totalCycles: 5800, nextMaintenance: '2026-04-30', status: 'active', fuelEfficiency: 11500 },
  { id: 'LH-A350-1', airline: 'Lufthansa', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: 'D-AIXA', totalHours: 9200, totalCycles: 1500, nextMaintenance: '2026-07-20', status: 'active', fuelEfficiency: 5800 },
  { id: 'LH-A350-2', airline: 'Lufthansa', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: 'D-AIXB', totalHours: 8500, totalCycles: 1400, nextMaintenance: '2026-08-25', status: 'active', fuelEfficiency: 5800 },
  { id: 'LH-A340-1', airline: 'Lufthansa', model: 'Airbus A340-600', bodyType: 'Wide Body', registration: 'D-AIHA', totalHours: 28500, totalCycles: 4500, nextMaintenance: '2026-05-05', status: 'active', fuelEfficiency: 8200 },
  { id: 'LH-A340-2', airline: 'Lufthansa', model: 'Airbus A340-300', bodyType: 'Wide Body', registration: 'D-AIGL', totalHours: 31000, totalCycles: 5200, nextMaintenance: '2026-06-20', status: 'active', fuelEfficiency: 7800 },
  { id: 'LH-A330-1', airline: 'Lufthansa', model: 'Airbus A330-300', bodyType: 'Wide Body', registration: 'D-AIKA', totalHours: 19500, totalCycles: 3800, nextMaintenance: '2026-07-15', status: 'active', fuelEfficiency: 6500 },
  { id: 'LH-A321-1', airline: 'Lufthansa', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'D-AIEA', totalHours: 4500, totalCycles: 1800, nextMaintenance: '2026-09-10', status: 'active', fuelEfficiency: 2300 },
  { id: 'LH-A321-2', airline: 'Lufthansa', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'D-AIEB', totalHours: 4200, totalCycles: 1700, nextMaintenance: '2026-10-15', status: 'active', fuelEfficiency: 2300 },
  { id: 'LH-A320-1', airline: 'Lufthansa', model: 'Airbus A320neo', bodyType: 'Narrow Body', registration: 'D-AINA', totalHours: 5800, totalCycles: 2400, nextMaintenance: '2026-07-10', status: 'active', fuelEfficiency: 2200 },
  { id: 'LH-A320-2', airline: 'Lufthansa', model: 'Airbus A320neo', bodyType: 'Narrow Body', registration: 'D-AINB', totalHours: 5200, totalCycles: 2200, nextMaintenance: '2026-08-05', status: 'active', fuelEfficiency: 2200 },
  { id: 'LH-A320-3', airline: 'Lufthansa', model: 'Airbus A320neo', bodyType: 'Narrow Body', registration: 'D-AINC', totalHours: 4800, totalCycles: 2100, nextMaintenance: '2026-09-25', status: 'active', fuelEfficiency: 2200 },

  // Cathay Pacific (B-*)
  { id: 'CX-B777-1', airline: 'Cathay Pacific', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: 'B-KPY', totalHours: 19500, totalCycles: 3200, nextMaintenance: '2026-05-15', status: 'active', fuelEfficiency: 7100 },
  { id: 'CX-B777-2', airline: 'Cathay Pacific', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: 'B-KPZ', totalHours: 18200, totalCycles: 3000, nextMaintenance: '2026-06-25', status: 'active', fuelEfficiency: 7100 },
  { id: 'CX-B777-3', airline: 'Cathay Pacific', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: 'B-KQA', totalHours: 17500, totalCycles: 2900, nextMaintenance: '2026-08-05', status: 'active', fuelEfficiency: 7100 },
  { id: 'CX-A350-1', airline: 'Cathay Pacific', model: 'Airbus A350-1000', bodyType: 'Wide Body', registration: 'B-LXA', totalHours: 7800, totalCycles: 1200, nextMaintenance: '2026-08-10', status: 'active', fuelEfficiency: 6200 },
  { id: 'CX-A350-2', airline: 'Cathay Pacific', model: 'Airbus A350-1000', bodyType: 'Wide Body', registration: 'B-LXB', totalHours: 7200, totalCycles: 1100, nextMaintenance: '2026-09-15', status: 'active', fuelEfficiency: 6200 },
  { id: 'CX-A350-3', airline: 'Cathay Pacific', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: 'B-LRA', totalHours: 10500, totalCycles: 1600, nextMaintenance: '2026-07-05', status: 'active', fuelEfficiency: 5800 },
  { id: 'CX-A350-4', airline: 'Cathay Pacific', model: 'Airbus A350-900', bodyType: 'Wide Body', registration: 'B-LRB', totalHours: 9800, totalCycles: 1500, nextMaintenance: '2026-10-10', status: 'active', fuelEfficiency: 5800 },
  { id: 'CX-A330-1', airline: 'Cathay Pacific', model: 'Airbus A330-300', bodyType: 'Wide Body', registration: 'B-HLM', totalHours: 24500, totalCycles: 4800, nextMaintenance: '2026-05-20', status: 'active', fuelEfficiency: 6400 },
  { id: 'CX-A330-2', airline: 'Cathay Pacific', model: 'Airbus A330-300', bodyType: 'Wide Body', registration: 'B-HLN', totalHours: 23800, totalCycles: 4600, nextMaintenance: '2026-06-30', status: 'active', fuelEfficiency: 6400 },
  { id: 'CX-A321-1', airline: 'Cathay Pacific', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'B-HPA', totalHours: 3500, totalCycles: 1100, nextMaintenance: '2026-09-05', status: 'active', fuelEfficiency: 2300 },
  { id: 'CX-A321-2', airline: 'Cathay Pacific', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'B-HPB', totalHours: 3100, totalCycles: 1000, nextMaintenance: '2026-10-15', status: 'active', fuelEfficiency: 2300 },
  { id: 'CX-A321-3', airline: 'Cathay Pacific', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'B-HPC', totalHours: 2800, totalCycles: 950, nextMaintenance: '2026-11-20', status: 'active', fuelEfficiency: 2300 },

  // British Airways (G-*)
  { id: 'BA-A380-1', airline: 'British Airways', model: 'Airbus A380-800', bodyType: 'Wide Body', registration: 'G-XLEA', totalHours: 24200, totalCycles: 4000, nextMaintenance: '2026-05-25', status: 'active', fuelEfficiency: 12100 },
  { id: 'BA-A380-2', airline: 'British Airways', model: 'Airbus A380-800', bodyType: 'Wide Body', registration: 'G-XLEB', totalHours: 23500, totalCycles: 3900, nextMaintenance: '2026-07-10', status: 'active', fuelEfficiency: 12100 },
  { id: 'BA-B777-1', airline: 'British Airways', model: 'Boeing 777-300ER', bodyType: 'Wide Body', registration: 'G-STBA', totalHours: 15500, totalCycles: 2600, nextMaintenance: '2026-08-20', status: 'active', fuelEfficiency: 7300 },
  { id: 'BA-B777-2', airline: 'British Airways', model: 'Boeing 777-200ER', bodyType: 'Wide Body', registration: 'G-VIIA', totalHours: 28500, totalCycles: 4800, nextMaintenance: '2026-04-15', status: 'maintenance', fuelEfficiency: 6800 },
  { id: 'BA-B777-3', airline: 'British Airways', model: 'Boeing 777-200ER', bodyType: 'Wide Body', registration: 'G-VIIB', totalHours: 27800, totalCycles: 4700, nextMaintenance: '2026-06-05', status: 'active', fuelEfficiency: 6800 },
  { id: 'BA-B787-1', airline: 'British Airways', model: 'Boeing 787-9', bodyType: 'Wide Body', registration: 'G-ZBKA', totalHours: 14500, totalCycles: 2400, nextMaintenance: '2026-06-30', status: 'active', fuelEfficiency: 5100 },
  { id: 'BA-B787-2', airline: 'British Airways', model: 'Boeing 787-9', bodyType: 'Wide Body', registration: 'G-ZBKB', totalHours: 13800, totalCycles: 2300, nextMaintenance: '2026-09-15', status: 'active', fuelEfficiency: 5100 },
  { id: 'BA-B787-3', airline: 'British Airways', model: 'Boeing 787-10', bodyType: 'Wide Body', registration: 'G-ZBLA', totalHours: 8200, totalCycles: 1350, nextMaintenance: '2026-10-20', status: 'active', fuelEfficiency: 5200 },
  { id: 'BA-A350-1', airline: 'British Airways', model: 'Airbus A350-1000', bodyType: 'Wide Body', registration: 'G-XWBA', totalHours: 9500, totalCycles: 1550, nextMaintenance: '2026-07-25', status: 'active', fuelEfficiency: 6100 },
  { id: 'BA-A350-2', airline: 'British Airways', model: 'Airbus A350-1000', bodyType: 'Wide Body', registration: 'G-XWBB', totalHours: 8800, totalCycles: 1450, nextMaintenance: '2026-09-30', status: 'active', fuelEfficiency: 6100 },
  { id: 'BA-A321-1', airline: 'British Airways', model: 'Airbus A321neo', bodyType: 'Narrow Body', registration: 'G-NEOP', totalHours: 5200, totalCycles: 2200, nextMaintenance: '2026-08-15', status: 'active', fuelEfficiency: 2300 },
  { id: 'BA-A320-1', airline: 'British Airways', model: 'Airbus A320neo', bodyType: 'Narrow Body', registration: 'G-TTNA', totalHours: 6200, totalCycles: 2800, nextMaintenance: '2026-07-15', status: 'active', fuelEfficiency: 2200 },
  { id: 'BA-A320-2', airline: 'British Airways', model: 'Airbus A320neo', bodyType: 'Narrow Body', registration: 'G-TTNB', totalHours: 5800, totalCycles: 2600, nextMaintenance: '2026-08-25', status: 'active', fuelEfficiency: 2200 },
  { id: 'BA-A319-1', airline: 'British Airways', model: 'Airbus A319', bodyType: 'Narrow Body', registration: 'G-EUPJ', totalHours: 18500, totalCycles: 9200, nextMaintenance: '2026-06-20', status: 'active', fuelEfficiency: 2100 }
];

export const generateMockFlights = (count: number): Flight[] => {
  const flights: Flight[] = [];
  const hubs: Record<string, string> = {
    'Singapore Airlines': 'SIN',
    'Lufthansa': 'FRA',
    'Cathay Pacific': 'HKG',
    'British Airways': 'LHR'
  };
  const prefixes: Record<string, string> = {
    'Singapore Airlines': 'SQ',
    'Lufthansa': 'LH',
    'Cathay Pacific': 'CX',
    'British Airways': 'BA'
  };
  
  const longHaulDestinations = ['JFK', 'LAX', 'SYD', 'HND', 'CDG', 'DXB', 'SFO'];
  const regionalDestinations = ['BKK', 'KUL', 'TPE', 'MNL', 'AMS', 'MUC', 'MAD', 'EDI'];

  for (let i = 0; i < count; i++) {
    const date = subDays(new Date(), i % 30);
    const aircraft = AIRCRAFT_LIST[i % AIRCRAFT_LIST.length];
    
    // Narrow body flights are shorter
    const duration = aircraft.bodyType === 'Narrow Body' 
      ? 1.5 + Math.random() * 3 
      : 6 + Math.random() * 10;

    const departure = addHours(date, 6 + (i % 14));
    const arrival = addHours(departure, duration);

    const hub = hubs[aircraft.airline];
    const destinations = aircraft.bodyType === 'Narrow Body' ? regionalDestinations : longHaulDestinations;
    
    const isOutbound = Math.random() > 0.5;
    const origin = isOutbound ? hub : destinations[i % destinations.length];
    const destination = isOutbound ? destinations[i % destinations.length] : hub;

    flights.push({
      id: `${prefixes[aircraft.airline]}${100 + i}`,
      date: format(date, 'yyyy-MM-dd'),
      airline: aircraft.airline,
      aircraftId: aircraft.id,
      origin,
      destination,
      departureTime: format(departure, 'HH:mm'),
      arrivalTime: format(arrival, 'HH:mm'),
      flightHours: Number(duration.toFixed(1)),
      cycles: 1,
      fuelBurned: Math.round(duration * aircraft.fuelEfficiency * (0.95 + Math.random() * 0.1)),
      payload: aircraft.bodyType === 'Narrow Body' 
        ? Math.round(12000 + Math.random() * 5000)
        : Math.round(25000 + Math.random() * 15000),
      status: i < 10 ? 'scheduled' : 'completed',
    });
  }
  return flights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
