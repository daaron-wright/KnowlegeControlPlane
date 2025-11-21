# ESG Scope 3 Emission Calculation Methodology

This document contains the extracted emission calculation methodology from the ESG Scope 3 Workflow Mapping and Agentic AI Functional Architecture.

## Scope 3 as Part of ESRS Regulatory Reporting Workflow 4 of 6
### Level 0: Emission Calculation

| Level 1 | Level 2 | Inputs | Outputs | Data & Business Logic | Illustrative Data Feeds |
|---------|---------|--------|---------|----------------------|------------------------|
| **Apply Emission Factors** | Map activities to EF | - Validated activity data<br>- EF library<br>- PCAF logic for Scope 3 Category 15 | Emissions by activity line item | Select EF by activity type, region, material; apply formula:<br>**Emissions = Activity × EF** | - DEFRA/Ecoinvent EF table |
| **Category Aggregation** | Aggregate to ESRS categories | - Emissions by activity<br>- PCAF logic for Scope 3 Category 15 | Emissions by GHG Protocol category & ESRS E1 | Sum emissions by category, reconcile totals, separate CO₂, CH₄, N₂O, other gases | - Aggregation ruleset |

## 3. Emission Calculation Agents

### Sub-process 3.1: Calculate Emissions for Corporate Bonds

**Inputs:**
- Internal data sources: inputs come directly from the validated dataset of Phase 2

**Processing Logic:**
- For corporate bonds and listed equity holdings we have: the investment value (e.g. amount of bond holding), the enterprise value (EVIC) of the issuer, and the issuer's GHG emissions (Scope 1 and 2). These inputs come directly from the validated dataset of Phase 2
- **Method & Processing Logic:** We apply the PCAF attributed emissions formula. For each corporate issuer:

  ```
  Financed Emissions = (Investment Value / Enterprise Value Including Cash) × Company Emissions
  ```

- For example, if we own 1% of a company (by value), we assume responsibility for 1% of that company's emissions
- We ensure to use the same emissions figure for the company whether we hold equity or debt, to avoid double counting. If the firm has multiple securities in the portfolio (e.g., we hold both bond and equity of Company X), we calculate emissions for each holding and then sum them – effectively still getting (bond value + equity value)/EV * emissions, which is total exposure fraction times emissions (same result as if done once combined). We need to be careful not to count the company twice in aggregate results.
- If any company emissions include Scope 3 (not typical unless explicitly intended), we would handle them separately to avoid mixing scopes. In general, we stick to Scope 1 and 2 for the financed emissions footprint as per common practice. However, in this case L&G wants to see Scope 3 in the final output
- For sovereign bonds (not explicitly mentioned, but if any government bonds were present, PCAF has a different method. For this mock up
- The calculation is performed programmatically for all relevant rows. After computing each, we sum up emissions by issuer, by sector, etc., as needed.

**Outputs:**
- Financed emissions for each corporate issuer investment, typically expressed in tons CO₂e.
- We can aggregate these at various levels for reporting: e.g., total financed emissions from corporate bonds, total from listed equities (if any), and combined. We also compute an emissions intensity metric for this segment, such as tons CO₂e per £ million invested, to facilitate comparisons and to meet any disclosure requirement for intensity. For instance, if our total financed emissions in this category is 50,000 tCO₂e on £5,000M invested, the intensity is 10 tCO₂e/£m. Another metric is Weighted Average Carbon Intensity (WACI), but that's a different calculation (often required by TCFD, but WACI uses emissions/ revenue weighted by portfolio weight – which could be computed separately if needed). The primary output is absolute emissions

### Sub-process 3.2: Calculate Emissions for Real Estate Equity

**Inputs:**
- Internal data sources: inputs come directly from the validated dataset of Phase 2

**Processing Logic:**
- For each property asset, we have either actual operational emissions data or an estimated emissions figure (from Phase 2, likely calculated via energy use or proxy). We also have our ownership share in the asset (often 100% if wholly owned, or some percentage if co-owned). In lieu of EVIC (since a building isn't a company with debt/equity split in the same way), the attribution factor is the ownership percentage or financed fraction of the asset's value.
- **Method & Processing Logic:** Formally, for each property p:

  ```
  Financed Emissions = Ownership Share × Property Emissions
  ```

- The Property Emissions would ideally be the sum of Scope 1 and 2 emissions from building operations (e.g., fuel combustion on-site, purchased electricity) over a year. We ensure those emissions are either measured (from utility data, fuel usage) or estimated via the proxies applied earlier. If properties are held via a property company or fund structure, but essentially we have look-through to the asset, we use the same approach.
- For each property, if we had to compute emissions via energy, we do: Energy use (kWh) × carbon factor (kgCO₂e/kWh) for each energy type, summing to total tCO₂e3. (This would have been done in data acquisition or validation step for proxies; here we just use the result).
- No additional financial factor like EVIC is needed since we're directly allocating by ownership. The "investment value" in a sense is proportional to ownership anyway. If needed, we could also check consistency by taking (our investment value / property value) as the fraction – it should equal our ownership share. If not, that implies perhaps leverage on the property; however, since we are equity owners, PCAF would treat it as if we finance that share of emissions fully.
- We aggregate emissions across all real estate assets

**Outputs:**
- Financed emissions for each real estate investment, typically expressed in tons CO₂e.
- Financed emissions from real estate portfolio (tCO₂e). This could be broken down by property or summed. Likely we'll report an aggregate figure for real estate investments. Additional outputs might include the breakdown by type of emissions (e.g., electricity vs gas usage contributions) if needed internally, and an intensity metric like kg CO₂e per square meter across the portfolio to align with any real estate benchmarks
- for external disclosure, usually the total financed emissions attributed to real estate holdings is the key number. We again record the PCAF data quality (perhaps many property emissions might be estimated if direct data was unavailable). If any properties were only partially owned, that is already

### Sub-process 3.3: Calculate Emissions for Infrastructure Equity

**Inputs:**
- Internal data sources: inputs come directly from the validated dataset of Phase 2

**Processing Logic:**
- For each project, we should have an emissions figure (either reported by the project operator or estimated via proxies, depending on data availability from Phase 2) and our ownership percentage or share of financing. If the infrastructure investment is through a fund, we may have to look through to underlying projects proportionally.
- **Method & Processing Logic:** PCAF's project finance methodology is similar to bonds : allocate based on share of total project cost financed. For each project j:

  ```
  Financed Emissions = (Share of Project Financing / Total Project Cost) × Project Emissions
  ```

- This mirrors the approach for real estate, using share of equity or loan in the project as attribution. If we provided, say, 20% of the capital for an infrastructure project, we take responsibility for 20% of its annual emissions.
- Project Emissions should cover operational emissions of the infrastructure. For example, if it's a renewable energy project, operational emissions might be low (mostly maintenance vehicles, etc.), whereas a transportation infrastructure (like a toll road) might have more significant operational footprint (energy use for lighting, etc.). If it's a power generation project (e.g., a gas power plant), the combustion emissions would be the major contributor. We use whatever data is available; if none, we use industry proxy (like emissions per MW for similar plants, etc.).
- Ensure that any debt vs equity distinction in project finance is considered: if our investment is equity and the project also has loans, PCAF would still have us count our portion of emissions based on total project value financed. In practice, since we're likely calculating for "infrastructure equity", we assume equity share as the proportion. (If there were project loans we provided, it would be similar calculation treating loan as part of financing).
- Compute for each project and sum up.

**Outputs:**
- Financed emissions for each infrastructure equity investment (project finance), typically expressed in tons CO₂e
- Financed emissions from infrastructure investments (tCO₂e). Again, aggregated as needed (total for this category). We might also note project-level results internally, especially if we want to identify high emission projects vs low (e.g., a list: Project A – 1,000 tCO₂e, Project B – 0 tCO₂e if it's a wind farm, etc.). This could feed into future strategy (which projects to decarbonise)
- For reporting, likely the total figure is disclosed, possibly with qualitative commentary on the nature of those assets. Intensity metrics here are less

## Key Formulas Summary

### Corporate Bonds/Listed Equity:
```
Financed Emissions = (Investment Value / Enterprise Value Including Cash) × Company Emissions
```

### Real Estate Equity:
```
Financed Emissions = Ownership Share × Property Emissions
```

### Infrastructure Equity:
```
Financed Emissions = (Share of Project Financing / Total Project Cost) × Project Emissions
```

### Energy-based Emissions Calculation:
```
Emissions = Energy Use (kWh) × Carbon Factor (kgCO₂e/kWh)
```

### General Emission Factor Application:
```
Emissions = Activity × Emission Factor
```

## Emission Calculation Agents in Agentic AI Design

**Data Acquisition Agents:** Handle ERP/API integrations, interface to supplier portals etc
**Data Validation Agents:** Run harmonisation, QA, anomaly detection
**Emission Calculation Agents:** Map to Emission Factors (EFs), perform category aggregation
**Assurance Agents:** Compile evidence packs, track lineage
**Reporting Agents:** Format, tag, and publish disclosure
