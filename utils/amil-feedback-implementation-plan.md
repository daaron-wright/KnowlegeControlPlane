# 🔄 Amil's Feedback Implementation Plan

## 📋 Overview
This document outlines the comprehensive steps needed to implement Amil's feedback for the ESG DAG workflow visualization and node architecture.

Generated on: August 26, 2025

---

## 🎯 Summary of Required Changes

### **1. Visual Improvements**
- Change rectangular edges to curvy edges like other OMNIS demos
- Reorganize "Parse ESG Query" node positioning and color

### **2. Parse ESG Query Node Updates**
- Update outputs, input schema, and properties
- Add realistic XML mockup data

### **3. Sub Process 1.1 - Portfolio Data Collection**
- Add 3 new agents for internal data collection and merging

### **4. Sub Process 1.2 - Carbon & Financial Data**
- Re-engineer with 6 new data collection agents + 1 merge agent

### **5. Sub Process 1.3 - Final Data Merging**
- Simplify to single merge agent

---

## 📝 Detailed Implementation Steps

### **STEP 1: Fix Edge Visualization (Curved Lines)**

**Files to modify:**
- `/omnis-ui/components/dag/utils/esg-dag-data.ts`

**Changes needed:**
```typescript
// Current: type: "step" (rectangular)
{ id: "e-q0-d1", source: "Q0", target: "D1", type: "step", ... }

// Change to: type: "smoothstep" or remove type entirely (curved/default)
{ id: "e-q0-d1", source: "Q0", target: "D1", type: "smoothstep", ... }
// OR
{ id: "e-q0-d1", source: "Q0", target: "D1", ... } // Default bezier curves
```

**Implementation:**
1. Search and replace all `type: "step"` with `type: "smoothstep"` in edges array
2. Alternative: Remove `type` property entirely to use default curved bezier paths
3. Test visualization to ensure edges are now curved

---

### **STEP 2: Update Parse ESG Query Node (Q0)**

**Current location:** First node in the DAG
**Required changes:**

#### **2.1 Positioning & Color**
```typescript
// Move to preceding layer with different color
position: createNodePosition(400, 100), // Move left to create preceding layer
color: colors.intent, // Change from dataAcquisition to intent color (#2c5282)
```

#### **2.2 Update Outputs**
```typescript
// Current outputs
"Outputs: portfolio_scope, esg_metrics_requested, analysis_timeframe"

// New outputs  
"Outputs: portfolio_scope, esg_metrics_requested, pcaf_scope_3_categories, asset_types"
```

#### **2.3 Enhanced Input Schema**
```typescript
inputSchema: {
  type: "object",
  properties: {
    userQuery: {
      type: "string",
      description: "End user ESG analysis request",
      example: "Analyze our proposed ESG portfolio for Scope 3 Category 15 financed emissions compliance with PCAF methodology"
    },
    portfolio_scope: {
      type: "integer",
      value: 3,
      description: "Scope level for emissions analysis"
    },
    esg_metrics_requested: {
      type: "string", 
      value: "tCO2e",
      description: "Requested ESG metrics format"
    },
    pcaf_scope_3_categories: {
      type: "integer",
      value: 15,
      description: "PCAF Scope 3 category for financed emissions"
    },
    asset_types: {
      type: "string",
      value: "bond | real estate | infrastructure",
      description: "Types of assets in analysis scope"
    }
  },
  required: ["userQuery", "portfolio_scope", "esg_metrics_requested"]
}
```

---

### **STEP 3: Add Sub Process 1.1 Agents**

**New nodes to add after Q0:**

#### **3.1 Node: D1A - Collect Portfolio Data - Internal - Investments Under Consideration**
```typescript
{
  id: "D1A",
  type: "onprem", 
  position: createNodePosition(800, 300),
  data: {
    label: "Collect Portfolio Data - Internal - Investments Under Consideration",
    color: colors.dataAcquisition,
    description: "Interpret proposed investments and identify relevant guidance",
    details: [
      "Tool: data.extract_excel_data",
      "Source: Proposed Portfolio for ESG Scope 3 Analysis.xlsx", 
      "Async: true"
    ],
    metrics: {
      DataSource: "Proposed Portfolio for ESG Scope 3 Analysis.xlsx",
      AssetCount: 18,
      TotalInvestmentValue: "$46m", 
      AssetType: "Bonds, Real Estate, Infrastructure"
    },
    inputSchema: {
      type: "object",
      properties: {
        spreadsheetPath: { type: "string" },
        worksheetName: { type: "string" }
      }
    },
    outputSchema: {
      type: "object", 
      properties: {
        IssuerName: { type: "string" },
        AssetName: { type: "string" },
        InternalAssetID: { type: "string" },
        AssetType: { type: "string" },
        InvestmentValue: { type: "number" },
        OwnershipStake: { type: "number" },
        Sector: { type: "string" },
        Geography: { type: "string" },
        Location: { type: "string" },
        IssuerWebsites: { type: "string" },
        ObtainGuidanceFrom: { type: "string" },
        ObtainGuidanceFromDataSources: { type: "string" }
      }
    },
    processingTime: 6,
    processingState: "idle"
  }
}
```

#### **3.2 Node: D1B - Collect Portfolio Data - Internal - Guidance**
```typescript
{
  id: "D1B", 
  type: "onprem",
  position: createNodePosition(800, 500),
  data: {
    label: "Collect Portfolio Data - Internal - Guidance",
    color: colors.dataAcquisition,
    description: "Obtain the relevant internal guidance required to map, enrich and standardise the investments",
    details: [
      "Tool: analysis.extract_esg_guidance",
      "Source: ClimateSolution.PDF.GetCategorisationAndGuidance, MiddleOffice.SQLServer.GetInvesteeFinancials, ESGReporting.SQLServer GetPriorYearAnalysis",
      "Async: true"
    ],
    metrics: {
      DataSource: "ClimateSolution.PDF ('L&G Categorisation and Mapping'), MiddleOffice.SQLServer ('tblInvesteeFinancials'), ESGReporting.SQLServer ('tblHistoricalPortfolioAnalysis')",
      GuidanceExtractedCount: 87
    },
    inputSchema: {
      type: "object",
      properties: {
        ClimateSolutionPDF: { type: "string", source: "GetCategorisationAndGuidance" },
        MiddleOfficeSQLServer: { type: "string", source: "GetInvesteeFinancials" }, 
        ESGReportingSQLServer: { type: "string", source: "GetPriorYearAnalysis" }
      }
    },
    outputSchema: {
      type: "object",
      properties: {
        InternalGuidanceID: { type: "string" },
        InternalGuidanceSource: { type: "string" },
        InternalGuidanceRule: { type: "string" }
      }
    },
    processingTime: 5,
    processingState: "idle"
  }
}
```

#### **3.3 Node: D1C - Collect Portfolio Data - Merge Investments with Guidance**  
```typescript
{
  id: "D1C",
  type: "custom",
  position: createNodePosition(1200, 400), 
  data: {
    label: "Collect Portfolio Data - Merge Investments with Guidance",
    color: colors.dataValidation,
    description: "Harmonise and standardise the proposed investment data into a master holdings dataset, listing every in-scope investment with its key attributes and financial data",
    details: [
      "Tool: analysis.merge_multiple_sources",
      "Source: 'Collect Portfolio Data - Internal - Investments Under Consideration', 'Collect Portfolio Data - Internal - Guidance'"
    ],
    metrics: {
      DataSource: "CollectPortfolioData.Internal.InvestmentsUnderConsideration.Output, CollectPortfolioData.Internal.Guidance.Output"
    },
    outputSchema: {
      type: "object",
      properties: {
        StandardisedIssuerName: { type: "string" },
        StandardisedAssetName: { type: "string" },
        StandardisedAssetID: { type: "string" },
        StandardisedAssetType: { type: "string" },
        InvestmentValue: { type: "number" },
        OwnershipStakePercentage: { type: "number" },
        StandardisedSector: { type: "string" },
        StandardisedGeography: { type: "string" },
        StandardisedLocation: { type: "string" },
        InternalIssuerPYRating: { type: "string" },
        InternalIssuerPYEBITDA: { type: "number" },
        MappedAssetClass: { type: "string" },
        MappedAssetHierarchy: { type: "string" }
      }
    },
    processingTime: 4,
    processingState: "idle"
  }
}
```

---

### **STEP 4: Add Sub Process 1.2 Agents (Carbon & Financial Data)**

**New nodes to add:**

#### **4.1 Internal Climate Solution Node (D2A)**
```typescript
{
  id: "D2A",
  type: "onprem",
  position: createNodePosition(800, 700),
  data: {
    label: "Collect Carbon and Financial Data - Internal - Climate Solution",
    color: colors.dataAcquisition,
    description: "Extract internal climate solution data and carbon metrics",
    details: [
      "Tool: climate.extract_internal_data", 
      "Source: ClimateSolution Internal Database",
      "Async: true"
    ],
    processingTime: 4,
    processingState: "idle"
  }
}
```

#### **4.2 External Primary - Reported Emissions (D2B)**
```typescript
{
  id: "D2B", 
  type: "cloud",
  position: createNodePosition(800, 850),
  data: {
    label: "Collect Carbon and Financial Data - External (Primary) - Reported Emissions and Financials",
    color: colors.dataAcquisition,
    description: "Collect primary reported emissions and financial data from external sources",
    details: [
      "Tool: emissions.fetch_reported_data",
      "Source: Company disclosures, CDP, regulatory filings",
      "Async: true"
    ],
    processingTime: 6,
    processingState: "idle"
  }
}
```

#### **4.3 External Primary - Supply Chain (D2C)**
```typescript
{
  id: "D2C",
  type: "cloud", 
  position: createNodePosition(800, 1000),
  data: {
    label: "Collect Carbon and Financial Data - External (Primary) - Supply Chain Emissions",
    color: colors.dataAcquisition,
    description: "Gather supply chain scope 3 emissions data",
    details: [
      "Tool: emissions.fetch_supply_chain_data",
      "Source: Supplier networks, value chain reporting",
      "Async: true"
    ],
    processingTime: 8,
    processingState: "idle"
  }
}
```

#### **4.4 External Secondary - Emission Factors (D2D)**
```typescript
{
  id: "D2D",
  type: "cloud",
  position: createNodePosition(800, 1150), 
  data: {
    label: "Collect Carbon and Financial Data - External (Secondary) - Emission Factors",
    color: colors.dataAcquisition,
    description: "Retrieve standardized emission factors for calculations",
    details: [
      "Tool: factors.fetch_emission_factors",
      "Source: DEFRA, EPA, IPCC databases",
      "Async: true"
    ],
    processingTime: 3,
    processingState: "idle"
  }
}
```

#### **4.5 External Secondary - Grid Energy (D2E)**
```typescript
{
  id: "D2E",
  type: "cloud",
  position: createNodePosition(800, 1300),
  data: {
    label: "Collect Carbon and Financial Data - External (Secondary) - Estimated Grid Energy Intensity", 
    color: colors.dataAcquisition,
    description: "Collect grid energy intensity factors by geography",
    details: [
      "Tool: energy.fetch_grid_intensity",
      "Source: National grid operators, IEA data",
      "Async: true"
    ],
    processingTime: 4,
    processingState: "idle"
  }
}
```

#### **4.6 External Secondary - Benchmarks (D2F)**
```typescript
{
  id: "D2F",
  type: "cloud",
  position: createNodePosition(800, 1450),
  data: {
    label: "Collect Carbon and Financial Data - External (Secondary) - Industry and National Benchmarks",
    color: colors.dataAcquisition, 
    description: "Retrieve industry and national emissions benchmarks",
    details: [
      "Tool: benchmarks.fetch_industry_data",
      "Source: Sectoral decarbonization approach, national inventories", 
      "Async: true"
    ],
    processingTime: 5,
    processingState: "idle"
  }
}
```

#### **4.7 Merge Carbon & Financial Data (D2G)**
```typescript
{
  id: "D2G",
  type: "custom",
  position: createNodePosition(1200, 1000),
  data: {
    label: "Collect Carbon and Financial Data - Merge Internal and External Inputs",
    color: colors.dataValidation,
    description: "Merge all carbon and financial data sources into unified datasets",
    details: [
      "Tool: analysis.merge_carbon_financial_data",
      "Depends on: D2A, D2B, D2C, D2D, D2E, D2F"
    ],
    outputSchema: {
      type: "object",
      properties: {
        EmissionsDataset: { 
          type: "array",
          description: "List of companies/projects with GHG emissions (tCO₂e)"
        },
        ReferenceDataset: {
          type: "object", 
          description: "Financial parameters (EVIC etc.) and benchmark factors"
        },
        DataMappingLog: {
          type: "object",
          description: "Documentation of successful/failed data matching"
        }
      }
    },
    processingTime: 7,
    processingState: "idle"
  }
}
```

---

### **STEP 5: Update Sub Process 1.3 (Final Merge)**

**Replace existing nodes with single merge agent:**

#### **5.1 Node: D3 - Merge Portfolio Data**
```typescript
{
  id: "D3",
  type: "custom", 
  position: createNodePosition(1600, 700),
  data: {
    label: "Merge Portfolio Data",
    color: colors.dataValidation,
    description: "Merge the internal and external datasets to create a unified view per investment",
    details: [
      "Tool: analysis.merge_multiple_sources",
      "Source: CollectCarbonandFinancialData.Output and CollectPortfolioData.Output",
      "Async: false"
    ],
    metrics: {
      DataSource: "CollectCarbonandFinancialData.Output and CollectPortfolioData.Output",
      AssetCount: 18,
      AssetWithMissingValues: 6,
      AssetsWithPrimaryEmissionsData: "75%"
    },
    outputSchema: {
      type: "object",
      properties: {
        StandardisedIssuerName: { type: "string" },
        StandardisedAssetName: { type: "string" },
        StandardisedAssetID: { type: "string" },
        StandardisedAssetType: { type: "string" },
        InvestmentValue: { type: "number" },
        OwnershipStakePercentage: { type: "number" },
        StandardisedSector: { type: "string" },
        StandardisedGeography: { type: "string" },
        StandardisedLocation: { type: "string" },
        IssuerPYRating: { type: "string" },
        IssuerPYEBITDA: { type: "number" },
        EVIC: { type: "number" },
        Sector: { type: "string" },
        Scope1Emission: { type: "number" },
        Scope2Emission: { type: "number" },
        Scope3Emission: { type: "number" },
        FlaggedForEstimation: { type: "boolean" },
        // Real estate subschema
        RealEstateDetails: {
          type: "object",
          properties: {
            SizeInSqm: { type: "number" },
            Utilisation: { type: "number" },
            GreenDesignRating: { type: "string" }
          }
        }
      }
    },
    processingTime: 5,
    processingState: "idle"
  }
}
```

---

### **STEP 6: Update Edge Connections**

**New edge connections needed:**

```typescript
// Q0 connections to Sub Process 1.1
{ id: "e-q0-d1a", source: "Q0", target: "D1A", type: "smoothstep" },
{ id: "e-q0-d1b", source: "Q0", target: "D1B", type: "smoothstep" },

// Sub Process 1.1 internal connections
{ id: "e-d1a-d1c", source: "D1A", target: "D1C", type: "smoothstep" },
{ id: "e-d1b-d1c", source: "D1B", target: "D1C", type: "smoothstep" },

// Q0 connections to Sub Process 1.2  
{ id: "e-q0-d2a", source: "Q0", target: "D2A", type: "smoothstep" },
{ id: "e-q0-d2b", source: "Q0", target: "D2B", type: "smoothstep" },
{ id: "e-q0-d2c", source: "Q0", target: "D2C", type: "smoothstep" },
{ id: "e-q0-d2d", source: "Q0", target: "D2D", type: "smoothstep" },
{ id: "e-q0-d2e", source: "Q0", target: "D2E", type: "smoothstep" },
{ id: "e-q0-d2f", source: "Q0", target: "D2F", type: "smoothstep" },

// Sub Process 1.2 to merge
{ id: "e-d2a-d2g", source: "D2A", target: "D2G", type: "smoothstep" },
{ id: "e-d2b-d2g", source: "D2B", target: "D2G", type: "smoothstep" },
{ id: "e-d2c-d2g", source: "D2C", target: "D2G", type: "smoothstep" },
{ id: "e-d2d-d2g", source: "D2D", target: "D2G", type: "smoothstep" },
{ id: "e-d2e-d2g", source: "D2E", target: "D2G", type: "smoothstep" },
{ id: "e-d2f-d2g", source: "D2F", target: "D2G", type: "smoothstep" },

// Final merge connections (Sub Process 1.3)
{ id: "e-d1c-d3", source: "D1C", target: "D3", type: "smoothstep" },
{ id: "e-d2g-d3", source: "D2G", target: "D3", type: "smoothstep" },

// Connect D3 to existing downstream processing
{ id: "e-d3-p1", source: "D3", target: "P1", type: "smoothstep" },
```

---

### **STEP 7: Update Dependencies Configuration**

**Update the `getNodeDependencies` function:**

```typescript
export const getNodeDependencies = (nodeId: string): string[] => {
  const dependencies: { [key: string]: string[] } = {
    "Q0": [], // Entry point
    
    // Sub Process 1.1
    "D1A": ["Q0"],
    "D1B": ["Q0"], 
    "D1C": ["D1A", "D1B"],
    
    // Sub Process 1.2
    "D2A": ["Q0"],
    "D2B": ["Q0"],
    "D2C": ["Q0"],
    "D2D": ["Q0"],
    "D2E": ["Q0"],
    "D2F": ["Q0"],
    "D2G": ["D2A", "D2B", "D2C", "D2D", "D2E", "D2F"],
    
    // Sub Process 1.3
    "D3": ["D1C", "D2G"],
    
    // Existing downstream nodes
    "P1": ["D3"], // Portfolio ESG Scoring now depends on final merged data
    // ... rest of existing dependencies
  };
  
  return dependencies[nodeId] || [];
};
```

---

### **STEP 8: Node Positioning Strategy**

**Layout organization:**

```typescript
// Layer 0: Parse Query (x = 400)
Q0: createNodePosition(400, 100)

// Layer 1: Sub Process 1.1 (x = 800) 
D1A: createNodePosition(800, 300)
D1B: createNodePosition(800, 500)

// Layer 2: Sub Process 1.1 Merge (x = 1200)
D1C: createNodePosition(1200, 400)

// Layer 1: Sub Process 1.2 (x = 800)
D2A: createNodePosition(800, 700)
D2B: createNodePosition(800, 850) 
D2C: createNodePosition(800, 1000)
D2D: createNodePosition(800, 1150)
D2E: createNodePosition(800, 1300)
D2F: createNodePosition(800, 1450)

// Layer 2: Sub Process 1.2 Merge (x = 1200)
D2G: createNodePosition(1200, 1000)

// Layer 3: Final Merge (x = 1600)
D3: createNodePosition(1600, 700)

// Layer 4+: Existing processing nodes (x = 2000+)
// Keep existing positions but shift right if needed
```

---

## 📁 Files to Modify

### **Primary File:**
- `/omnis-ui/components/dag/utils/esg-dag-data.ts`

### **Secondary Files (if needed):**
- `/omnis-ui/components/dag/visualization.tsx` (for edge rendering)
- `/omnis-ui/utils/node-analyzer.ts` (to update analysis tools)

---

## ✅ Testing Checklist

After implementation:

1. **Visual Verification:**
   - [ ] Edges are curved (not rectangular)
   - [ ] Q0 is in preceding layer with different color
   - [ ] Node layout follows PowerPoint slide structure

2. **Data Verification:**
   - [ ] Q0 has updated outputs and input schema
   - [ ] All new Sub Process 1.1 nodes exist with correct properties
   - [ ] All Sub Process 1.2 nodes exist with correct tools/sources
   - [ ] Sub Process 1.3 simplified to single merge node

3. **Functionality Testing:**
   - [ ] Node dependencies work correctly
   - [ ] DAG execution flows properly
   - [ ] Expanded node details show correct schemas
   - [ ] Metrics display properly

4. **Data Alignment:**
   - [ ] Input/output schemas match between connected nodes
   - [ ] Metrics align with Amil's specified values
   - [ ] Real estate subschema appears correctly

---

## 🚨 Potential Issues & Solutions

### **Issue 1: Node Overlap**
**Problem:** Too many nodes in Sub Process 1.2 may cause visual overlap
**Solution:** Adjust Y-spacing or implement columnar sub-layouts

### **Issue 2: Edge Complexity**  
**Problem:** Many edges from Q0 may create visual clutter
**Solution:** Consider edge bundling or progressive disclosure

### **Issue 3: Schema Complexity**
**Problem:** Large input/output schemas may impact performance
**Solution:** Implement schema lazy loading or truncation

### **Issue 4: Dependency Conflicts**
**Problem:** New dependency structure may conflict with existing nodes
**Solution:** Carefully test dependency resolution and update existing nodes as needed

---

## 🎯 Success Criteria

✅ **Visual Requirements Met:**
- Curved edges throughout DAG
- Q0 repositioned and recolored  
- Clear layer separation

✅ **Functional Requirements Met:**
- All requested nodes added with correct properties
- Input/output schemas properly defined
- Metrics match Amil's specifications

✅ **Data Architecture Requirements Met:**
- Sub Process 1.1: 3 nodes (2 data collection + 1 merge)
- Sub Process 1.2: 7 nodes (6 data collection + 1 merge)  
- Sub Process 1.3: 1 node (final merge)
- Proper data flow from Q0 → 1.1 & 1.2 → 1.3 → existing processing

This implementation plan ensures all of Amil's feedback is systematically addressed while maintaining the existing DAG functionality and extending it with the new ESG-specific data collection and processing architecture.
