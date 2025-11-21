# Data Validation Agents Workflow Analysis

## **Overall Structure & Execution Sequence**

The document outlines a comprehensive data validation workflow for ESG (Environmental, Social, Governance) reporting, specifically for Scope 3 Category 15 financed emissions. The workflow consists of **3 main sub-processes** with **6 numbered execution steps** that follow a logical data validation pipeline:

## **Sub-process 2.1: Data Completeness and Accuracy Audit**

### **Steps 0-4: Data Collection, Validation & Quality Assessment**

#### **Step 0-1: Data Ingestion**
- **Step 0**: Takes consolidated dataset from Process 1 as baseline
- **Step 1**: Parallel data gathering from multiple sources:
  - **Internal sources**: 
    - Middle Office (financial cross-checks)
    - Reporting Team (historical baselines)
    - Climate Solutions Team (known issues database)
  - **External sources**: 
    - CDP, Bloomberg, Refinitiv for verification and spot-checking

#### **Step 2: Anomaly Detection**
- **"Identify Anomalies and Inconsistencies"**
- Systematic quality assurance sweep:
  - Catalog missing data fields (emissions, EVIC codes)
  - Flag outliers (unusual emission intensities vs peers)
  - Ensure consistency (same company data alignment, currency/unit standardization)

#### **Step 3: Expectation Validation**
- **"Compare against expectation"**
- Aggregate preliminary emissions calculations
- Validate against industry benchmarks and reasonable ranges

#### **Step 4: Quality Reporting**
- **"Produce DQ report"**
- Document all findings (missing values, anomalies, preliminary quality scores)
- Apply PCAF scoring scheme (1-5 scale: company disclosures = high quality, proxies = lower quality)

## **Sub-process 2.2: Apply Proxy Data & Assumptions**

### **Step 5: Gap Filling & Estimation**

#### **Step 5: Data Imputation**
- **"Estimate, Impute and Correct"**
- **For corporate investments**: Use revenue × sector average emissions ratio
- **For real estate**: Calculate from building characteristics (size × energy intensity × carbon factor)
- **Documentation requirements**: Document all assumptions with clear traceability
- **Conservative approach**: Apply conservative methodology to avoid underestimation
- **Transparency**: Mark estimated entries for transparency in TCFD reporting

## **Sub-process 2.3: Data Verification and Sign-off**

### **Step 6: Multi-stakeholder Validation**

#### **Step 6: Review and Critic Agents**
- **Climate Solutions Team/Agent**: 
  - Technical validation
  - PCAF compliance
  - Methodology consistency
- **Middle Office Team/Agent**: 
  - Financial reconciliation
  - Investment value verification
- **Institutional Retirement Reporting Team/Agent**: 
  - Scope validation
  - Reporting level alignment
- **Group Climate Team/Agent**: 
  - Regulatory compliance
  - TCFD requirements
  - Scenario analysis consistency

## **Key Design Principles**

1. **Multi-layered Validation**: Each step has multiple validation points with different specialist teams
2. **Transparency & Traceability**: Every assumption and proxy is documented for audit trails
3. **Conservative Approach**: Prefer overestimation to avoid regulatory underreporting
4. **Quality Scoring**: PCAF methodology ensures consistent quality assessment
5. **Asynchronous Human-in-the-Loop**: Step 6 allows for human oversight while maintaining automation capabilities

## **Data Flow & Outputs**

- **Input**: Consolidated dataset from Process 1
- **Intermediate**: Quality-flagged dataset with identified issues
- **Penultimate**: Complete dataset with proxy values and assumptions register
- **Final Output**: Validated, approved dataset ready for emission calculations with full governance sign-off

## **Technical Implementation Details**

### **Data Sources Integration**
- **Internal Systems**: Integration with Middle Office DB, Reporting Team DB, Climate Solutions DB
- **External APIs**: CDP, Bloomberg, Refinitiv data feeds
- **Validation Mechanisms**: Cross-referencing and spot-checking across multiple sources

### **Quality Assurance Framework**
- **PCAF Scoring**: Standardized 1-5 quality scoring system
- **Anomaly Detection**: Statistical outlier identification and peer comparison
- **Consistency Checks**: Entity deduplication and data alignment validation

### **Proxy Methodology**
- **Corporate Emissions**: Sector-based intensity ratios applied to revenue data
- **Real Estate Emissions**: Building characteristic-based estimation models
- **Documentation Standards**: Comprehensive assumption logging for audit compliance

### **Governance & Sign-off Process**
- **Multi-team Validation**: Parallel review by specialist teams
- **Regulatory Compliance**: TCFD and PCAF standard adherence
- **Audit Trail**: Complete documentation for regulatory and internal audit purposes

## **Workflow Benefits**

This workflow represents a sophisticated approach to financial services ESG data validation, balancing:
- **Automation** with human expertise
- **Speed** with accuracy
- **Regulatory compliance** with practical implementation
- **Transparency** with operational efficiency

The end result is an audit-ready, governance-approved dataset suitable for Scope 3 Category 15 financed emissions calculations and regulatory reporting.

---

# **🔄 Updated ESG Financed Emissions DAG Workflow Integration**

## **Overview**
This section describes how the data validation agents workflow integrates into the complete 22-step ESG financed emissions DAG workflow, replacing the previous Stage 3 with enhanced data validation processes.

## **🎯 Complete DAG Workflow Structure**

### **Current Structure (Stages 0-2 remain unchanged):**

#### **Stage 0: Intent Parsing**
- **Q0**: Parse ESG Query

#### **Stage 1A: Sub-Process 1.1 - Portfolio Data Collection**
- **D1A**: Collect Portfolio Data - Investments Under Consideration
- **D1B**: Collect Portfolio Data - Internal Guidance  
- **D1C**: Merge Portfolio Datasets

#### **Stage 1B: Sub-Process 1.2 - Carbon & Financial Data**
- **D2A-D2F**: Parallel data collection (6 sources)
- **D2G**: Merge Carbon & Financial Data

#### **Stage 2: Data Consolidation**
- **D3**: Create Unified Investment View

---

### **🔄 NEW Stage 3: Enhanced Data Validation (Replacing Current S1-S5)**

Based on the data validation agents analysis, Stage 3 is restructured into **3 detailed sub-processes with 10 execution steps**:

#### **Sub-process 2.1: Data Completeness and Accuracy Audit**

**Step 0-1: Data Ingestion**
- **S1A**: Get Internal Data for Validation, Imputation and Estimation
  - Middle Office Team DB (financial cross-checks)
  - Reporting Team DB (historical baselines)
  - Climate Solutions Team DB (known issues)

- **S1B**: Get External Data for Validation, Imputation and Estimation
  - CDP, Bloomberg, Refinitiv (alternative verification sources)
  - Publicly available data for sanity checks

**Step 2: Systematic QA Sweep**
- **S2**: Identify Anomalies and Inconsistencies
  - Missing data field cataloging
  - Outlier detection (emission intensities vs peers)
  - Consistency verification (duplicate entities, unit alignment)

**Step 3: Expectation Validation**
- **S3**: Compare Against Expectations
  - Aggregate figures vs industry benchmarks
  - Preliminary sum validation

**Step 4: Quality Documentation**
- **S4**: Produce Data Quality Report
  - Document findings (missing values, anomalies)
  - Apply PCAF quality scoring (1-5 scale)
  - Generate initial data quality assessment

#### **Sub-process 2.2: Apply Proxy Data & Assumptions**

**Step 5: Gap Filling**
- **S5**: Estimate, Impute and Correct
  - Corporate investments: Revenue × sector average emissions ratio
  - Real estate: Building characteristics estimation
  - Document all assumptions with clear traceability
  - Apply conservative methodology
  - Mark estimated entries for TCFD transparency

#### **Sub-process 2.3: Data Verification and Sign-off**

**Step 6: Multi-stakeholder Validation**
- **S6A**: Climate Solutions Team/Agent Review
  - Technical validation, PCAF compliance, methodology consistency

- **S6B**: Middle Office Team/Agent Review  
  - Financial reconciliation, investment value verification

- **S6C**: Institutional Retirement Reporting Team/Agent Review
  - Scope validation, reporting level alignment

- **S6D**: Group Climate Team/Agent Review
  - Regulatory compliance, TCFD requirements, scenario analysis consistency

---

### **Stages 4-5 (Renumbered from previous S6-S12):**

#### **Stage 4: Emissions Calculations**
- **S7**: Calculate Scope 1&2 Emissions
- **S8**: Calculate Scope 3 Emissions
- **S9**: Apply PCAF Attribution Factors
- **S10**: Calculate Portfolio-Level Emissions

#### **Stage 5: Assurance & Reporting**
- **S11**: Third-Party Data Assurance
- **S12**: Generate TCFD Climate Report
- **S13**: Compliance & Regulatory Reporting

#### **Completion**
- **COMPLETE**: Archive comprehensive ESG analysis results

---

## **🔄 Key Changes in the Updated DAG**

### **1. Expanded Stage 3 Structure:**
- **Before**: 5 simple validation steps (S1-S5)
- **After**: 3 sub-processes with 10 detailed steps (S1A, S1B, S2, S3, S4, S5, S6A, S6B, S6C, S6D)

### **2. Enhanced Data Sources:**
- **Internal**: Middle Office DB, Reporting Team DB, Climate Solutions DB
- **External**: CDP, Bloomberg, Refinitiv with verification focus
- **Validation**: Multiple stakeholder review agents

### **3. Improved Process Flow:**
```
D3 (Unified Dataset) → 
  ↓
Sub-process 2.1 (S1A, S1B, S2, S3, S4) → 
  ↓
Sub-process 2.2 (S5) → 
  ↓
Sub-process 2.3 (S6A, S6B, S6C, S6D) → 
  ↓
Stage 4 (Emissions Calculations)
```

### **4. Enhanced Outputs:**
- **Data Quality Report** with comprehensive findings
- **Assumptions Register** for audit trail
- **Multi-stakeholder Sign-off** for governance
- **PCAF-compliant Quality Scoring** for each data point

### **5. Step Renumbering:**
- Current S6-S12 become S7-S13 to accommodate expanded validation

### **6. Integration Benefits:**
- **More rigorous data validation** with proper governance
- **Enhanced traceability** and regulatory compliance
- **Multi-layered validation** with specialist team oversight
- **Maintained efficiency** through parallel processing
- **Improved audit readiness** with comprehensive documentation

## **🚀 Implementation Considerations**

### **DAG Node Updates Required:**
1. **Replace nodes S1-S5** with new S1A, S1B, S2, S3, S4, S5, S6A, S6B, S6C, S6D
2. **Renumber nodes S6-S12** to S7-S13
3. **Update edge connections** to reflect new sub-process flow
4. **Add agent type colors** for different validation teams
5. **Update processing metrics** for enhanced validation steps

### **Agent Configuration:**
- **Data Validation Agents**: Enhanced with multi-source capabilities
- **Review Agents**: New specialist team agents (Climate Solutions, Middle Office, etc.)
- **Quality Assurance Agents**: PCAF-compliant scoring mechanisms
- **Documentation Agents**: Comprehensive assumption logging

This updated structure provides **comprehensive data validation** with proper **governance, traceability, and regulatory compliance** while maintaining the existing workflow's efficiency and parallel processing capabilities.

---

# **🎨 Node Design for Enhanced Stage 3: Data Validation**

## **Design Principles**

1. **Visual Hierarchy**: Different sub-processes have distinct visual groupings
2. **Agent Type Colors**: Consistent color coding for different validation roles
3. **Processing Flow**: Clear sequential and parallel execution paths
4. **Stakeholder Clarity**: Easy identification of human vs automated agents

---

## **🎯 Node Structure Design**

### **Sub-process 2.1: Data Completeness and Accuracy Audit**

#### **Step 0-1: Parallel Data Ingestion Nodes**

```typescript
// S1A: Internal Data Collection
{
  id: "S1A",
  type: "onprem", 
  position: { x: 2400, y: 200 },
  data: {
    label: "Get Internal Data for Validation",
    color: colors.dataValidation, // Blue
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
    processingTime: 3,
    processingState: "idle",
  },
}

// S1B: External Data Collection  
{
  id: "S1B",
  type: "cloud",
  position: { x: 2400, y: 400 },
  data: {
    label: "Get External Data for Validation", 
    color: colors.dataValidation, // Blue
    description: "Collect external verification sources and sanity check data",
    details: [
      "Tool: validation.get_external_data",
      "Sources: CDP, Bloomberg, Refinitiv, Annual Reports", 
      "Purpose: Alternative verification, spot-checking, sanity validation",
      "Async: true",
      "Agent: Data Validation Agent",
    ],
    metrics: {
      ExternalSources: "4 verification databases",
      SpotCheckCoverage: "Large issuers verified",
      SanityChecks: "Revenue-emissions correlation",
      PublicData: "Available for validation",
    },
    processingTime: 4,
    processingState: "idle",
  },
}
```

#### **Step 2-4: Sequential Quality Assessment Nodes**

```typescript
// S2: Anomaly Detection
{
  id: "S2", 
  type: "custom",
  position: { x: 2800, y: 300 },
  data: {
    label: "Identify Anomalies and Inconsistencies",
    color: colors.dataValidation, // Blue
    description: "Systematic QA sweep for missing data, outliers, and consistency issues",
    details: [
      "Tool: validation.identify_anomalies",
      "Process: Missing field cataloging, outlier detection, consistency checks",
      "Standards: PCAF compliance, unit alignment, entity deduplication",
      "Async: false",
      "Agent: Data Quality Agent",
    ],
    metrics: {
      MissingDataFields: "Catalogued by investment",
      OutlierDetection: "Emission intensity vs peers",
      ConsistencyChecks: "Currency/unit alignment",
      EntityDeduplication: "Same company verification",
    },
    processingTime: 5,
    processingState: "idle",
  },
}

// S3: Expectation Validation
{
  id: "S3",
  type: "custom", 
  position: { x: 3200, y: 300 },
  data: {
    label: "Compare Against Expectations",
    color: colors.dataValidation, // Blue
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
    processingTime: 3,
    processingState: "idle",
  },
}

// S4: Quality Reporting
{
  id: "S4",
  type: "custom",
  position: { x: 3600, y: 300 },
  data: {
    label: "Produce Data Quality Report", 
    color: colors.dataValidation, // Blue
    description: "Document findings and apply PCAF quality scoring for each data point",
    details: [
      "Tool: validation.produce_dq_report",
      "Output: Data quality report, PCAF scores, issue catalog",
      "Standards: PCAF scoring scheme (1-5), comprehensive documentation",
      "Async: false",
      "Agent: Data Quality Agent",
    ],
    metrics: {
      PCAFScoring: "1-5 quality grades applied",
      IssuesCatalogued: "Missing values, anomalies documented",
      QualityAssessment: "Per investment scoring",
      DocumentationComplete: "Audit-ready findings",
    },
    processingTime: 4,
    processingState: "idle",
  },
}
```

### **Sub-process 2.2: Apply Proxy Data & Assumptions**

```typescript
// S5: Data Imputation
{
  id: "S5",
  type: "custom",
  position: { x: 4000, y: 300 },
  data: {
    label: "Estimate, Impute and Correct",
    color: colors.dataValidation, // Blue  
    description: "Fill data gaps with conservative proxy estimates and document all assumptions",
    details: [
      "Tool: validation.estimate_impute_correct",
      "Methods: Revenue ratios, building characteristics, sector averages",
      "Documentation: Comprehensive assumption logging",
      "Approach: Conservative methodology for regulatory compliance",
      "Agent: Data Imputation Agent",
    ],
    metrics: {
      CorporateProxies: "Revenue × sector intensity",
      RealEstateProxies: "Building characteristics model",
      AssumptionLogging: "Complete traceability",
      ConservativeApproach: "Regulatory compliant",
      TCFDTransparency: "Estimation marked",
    },
    processingTime: 6,
    processingState: "idle",
  },
}
```

### **Sub-process 2.3: Data Verification and Sign-off**

#### **Parallel Stakeholder Review Nodes**

```typescript
// S6A: Climate Solutions Review
{
  id: "S6A",
  type: "custom",
  position: { x: 4400, y: 100 },
  data: {
    label: "Climate Solutions Team Review",
    color: colors.assurance, // Orange - Human oversight
    description: "Technical validation of emissions data and PCAF methodology compliance",
    details: [
      "Tool: review.climate_solutions_validation",
      "Focus: Technical aspects, PCAF standards, methodology consistency", 
      "Team: Climate Solutions specialists",
      "Async: true (human-in-the-loop)",
      "Agent: Climate Solutions Review Agent",
    ],
    metrics: {
      TechnicalValidation: "Emissions data verified",
      PCAFCompliance: "Standards adherence confirmed",
      MethodologyConsistency: "Approach validated",
      QualityScoring: "PCAF grades verified",
    },
    processingTime: 8,
    processingState: "idle",
  },
}

// S6B: Middle Office Review  
{
  id: "S6B",
  type: "onprem",
  position: { x: 4400, y: 250 },
  data: {
    label: "Middle Office Team Review",
    color: colors.assurance, // Orange - Human oversight
    description: "Financial reconciliation and investment value verification",
    details: [
      "Tool: review.middle_office_validation",
      "Focus: Financial attributes, ownership percentages, valuation alignment",
      "Team: Middle Office specialists", 
      "Async: true (human-in-the-loop)",
      "Agent: Middle Office Review Agent",
    ],
    metrics: {
      FinancialReconciliation: "Official books alignment",
      InvestmentValues: "Verified accuracy",
      OwnershipPercentages: "Confirmed",
      ValuationDates: "Reconciled",
    },
    processingTime: 6,
    processingState: "idle",
  },
}

// S6C: Reporting Team Review
{
  id: "S6C", 
  type: "onprem",
  position: { x: 4400, y: 400 },
  data: {
    label: "Institutional Reporting Team Review",
    color: colors.assurance, // Orange - Human oversight
    description: "Scope validation and reporting level alignment verification",
    details: [
      "Tool: review.reporting_team_validation",
      "Focus: Dataset scope, reporting level, aggregate alignment",
      "Team: Institutional Retirement Reporting specialists",
      "Async: true (human-in-the-loop)", 
      "Agent: Reporting Team Review Agent",
    ],
    metrics: {
      ScopeValidation: "Intended reporting scope confirmed",
      ReportingLevel: "Aggregate institutional alignment", 
      AssetInclusion: "All relevant assets included",
      ReportingConsistency: "Disclosure requirements met",
    },
    processingTime: 5,
    processingState: "idle",
  },
}

// S6D: Group Climate Review
{
  id: "S6D",
  type: "custom",
  position: { x: 4400, y: 550 },
  data: {
    label: "Group Climate Team Review",
    color: colors.assurance, // Orange - Human oversight  
    description: "Regulatory compliance and TCFD requirements validation",
    details: [
      "Tool: review.group_climate_validation",
      "Focus: Regulatory expectations, TCFD compliance, scenario consistency",
      "Team: Group Climate specialists",
      "Async: true (human-in-the-loop)",
      "Agent: Group Climate Review Agent", 
    ],
    metrics: {
      RegulatoryCompliance: "TCFD standards met",
      YearOnYearComparison: "Historical data available",
      DataQualityDisclosure: "Methodology documented",
      ScenarioConsistency: "Analysis alignment confirmed",
    },
    processingTime: 7,
    processingState: "idle",
  },
}

// S6E: Validation Consolidation
{
  id: "S6E",
  type: "custom", 
  position: { x: 4800, y: 325 },
  data: {
    label: "Consolidate Validation Results",
    color: colors.dataValidation, // Blue
    description: "Merge all stakeholder reviews and finalize validated dataset",
    details: [
      "Tool: validation.consolidate_reviews", 
      "Input: All stakeholder feedback and approvals",
      "Output: Final validated dataset with governance sign-off",
      "Async: false",
      "Agent: Data Validation Agent",
    ],
    metrics: {
      StakeholderSignOff: "Multi-team approval recorded",
      GovernanceCompliance: "All reviews completed",
      FinalDataset: "Calculation-ready",
      AuditTrail: "Complete documentation",
    },
    processingTime: 2,
    processingState: "idle",
  },
}
```

---

## **🔗 Edge Connections Design**

```typescript
// Sub-process 2.1: Data ingestion → Analysis → Reporting
{ id: "e-d3-s1a", source: "D3", target: "S1A", ... },
{ id: "e-d3-s1b", source: "D3", target: "S1B", ... },
{ id: "e-s1a-s2", source: "S1A", target: "S2", ... },
{ id: "e-s1b-s2", source: "S1B", target: "S2", ... },
{ id: "e-s2-s3", source: "S2", target: "S3", ... },
{ id: "e-s3-s4", source: "S3", target: "S4", ... },

// Sub-process 2.2: Proxy application  
{ id: "e-s4-s5", source: "S4", target: "S5", ... },

// Sub-process 2.3: Parallel stakeholder reviews
{ id: "e-s5-s6a", source: "S5", target: "S6A", ... },
{ id: "e-s5-s6b", source: "S5", target: "S6B", ... }, 
{ id: "e-s5-s6c", source: "S5", target: "S6C", ... },
{ id: "e-s5-s6d", source: "S5", target: "S6D", ... },

// Consolidation
{ id: "e-s6a-s6e", source: "S6A", target: "S6E", ... },
{ id: "e-s6b-s6e", source: "S6B", target: "S6E", ... },
{ id: "e-s6c-s6e", source: "S6C", target: "S6E", ... },
{ id: "e-s6d-s6e", source: "S6D", target: "S6E", ... },

// Connect to next stage
{ id: "e-s6e-s7", source: "S6E", target: "S7", ... },
```

---

## **🎨 Visual Design Features**

### **1. Color Coding:**
- **Blue**: Data validation and quality agents
- **Orange**: Human oversight and review agents  
- **Teal**: External system connections
- **Gray**: Internal system connections

### **2. Node Types:**
- **custom**: Processing and analysis nodes
- **onprem**: Internal system integrations
- **cloud**: External API connections

### **3. Layout Strategy:**
- **Horizontal flow**: Left to right progression
- **Vertical grouping**: Sub-processes clustered
- **Parallel alignment**: Simultaneous operations at same Y-level

### **4. Processing States:**
- **Idle**: Ready for execution
- **Running**: Currently processing  
- **Complete**: Successfully finished
- **Error**: Requires attention

### **5. Node Positioning Logic:**
- **X-axis progression**: 2400 → 2800 → 3200 → 3600 → 4000 → 4400 → 4800
- **Y-axis grouping**: Related processes at similar heights
- **Parallel review nodes**: S6A-S6D spread vertically (y: 100-550)
- **Consolidation node**: Centered position for merge operation

### **6. Metrics Integration:**
- **Processing time**: Realistic estimates for each validation step
- **Data sources**: Clear indication of internal vs external
- **Quality measures**: PCAF compliance and scoring integration
- **Team identification**: Specialist roles clearly defined

This design provides **clear visual hierarchy**, **logical flow progression**, and **comprehensive validation coverage** while maintaining the existing DAG's efficiency and scalability. The node structure ensures **stakeholder clarity**, **governance transparency**, and **audit readiness** for the enhanced data validation process.
