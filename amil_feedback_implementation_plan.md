# Amil Dashboard Feedback - Implementation Plan

## Overview
This document outlines the implementation requirements based on Amil's feedback for the ESG dashboard. The dashboard needs two main sections with specific metrics, visualizations, and comparisons.

## Dashboard Structure

### Main Navigation
- **Tab 1:** Financed Emissions Analysis
- **Tab 2:** Data Quality Assessment

---

## 1. FINANCED EMISSIONS ANALYSIS

### Purpose
Compare calculated Financed Emissions from 18 dummy investments against:
- L&G's existing portfolio 
- External benchmarks

### Key Metrics to Compare
1. **Total emissions (tCO2e)**
2. **Emission intensity (tCO2e per £1m invested)**
3. **Weighted Average Carbon Intensity (WACI)**
4. **Implied portfolio temperature (°C)**

### Structure Required
- **Summary Dashboard** - Portfolio-level comparisons
- **Individual Breakdown** - Per 18 investments

---

### Summary Dashboard Requirements

#### 1. Total tCO2e Comparison
**Data Sources:** [L&G Climate Report 2024](https://group.legalandgeneral.com/media/1axftm2t/l-g-climate-and-nature-report-2024.pdf)

| Metric | L&G Portfolio | 18 Investments | Comparison |
|--------|---------------|----------------|------------|
| Total Scope 3 Carbon Footprint | 4,900,000 tCO2e | 180 tCO2e | Much smaller footprint |

**Visualization:** Scope 3 GHG Emissions Distribution pie chart (already implemented)

#### 2. Emission Intensity (tCO2e/£m)
**Data Sources:** [L&G AOA Targets 2025](https://group.legalandgeneral.com/media/idmbl4sh/legal-general-aoa-targets-2025.pdf)

| Metric | L&G Portfolio | 18 Investments | Performance |
|--------|---------------|----------------|-------------|
| Emission Intensity | 51 tCO2e/£m | 42 tCO2e/£m | 🟢 Greener (18% better) |
| Subset Asset Classes | 49 tCO2e/£m | 42 tCO2e/£m | 🟢 Greener |

**Context:** 2024 intensity for 74% of £97.6bn group proprietary assets

#### 3. WACI (Weighted Average Carbon Intensity)

| Metric | L&G Portfolio | 18 Investments | Performance |
|--------|---------------|----------------|-------------|
| WACI | 117 tCO2e/USD million revenues | 109 tCO2e/USD million revenues | 🟢 Greener (7% better) |

**Historical Context:**
| Year | WACI | GHG Emissions (million tCO2e) |
|------|------|-------------------------------|
| Historical | 169 | 6.7 |
| Previous | 151 | 6.2 |
| Recent | 117 | 4.9 |

#### 4. Implied Portfolio Temperature (°C)

| Metric | L&G Portfolio | 18 Investments | Performance |
|--------|---------------|----------------|-------------|
| Implied Temperature | 2.8°C | 2.5°C | 🟢 Better alignment (0.3°C improvement) |

**Visualizations Required:**
- Portfolio Temperature Measures over time (already implemented)
- 2024 Temperature Alignment comparison (already implemented)

**Target Commitments:**
| Scope Coverage | 2021 Baseline | 2024 Current | 2026 Target |
|----------------|---------------|---------------|-------------|
| Scopes 1 & 2 | 2.4°C | 2.5°C | 2.1°C |
| Scopes 1, 2 & 3 | 2.9°C | 2.8°C | 2.5°C |

---

### Asset Class & Sector Breakdown

#### Current L&G Portfolio Breakdown
| Asset Class | By Value % | Emissions Intensity | GHG Emissions (million tCO2e) | PCAF Quality |
|-------------|------------|---------------------|-------------------------------|--------------|
| Bonds | 90% | 55 | 4.7 | 2.3 |
| Property | 9% | 14 | 0.1 | 2.3 |
| Equity | 1% | 33 | 0.0 | 2.3 |
| **Total** | **100%** | **51** | **4.9** | **2.3** |

#### 18 Investments Comparison Strategy
**General Performance:** Lower emissions across most sectors
**Exception:** Utilities sector investments
- Proposed utilities: 185 vs existing average: 158
- **Decision Point:** Whether to invest or avoid these utilities investments

#### Required Comparisons
- Individual asset vs sector averages
- Individual asset vs asset class averages  
- 18 investments aggregate vs L&G portfolio
- 18 investments vs external benchmarks

---

### Individual Investment Breakdown

#### Table Requirements
**Current Names → New Names:**
- "Investment Holdings" → **"Financed Emissions - Asset Level"**
- "Emissions by Organisation" → **"Financed Emissions - Asset Level"**

#### Columns Required
- Investment Name
- Asset Class
- Sector
- Total Emissions (tCO2e)
- Emission Intensity (tCO2e/£m)
- WACI Score
- Implied Temperature (°C)
- Comparison vs Portfolio Average
- Comparison vs Sector Average
- Investment Decision Indicator

---

## 2. DATA QUALITY ASSESSMENT

### Purpose
Show data quality metrics, missing values, estimated data, and PCAF scores for the 18 investments analysis.

### Structure Required
- **Summary Dashboard** - Overall quality metrics
- **Individual Breakdown** - Per 18 investments

---

### Summary Dashboard Requirements

#### 1. PCAF Data Quality Score
| Metric | L&G Portfolio | 18 Investments | Reason |
|--------|---------------|----------------|---------|
| PCAF Score | 2.3 (better) | 2.6 (worse) | More estimates needed for direct investments |

**Context:** Lower scores are better. The 18 investments score worse because they require more estimation due to being direct investments with limited data availability.

#### 2. Performance Metrics Table
|  | 2023 | 2024 (constant EVIC) | 2024 |
|---------------------------|------|---------------------|------|
| Investment portfolio economic GHG emissions intensity | 56 | 54 | 51 |
| Reduction from 2023 - actual | NA | 4% | 9% |
| Reduction from 2019 - actual | 30% | 33% | 37% |
| Reduction from 2019 - target | NA | 18.50% | 18.50% |
| **PCAF Data Quality Score** | **2.5** | **NA** | **2.3** |
| Investment portfolio economic GHG emissions intensity ex-sovereigns | 52 | NA | 45 |
| Investment portfolio WACI (tCO2/$m revenues) | 127 | NA | 117 |

#### 3. Asset Class Quality Comparison
**18 Investments vs Portfolio:**
- Higher proportion of Property and Infrastructure Equity
- Higher relative value % in these asset classes
- Resulting in worse average PCAF score
- Lower emission intensity due to asset mix

#### 4. Data Sources Distribution
**Visualization:** Pie chart showing data source quality

| Source Type | Percentage | Quality Level |
|-------------|------------|---------------|
| Primary Sources | 60% | Highest |
| Secondary Sources | 25% | Medium |
| Estimated Data | 15% | Lowest |

---

### Individual Asset Quality Breakdown

#### Required Table: Asset-Level Data Quality
| Investment | PCAF Score | Primary Data % | Secondary Data % | Estimated Data % | Quality Notes |
|------------|------------|----------------|------------------|------------------|---------------|
| Asset 1 | 2.4 | 70% | 20% | 10% | Good coverage |
| Asset 2 | 2.8 | 45% | 30% | 25% | More estimates needed |
| ... | ... | ... | ... | ... | ... |

#### Data Quality Process Summary Table
| Process Stage | Failed Mappings | Successful Mappings | Anomalies Detected | Corrections Applied |
|---------------|-----------------|---------------------|-------------------|-------------------|
| Subprocess 1.3 Data Mapping | 12 | 156 | 8 | 8 |
| Subprocess 2.1 Validation | 5 | 163 | 15 | 12 |
| Subprocess 2.4 Imputation | 0 | 168 | 23 | 20 |
| **Total** | **17** | **487** | **46** | **40** |

**Examples of Corrections:**
- Missing revenue data: Estimated using industry averages
- Outlier emission factors: Validated against sector benchmarks  
- Incomplete scope coverage: Imputed using similar companies
- Currency conversion errors: Corrected using proper exchange rates

---

## Implementation Priority

### Phase 1: Core Structure
1. ✅ Two-tab navigation (Financed Emissions Analysis / Data Quality Assessment)
2. ✅ Summary dashboards for both sections
3. ✅ Key metric comparisons tables

### Phase 2: Visualizations  
1. ✅ Scope 3 emissions pie chart
2. ✅ Temperature measures charts with proper colors
3. ✅ Data quality sources pie chart
4. Asset class breakdown charts

### Phase 3: Detailed Breakdowns
1. Individual investment tables with renamed headers
2. Asset-level data quality tables
3. Process summary tables with examples

### Phase 4: Decision Support
1. Investment recommendation indicators
2. Sector comparison highlights
3. Utilities investment decision framework

---

## Technical Notes

### Color Schemes Used
- **Red (#FF0000):** L&G values
- **Blue (#0000FF):** Benchmark/comparison values  
- **Green (#00AA00):** Third data series
- **Charts:** Non-overlapping bars with distinct positioning

### Data Sources Referenced
1. [L&G Climate and Nature Report 2024](https://group.legalandgeneral.com/media/1axftm2t/l-g-climate-and-nature-report-2024.pdf)
2. [L&G AOA Targets 2025](https://group.legalandgeneral.com/media/idmbl4sh/legal-general-aoa-targets-2025.pdf)

### Key Narrative
The 18 investments generally perform better than the existing portfolio (greener, lower emissions, better temperature alignment) except for some Utilities sector investments that create decision points for investment committees.
