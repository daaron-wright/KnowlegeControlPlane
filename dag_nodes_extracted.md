# DAG Nodes - Complete List

This document contains all the DAG node names extracted from the various workflow visualizations in the ESG demo application.

## ESG Scope 3 Emissions Workflow (22-Step Process)

### Stage 0: Intent Parsing
- **Q0** - Parse ESG Query

### Stage 1A: Sub Process 1.1 - Portfolio Data Collection
- **D1A** - Collect Portfolio Data - Investments Under Consideration
- **D1B** - Collect Portfolio Data - Internal Guidance
- **D1C** - Merge Investments with Guidance

### Stage 1B: Sub Process 1.2 - Carbon & Financial Data (6-way Parallel)
- **D2A** - Internal - Climate Solution
- **D2B** - External Primary - Reported Emissions
- **D2C** - External Primary - Supply Chain
- **D2D** - External Secondary - Emission Factors
- **D2E** - External Secondary - Grid Energy
- **D2F** - External Secondary - Benchmarks
- **D2G** - Merge Carbon & Financial Data

### Stage 1C: Sub Process 1.3 - Final Data Merging
- **D3** - Merge Portfolio Data

### Stage 3: Enhanced Data Validation

#### Sub-process 2.1: Data Completeness and Accuracy Audit
- **S1A** - Get Internal Data for Validation
- **S1B** - Get External Data for Validation
- **V2** - Identify Anomalies and Inconsistencies
- **V3** - Compare Against Expectations
- **S4** - Produce Data Quality Report

#### Sub-process 2.2: Apply Proxy Data & Assumptions
- **S5** - Estimate, Impute and Correct

#### Sub-process 2.3: Data Verification and Sign-off
- **S6A** - Climate Solutions Team Review
- **S6B** - Middle Office Team Review
- **S6C** - Institutional Reporting Team Review
- **S6D** - Group Climate Team Review
- **S6E** - Consolidate Validation Results

### Stage 4: Emission Calculations (Parallel)
- **S7** - Financed Emissions Calculation
- **S8** - Sectoral Analysis & Breakdown
- **S9** - Climate Risk Assessment

### Stage 5: Reporting (Sequential)
- **S10** - Compile Evidence Pack
- **S11** - Disclosure Preparation
- **S12** - Integration into Annual Report

### Completion Milestone
- **COMPLETE** - Emissions Workflow Complete

## Healthcare/Government Response Workflow

### Intent Parsing
- **Q0** - Parse User Query

### Data Collection
- **A1** - Health Data Warehouse (Internal)
- **A2** - External Public Health APIs
- **A3** - Economic Development Database
- **A4** - Emergency Services Database
- **A5** - Municipality Data Portal
- **A6** - Weather & Environmental Data
- **A7** - Healthcare Provider Network

### Data Processing
- **B1** - Health Data Aggregation
- **B2** - Environmental Analysis
- **B3** - Economic Impact Analysis
- **B4** - Emergency Response Analysis
- **B5** - Public Health Metrics
- **B6** - Resource Allocation Analysis

### Analysis & Insights
- **C1** - Trend Analysis
- **C2** - Anomaly Detection
- **C3** - Correlation Analysis
- **C4** - Predictive Modeling
- **C5** - Risk Assessment
- **C6** - Resource Planning

### Visualization & Communication
- **D1** - Dashboard Generation
- **D2** - Report Generation
- **D3** - Alert System
- **D4** - Stakeholder Notification
- **D5** - Media Communication
- **D6** - Public Information Portal

### Output & Completion
- **E1** - Final Report
- **COMPLETE** - Workflow Complete

## Back-to-School Retail Analytics Workflow

### Intent & Customer Analysis
- **P1** - Parse User Prompt
- **C1** - Emily Customer Profile Analysis
- **C2** - Back-to-School Segment Analysis
- **C3** - Customer Journey Mapping

### Data Sources (Cloud & On-Premise)
- **D1** - Salesforce Customer Data
- **D2** - Adobe Analytics Behavioral Data
- **D3** - Zendesk Support Ticket Analysis
- **D4** - Order Management System
- **D5** - Inventory Management System
- **D6** - Email Marketing Platform

### Analytics & Insights
- **A1** - Purchase Pattern Analysis
- **A2** - WISMO Trend Analysis
- **A3** - Product Affinity Analysis
- **A4** - Customer Lifetime Value Analysis
- **A5** - Support Ticket Sentiment Analysis

### ML Models & Optimization
- **M1** - Attach Rate Prediction Model
- **M2** - Customer Churn Risk Model
- **M3** - Product Recommendation Engine
- **M4** - Dynamic Pricing Model
- **O1** - Campaign Optimization
- **O2** - Inventory Optimization

### Campaign Execution
- **X1** - Personalized Email Campaigns
- **X2** - Product Bundle Recommendations
- **X3** - Proactive Customer Service
- **X4** - Dynamic Website Personalization

### Visualization & Reporting
- **V1** - Real-time Dashboard
- **V2** - Performance Analytics
- **V3** - ROI Measurement
- **N1** - Stakeholder Notifications

### Completion
- **COMPLETE** - Campaign Optimization Complete

## Isuzu Productivity & Sustainability Workflow

### Intent & Vehicle Analysis
- **Q0** - Parse Productivity Query
- **V1** - Isuzu Vehicle Specifications
- **V2** - Performance Benchmarking
- **V3** - Sustainability Metrics

### Data Collection
- **D1** - Vehicle Telemetry Data
- **D2** - Fuel Efficiency Monitoring
- **D3** - Maintenance Records
- **D4** - Driver Behavior Analysis
- **D5** - Route Optimization Data
- **D6** - Environmental Impact Data

### Analytics & Processing
- **A1** - Productivity Analysis
- **A2** - Fuel Consumption Analysis
- **A3** - Emission Tracking
- **A4** - Cost-Benefit Analysis
- **A5** - Performance Optimization

### Insights & Recommendations
- **I1** - Efficiency Recommendations
- **I2** - Maintenance Scheduling
- **I3** - Driver Training Insights
- **I4** - Route Optimization
- **I5** - Sustainability Reporting

### Output & Reporting
- **R1** - Performance Dashboard
- **R2** - Sustainability Report
- **R3** - Cost Analysis Report
- **COMPLETE** - Analysis Complete

## Node Types by Function

### Intent/Query Parsing Nodes
- Q0, P1 (Various workflows)

### Data Acquisition Nodes
- D1A, D1B, D1C, D2A-D2G, D3 (ESG)
- A1-A7 (Healthcare)
- D1-D6 (Retail)
- D1-D6 (Isuzu)

### Validation/Quality Nodes
- S1A, S1B, V2, V3, S4, S5 (ESG)
- B1-B6 (Healthcare processing)

### Analysis/Calculation Nodes
- S7, S8, S9 (ESG calculations)
- C1-C6 (Healthcare analysis)
- A1-A5, M1-M4 (Retail analytics)
- A1-A5 (Isuzu analytics)

### Review/Assurance Nodes
- S6A, S6B, S6C, S6D, S6E (ESG reviews)

### Reporting/Output Nodes
- S10, S11, S12 (ESG reporting)
- D1-D6, E1 (Healthcare communication)
- V1-V3, N1 (Retail visualization)
- R1-R3 (Isuzu reporting)

### Completion Nodes
- COMPLETE (All workflows)

## Total Node Count by Workflow
- **ESG Scope 3 Emissions**: 30 nodes (22-step enhanced process)
- **Healthcare/Government Response**: 26 nodes
- **Back-to-School Retail**: 25 nodes  
- **Isuzu Productivity**: 20 nodes

**Total Unique Nodes Across All Workflows**: ~101 nodes
