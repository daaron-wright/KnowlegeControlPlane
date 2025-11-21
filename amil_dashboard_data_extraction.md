# AMIL Excel File - Data Extraction from ESG Dashboard

Based on the ESG chat response dashboard and analysis data, here is the comprehensive data that can be used to fill in the AMIL Excel file requirements.

## Portfolio Overview
- **Total Portfolio Value**: $46,000,000
- **Total Emissions**: 2,507.2 tCO₂e
- **Number of Assets**: 4 (from dashboard) + 19 assets (from CSV analysis)
- **Analysis Date**: 2025-08-27

## Sheet 1: Bond Holdings

### From Dashboard Data (4 Assets)
| Issuer Name | Internal ID | ISIN | Investment Value | Sector | Geography | Data Quality | PCAF Category |
|-------------|-------------|------|------------------|--------|-----------|--------------|---------------|
| Infrastructure Bond B | IB001 | TBD | $12,300,000 | Infrastructure | TBD | Medium | Category 15 - Corporate Bonds |

### From CSV Analysis (14 Bond Assets)
| Investment Name | Internal ID | Sector | Investment Value | Carbon Intensity | WACI | Temp Alignment |
|-----------------|-------------|--------|------------------|------------------|------|----------------|
| Bond 1 | B001 | Energy | TBD | 188 tCO₂e/£m | 105 | 2.6°C |
| Bond 2 | B002 | Utilities | TBD | 185 tCO₂e/£m | 121 | 2.8°C |
| Bond 3 | B003 | Utilities | TBD | 185 tCO₂e/£m | 124 | 2.9°C |
| Bond 4 | B004 | Energy | TBD | 188 tCO₂e/£m | 104 | 2.5°C |
| Bond 5 | B005 | Energy | TBD | 188 tCO₂e/£m | 105 | 2.3°C |
| Bond 6 | B006 | Energy | TBD | 188 tCO₂e/£m | 106 | 2.6°C |
| Bond 7 | B007 | Materials | TBD | 270 tCO₂e/£m | 105 | 2.6°C |
| Bond 8 | B008 | Materials | TBD | 270 tCO₂e/£m | 109 | 2.5°C |
| Bond 9 | B009 | Materials | TBD | 270 tCO₂e/£m | 109 | 2.4°C |
| Bond 10 | B010 | Materials | TBD | 270 tCO₂e/£m | 111 | 2.4°C |
| Bond 11 | B011 | Government | TBD | 82 tCO₂e/£m | 99 | 2.2°C |
| Bond 12 | B012 | Government | TBD | 82 tCO₂e/£m | 98 | 2.5°C |
| Bond 13 | B013 | Government | TBD | 82 tCO₂e/£m | 105 | 2.2°C |
| Bond 14 | B014 | Government | TBD | 82 tCO₂e/£m | 104 | 2.5°C |

## Sheet 2: Real Estate Equity Holdings

### From Dashboard Data (1 Asset)
| Asset Name | Internal ID | Investment Value | Sector | Data Quality | PCAF Category | Emissions |
|------------|-------------|------------------|--------|--------------|---------------|-----------|
| Real Estate Portfolio C | RE001 | $15,600,000 | Commercial Property | High | Category 15 - Real Estate | 1,234.8 tCO₂e |

### From CSV Analysis (3 Assets)
| Investment Name | Internal ID | Sector | Carbon Intensity | WACI | Temp Alignment |
|-----------------|-------------|--------|------------------|------|----------------|
| Real Estate Asset 1 | RE002 | Materials | 270 tCO₂e/£m | 106 | 2.1°C |
| Real Estate Asset 2 | RE003 | Materials | 270 tCO₂e/£m | 110 | 2.4°C |
| Real Estate Asset 3 | RE004 | Government | 82 tCO₂e/£m | 97 | 2.5°C |

## Sheet 3: Infrastructure Equity Holdings

### From CSV Analysis (2 Assets)
| Investment Name | Internal ID | Sector | Asset Class | Carbon Intensity | WACI | Temp Alignment |
|-----------------|-------------|--------|-------------|------------------|------|----------------|
| Infrastructure 1 | IF001 | Energy | Infrastructure (Project Finance) | 188 tCO₂e/£m | 112 | 2.4°C |
| Infrastructure 2 | IF002 | Energy | Infrastructure (Project Finance) | 188 tCO₂e/£m | 107 | 2.5°C |

## Additional Assets from Dashboard

### Listed Equity Holdings
| Investment Name | Internal ID | Investment Value | Sector | Data Quality | PCAF Category | Emissions |
|-----------------|-------------|------------------|--------|--------------|---------------|-----------|
| Green Energy Fund A | LE001 | $8,500,000 | Renewable Energy | High | Category 15 - Listed Equity | 145.2 tCO₂e |
| Tech Growth Fund D | LE002 | $9,400,000 | Technology | High | Category 15 - Listed Equity | 234.7 tCO₂e |

## Data Quality Sources

From the dashboard analysis, the following data sources are available:

| Data Source | Quality | Coverage | Last Updated | Status |
|-------------|---------|----------|--------------|--------|
| Internal Portfolio DB | High | 95% | 2025-08-25 | Active |
| CDP Climate Data | Medium | 78% | 2025-08-20 | SME data gaps |
| Bloomberg ESG | High | 85% | 2025-08-24 | Limited Scope 3 |
| Refinitiv ESG | Medium | 72% | 2025-08-22 | Data lag issues |
| Annual Reports | Low | 45% | 2025-07-15 | Manual extraction |

## Calculated Metrics Available

### Portfolio Level
- **Total Portfolio Value**: $46,000,000
- **Total Emissions**: 2,507.2 tCO₂e (180 tCO₂e from CSV analysis)
- **Portfolio Carbon Intensity**: 42 tCO₂e/£m (vs L&G existing: 49)
- **Weighted Average Carbon Intensity**: 105 (vs L&G existing: 117)
- **Temperature Alignment**: 2.5°C (vs L&G existing: 2.8°C)

### Asset Class Performance
- **Bonds Carbon Intensity**: 52 tCO₂e/£m (vs L&G: 55, vs Benchmark: 57)
- **Real Estate Carbon Intensity**: 7 tCO₂e/£m (vs L&G: 9, vs Benchmark: 6)
- **Infrastructure Carbon Intensity**: 1 tCO₂e/£m (vs L&G: 1, vs Benchmark: 2)

### Sector Analysis
- **Utilities**: 185 tCO₂e/£m (vs L&G: 158)
- **Energy**: 188 tCO₂e/£m (vs L&G: 192)
- **Materials**: 270 tCO₂e/£m (vs L&G: 290)
- **Government**: 82 tCO₂e/£m (vs L&G: 83)

## Missing Data Elements for Complete Excel File

To complete the AMIL Excel file, the following data elements need to be added:

### Required but Missing
1. **ISINs** for all bond holdings
2. **Property IDs** for real estate assets
3. **External IDs** for infrastructure projects
4. **Specific Investment Values** for CSV assets (currently only have intensities)
5. **Ownership Stakes** for all assets
6. **Physical Locations** for real estate and infrastructure
7. **Asset Properties** (size, capacity, specifications)
8. **Utilization Rates** for real estate and infrastructure
9. **Green Design Ratings** for real estate
10. **Website URLs** for issuers and operators
11. **Outstanding Amounts** for bonds (needed for EVIC calculation)

### Can be Estimated/Derived
1. **Geography** from sector and issuer analysis
2. **Internal Classifications** from existing sector data
3. **Investment Values** proportional to portfolio allocation

## Recommended Approach

1. **Use Dashboard Data** as the foundation (4 primary assets with detailed financial data)
2. **Supplement with CSV Analysis** for additional 19 assets
3. **Generate Missing Identifiers** using systematic naming conventions
4. **Estimate Investment Values** based on sector and asset class distributions
5. **Add Realistic Mock Data** for physical properties and operational metrics
6. **Maintain Data Consistency** with existing quality assessments and PCAF categories

This approach provides a comprehensive dataset that supports all three emission calculation sub-processes while maintaining realistic and internally consistent data relationships.
