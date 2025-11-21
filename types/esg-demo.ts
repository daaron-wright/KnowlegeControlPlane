export interface ESGDemoSheet {
  id: string;
  name: string;
  data: any[];
  type: 'financed-emissions' | 'data-quality' | 'general';
}

export interface ESGDemoData {
  sheets: ESGDemoSheet[];
  activeSheet: string;
  metadata: {
    title: string;
    generatedAt: string;
    portfolioValue: string;
    totalEmissions: string;
  };
}

// Financed Emissions Data Types
export interface FinancedEmissionsRow {
  investmentName: string;
  assetClass: string;
  sector: string;
  investmentValue: number;
  emissions: number;
  emissionsIntensity: number;
  dataQuality: 'High' | 'Medium' | 'Low';
  pcafCategory: string;
}

// Data Quality Assessment Types
export interface DataQualityRow {
  dataSource: string;
  quality: 'High' | 'Medium' | 'Low';
  coverage: string;
  lastUpdated: string;
  issues: string;
  recommendation: string;
}

// Mock data structure based on HTML file
export const esgDemoData: ESGDemoData = {
  sheets: [
    {
      id: "financed-emissions",
      name: "Financed Emissions Analysis",
      type: "financed-emissions",
      data: [
        {
          investmentName: "Green Energy Fund A",
          assetClass: "Listed Equity",
          sector: "Renewable Energy",
          investmentValue: 8500000,
          emissions: 145.2,
          emissionsIntensity: 17.1,
          dataQuality: "High",
          pcafCategory: "Category 15 - Listed Equity"
        },
        {
          investmentName: "Infrastructure Bond B",
          assetClass: "Corporate Bonds",
          sector: "Infrastructure",
          investmentValue: 12300000,
          emissions: 892.5,
          emissionsIntensity: 72.6,
          dataQuality: "Medium",
          pcafCategory: "Category 15 - Corporate Bonds"
        },
        {
          investmentName: "Real Estate Portfolio C",
          assetClass: "Real Estate",
          sector: "Commercial Property",
          investmentValue: 15600000,
          emissions: 1234.8,
          emissionsIntensity: 79.2,
          dataQuality: "High",
          pcafCategory: "Category 15 - Real Estate"
        },
        {
          investmentName: "Tech Growth Fund D",
          assetClass: "Listed Equity",
          sector: "Technology",
          investmentValue: 9400000,
          emissions: 234.7,
          emissionsIntensity: 25.0,
          dataQuality: "High",
          pcafCategory: "Category 15 - Listed Equity"
        }
      ]
    },
    {
      id: "data-quality",
      name: "Data Quality Assessment",
      type: "data-quality",
      data: [
        {
          dataSource: "Internal Portfolio DB",
          quality: "High",
          coverage: "95%",
          lastUpdated: "2025-08-25",
          issues: "None",
          recommendation: "Continue current process"
        },
        {
          dataSource: "CDP Climate Data",
          quality: "Medium",
          coverage: "78%",
          lastUpdated: "2025-08-20",
          issues: "Missing SME data",
          recommendation: "Enhance SME coverage"
        },
        {
          dataSource: "Bloomberg ESG",
          quality: "High",
          coverage: "85%",
          lastUpdated: "2025-08-24",
          issues: "Limited scope 3 data",
          recommendation: "Supplement with proxy data"
        },
        {
          dataSource: "Refinitiv ESG",
          quality: "Medium",
          coverage: "72%",
          lastUpdated: "2025-08-22",
          issues: "Data lag issues",
          recommendation: "Implement real-time feeds"
        },
        {
          dataSource: "Annual Reports",
          quality: "Low",
          coverage: "45%",
          lastUpdated: "2025-07-15",
          issues: "Manual extraction",
          recommendation: "Automate data extraction"
        }
      ]
    }
  ],
  activeSheet: "financed-emissions",
  metadata: {
    title: "ESG Scope 3 Demo - Financed Emissions Analysis",
    generatedAt: "2025-08-27T10:30:00Z",
    portfolioValue: "$46,000,000",
    totalEmissions: "2,507.2 tCO2e"
  }
};
