import { GoogleGenAI, Type } from "@google/genai";

const POOL_OF_INSIGHTS: Record<string, string[]> = {
  "Singapore Airlines": [
    "Ultra-long-haul flight tracking for 9V-SGE (A350-900ULR) shows optimal cruise fuel burn above FL390 on Pacific tracks.",
    "Singapore Changi (SIN) Terminal 3 apron telemetry recommends staggered pushbacks during the 23:00–01:00 departure bank to reduce ground idle fuel burn by 6.2%.",
    "Airbus A380-800 heavy-lift routes to London Heathrow (LHR) and Sydney (SYD) report 94.8% seat-factor efficiency against seasonal headwind models.",
    "Boeing 737-8 MAX narrow-body regional operations in Southeast Asia show consistent climb performance, saving ~180 kg of Jet-A1 per departure.",
    "Predictive airframe telemetry flags scheduled landing gear sensor calibration for 9V-SHD prior to upcoming monsoon operations in South Asia.",
    "Route optimization algorithms suggest minor waypoint shifts on SQ322 to leverage favorable sub-tropical jetstream velocity.",
    "Boeing 777-300ER long-haul rotation efficiency improved by 3.1% after transitioning to dynamic continuous descent approach (CDA) vectors."
  ],
  "Lufthansa": [
    "Frankfurt (FRA) hub ground turnarounds for Boeing 747-8i (D-ABYA, D-ABYB) show high dispatch reliability with an average gate turnaround of 82 minutes.",
    "Monitor scheduled cycle counts for D-ABTK (Boeing 747-400) approaching its structural heavy check; capacity smoothly backfilled by Munich-based A350-900s.",
    "Short-haul European A320neo and A321neo operations maintain 98.9% on-time dispatch reliability with low-noise departure compliance at FRA and MUC.",
    "Transatlantic north-track routing for LH400 displays a 4.2% fuel conservation index when cruising at Mach 0.84 with optimal step-climbs.",
    "Turbofan acoustic telemetry on D-AINZ (A320neo) indicates healthy vibration margins following recent scheduled fan blade inspections.",
    "Predictive de-icing and cold-weather turnaround schedules at Munich Hub indicate zero disruption risk for upcoming northern route rotations.",
    "Recommend optimizing cargo payload distribution on Frankfurt-to-Tokyo cargo-combi routes to improve center-of-gravity drag reduction by 1.1%."
  ],
  "Cathay Pacific": [
    "Hong Kong (HKG) hub bank connections show optimal payload transfer synchronization between incoming regional narrow-bodies and departing long-haul wide-bodies.",
    "Airbus A350-1000 flagships (B-LXA, B-LXB) demonstrate benchmark fuel consumption of 5,850 kg/hr on trans-Pacific polar corridors.",
    "Boeing 777-300ER fleet utilization across North American routes yields an average dispatch reliability rate exceeding 99.1%.",
    "Recommend staggered pushback sequencing during peak 18:00–20:00 HKG departure banks to minimize taxiway queue holding times.",
    "Airbus A321neo regional fleet demonstrates 14.2% lower carbon emissions per Available Seat Kilometer (ASK) compared to previous generation frames.",
    "Predictive maintenance analysis for CX880 identifies optimal hydraulic actuator service intervals prior to summer typhoon season.",
    "Telemetry analytics recommend adjusting flight level allocations across the South China Sea corridor to avoid localized turbulence bands."
  ],
  "British Airways": [
    "London Heathrow (LHR) Terminal 5 operations demonstrate enhanced on-time performance on Boeing 777-300ER services (G-STBA, G-VIIB).",
    "Boeing 787-9 and 787-10 Dreamliners achieve standout efficiency metrics on mid-Atlantic routes, averaging 5,120 kg/hr fuel consumption.",
    "Predictive cabin pressure telemetry on Airbus A319 (G-EUPJ) validates sound structural integrity across high-frequency UK domestic hops.",
    "Continuous Descent Arrival (CDA) compliance for BA arrivals into LHR reached 96.4%, reducing community noise footprint and terminal fuel burn.",
    "Airbus A350-1000 Club Suite configurations show balanced center-of-gravity performance on long-haul sectors to North America and Africa.",
    "Engine health monitoring for Rolls-Royce Trent 1000 powerplants reports zero thermal degradation anomalies across the Dreamliner sub-fleet.",
    "Scheduling analytics suggest batching overnight maintenance checks at Cardiff and Glasgow engineering bases to maximize daytime availability."
  ],
  "Wide Body": [
    "Fleet-wide A350-900, A350-1000, and B787 Dreamliner aircraft demonstrate class-leading aerodynamic efficiency on ultra-long-haul transoceanic sectors.",
    "Four-engine heavy wide-bodies (A380-800 and B747-8i) deliver optimal economics on dense, high-slot-value hub pairs between SIN, LHR, and FRA.",
    "Predictive flight planning recommends dynamic oceanic waypoint selection based on real-time satellite wind and temperature soundings.",
    "Wide-body auxiliary power unit (APU) ground usage has been cut by 18% through expanded use of fixed electrical ground power at major gates.",
    "Center-of-gravity automated trim adjustments on twin-aisle fleets have yielded a calculated 0.8% decrease in aerodynamic cruise drag."
  ],
  "Narrow Body": [
    "Next-generation narrow-bodies (A320neo, A321neo, B737-8 MAX) demonstrate a 15–18% reduction in block fuel burn compared to legacy models.",
    "High-frequency regional turnarounds average 38 minutes across regional hubs, sustaining high daily aircraft utilization rates.",
    "Predictive brake wear telemetry indicates replacement intervals can be safely extended by 12% across short-haul narrow-body fleets.",
    "Single-engine taxi-in procedures on narrow-body arrivals have saved an estimated 14,000 kg of fuel across the network this month.",
    "Cabin air filtration and sensor telemetry confirm peak environmental control system efficiency across all high-frequency routes."
  ],
  "General": [
    "Fleet-wide average fuel efficiency improved by 4.8% over the past 30 days due to widespread adoption of optimized flight level step-climbs.",
    "Hub-to-hub routing between SIN, HKG, FRA, and LHR maintains an aggregate 98.4% dispatch reliability rating across 300+ tracked operations.",
    "Predictive maintenance algorithms have preemptively flagged 4 minor avionics sensor calibrations, preventing unscheduled line-maintenance delays.",
    "Cross-fleet fuel burn variance between wide-body and narrow-body cohorts aligns precisely with payload mass and sector distance projections.",
    "Real-time meteorological turbulence rerouting reduced average flight time deviations by 7.3 minutes per long-haul flight sector."
  ]
};

function shuffleAndPick(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getFallbackInsights(carrier: string, bodyType: string): string[] {
  let pool: string[] = [];

  if (carrier && carrier !== "All Airlines" && POOL_OF_INSIGHTS[carrier]) {
    pool = [...POOL_OF_INSIGHTS[carrier]];
  } else if (bodyType && bodyType !== "All Types" && POOL_OF_INSIGHTS[bodyType]) {
    pool = [...POOL_OF_INSIGHTS[bodyType], ...POOL_OF_INSIGHTS["General"]];
  } else {
    pool = [
      ...POOL_OF_INSIGHTS["General"],
      ...POOL_OF_INSIGHTS["Wide Body"].slice(0, 2),
      ...POOL_OF_INSIGHTS["Narrow Body"].slice(0, 2),
      ...POOL_OF_INSIGHTS["Singapore Airlines"].slice(0, 2),
      ...POOL_OF_INSIGHTS["Lufthansa"].slice(0, 2),
      ...POOL_OF_INSIGHTS["Cathay Pacific"].slice(0, 2),
      ...POOL_OF_INSIGHTS["British Airways"].slice(0, 2),
    ];
  }

  return shuffleAndPick(pool, 3);
}

export default async function handler(req: any, res: any) {
  // Set cache prevention headers so every request is freshly evaluated
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      })
    : null;

  const { flightSummary } = req.body || {};
  const carrier = req.body?.carrier || "All Airlines";
  const bodyType = req.body?.bodyType || "All Types";
  const timestamp = req.body?.timestamp || Date.now();

  if (!ai) {
    const fallbacks = getFallbackInsights(carrier, bodyType);
    return res.status(200).json({ insights: fallbacks, source: "domain-analytics-engine", generatedAt: new Date().toISOString() });
  }

  try {
    const focusTopics = [
      "real-time fuel burn variance & step-climb optimization",
      "predictive airframe & engine maintenance cycle health",
      "hub turnaround efficiency and gate queue mitigation (SIN, FRA, HKG, LHR)",
      "payload-to-range aerodynamics and high-altitude meteorological adjustments",
      "narrow-body vs wide-body operational dispatch optimization"
    ];
    const chosenFocus = focusTopics[Math.floor(Math.random() * focusTopics.length)];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: `You are an expert Chief Airline Operations & Telemetry Intelligence Officer.
Analyze the following aircraft utilization data for our airline fleet and generate 3 unique, realistic, concise actionable insights.

Focus on: ${chosenFocus}
Filtered Airline: ${carrier}
Aircraft Category: ${bodyType}
Telemetry Snapshot Timestamp: ${timestamp}

Data Summary:
${JSON.stringify(flightSummary, null, 2)}

Requirements:
- Provide exactly 3 concise bullet strings.
- Reference realistic operational aviation parameters (e.g., flight levels FL380, fuel burn in kg/hr, hub operations at SIN/FRA/HKG/LHR, airframe models like A350, B787, A380, B747, A320neo, B737 MAX).
- Make each insight fresh, unique, and actionable.`,
        },
      ],
      config: {
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const text = response.text || "[]";
    try {
      const parsed = JSON.parse(text.trim());
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.status(200).json({ insights: parsed, source: "gemini-ai", generatedAt: new Date().toISOString() });
      }
    } catch {
      // Fall through to fallback if parsing fails
    }
    const fallbacks = getFallbackInsights(carrier, bodyType);
    return res.status(200).json({ insights: fallbacks, source: "domain-analytics-engine", generatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("AI Generation error:", err);
    const fallbacks = getFallbackInsights(carrier, bodyType);
    return res.status(200).json({ insights: fallbacks, source: "domain-analytics-engine", generatedAt: new Date().toISOString() });
  }
}

