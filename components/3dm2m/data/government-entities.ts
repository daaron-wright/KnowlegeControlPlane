// Types for government entities
export interface GovernmentEntity {
  id: string;
  label: string;
  type: string;
}

export interface GovernmentLink {
  source: string;
  target: string;
  weight?: number;
}

// UAE Government Entities data
export const governmentEntities = [
  { id: "OMNIS", label: "Omnis", type: "central" },
  { id: "ADEC", label: "Abu Dhabi Executive Council", type: "authority" },
  { id: "ADEO", label: "Abu Dhabi Executive Office", type: "authority" },
  {
    id: "DGE",
    label: "Department of Government Enablement (DGE)",
    type: "authority",
  },
  { id: "DOF", label: "Department of Finance (DoF)", type: "authority" },
  {
    id: "SCAD",
    label: "Statistics Centre – Abu Dhabi (SCAD)",
    type: "authority",
  },
  { id: "HRA", label: "Human Resources Authority (HRA)", type: "authority" },
  { id: "ADDA", label: "Abu Dhabi Digital Authority", type: "authority" },
  { id: "ADMO", label: "Abu Dhabi Media Office", type: "authority" },
  {
    id: "DOH",
    label: "Department of Health (DoH)",
    type: "authority",
    isHighlighted: true,
  },
  {
    id: "ADEK",
    label: "Department of Education and Knowledge (ADEK)",
    type: "authority",
  },
  {
    id: "DCD",
    label: "Department of Community Development (DCD)",
    type: "authority",
  },
  {
    id: "ADHA",
    label: "Abu Dhabi Housing Authority (ADHA)",
    type: "authority",
  },
  {
    id: "ADRPBF",
    label: "Abu Dhabi Retirement Pensions and Benefits Fund (ADRPBF)",
    type: "authority",
  },
  {
    id: "ADSSA",
    label: "Abu Dhabi Social Support Authority",
    type: "authority",
  },
  {
    id: "MAAN",
    label: "Authority of Social Contribution – Ma'an",
    type: "authority",
  },
  {
    id: "ZHO",
    label: "Zayed Higher Organization for People of Determination (ZHO)",
    type: "authority",
  },
  {
    id: "FDF",
    label: "Family Development Foundation (FDF)",
    type: "organization",
  },
  {
    id: "ADECA",
    label: "Abu Dhabi Early Childhood Authority",
    type: "authority",
  },
  {
    id: "DED",
    label: "Department of Economic Development (DED)",
    type: "authority",
  },
  {
    id: "ADIO",
    label: "Abu Dhabi Investment Office (ADIO)",
    type: "authority",
  },
  {
    id: "ADCED",
    label: "Abu Dhabi Council for Economic Development",
    type: "authority",
  },
  {
    id: "ADX",
    label: "Abu Dhabi Securities Exchange (ADX)",
    type: "authority",
  },
  {
    id: "ADFD",
    label: "Abu Dhabi Fund for Development (ADFD)",
    type: "authority",
  },
  {
    id: "DMT",
    label: "Department of Municipalities and Transport (DMT)",
    type: "authority",
  },
  { id: "DOE", label: "Department of Energy (DoE)", type: "authority" },
  { id: "ADM", label: "Abu Dhabi Maritime", type: "authority" },
  { id: "ADP", label: "Abu Dhabi Ports", type: "organization" },
  { id: "ADA", label: "Abu Dhabi Airports", type: "organization" },
  { id: "ITC", label: "Integrated Transport Centre (ITC)", type: "authority" },
  { id: "ADP2", label: "Abu Dhabi Police", type: "authority" },
  { id: "ADJD", label: "Abu Dhabi Judicial Department", type: "authority" },
  {
    id: "ADCDA",
    label: "Abu Dhabi Civil Defense Authority",
    type: "authority",
  },
  {
    id: "GACA",
    label: "General Administration of Customs – Abu Dhabi",
    type: "authority",
  },
  {
    id: "ADAFSA",
    label: "Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)",
    type: "authority",
  },
  {
    id: "EAD",
    label: "Environment Agency – Abu Dhabi (EAD)",
    type: "authority",
  },
  {
    id: "DCT",
    label: "Department of Culture and Tourism (DCT)",
    type: "authority",
  },
  { id: "ADSC", label: "Abu Dhabi Sports Council", type: "authority" },
  {
    id: "QCC",
    label: "Abu Dhabi Quality and Conformity Council (QCC)",
    type: "authority",
  },
  {
    id: "ACTVET",
    label:
      "Abu Dhabi Centre for Technical and Vocational Education and Training (ACTVET)",
    type: "education",
  },
];

// Generate connections from all entities to the central OMNIS node
export const governmentConnections = governmentEntities
  .filter((entity) => entity.id !== "OMNIS") // Exclude OMNIS itself
  .map((entity) => ({
    source: entity.id,
    target: "OMNIS",
  }));

// Add some additional connections between related entities for a more realistic network
export const additionalConnections = [
  { source: "ADEK", target: "ACTVET" },
  { source: "DOH", target: "DCD" },
  { source: "ADMO", target: "DCT" },
  { source: "DED", target: "ADIO" },
  { source: "DED", target: "ADCED" },
  { source: "DED", target: "ADX" },
  { source: "DMT", target: "ADM" },
  { source: "DMT", target: "ADP" },
  { source: "DMT", target: "ADA" },
  { source: "DMT", target: "ITC" },
  { source: "DCD", target: "ADHA" },
  { source: "DCD", target: "ADSSA" },
  { source: "DCD", target: "MAAN" },
  { source: "DCD", target: "ZHO" },
  { source: "DCD", target: "FDF" },
  { source: "DCD", target: "ADECA" },
  { source: "ADDA", target: "DGE" },
  { source: "DOE", target: "DMT" },
  { source: "ADCDA", target: "ADP2" },
  { source: "GACA", target: "ADP2" },
];

// Combine all connections
export const governmentLinks = [
  ...governmentConnections,
  ...additionalConnections,
];
