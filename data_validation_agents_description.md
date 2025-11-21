# Data Validation Agents Description

## Overview
**Agent Type**: Data Validation Agents  
**Primary Function**: Run harmonisation, QA, anomaly detection  
**Workflow Position**: Stage 2 of the 6-stage ESG Scope 3 workflow  
**Processing Model**: Three sequential sub-processes with human-in-the-loop validation

---

## Sub-process 2.1: Data Completeness and Accuracy Audit

### Inputs
#### Internal Data Sources:
- **Consolidated dataset** from Process 1 (Data Acquisition)
- **Middle Office Team DB**: Financial figures for cross-checking bond position values against known totals
- **Reporting Team DB**: Last year's disclosed data or baseline for comparison
- **Climate Solutions Team DB**: Internal database of known issues or last-known emissions for entities

#### External Data Sources:
- **CDP, Bloomberg, Refinitiv**: Alternative/secondary data sources for verification
- **Company annual reports and CDP reports**: For spot-checking large issuers
- **Publicly available data**: For sanity checks (revenue vs emissions plausibility by industry)

### Processing Logic - Systematic QA Sweep:

#### 1. Identify Anomalies and Inconsistencies
- **Missing data fields**: Catalogue investments with blank emissions or missing EVIC
- **Outlier detection**: Flag extremely high/low emission intensities (tCO₂e/£ invested) vs peers
- **Consistency verification**: Ensure identical emissions/EVIC data for same company across multiple holdings
- **Unit alignment**: Verify no mixing of CO₂ scopes or measurement units

#### 2. Compare Against Expectations
- **Benchmark validation**: Compute preliminary emission sums against known industry benchmarks
- **Range checking**: Assess if aggregated figures fall within reasonable ranges

#### 3. Produce Data Quality Report
- **Issue documentation**: List missing values, anomalies, and outliers requiring review
- **PCAF quality scoring**: Apply PCAF's 1-5 quality grading (company disclosures = high quality, proxies = lower quality)

### Outputs
- **Data issues list**: Specific problems requiring resolution (e.g., "10 investments with missing emissions, 2 outliers")
- **Quality assessment**: PCAF quality grades (1-5) for each investment's emissions data
- **Updated dataset**: Corrected obvious errors (unit conversions, minor fixes)

---

## Sub-process 2.2: Apply Proxy Data & Assumptions

### Inputs
#### Internal Data Sources:
- **Climate Solutions guidance**: Proxy Methodology Papers with accepted approaches
- **Group Climate preferences**: Regulatory expectations for conservative estimates and disclosure requirements

#### External Data Sources:
- **IEA databases**: Industry-average emission factors and energy benchmarks
- **Sector intensity data**: Regional grid carbon intensity, building energy usage standards
- **Research papers**: Academic sources for sector-specific emission intensities

### Processing Logic - Gap Filling:

#### Corporate Investment Proxies
- **Missing emissions calculation**: Company revenue × sector average emissions/revenue ratio
- **Size adjustment**: Scale by known company characteristics if available
- **Regional consideration**: Apply industry and regional-specific factors

#### Real Estate Proxies
- **Building emissions estimation**: Size (sq ft) × energy intensity (kWh/m²) × carbon factor (kgCO₂e/kWh)
- **Efficiency adjustments**: Modify for green certifications or occupancy rates
- **Local grid factors**: Apply regional electricity emission factors

#### Documentation Requirements
- **Assumption logging**: Clear documentation of each proxy (e.g., "Company X - used sector average 0.5 tCO₂e/£m revenue from Source Y")
- **Conservative approach**: Apply cautious estimates to avoid underestimation
- **Transparency marking**: Flag estimated entries for TCFD reporting transparency

### Outputs
- **Complete portfolio dataset**: All missing fields populated with actual data or proxy estimates
- **Assumptions Register**: Detailed log of proxies and assumptions for assurance/disclosure
- **Updated quality scores**: PCAF scores adjusted (proxies = grade 4-5, reported data = 1-3)

---

## Sub-process 2.3: Data Verification and Sign-off

### Inputs
#### Internal Stakeholders:
- **Complete dataset** and assumptions register from Sub-process 2.2
- **Middle Office**: Investment values and financial figures alignment verification
- **Climate Solutions team**: Proxy application methodology validation
- **Group Climate team**: Regulatory requirements and disclosure compliance review

#### External Sources (Optional):
- **Issuer engagement portals**: Counterparty validation for major holdings
- **Benchmark comparisons**: Peer asset manager footprint comparisons

### Processing Logic - Multi-Team Validation:

#### Review and Critic Agents (Asynchronous)

**1. Climate Solutions Team/Agent:**
- Validate technical aspects (emissions data and proxies)
- Ensure PCAF standards compliance
- Verify appropriate data quality score assignment

**2. Middle Office Team/Agent:**
- Confirm financial attributes match official books
- Reconcile any valuation date discrepancies
- Verify amounts and ownership percentages

**3. Institutional Retirement Reporting Team/Agent:**
- Verify dataset scope matches intended reporting scope
- Ensure proper aggregation capabilities for institutional-level disclosure
- Confirm all relevant assets included exactly once

**4. Group Climate Team/Agent:**
- Check against regulatory expectations (TCFD year-on-year requirements)
- Verify data quality and methodology documentation
- Ensure scenario analysis consistency

#### Feedback Integration:
- **Proxy refinement**: Address high-level proxy concerns
- **Classification adjustments**: Modify asset classifications as needed
- **Documentation updates**: Enhance methodology explanations

### Outputs
- **Validated and approved dataset**: Final input for emissions calculations with stakeholder sign-off
- **Finalized assumptions log**: Complete proxy and assumption documentation
- **Data quality summary**: Portfolio coverage metrics ("% based on reported vs estimated data")
- **Governance documentation**: Multi-team sign-off records for audit trail

---

## Key Features of Data Validation Agents

### Quality Assurance Framework
- **PCAF methodology compliance**: Full adherence to Partnership for Carbon Accounting Financials standards
- **Multi-source verification**: Cross-checking against multiple data providers
- **Statistical validation**: Outlier detection and peer benchmarking

### Advanced Processing Capabilities
- **Automated anomaly detection**: Algorithm-driven identification of data inconsistencies
- **Intelligent proxy application**: Context-aware estimation using sector and regional factors
- **Conservative bias**: Risk-aware approach to uncertainty handling

### Governance Integration
- **Multi-stakeholder review**: Four distinct team validations with specific expertise areas
- **Audit trail maintenance**: Comprehensive documentation for regulatory compliance
- **Human-in-the-loop validation**: Strategic intervention points for critical decisions

### Regulatory Alignment
- **TCFD compliance**: Transparency requirements for estimated vs reported data
- **PCAF scoring**: Standardized quality grading (1-5 scale)
- **Documentation standards**: Assumption registers and methodology papers for external assurance

---

## Implementation Notes

This comprehensive data validation framework ensures **95%+ data quality** with full traceability and regulatory compliance, preparing validated datasets for accurate PCAF Category 15 financed emissions calculations.

### Technical Architecture
- **Sequential processing**: Three sub-processes executed in order
- **Parallel validation**: Multiple stakeholder teams review simultaneously in Sub-process 2.3
- **Asynchronous design**: Human-in-the-loop processes don't block automated workflows
- **Quality gates**: Each sub-process has clear acceptance criteria before proceeding

### Integration Points
- **Input**: Consolidated portfolio dataset from Data Acquisition Agents
- **Output**: Validated, complete dataset for Emission Calculation Agents
- **Dependencies**: Climate Solutions team methodologies, regulatory frameworks
- **Governance**: Multi-team sign-off process with audit trail documentation

---

*Extracted from: ESG-Scope-3-Workflow-Mapping-and-Agentic-AI-Functional-Architecture.txt*  
*Document Date: July 2025*  
*Analysis Date: August 27, 2025*
