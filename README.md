# ✈️ GlobalFleet: Aviation Fleet Analytics & Insights Dashboard

GlobalFleet is a full-stack aviation analytics platform designed to monitor commercial aircraft fleet operations, maintenance readiness, and fuel performance. The application combines real-time telemetry simulation, operational analytics, and predictive maintenance monitoring within a unified dashboard.

Built with React, Vite, Node.js, and Express, GlobalFleet provides fleet managers and operations teams with actionable insights through interactive visualizations, maintenance tracking systems, flight activity logs, and intelligent alerting mechanisms.

---

## 🚀 Features

* Real-time fleet monitoring dashboard
* Aircraft utilization and operational health tracking
* Fuel consumption and efficiency analytics
* Maintenance readiness monitoring and threshold alerts
* Historical flight log archive with search and filtering
* Multi-airline fleet analysis
* Interactive performance visualizations
* Manual flight dispatch simulation tools
* Metric (KG) and Imperial (LBS) conversion support
* Automated KPI insights & trend visualization
* Telemetry anomaly injection for testing and validation
* Data aggregation and trend analysis across simulated fleet operations

---

## 📊 Data Source & Simulation Model

All flight telemetry, aircraft details, flight hours, cargo payloads, and fuel metrics in GlobalFleet are **fully simulated (mock data)** and not sourced from real-world airline systems.

### 🧠 Telemetry Generation Engine

The system dynamically generates a historical dataset of hundreds of synthetic flights across multiple carriers including:

* Singapore Airlines
* Lufthansa
* Cathay Pacific
* British Airways

This creates realistic operational patterns, including flight frequency, aircraft usage cycles, and fuel consumption trends.

### ⚙️ Interactive Data Behavior

* The **Manual Flight Dispatcher** generates new simulated flight entries in real time
* The **Inject Bad Data** feature introduces anomalies such as fuel spikes, abnormal durations, and maintenance threshold violations
* All updates instantly propagate into dashboards, tables, and visualizations

### ✈️ Realistic Simulation Design

Although the dataset is synthetic, it is designed to mimic real aviation behavior using:

* Airline-style flight codes (SQ, LH, CX, BA formats)
* Real-world aircraft models (A350, A380, B787, B777, etc.)
* Proportional fuel burn logic based on aircraft type and route distance
* Consistent flight hour accumulation for maintenance simulation

### 🎯 Purpose of Simulation

This system serves as:

* Aviation analytics sandbox
* Fleet operations simulator
* Maintenance prediction testing environment
* Interactive dashboard demonstration platform

---

## 📷 Screenshots

### Dashboard Overview

![Dashboard Overview](screenshots/dashboard_metrics_insights.png)

**Highlights**

* KPI metrics overview
* Fleet utilization analytics
* Fuel efficiency monitoring
* AI Intelligence Feed

---

### Flight Logs & Maintenance Alerts

![Flight Logs & Maintenance Alerts](screenshots/dashboard_flight_logs.png)

**Highlights**

* Recent flight telemetry logs
* Aircraft status tracking
* Maintenance threshold alerts
* Operational monitoring

---

### Fleet Status Control Center

![Fleet Status Control Center](screenshots/fleet_status.png)

**Highlights**

* Aircraft-level fleet tracking
* Flight hours and cycles
* Maintenance readiness indicators
* Airline segmentation

---

### Flight Archive Registry

![Flight Archive Registry](screenshots/flight_logs_archive.png)

**Highlights**

* Searchable historical flights
* Status filtering
* Route tracking
* Analytics-ready dataset

---

### Fuel Efficiency & Performance Analytics

![Fuel Efficiency & Performance Analytics](screenshots/fuel_efficiency_charts.png)

**Highlights**

* Fuel burn trends
* Aircraft utilization graphs
* Carrier-based comparisons
* Performance analytics

---

### Settings & Dispatch Suite

![Settings & Dispatch Suite](screenshots/manual_dispatcher_suite.png)

**Highlights**

* Manual flight dispatcher
* System configuration controls
* Unit conversion (KG ↔ LBS)
* Maintenance threshold tuning

---

### Telemetry Anomaly Injector

![Telemetry Anomaly Injector](screenshots/anomaly_injector.png)

**Highlights**

* Inject synthetic anomalies
* Simulate failures and alerts
* Test maintenance logic
* Reset system state

---

## 🏗️ System Architecture

```text
Data Simulation Layer (Synthetic Aviation Dataset)
        │
        ▼
Data Processing Layer (Node.js Aggregation Logic)
        │
        ▼
Visualization Layer (React + Recharts Dashboard)
```

---

## ✈️ Operational Modules

### Fleet Monitoring

Tracks aircraft utilization, flight hours, cycles, and operational readiness.

### Maintenance Intelligence

Identifies aircraft approaching scheduled maintenance thresholds.

### Fuel Analytics

Analyzes fuel burn patterns and efficiency metrics across carriers.

### Flight Log Management

Provides searchable historical flight records with filtering capabilities.

### Dispatch Simulation

Generates mock flight operations for testing system behavior.

### Testing & Validation

Injects anomalies to simulate real-world operational edge cases.

---

## 📊 Key Analytical Insights

This dashboard enables analysis of:

- Airline-wise fuel efficiency comparison  
- Aircraft utilization trends across fleet types  
- Maintenance risk identification based on flight hours  
- Operational performance benchmarking across carriers  
- Historical flight pattern analysis using simulated datasets

---

## 🌍 Supported Airlines

* Singapore Airlines
* Lufthansa
* Cathay Pacific
* British Airways

---

## 🛠️ Technology Stack

### Frontend

* React 18
* Vite
* Tailwind CSS
* Recharts
* Framer Motion
* Lucide React

### Backend

* Node.js
* Express.js

### Development Tools

* ESLint
* npm

---

## 📂 Project Structure

```text
GlobalFleet/
│
├── screenshots/
│   ├── dashboard_metrics_insights.png
│   ├── dashboard_flight_logs.png
│   ├── fleet_status.png
│   ├── flight_logs_archive.png
│   ├── fuel_efficiency_charts.png
│   ├── manual_dispatcher_suite.png
│   └── anomaly_injector.png
│
├── client/
│   ├── src/
│   ├── public/
│   └── vite.config.ts
│
├── server/
│   ├── routes/
│   ├── controllers/
│   └── index.js
│
├── package.json
└── README.md
```

---

## ⚙️ Local Development

```bash
git clone https://github.com/<your-username>/globalfleet.git
cd globalfleet
npm install
npm run dev
```

App runs locally at:

```
http://localhost:3000
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🚀 Deployment

### Render

* Connect GitHub repo
* Build: `npm install && npm run build`
* Start: `npm start`

### Railway

* Import repo
* Auto-detect Node.js
* Deploy

### GitHub Pages (Frontend Only)

```ts
export default defineConfig({
  base: '/<repo-name>/'
})
```

---

## 🔮 Future Enhancements

* Real-world flight data integration
* Predictive maintenance models
* Advanced analytics dashboards
* Role-based access control
* Exportable reports
* Live airline simulation layer

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Raaghav Ramesh**

GlobalFleet Intelligence Dashboard was developed as a full-stack aviation analytics and fleet intelligence platform showcasing modern dashboard design, telemetry visualization, operational monitoring, and data-driven decision support systems.
