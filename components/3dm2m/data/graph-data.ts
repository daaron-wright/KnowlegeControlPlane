// Health data system nodes and links
// This data represents a fictional health data ecosystem

// Note: This is sample data for visualization purposes

export const nodes = [
  // Abstract Nodes (from your image)
  { id: "ADPHC", label: "ADPHC", type: "entity", cluster: "regulatory" },
  { id: "ADEK", label: "ADEK", type: "entity", cluster: "education" },
  {
    id: "Schools",
    label: "Public & Private Schools",
    type: "entity",
    cluster: "education",
  },
  {
    id: "Ambassadors",
    label: "Public Health Ambassadors",
    type: "entity",
    cluster: "community",
  },
  {
    id: "H100",
    label: "H100 AI Diagnostics",
    type: "entity",
    cluster: "technology",
  },
  {
    id: "Estijabah",
    label: "Estijabah Platform",
    type: "entity",
    cluster: "technology",
  },
  {
    id: "Malaffi",
    label: "Malaffi HIE",
    type: "entity",
    cluster: "technology",
  },
  {
    id: "Genome",
    label: "Emirati Genome Program",
    type: "entity",
    cluster: "community",
  },
  {
    id: "PHSSR",
    label: "PHSSR Supply Chain",
    type: "entity",
    cluster: "security",
  },
  {
    id: "Guard",
    label: "UAE National Guard",
    type: "entity",
    cluster: "security",
  },
  { id: "WHO", label: "WHO Collaboration", type: "entity", cluster: "global" },
  { id: "ADGHW", label: "ADGHW Exchange", type: "entity", cluster: "global" },
  { id: "SEHA", label: "SEHA", type: "entity", cluster: "healthcare" },
  { id: "Mubadala", label: "Mubadala", type: "entity", cluster: "healthcare" },

  // ADPHC Subnodes
  {
    id: "ADPHC:Surveillance",
    label: "Surveillance Systems",
    parent: "ADPHC",
    type: "process",
  },
  {
    id: "ADPHC:Processing",
    label: "Case Data Processing",
    parent: "ADPHC",
    type: "process",
  },
  {
    id: "ADPHC:Policy",
    label: "Policy Interface",
    parent: "ADPHC",
    type: "process",
  },
  {
    id: "ADPHC:Archives",
    label: "Historical Repository",
    parent: "ADPHC",
    type: "data",
  },

  // ADEK Subnodes
  {
    id: "ADEK:Records",
    label: "Immunization Records",
    parent: "ADEK",
    type: "data",
  },
  {
    id: "ADEK:Comms",
    label: "Risk Communication",
    parent: "ADEK",
    type: "process",
  },
  {
    id: "ADEK:Closures",
    label: "School Closure Logic",
    parent: "ADEK",
    type: "decision",
  },

  // Schools Subnodes
  {
    id: "Schools:NurseReports",
    label: "Nurse Reports",
    parent: "Schools",
    type: "trigger",
  },
  {
    id: "Schools:VaccineOps",
    label: "Vaccination Ops",
    parent: "Schools",
    type: "action",
  },
  {
    id: "Schools:Absenteeism",
    label: "Absenteeism Analytics",
    parent: "Schools",
    type: "data",
  },

  // Ambassadors Subnodes
  {
    id: "Ambassadors:Scheduling",
    label: "Outreach Scheduling",
    parent: "Ambassadors",
    type: "action",
  },
  {
    id: "Ambassadors:Feedback",
    label: "Feedback Collection",
    parent: "Ambassadors",
    type: "data",
  },
  {
    id: "Ambassadors:Mgmt",
    label: "Volunteer Management",
    parent: "Ambassadors",
    type: "process",
  },

  // H100 Subnodes
  { id: "H100:Inputs", label: "Input Streams", parent: "H100", type: "data" },
  { id: "H100:Model", label: "Prediction Engine", parent: "H100", type: "ai" },
  {
    id: "H100:Outputs",
    label: "Output Routing",
    parent: "H100",
    type: "process",
  },

  // Estijabah Subnodes
  {
    id: "Estijabah:Alerts",
    label: "Alert Handling",
    parent: "Estijabah",
    type: "process",
  },
  {
    id: "Estijabah:Coordination",
    label: "Coordination Engine",
    parent: "Estijabah",
    type: "action",
  },
  {
    id: "Estijabah:Escalation",
    label: "Human Escalation Node",
    parent: "Estijabah",
    type: "decision",
  },

  // Malaffi Subnodes
  {
    id: "Malaffi:Aggregation",
    label: "Data Aggregation",
    parent: "Malaffi",
    type: "data",
  },
  {
    id: "Malaffi:VaccinationRegistry",
    label: "Vaccine Registry",
    parent: "Malaffi",
    type: "data",
  },
  {
    id: "Malaffi:Interoperability",
    label: "FHIR Interfaces",
    parent: "Malaffi",
    type: "api",
  },

  // Genome Program Subnodes
  {
    id: "Genome:Tracking",
    label: "Variant Tracking",
    parent: "Genome",
    type: "data",
  },
  {
    id: "Genome:Forecasting",
    label: "Immunity Forecasting",
    parent: "Genome",
    type: "ai",
  },

  // PHSSR Subnodes
  {
    id: "PHSSR:Inventory",
    label: "Inventory Monitoring",
    parent: "PHSSR",
    type: "data",
  },
  {
    id: "PHSSR:ColdChain",
    label: "Cold Chain Logs",
    parent: "PHSSR",
    type: "sensor",
  },
  {
    id: "PHSSR:Dispatch",
    label: "Dispatch Planner",
    parent: "PHSSR",
    type: "action",
  },

  // National Guard Subnodes
  {
    id: "Guard:Requests",
    label: "Request Intake",
    parent: "Guard",
    type: "trigger",
  },
  {
    id: "Guard:Planning",
    label: "Deployment Planner",
    parent: "Guard",
    type: "decision",
  },
  {
    id: "Guard:PostOps",
    label: "Post-Operation Reports",
    parent: "Guard",
    type: "data",
  },

  // WHO Subnodes
  {
    id: "WHO:Protocols",
    label: "Protocol Ingest",
    parent: "WHO",
    type: "data",
  },
  {
    id: "WHO:Benchmarks",
    label: "Benchmark Comparisons",
    parent: "WHO",
    type: "ai",
  },

  // ADGHW Subnodes
  {
    id: "ADGHW:Import",
    label: "Global Importer",
    parent: "ADGHW",
    type: "data",
  },
  {
    id: "ADGHW:Content",
    label: "Knowledge Publishing",
    parent: "ADGHW",
    type: "content",
  },
  {
    id: "ADGHW:Tracker",
    label: "Engagement Tracker",
    parent: "ADGHW",
    type: "analytics",
  },
];

export const links = [
  // Abstract Links (from original DAG)
  { source: "ADPHC", target: "PHSSR" },
  { source: "ADPHC", target: "Guard" },
  { source: "ADPHC", target: "H100" },
  { source: "ADPHC", target: "Estijabah" },
  { source: "ADPHC", target: "Genome" },
  { source: "ADPHC", target: "SEHA" },
  { source: "ADEK", target: "Schools" },
  { source: "Schools", target: "Ambassadors" },
  { source: "Mubadala", target: "Malaffi" },
  { source: "H100", target: "Estijabah" },
  { source: "Estijabah", target: "Guard" },
  { source: "PHSSR", target: "Guard" },
  { source: "WHO", target: "ADGHW" },

  // Subnode Links
  { source: "ADPHC:Surveillance", target: "ADPHC:Processing" },
  { source: "ADPHC:Processing", target: "ADPHC:Policy" },
  { source: "ADPHC:Policy", target: "ADPHC:Archives" },

  { source: "ADEK:Records", target: "ADEK:Comms" },
  { source: "ADEK:Comms", target: "ADEK:Closures" },

  { source: "Schools:NurseReports", target: "Schools:VaccineOps" },
  { source: "Schools:VaccineOps", target: "Schools:Absenteeism" },

  { source: "Ambassadors:Scheduling", target: "Ambassadors:Mgmt" },
  { source: "Ambassadors:Mgmt", target: "Ambassadors:Feedback" },

  { source: "H100:Inputs", target: "H100:Model" },
  { source: "H100:Model", target: "H100:Outputs" },

  { source: "Estijabah:Alerts", target: "Estijabah:Coordination" },
  { source: "Estijabah:Coordination", target: "Estijabah:Escalation" },

  { source: "Malaffi:Aggregation", target: "Malaffi:VaccinationRegistry" },
  { source: "Malaffi:VaccinationRegistry", target: "Malaffi:Interoperability" },

  { source: "Genome:Tracking", target: "Genome:Forecasting" },

  { source: "PHSSR:Inventory", target: "PHSSR:ColdChain" },
  { source: "PHSSR:ColdChain", target: "PHSSR:Dispatch" },

  { source: "Guard:Requests", target: "Guard:Planning" },
  { source: "Guard:Planning", target: "Guard:PostOps" },

  { source: "WHO:Protocols", target: "WHO:Benchmarks" },

  { source: "ADGHW:Import", target: "ADGHW:Content" },
  { source: "ADGHW:Content", target: "ADGHW:Tracker" },
];
