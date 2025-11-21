// DAG for: "Merged ESG Emissions Workflow - 22-Step Comprehensive Process"

import type { Edge, Node } from "reactflow";
import { MarkerType } from "reactflow";

const colors = {
  // Agent type colors - matching merged workflow stages
  intent: "#2c5282",          // Dark blue for Intent Parser agents (Stage 0)
  dataAcquisition: "#059669", // Green for Data Acquisition agents (Stages 1-2)
  dataValidation: "#3b82f6",  // Blue for Data Validation agents (Stage 3)
  emissionCalculation: "#7c3aed", // Purple for Emission Calculation agents (Stage 4)
  assurance: "#ea580c",       // Orange for Assurance agents (Stage 5)
  reporting: "#dc2626",       // Red for Reporting agents (Stage 5)
  milestone: "#1a202c",       // Dark for start/completion milestones
  
  // System type colors
  cloud: "#38b2ac",           // Teal for cloud/external systems
  onprem: "#4a5568",         // Gray for on-prem/internal systems
  custom: "#2b6cb0",         // Blue for custom processing/merge operations
};

const createNodePosition = (x: number, y: number) => {
  const jitterX = Math.random() * 10 - 5;
  const jitterY = Math.random() * 10 - 5;
  return { x: x + jitterX, y: y + jitterY };
};

export const initialNodes: Node[] = [
  // Stage 0: Intent Parsing (Entry point)
  {
    id: "Q0",
    type: "custom",
    position: createNodePosition(-1200, 400),
    data: {
      label: "Parse ESG Query",
      color: "#000000",
      description: "Interpret user ESG analysis request and extract portfolio scope, metrics, and asset types.",
      details: [
        "Tool: intent.parse_esg_query",
        "Process: NLP query interpretation",
        "Output: Structured ESG analysis parameters",
        "Async: false",
        "Agent: Intent Parser Agent",
      ],
      metrics: {
        IntentClarity: "User query captured",
        OutputStructure: "Workflow initiated",
        AssetClassesIdentified: "3 types (bonds, real estate, infrastructure)",
        AnalysisScope: "Scope 3 Category 15 (financed emissions)",
        Benchmarks: "Existing L&G Portfolio (Internal), External (Various)",
        ProcessingConfidence: "95% query clarity achieved",
      },
      processingTime: 1.2,
      processingState: "idle",
      logs: [
        { timestamp: "2025-08-30T07:39:30Z", level: "INFO", message: "ESG query parsing initiated" },
        { timestamp: "2025-08-30T07:39:30.2Z", level: "INFO", message: "Analyzing query: 'Calculate my Scope 3 Category 15...'" },
        { timestamp: "2025-08-30T07:39:30.5Z", level: "INFO", message: "Identified analysis type: Scope 3 Category 15 (financed emissions)" },
        { timestamp: "2025-08-30T07:39:30.8Z", level: "INFO", message: "Detected asset classes: bonds, infrastructure equity, real estate equity" },
        { timestamp: "2025-08-30T07:39:31.0Z", level: "INFO", message: "Benchmark analysis against existing L&G portfolio enabled" },
        { timestamp: "2025-08-30T07:39:31.2Z", level: "INFO", message: "Portfolio file uploaded: investment_data.xlsx" },
        { timestamp: "2025-08-30T07:39:31.8Z", level: "INFO", message: "Query parsed successfully - triggering D1A and D1B nodes" },
        { timestamp: "2025-08-30T07:39:32.0Z", level: "INFO", message: "Intent parsing completed with 95% confidence" },
      ],
      config: {
        version: "2.1.0",
        timeout: "5s",
        retries: 2,
        nlpModel: "ESG-Intent-Parser-v2.1",
        supportedFileTypes: ["xlsx", "csv", "xls"],
        maxFileSize: "50MB",
        confidenceThreshold: 0.85,
        lastModified: "2025-08-30T07:39:00Z",
        assetClassDetection: "enabled",
        scopeIdentification: "advanced",
      },
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "User's ESG analysis request prompt",
            example: "Calculate my Scope 3 Category 15 (financed emissions) position for the following set of investments consisting of bonds, infrastructure equity and real estate equity"
          }
        },
        required: ["query"]
      },
      outputSchema: {
        type: "object",
        properties: {
          parsedIntent: {
            type: "object",
            properties: {
              analysisType: {
                type: "string",
                enum: ["Scope 3 Category 15", "Scope 1+2", "Full Scope 3", "Portfolio Carbon Footprint"],
                description: "Type of ESG analysis requested"
              },
              assetClasses: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["bonds", "real estate equity", "infrastructure equity"]
                },
                description: "Investment types identified in the query"
              },
              benchmarkAnalysis: {
                type: "boolean",
                description: "Whether benchmark analysis against existing portfolio is required"
              },
              portfolioScope: {
                type: "string",
                description: "Scope of portfolio for analysis"
              },
              reportingStandard: {
                type: "string",
                enum: ["PCAF", "GHG Protocol", "TCFD"],
                description: "Identified reporting standard preference"
              }
            },
            required: ["analysisType", "assetClasses"]
          },
          confidence: {
            type: "number",
            minimum: 0,
            maximum: 1,
            description: "Confidence score for query interpretation"
          },
          nextSteps: {
            type: "array",
            items: { type: "string" },
            description: "DAG nodes to trigger next based on parsed intent"
          },
          status: {
            type: "string",
            enum: ["success", "partial", "error"],
            description: "Processing status"
          }
        },
        required: ["parsedIntent", "confidence", "status"]
      },
    },
  },

  // Stage 1A: Sub Process 1.1 - Portfolio Data Collection (Sequential)
  {
    id: "D1A",
    type: "custom",
    position: createNodePosition(-600, 100),
    data: {
      label: "Collect Portfolio Data - Investments Under Consideration",
      color: "#22c55e",
      description: "Extract internal investment data from proposed portfolio for ESG Scope 3 analysis.",
      details: [
        "Tool: portfolio.extract_investments_under_consideration",
        "Source: PortfolioForScope3Analysis.xlsx",
        "Assets: 18 assets (£89.7m total)",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "Internal Excel portfolio",
        AssetsCount: "18 investments",
        TotalValue: "£89.7m",
        AssetTypes: "Real estate, bonds, infrastructure",
      },
      processingTime: 3.6,
      processingState: "idle",
      logs: [
        { timestamp: "2025-08-30T07:39:32Z", level: "INFO", message: "Portfolio data collection initiated" },
        { timestamp: "2025-08-30T07:39:32.5Z", level: "INFO", message: "Reading investment data from PortfolioForScope3Analysis.xlsx" },
        { timestamp: "2025-08-30T07:39:33.0Z", level: "INFO", message: "Found 18 assets with total value £89.7m" },
        { timestamp: "2025-08-30T07:39:33.5Z", level: "INFO", message: "Asset types identified: Real estate, bonds, infrastructure" },
        { timestamp: "2025-08-30T07:39:34.0Z", level: "INFO", message: "Validating portfolio data structure" },
        { timestamp: "2025-08-30T07:39:34.5Z", level: "INFO", message: "All required fields present for ESG analysis" },
        { timestamp: "2025-08-30T07:39:35.0Z", level: "INFO", message: "Portfolio data extraction completed successfully" },
      ],
      config: {
        version: "2.1.0",
        timeout: "10s",
        retries: 3,
        dataSource: "Excel",
        supportedFileTypes: ["xlsx", "csv", "xls"],
        maxFileSize: "100MB",
        validationRules: "ESG-Portfolio-Schema-v2.1",
        lastModified: "2025-08-30T07:39:32Z",
        requiredFields: ["IssuerName", "AssetName", "InternalAssetID"],
      },
      inputSchema: {
        type: "object",
        properties: {
          IssuerName: {
            type: "string",
            description: "Name of the issuing organization"
          },
          AssetName: {
            type: "string", 
            description: "Name of the investment asset"
          },
          InternalAssetID: {
            type: "string",
            description: "Internal identifier for the asset"
          },
          AssetType: {
            type: "string",
            enum: ["Real Estate", "Bond", "Infrastructure"],
            description: "Type of investment asset"
          },
          InvestmentValue: {
            type: "number",
            description: "Value of investment in GBP"
          },
          OwnershipStake: {
            type: "number",
            description: "Percentage ownership stake"
          },
          Sector: {
            type: "string",
            description: "Industry sector classification"
          },
          Geography: {
            type: "string",
            description: "Geographic region"
          },
          Location: {
            type: "string",
            description: "Specific location details"
          },
          IssuerWebsites: {
            type: "string",
            description: "Issuer website URLs"
          }
        },
        required: ["IssuerName", "AssetName", "InternalAssetID"]
      },
      outputSchema: {
        type: "object",
        properties: {
          IssuerName: {
            type: "string",
            description: "Name of the issuing organization"
          },
          AssetName: {
            type: "string", 
            description: "Name of the investment asset"
          },
          InternalAssetID: {
            type: "string",
            description: "Internal identifier for the asset"
          },
          AssetType: {
            type: "string",
            enum: ["Real Estate", "Bond", "Infrastructure"],
            description: "Type of investment asset"
          },
          InvestmentValue: {
            type: "number",
            description: "Value of investment in GBP"
          },
          OwnershipStake: {
            type: "number",
            description: "Percentage ownership stake"
          },
          Sector: {
            type: "string",
            description: "Industry sector classification"
          },
          Geography: {
            type: "string",
            description: "Geographic region"
          },
          Location: {
            type: "string",
            description: "Specific location details"
          },
          IssuerWebsites: {
            type: "string",
            description: "Issuer website URLs"
          },
          ObtainGuidanceFrom: {
            type: "string",
            description: "Source for obtaining guidance on this asset"
          },
          ObtainGuidanceFromDataSources: {
            type: "array",
            items: { type: "string" },
            description: "Data sources for guidance information"
          }
        },
        required: ["IssuerName", "AssetName", "InternalAssetID"]
      },
    },
  },
  {
    id: "D1B",
    type: "custom",
    position: createNodePosition(-600, 700),
    data: {
      label: "Collect Portfolio Data - Internal Guidance",
      color: "#22c55e",
      description: "Obtain the relevant internal guidance required to map, enrich and standardise the investments.",
      details: [
        "Tool: portfolio.extract_internal_guidance",
        "Source: ClimateSolution.PDF (Categorisation), MiddleOffice.SQL (Financials), ESGReporting.SQL (PY Analysis)",
        "Rules: 87 guidance rules",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "ClimateSolution.PDF ('L&G Categorisation and Mapping'), MiddleOffice.SQLServer ('tblInvesteeFinancials'), ESGReporting.SQLServer ('tblHistoricalPortfolioAnalysis')",
        GuidanceRules: "87 categorization rules",
        HistoricalAnalysis: "Available",
        MappingLogic: "Asset classification",
      },
      processingTime: 4.8,
      processingState: "idle",
      logs: [
        { timestamp: "2025-08-30T07:39:35Z", level: "INFO", message: "Internal guidance collection initiated" },
        { timestamp: "2025-08-30T07:39:35.5Z", level: "INFO", message: "Accessing ClimateSolution.PDF database" },
        { timestamp: "2025-08-30T07:39:36.0Z", level: "INFO", message: "Connecting to MiddleOffice.SQLServer for investee financials" },
        { timestamp: "2025-08-30T07:39:36.5Z", level: "INFO", message: "Querying ESGReporting.SQLServer for prior year analysis" },
        { timestamp: "2025-08-30T07:39:37.0Z", level: "INFO", message: "Retrieved 87 guidance rules and categorization logic" },
        { timestamp: "2025-08-30T07:39:37.5Z", level: "INFO", message: "Cross-referencing with historical ESG data" },
        { timestamp: "2025-08-30T07:39:38.0Z", level: "INFO", message: "Internal guidance extraction completed successfully" },
      ],
      config: {
        version: "2.1.0",
        timeout: "15s",
        retries: 3,
        dataSource: "Multiple",
        supportedSources: ["PDF", "SQLServer", "InternalDB"],
        maxRules: "100",
        validationRules: "ESG-Guidance-Schema-v2.1",
        lastModified: "2025-08-30T07:39:35Z",
        requiredSources: ["ClimateSolution.PDF", "MiddleOffice.SQLServer", "ESGReporting.SQLServer"],
      },
      inputSchema: {
        type: "object",
        properties: {
          "ClimateSolution_PDF_Categorisation": {
            type: "object",
            description: "Climate solution categorization and guidance rules from PDF database",
            properties: {
              categoryRules: {
                type: "array",
                items: { type: "string" },
                description: "Asset categorization rules"
              },
              guidanceLogic: {
                type: "object",
                description: "Decision logic for ESG guidance"
              }
            }
          },
          "MiddleOffice_SQL_Financials": {
            type: "object",
            description: "Financial data for investee companies from middle office system",
            properties: {
              financialMetrics: {
                type: "object",
                description: "Key financial indicators"
              },
              reportingPeriod: {
                type: "string",
                description: "Financial reporting period"
              }
            }
          },
          "ESGReporting_SQL_PriorYear": {
            type: "object",
            description: "Previous year ESG analysis data from reporting system",
            properties: {
              priorYearMetrics: {
                type: "object",
                description: "ESG metrics from previous analysis"
              },
              benchmarkData: {
                type: "array",
                items: { type: "object" },
                description: "Historical benchmark comparisons"
              }
            }
          }
        },
        required: ["ClimateSolution_PDF_Categorisation", "MiddleOffice_SQL_Financials", "ESGReporting_SQL_PriorYear"]
      },
      outputSchema: {
        type: "object",
        properties: {
          InternalGuidanceID: {
            type: "string",
            description: "Unique identifier for the internal guidance rule"
          },
          InternalGuidanceSource: {
            type: "string",
            description: "Source system or document for the guidance"
          },
          InternalGuidanceRule: {
            type: "string",
            description: "The actual guidance rule or categorization logic"
          }
        },
        required: ["InternalGuidanceID", "InternalGuidanceSource", "InternalGuidanceRule"]
      },
    },
  },
  {
    id: "D1C",
    type: "custom",
    position: createNodePosition(0, 400),
    data: {
      label: "Merge Investments with Guidance",
      color: "#22c55e",
      description: "Harmonise and standardise the proposed investment data into a master holdings dataset, listing every in-scope investment with its key attributes and financial data.",
      details: [
        "Tool: data.merge_investments_guidance",
        "Process: Data harmonization, standardization",
        "Output: Master holdings dataset",
        "Async: false",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        MergedAssets: "18 standardized investments",
        HarmonizationAccuracy: "100%",
        StandardizationRules: "87 applied",
        OutputSchema: "Enhanced asset schema",
        DataCoverage: "85% complete, 15% requires estimation",
        MappingSuccess: "100% portfolio to emissions mapping",
        DataConsistency: "Currency and units standardized",
        ProcessingStatus: "All investment records harmonized",
      },
      processingTime: 1,
      processingState: "idle",
      logs: [
        { timestamp: "2025-08-30T07:39:40Z", level: "INFO", message: "Investment and guidance merge initiated" },
        { timestamp: "2025-08-30T07:39:40.2Z", level: "INFO", message: "Loading investment data from D1A (18 assets)" },
        { timestamp: "2025-08-30T07:39:40.4Z", level: "INFO", message: "Loading guidance rules from D1B (87 rules)" },
        { timestamp: "2025-08-30T07:39:40.6Z", level: "INFO", message: "Applying standardization rules to asset data" },
        { timestamp: "2025-08-30T07:39:40.8Z", level: "INFO", message: "Harmonizing currency and units across portfolio" },
        { timestamp: "2025-08-30T07:39:41.0Z", level: "INFO", message: "Mapping assets to standardized classifications" },
        { timestamp: "2025-08-30T07:39:41.2Z", level: "INFO", message: "Data merge completed with 100% success rate" },
      ],
      config: {
        version: "2.1.0",
        timeout: "8s",
        retries: 2,
        mergeStrategy: "RuleBasedHarmonization",
        validationRules: "ESG-DataMerge-Schema-v2.1",
        lastModified: "2025-08-30T07:39:40Z",
        standardizationLevel: "Full",
        dataQualityThreshold: 0.95,
      },
      inputSchema: {
        type: "object",
        properties: {
          // From D1A - Investment Data
          IssuerName: {
            type: "string",
            description: "Name of the issuing organization"
          },
          AssetName: {
            type: "string", 
            description: "Name of the investment asset"
          },
          InternalAssetID: {
            type: "string",
            description: "Internal identifier for the asset"
          },
          AssetType: {
            type: "string",
            enum: ["Real Estate", "Bond", "Infrastructure"],
            description: "Type of investment asset"
          },
          InvestmentValue: {
            type: "number",
            description: "Value of investment in GBP"
          },
          OwnershipStake: {
            type: "number",
            description: "Percentage ownership stake"
          },
          Sector: {
            type: "string",
            description: "Industry sector classification"
          },
          Geography: {
            type: "string",
            description: "Geographic region"
          },
          Location: {
            type: "string",
            description: "Specific location details"
          },
          IssuerWebsites: {
            type: "string",
            description: "Issuer website URLs"
          },
          ObtainGuidanceFrom: {
            type: "string",
            description: "Source for obtaining guidance on this asset"
          },
          ObtainGuidanceFromDataSources: {
            type: "array",
            items: { type: "string" },
            description: "Data sources for guidance information"
          },
          // From D1B - Guidance Data
          InternalGuidanceID: {
            type: "string",
            description: "Unique identifier for the internal guidance rule"
          },
          InternalGuidanceSource: {
            type: "string",
            description: "Source system or document for the guidance"
          },
          InternalGuidanceRule: {
            type: "string",
            description: "The actual guidance rule or categorization logic"
          }
        },
        required: ["IssuerName", "AssetName", "InternalAssetID", "AssetType", "InvestmentValue", "InternalGuidanceID", "InternalGuidanceSource", "InternalGuidanceRule"]
      },
      outputSchema: {
        type: "object",
        properties: {
          StandardisedIssuerName: {
            type: "string",
            description: "Standardized name of the issuing organization"
          },
          StandardisedAssetName: {
            type: "string",
            description: "Standardized name of the investment asset"
          },
          StandardisedAssetID: {
            type: "string",
            description: "Standardized internal identifier for the asset"
          },
          StandardisedAssetType: {
            type: "string",
            enum: ["Real Estate Equity", "Corporate Bond", "Infrastructure Equity"],
            description: "Standardized type of investment asset"
          },
          InvestmentValue: {
            type: "number",
            description: "Investment value in GBP (standardized currency)"
          },
          OwnershipStakePercentage: {
            type: "number",
            description: "Ownership stake as standardized percentage"
          },
          StandardisedSector: {
            type: "string",
            description: "Standardized industry sector classification"
          },
          StandardisedGeography: {
            type: "string",
            description: "Standardized geographic region"
          },
          StandardisedLocation: {
            type: "string",
            description: "Standardized location details"
          },
          InternalIssuerPYRating: {
            type: "string",
            description: "Internal issuer prior year rating"
          },
          InternalIssuerPYEBITDA: {
            type: "number",
            description: "Internal issuer prior year EBITDA"
          },
          MappedAssetClass: {
            type: "string",
            description: "Mapped asset class based on guidance rules"
          },
          MappedAssetHierarchy: {
            type: "string",
            description: "Mapped asset hierarchy classification"
          }
        },
        required: ["StandardisedIssuerName", "StandardisedAssetName", "StandardisedAssetID", "StandardisedAssetType", "InvestmentValue"]
      },
    },
  },

  // Stage 1B: Sub Process 1.2 - Carbon & Financial Data (6-way Parallel)
  {
    id: "D2A",
    type: "onprem",
    position: createNodePosition(600, -850),
    data: {
      label: "Internal - Climate Solution",
      color: "#22c55e",
      description: "Collect internal carbon metrics from ClimateSolution internal database.",
      details: [
        "Tool: data.extract_internal_climate_solution",
        "Source: ClimateSolution Internal DB",
        "Focus: Internal carbon metrics",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "Internal climate solution DB",
        CarbonMetrics: "Historical emissions data",
        Coverage: "Portfolio-specific metrics",
        UpdateFrequency: "Monthly",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  {
    id: "D2B",
    type: "cloud",
    position: createNodePosition(600, -350),
    data: {
      label: "External Primary - Reported Emissions",
      color: "#22c55e",
      description: "Collect direct reported emissions from company disclosures and CDP reports.",
      details: [
        "Tool: data.extract_reported_emissions",
        "Sources: Company disclosures, CDP",
        "Focus: Direct reported emissions",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "CDP, company reports",
        CompanyCoverage: "Primary disclosure sources",
        EmissionsScope: "Scope 1, 2, 3",
        DataQuality: "PCAF Grade 1-2",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },
  {
    id: "D2C",
    type: "cloud",
    position: createNodePosition(600, 150),
    data: {
      label: "External Primary - Supply Chain",
      color: "#22c55e",
      description: "Collect Scope 3 supply chain emissions data from supplier networks.",
      details: [
        "Tool: data.extract_supply_chain_emissions",
        "Sources: Supplier networks",
        "Focus: Scope 3 supply chain data",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "Supplier networks",
        SupplyChainCoverage: "Tier 1-2 suppliers",
        EmissionsScope: "Scope 3 categories",
        DataQuality: "PCAF Grade 2-3",
      },
      processingTime: 2.5,
      processingState: "idle",
    },
  },
  {
    id: "D2D",
    type: "cloud",
    position: createNodePosition(600, 650),
    data: {
      label: "External Secondary - Emission Factors",
      color: "#22c55e",
      description: "Collect standardized emission factors from DEFRA, EPA, and IPCC databases.",
      details: [
        "Tool: data.extract_emission_factors",
        "Sources: DEFRA, EPA, IPCC",
        "Focus: Standardized calculation factors",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "DEFRA, EPA, IPCC",
        FactorTypes: "Activity-based factors",
        GeographicCoverage: "Global factors",
        DataQuality: "PCAF Grade 3-4",
      },
      processingTime: 1.5,
      processingState: "idle",
    },
  },
  {
    id: "D2E",
    type: "cloud",
    position: createNodePosition(600, 1150),
    data: {
      label: "External Secondary - Grid Energy",
      color: "#22c55e",
      description: "Collect geographic energy intensity data from national grid operators and IEA.",
      details: [
        "Tool: data.extract_grid_energy_intensity",
        "Sources: National grid operators, IEA",
        "Focus: Geographic energy intensity",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "Grid operators, IEA",
        GeographicCoverage: "23 countries",
        EnergyIntensity: "kgCO2/kWh by region",
        DataQuality: "PCAF Grade 3",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  {
    id: "D2F",
    type: "cloud",
    position: createNodePosition(600, 1650),
    data: {
      label: "External Secondary - Benchmarks",
      color: "#22c55e",
      description: "Collect sectoral benchmarks and national inventory data for industry comparisons.",
      details: [
        "Tool: data.extract_sectoral_benchmarks",
        "Sources: Sectoral benchmarks, national inventories",
        "Focus: Industry comparison data",
        "Async: true",
        "Agent: Data Acquisition Agent",
      ],
      metrics: {
        DataSource: "Sectoral benchmarks",
        SectorsCovered: "11 major sectors",
        BenchmarkTypes: "Intensity ratios",
        DataQuality: "PCAF Grade 4",
      },
      processingTime: 1.5,
      processingState: "idle",
    },
  },
  {
    id: "D2G",
    type: "custom",
    position: createNodePosition(1200, 100),
    data: {
      label: "Merge Carbon & Financial Data",
      color: "#22c55e",
      description: "Unified merge of all carbon and financial data sources into comprehensive emissions dataset.",
      details: [
        "Tool: data.merge_carbon_financial_data",
        "Sources: 6 parallel data streams",
        "Output: Unified carbon/financial dataset",
        "Async: false",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        DataSources: "6 parallel streams merged",
        PrimaryDataCoverage: "75%",
        MergeAccuracy: "98.7%",
        QualityScore: "PCAF Grade 2-4",
      },
      processingTime: 2.4,
      processingState: "idle",
    },
  },

  // Stage 1C: Sub Process 1.3 - Final Data Merging
  {
    id: "D3",
    type: "custom",
    position: createNodePosition(1600, 400),
    data: {
      label: "Merge Portfolio Data",
      color: "#22c55e",
      description: "Create unified investment view using final outputs from Sub Process 1.1 (D1C) and Sub Process 1.2 (D2G) - optimized workflow.",
      details: [
        "Tool: data.merge_final_portfolio_data",
        "Portfolio data processing complete",
        "Optimized workflow: D1C + D2G → D3 (parallel inputs)",
        "Input 1: D1C (merged portfolio + guidance data)",
        "Input 2: D2G (comprehensive carbon & financial data)",
        "Output: Complete unified dataset for emissions workflow",
        "Async: false",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        UnifiedAssets: "18 complete investment records",
        StandardizedSchema: "Enhanced asset schema",
        DataCompleteness: "95.8%",
        InputOptimization: "Uses final agents from Sub Process 1.1 & 1.2",
        ReadyForProcessing: "Complete dataset",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },

    // Stage 3: Enhanced Data Validation (3 Sub-processes with detailed workflow)
  
  // Sub-process 2.1: Data Completeness and Accuracy Audit
  // Step 0-1: Parallel Data Ingestion
  {
    id: "S1A",
    type: "onprem",
    position: createNodePosition(2000, 100),
    data: {
      label: "Get Internal Data for Validation",
      color: "#3b82f6",
      description: "Collect internal data sources for validation, imputation and estimation",
      details: [
        "Tool: validation.get_internal_data",
        "Sources: Middle Office DB, Reporting Team DB, Climate Solutions DB",
        "Purpose: Financial cross-checks, historical baselines, known issues",
        "Async: true",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        DataSources: "3 internal databases",
        FinancialRecords: "Cross-validation ready",
        HistoricalBaseline: "Available",
        KnownIssues: "Catalogued",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  {
    id: "S1B",
    type: "onprem",
    position: createNodePosition(2000, 700),
    data: {
      label: "Get External Data for Validation",
      color: "#3b82f6",
      description: "Collect external verification sources and sanity check data",
      details: [
        "Tool: validation.get_external_data",
        "Sources: CDP, Bloomberg, Refinitiv, IEA, DEFRA, UK BEIS",
        "Purpose: Alternative verification, spot-checking, sanity validation",
        "External Factors: Regional grid carbon intensity",
        "Industry Benchmarks: IEA sector averages",
        "Async: true",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        ExternalSources: "6 verification databases",
        SpotCheckCoverage: "Large issuers verified",
        SanityChecks: "Revenue-emissions correlation",
        PublicData: "Available for validation",
        IEABenchmarks: "Industry sector averages",
        RegionalGridData: "Local carbon intensity factors",
        DEFRAFactors: "UK carbon conversion factors",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  
  // Step 2: Systematic QA Sweep
  {
    id: "V2",
    type: "custom",
    position: createNodePosition(3000, 100),
    data: {
      label: "Identify Anomalies and Inconsistencies",
      color: "#3b82f6",
      description: "Systematic QA sweep for missing data, outliers, and consistency issues",
      details: [
        "Tool: validation.identify_anomalies",
        "Process: Missing field cataloging, outlier detection, consistency checks",
        "Standards: PCAF compliance, unit alignment, entity deduplication",
        "Thresholds: tCO₂e/£ invested peer comparison, ±20% YoY limits",
        "Examples: 'X investments missing emissions, Y outliers flagged'",
        "Async: false",
        "Agent: Data Quality Agent",
      ],
      metrics: {
        MissingDataFields: "Catalogued by investment",
        OutlierDetection: "Emission intensity vs peers",
        ConsistencyChecks: "Currency/unit alignment",
        EntityDeduplication: "Same company verification",
        IntensityThresholds: "tCO₂e/£ invested peer comparison",
        YearOnYearLimits: "±20% change threshold",
        ExampleOutputs: "Missing EVIC, blank emissions, unit misalignment",
        TypicalIssues: "Data gaps and inconsistencies flagged",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  
  // Step 3: Expectation Validation
  {
    id: "V3",
    type: "custom",
    position: createNodePosition(2600, 400),
    data: {
      label: "Compare Against Expectations",
      color: "#3b82f6",
      description: "Validate aggregated figures against industry benchmarks and reasonable ranges",
      details: [
        "Tool: validation.compare_expectations",
        "Process: Preliminary sum calculation, benchmark comparison",
        "Standards: Industry benchmarks, reasonable range validation",
        "Async: false",
        "Agent: Data Quality Agent",
      ],
      metrics: {
        BenchmarkComparison: "Industry standard ranges",
        PreliminarySum: "Calculated and validated",
        ReasonableRange: "Within expected bounds",
        IndustryAlignment: "Sector-specific validation",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  
  // Step 4: Quality Reporting
  {
    id: "S4",
    type: "custom",
    position: createNodePosition(3600, 400),
    data: {
      label: "Produce Data Quality Report",
      color: "#3b82f6",
      description: "Document findings and apply PCAF quality scoring for each data point",
      details: [
        "Tool: validation.produce_dq_report",
        "Output: Data quality report, PCAF scores, issue catalog",
        "Standards: PCAF scoring scheme (1-5), comprehensive documentation",
        "Performance Target: 95%+ data quality assurance",
        "Coverage Metrics: % reported vs estimated breakdown",
        "Async: false",
        "Agent: Data Quality Agent",
      ],
      metrics: {
        PCAFScoring: "1-5 quality grades applied",
        IssuesCatalogued: "Missing values, anomalies documented",
        QualityAssessment: "Per investment scoring",
        DocumentationComplete: "Audit-ready findings",
        PCAFGradeMapping: "Reported data = 1-3, Proxies = 4-5",
        QualityThresholds: "High quality = direct disclosure, Low = estimation",
        DataQualityTarget: "95%+ quality assurance",
        CoverageMetrics: "% reported vs estimated breakdown",
        SampleReporting: "Issue count examples, resolution tracking",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  
  // Sub-process 2.2: Apply Proxy Data & Assumptions  
  // Step 5: Data Imputation
  {
    id: "S5",
    type: "custom",
    position: createNodePosition(4000, 400),
    data: {
      label: "Estimate, Impute and Correct",
      color: "#3b82f6",
      description: "Fill data gaps with conservative proxy estimates and document all assumptions",
      details: [
        "Tool: validation.estimate_impute_correct",
        "Methods: Revenue ratios, building characteristics, sector averages",
        "Corporate Formula: Revenue × sector emissions/revenue ratio",
        "Real Estate Formula: Size (sq ft) × energy intensity (kWh/m²) × carbon factor",
        "Documentation: Comprehensive assumption logging with examples",
        "Example: 'Company X - used sector average 0.5 tCO₂e/£m revenue from Source Y'",
        "Conservative Approach: Cautious estimates, avoid underestimation",
        "Agent: Data Imputation Agent",
      ],
      metrics: {
        CorporateProxies: "Revenue × sector intensity",
        RealEstateProxies: "Building characteristics model",
        AssumptionLogging: "Complete traceability",
        ConservativeApproach: "Regulatory compliant",
        TCFDTransparency: "Estimation marked",
        FormulaDetail: "Revenue × sector emissions/revenue ratio",
        RealEstateFormula: "Size (sq ft) × energy intensity (kWh/m²) × carbon factor",
        GreenAdjustments: "Efficiency class modifications",
        OccupancyFactors: "Building utilization rates",
        ProxyQualityScore: "Grade 4-5 assignment",
        ReportedDataScore: "Grade 1-3 maintenance",
        ConservativeMethod: "Cautious estimates, avoid underestimation",
        RiskAwareness: "Uncertainty handling protocols",
        RegulatoryCompliance: "Conservative bias application",
      },
      processingTime: 1.5,
      processingState: "idle",
    },
  },
  
  // Sub-process 2.3: Data Verification and Sign-off
  // Step 6: Multi-stakeholder Validation (Parallel)
  {
    id: "S6A",
    type: "onprem",
    position: createNodePosition(4400, 100),
    data: {
      label: "Climate Solutions Team Review",
      color: "#3b82f6",
      description: "Technical validation of emissions data and PCAF methodology compliance",
      details: [
        "Tool: review.climate_solutions_validation",
        "Focus: Technical aspects, PCAF standards, methodology consistency",
        "Team: Climate Solutions specialists",
        "External Engagement: Counterparty validation for major holdings",
        "Documentation: Methodology papers for external assurance",
        "Governance: Strategic intervention points for critical decisions",
        "Async: true (human-in-the-loop)",
        "Agent: Climate Solutions Review Agent",
      ],
      metrics: {
        TechnicalValidation: "Emissions data verified",
        PCAFCompliance: "Standards adherence confirmed",
        MethodologyConsistency: "Approach validated",
        QualityScoring: "PCAF grades verified",
        CounterpartyEngagement: "Issuer validation portals",
        DataSharing: "Investee verification process",
        ExternalValidation: "Major holdings confirmation",
        MethodologyPapers: "External assurance preparation",
      },
      processingTime: 4.8,
      processingState: "idle",
    },
  },
  {
    id: "S6B",
    type: "onprem",
    position: createNodePosition(4400, 1100),
    data: {
      label: "Middle Office Team Review",
      color: "#3b82f6",
      description: "Financial reconciliation and investment value verification",
      details: [
        "Tool: review.middle_office_validation",
        "Focus: Financial attributes, ownership percentages, valuation alignment",
        "Team: Middle Office specialists",
        "Reconciliation: Valuation date discrepancies resolution",
        "Verification: Official books alignment confirmation",
        "Governance: Investment value accuracy validation",
        "Async: true (human-in-the-loop)",
        "Agent: Middle Office Review Agent",
      ],
      metrics: {
        FinancialReconciliation: "Official books alignment",
        InvestmentValues: "Verified accuracy",
        OwnershipPercentages: "Confirmed",
        ValuationDates: "Reconciled",
        BookAlignment: "Financial attributes verified",
        DiscrepancyResolution: "Valuation date reconciliation",
        AccuracyValidation: "Investment value confirmation",
      },
      processingTime: 1.5,
      processingState: "idle",
    },
  },
  {
    id: "S6C",
    type: "onprem",
    position: createNodePosition(4400, 2100),
    data: {
      label: "Institutional Reporting Team Review",
      color: "#3b82f6",
      description: "Scope validation and reporting level alignment verification",
      details: [
        "Tool: review.reporting_team_validation",
        "Focus: Dataset scope, reporting level, aggregate alignment",
        "Team: Institutional Retirement Reporting specialists",
        "Scope: Intended reporting scope confirmation",
        "Aggregation: Institutional-level disclosure capabilities",
        "Inclusion: All relevant assets verification",
        "Async: true (human-in-the-loop)",
        "Agent: Reporting Team Review Agent",
      ],
      metrics: {
        ScopeValidation: "Intended reporting scope confirmed",
        ReportingLevel: "Aggregate institutional alignment",
        AssetInclusion: "All relevant assets included",
        ReportingConsistency: "Disclosure requirements met",
        ScopeConfirmation: "Dataset boundaries verified",
        AggregationCapability: "Institutional rollup validated",
        InclusionVerification: "Asset coverage confirmed",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
  {
    id: "S6D",
    type: "onprem",
    position: createNodePosition(4400, 3100),
    data: {
      label: "Group Climate Team Review",
      color: "#3b82f6",
      description: "Regulatory compliance and TCFD requirements validation",
      details: [
        "Tool: review.group_climate_validation",
        "Focus: Regulatory expectations, TCFD compliance, scenario consistency",
        "Team: Group Climate specialists",
        "TCFD: Year-on-year comparison requirements",
        "Documentation: Data quality and methodology validation",
        "Scenarios: Analysis alignment and consistency verification",
        "Async: true (human-in-the-loop)",
        "Agent: Group Climate Review Agent",
      ],
      metrics: {
        RegulatoryCompliance: "TCFD standards met",
        YearOnYearComparison: "Historical data available",
        DataQualityDisclosure: "Methodology documented",
        ScenarioConsistency: "Analysis alignment confirmed",
        TCFDRequirements: "Year-on-year compliance verified",
        MethodologyValidation: "Documentation standards met",
        ConsistencyVerification: "Scenario analysis aligned",
      },
      processingTime: 1.5,
      processingState: "idle",
    },
  },
  {
    id: "S6E",
    type: "custom",
    position: createNodePosition(4800, 400),
    data: {
      label: "Consolidate Validation Results",
      color: "#3b82f6",
      description: "Merge all stakeholder reviews and finalize validated dataset",
      details: [
        "Tool: validation.consolidate_reviews",
        "Input: All stakeholder feedback and approvals",
        "Output: Final validated dataset with governance sign-off",
        "Documentation: Assumptions Register with detailed proxy documentation",
        "Governance: Multi-team sign-off records for audit trail",
        "Traceability: Source-to-calculation lineage",
        "Async: false",
        "Agent: Data Validation Agent",
      ],
      metrics: {
        StakeholderSignOff: "Multi-team approval recorded",
        GovernanceCompliance: "All reviews completed",
        FinalDataset: "Calculation-ready",
        AuditTrail: "Complete documentation",
        AssumptionsRegister: "Detailed proxy documentation",
        TraceabilityLog: "Source-to-calculation lineage",
        SignOffRecords: "Multi-team approval documentation",
        InterventionPoints: "Critical decision tracking",
        GovernanceAuditTrail: "Review process documentation",
      },
      processingTime: 2,
      processingState: "idle",
    },
  },

  // Stage 4: Emission Calculations (Parallel)
  {
    id: "S7",
    type: "custom",
    position: createNodePosition(5200, 100),
    data: {
      label: "Calculate Emissions for Corporate Bonds",
      color: colors.emissionCalculation,
      description: "PCAF Category 15 compliant financed emissions with EVIC-based attribution and enhanced financial integration.",
      details: [
        "Tool: calculation.enhanced_financed_emissions",
        "Methodology: PCAF Category 15",
        "Attribution: EVIC-based allocation",
        "Async: true",
        "Agent: Emission Calculation Agent",
      ],
      metrics: {
        PCAFCategory: "Category 15 compliant",
        EVICAttribution: "Ownership stake allocation",
        FinancialIntegration: "Enhanced attribution",
        EmissionsCalculated: "18-asset portfolio",
      },
      processingTime: 6,
      processingState: "idle",
    },
  },
  {
    id: "S8",
    type: "custom",
    position: createNodePosition(5200, 700),
    data: {
      label: "Calculate Emissions for Real Estate Equity",
      color: colors.emissionCalculation,
      description: "Enhanced 18-asset granularity with asset-specific sector analysis and investment value weighting.",
      details: [
        "Tool: analysis.enhanced_sectoral_breakdown",
        "Granularity: 18-asset specific analysis",
        "Weighting: Investment value based",
        "Async: true",
        "Agent: Emission Calculation Agent",
      ],
      metrics: {
        AssetGranularity: "18 individual assets",
        SectorAnalysis: "Asset-specific sectors",
        GeographicBreakdown: "Enhanced detail",
        InvestmentWeighting: "£89.7m portfolio",
      },
      processingTime: 4.8,
      processingState: "idle",
    },
  },
  {
    id: "S9",
    type: "custom",
    position: createNodePosition(5200, 1300),
    data: {
      label: "Calculate Emissions for Infrastructure Equity",
      color: colors.emissionCalculation,
      description: "Portfolio-specific scenarios with £89.7m portfolio stress testing and asset class risk differentiation.",
      details: [
        "Tool: risk.enhanced_climate_risk_assessment",
        "Portfolio: £89.7m specific scenarios",
        "Testing: Asset-class differentiated",
        "Async: true",
        "Agent: Emission Calculation Agent",
      ],
      metrics: {
        PortfolioStressTesting: "£89.7m portfolio",
        AssetClassRisk: "Differentiated analysis",
        ScenarioModeling: "Enhanced scenarios",
        RiskQuantification: "Asset-specific risks",
      },
      processingTime: 7.2,
      processingState: "idle",
    },
  },

  // Stage 5: Reporting (Sequential)
  {
    id: "S10",
    type: "custom",
    position: createNodePosition(5600, 400),
    data: {
      label: "Compile Evidence Pack",
      color: "#000000",
      description: "Comprehensive audit trail with data lineage from 8+ sources and 18-asset calculation worksheets.",
      details: [
        "Tool: assurance.compile_enhanced_evidence_pack",
        "Sources: 8+ source lineage",
        "Documentation: PCAF methodology",
        "Async: false",
        "Agent: Assurance Agent",
      ],
      metrics: {
        DataLineage: "8+ sources tracked",
        PCAFDocumentation: "Complete methodology",
        AssetWorksheets: "18 calculation worksheets",
        AuditTrail: "Comprehensive evidence",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },

  // Completion Milestone
  {
    id: "COMPLETE",
    type: "custom",
    position: createNodePosition(6000, 400),
    data: {
      label: "Emissions Workflow Complete",
      color: "#000000",
      description: "Archive comprehensive ESG analysis results with investment decision support and notify stakeholders.",
      details: [
        "Tool: system.complete_enhanced_emissions_workflow",
        "Output: Comprehensive analysis archive",
        "Support: Investment decision framework",
        "Final Status: 22-step workflow complete",
      ],
      metrics: {
        WorkflowType: "20-step enhanced completion",
        TotalProcessingTime: "30 seconds",
        InvestmentSupport: "Decision-ready analysis",
        ComprehensiveArchive: "Multi-source evidence",
      },
      processingTime: 1,
      processingState: "idle",
    },
  },
];

export const initialEdges: Edge[] = [
  // Stage 0 to Stage 1A: Intent parsing triggers portfolio data collection
  { id: "e-q0-d1a", source: "Q0", target: "D1A", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-q0-d1b", source: "Q0", target: "D1B", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },

  // Stage 1A: Sub Process 1.1 - Portfolio data collection merge
  { id: "e-d1a-d1c", source: "D1A", target: "D1C", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d1b-d1c", source: "D1B", target: "D1C", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },

  // Stage 1B: Sub Process 1.2 - Carbon & financial data (Sequential: D1C triggers all D2 nodes)
  { id: "e-d1c-d2a", source: "D1C", target: "D2A", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-d1c-d2b", source: "D1C", target: "D2B", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-d1c-d2c", source: "D1C", target: "D2C", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-d1c-d2d", source: "D1C", target: "D2D", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-d1c-d2e", source: "D1C", target: "D2E", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },
  { id: "e-d1c-d2f", source: "D1C", target: "D2F", type: "default", animated: false, style: { stroke: "#059669", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#059669" } },

  // Stage 1B: Sub Process 1.2 - Carbon & financial data merge (6-way parallel → merge)
  { id: "e-d2a-d2g", source: "D2A", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d2b-d2g", source: "D2B", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d2c-d2g", source: "D2C", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d2d-d2g", source: "D2D", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d2e-d2g", source: "D2E", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },
  { id: "e-d2f-d2g", source: "D2F", target: "D2G", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },

  // Stage 1C: Sub Process 1.3 - Final data merge (Optimized: Both D1C and D2G feed into D3)
  { id: "e-d1c-d3", source: "D1C", target: "D3", type: "smoothstep", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" }, pathOptions: { offset: 50, borderRadius: 20 } },
  { id: "e-d2g-d3", source: "D2G", target: "D3", type: "default", animated: false, style: { stroke: "#2b6cb0", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#2b6cb0" } },

  // Stage 1C to Stage 3: Direct to Data Validation (Skip Acquisition)
  { id: "e-d3-s1a", source: "D3", target: "S1A", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-d3-s1b", source: "D3", target: "S1B", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3: Sub-process 2.1 - Data Ingestion (Parallel)
  { id: "e-s1a-v3", source: "S1A", target: "V3", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s1b-v3", source: "S1B", target: "V3", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3: Sub-process 2.2 - Quality Analysis to Reporting
  { id: "e-v2-s4", source: "V2", target: "S4", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-v3-v2", source: "V3", target: "V2", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3: Reporting to Proxy Application
  { id: "e-s4-s5", source: "S4", target: "S5", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3: Sub-process 2.3 - Multi-stakeholder Review (Parallel)
  { id: "e-s5-s6a", source: "S5", target: "S6A", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s5-s6b", source: "S5", target: "S6B", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s5-s6c", source: "S5", target: "S6C", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s5-s6d", source: "S5", target: "S6D", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3: Consolidation of Reviews
  { id: "e-s6a-s6e", source: "S6A", target: "S6E", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s6b-s6e", source: "S6B", target: "S6E", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s6c-s6e", source: "S6C", target: "S6E", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },
  { id: "e-s6d-s6e", source: "S6D", target: "S6E", type: "default", animated: false, style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" } },

  // Stage 3 to Stage 4: Parallel Emission Calculations
  { id: "e-s6e-s7", source: "S6E", target: "S7", type: "default", animated: false, style: { stroke: "#7c3aed", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" } },
  { id: "e-s6e-s8", source: "S6E", target: "S8", type: "default", animated: false, style: { stroke: "#7c3aed", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" } },
  { id: "e-s6e-s9", source: "S6E", target: "S9", type: "default", animated: false, style: { stroke: "#7c3aed", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#7c3aed" } },

  // Stage 4 to Stage 5: All calculations feed into evidence compilation
  { id: "e-s7-s10", source: "S7", target: "S10", type: "default", animated: false, style: { stroke: "#ea580c", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ea580c" } },
  { id: "e-s8-s10", source: "S8", target: "S10", type: "default", animated: false, style: { stroke: "#ea580c", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ea580c" } },
  { id: "e-s9-s10", source: "S9", target: "S10", type: "default", animated: false, style: { stroke: "#ea580c", strokeWidth: 2, opacity: 0.8 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ea580c" } },

  // Stage 5: Reporting (Direct to completion)
  { id: "e-s10-complete", source: "S10", target: "COMPLETE", type: "default", animated: false, style: { stroke: "#dc2626", strokeWidth: 3, opacity: 0.9 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#dc2626" } },
];

// Define node dependencies for proper execution sequencing in the 22-step merged workflow
export const getNodeDependencies = (nodeId: string): string[] => {
  const dependencies: { [key: string]: string[] } = {
    // Stage 0: Intent Parsing (Entry point)
    "Q0": [], // Entry point

    // Stage 1A: Sub Process 1.1 - Portfolio Data Collection (Triggered by Q0)
    "D1A": ["Q0"], // Investments under consideration
    "D1B": ["Q0"], // Internal guidance
    "D1C": ["D1A", "D1B"], // Merge portfolio data

    // Stage 1B: Sub Process 1.2 - Carbon & Financial Data (Sequential: D1C triggers all D2 nodes)
    "D2A": ["D1C"], // Internal climate solution (sequential after D1C)
    "D2B": ["D1C"], // External reported emissions (sequential after D1C)
    "D2C": ["D1C"], // External supply chain (sequential after D1C)
    "D2D": ["D1C"], // External emission factors (sequential after D1C)
    "D2E": ["D1C"], // External grid energy (sequential after D1C)
    "D2F": ["D1C"], // External benchmarks (sequential after D1C)
    "D2G": ["D2A", "D2B", "D2C", "D2D", "D2E", "D2F"], // Merge carbon & financial data

    // Stage 1C: Sub Process 1.3 - Final Data Merging (Optimized: Uses final outputs from both D1C and D2G)
    "D3": ["D1C", "D2G"], // Final portfolio data merge (optimized to use both final agents from Sub Process 1.1 and 1.2)

    // Stage 3: Sub-process 2.1 - Data Ingestion (Parallel)
    "S1A": ["D3"], // Internal portfolio data validation
    "S1B": ["D3"], // External ESG data validation
    
    // Stage 3: Sub-process 2.2 - Quality Analysis
    "V2": ["V3"], // Systematic quality analysis - receives from V3
    "V3": ["S1A", "S1B"], // Systematic quality analysis - external data and internal data
    "S4": ["V2"], // Data quality gap reporting - now only receives from V2
    "S5": ["S4"], // Proxy application & assumption validation
    
    // Stage 3: Sub-process 2.3 - Multi-stakeholder Review (Parallel)
    "S6A": ["S5"], // Climate Solutions Team review
    "S6B": ["S5"], // Middle Office Team review
    "S6C": ["S5"], // Institutional Reporting Team review
    "S6D": ["S5"], // Group Climate Team review
    "S6E": ["S6A", "S6B", "S6C", "S6D"], // Consolidated validation review
    
    // Stage 4: Emission Calculations (Parallel - all depend on S6E)
    "S7": ["S6E"], // Financed emissions calculation
    "S8": ["S6E"], // Sectoral analysis & breakdown
    "S9": ["S6E"], // Climate risk assessment
    
    // Stage 5: Reporting (Direct to completion)
    "S10": ["S7", "S8", "S9"], // Evidence pack (needs all calculations)
    
    // Completion
    "COMPLETE": ["S10"], // Workflow completion (direct from S10)
  };
  
  return dependencies[nodeId] || [];
};