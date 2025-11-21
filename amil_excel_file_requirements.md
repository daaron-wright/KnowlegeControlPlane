# AMIL Excel File Requirements

This document outlines the requirements for the AMIL dummy user Excel file based on internal data sources specification for ESG Scope 3 emission calculations.

## Overview

The Excel file should contain **three main asset classes** with their respective data columns to support PCAF Category 15 methodology and enable the three emission calculation sub-processes (3.1, 3.2, 3.3).

## File Structure

### 1. Bond Holdings

**Required Columns:**
- **Issuer Name** - Name of the bond issuer company
- **Internal ID** - Internal unique identifier 
- **ISIN** - International Securities Identification Number
- **Investment Value** - Amount invested in the bond
- **Outstanding Amount** - Total bond amount outstanding
- **Ownership Stake** - Percentage or fraction owned
- **Sector Classification** - Industry sector (e.g., Energy, Finance, Technology)
- **Geography** - Country/region of issuer
- **Issuer Website** - Company website URL

### 2. Real Estate Equity Holdings

**Required Columns:**
- **Asset Name** - Property or real estate asset name
- **Internal ID** - Internal unique identifier
- **Property ID** - External property identification
- **Investment Value** - Amount invested in the property
- **Ownership Stake** - Percentage ownership
- **Location** - Physical address/location of property
- **Property Size** - Square footage/meters
- **Utilization** - Occupancy rate or usage type
- **Green Design Rating** - Environmental certification (BREEAM, LEED, etc.)
- **Sector Classification** - Property type (Office, Retail, Industrial, etc.)
- **Geography** - Country/region
- **Operator Website** - Property management company website

### 3. Infrastructure Equity Holdings

**Required Columns:**
- **Asset Name** - Infrastructure project name
- **Internal ID** - Internal unique identifier
- **External ID** - External project identifier
- **Investment Value** - Amount invested in project
- **Ownership Stake** - Percentage ownership or financing share
- **Location** - Physical location of infrastructure
- **Asset Properties** - Project specifications (capacity, type, etc.)
- **Utilization** - Capacity utilization or operational status
- **Sector Classification** - Infrastructure type (Energy, Transport, Utilities, etc.)
- **Geography** - Country/region
- **Operator Website** - Operating company website

## Sample Excel Structure

### Sheet 1: Bond Holdings
```
| Issuer Name | Internal ID | ISIN | Investment Value | Outstanding Amount | Ownership Stake | Sector | Geography | Issuer Website |
|-------------|-------------|------|------------------|-------------------|----------------|--------|-----------|---------------|
| Example Corp| BC001       | GB123| £1,000,000      | £50,000,000       | 2.0%           | Energy | UK        | www.example.com|
```

### Sheet 2: Real Estate Equity
```
| Asset Name | Internal ID | Property ID | Investment Value | Ownership Stake | Location | Size | Utilization | Green Rating | Sector | Geography | Operator Website |
|------------|-------------|-------------|------------------|----------------|----------|------|-------------|--------------|--------|-----------|------------------|
| Office Tower| RE001      | PROP123     | £2,000,000      | 100%           | London   |10000m²| 85%        | BREEAM A     | Office | UK        | www.propco.com   |
```

### Sheet 3: Infrastructure Equity
```
| Asset Name | Internal ID | External ID | Investment Value | Ownership Stake | Location | Asset Properties | Utilization | Sector | Geography | Operator Website |
|------------|-------------|-------------|------------------|----------------|----------|------------------|-------------|--------|-----------|------------------|
| Wind Farm  | IF001       | WF456       | £5,000,000      | 50%            | Scotland | 100MW Capacity   | 90%         | Energy | UK        | www.windenergy.com|
```

## Key Data Requirements

### Financial Data
- Investment values must be in consistent currency
- Ownership stakes as percentages (0-100%) or decimals (0-1)
- Outstanding amounts for bonds to calculate EVIC attribution

### Identification Data
- Unique identifiers for data validation and matching
- ISINs for bonds enable external data sourcing
- Property/project IDs for real estate and infrastructure tracking

### Classification Data
- Sector classifications enable emission factor mapping
- Geography enables regional emission factor application
- Asset properties support proxy calculation methods

### Operational Data
- Utilization rates for energy consumption estimates
- Size metrics for per-unit emission calculations
- Green ratings for emission reduction factors

## Integration with PCAF Methodology

This structure supports:

1. **Sub-process 3.1 (Corporate Bonds)**: EVIC-based attribution using investment value and outstanding amounts
2. **Sub-process 3.2 (Real Estate)**: Ownership-based attribution using ownership stakes and property data
3. **Sub-process 3.3 (Infrastructure)**: Project finance attribution using ownership stakes and project specifications

## Data Quality Considerations

- **Completeness**: All required fields should be populated
- **Consistency**: Use standardized formats for dates, currencies, and percentages
- **Accuracy**: Validate financial figures and ownership percentages
- **Traceability**: Maintain clear links between internal and external identifiers
- **Currency**: Ensure all financial values are in the same currency (preferably GBP for L&G)

## File Format Requirements

- **Format**: Excel (.xlsx) or CSV format
- **Encoding**: UTF-8 to support international characters
- **Date Format**: ISO 8601 (YYYY-MM-DD) for consistency
- **Currency Format**: Numerical values without currency symbols (specify currency in metadata)
- **Percentage Format**: Decimal format (e.g., 0.25 for 25%) or percentage format consistently applied

This structure enables comprehensive ESG Scope 3 emission calculations while maintaining data quality and supporting regulatory reporting requirements.
