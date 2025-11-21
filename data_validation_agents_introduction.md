### Data validation agents 
Sub-process 2.1: Data completeness and accuracy audit

Inputs
0. Internal data sources - The consolidated dataset from Process 1
1 ‘Get Internal Data for Validation, Imputation and Estimation’ 
1. Internal data sources - Middle Office Team DB:  Financial figures for a cross-check that the sum of all bond positions’ values matches known totals etc
1 Internal data sources - Reporting Team  DB: Leverage last year’s disclosed data or baseline for comparison
1Internal data sources - Climate Solutions Team DB:  An internal database of known issues or last-known emissions for certain entities

1 ‘Get External Data for Validation, Imputation and Estimation’ 
1. External data sources - CDP, Bloomberg, Refinitiv etc: Alternative or secondary data sources for verification. i.e. if primary emissions data came from one vendor, we want to spot-check a few large issuers against another source (like checking a company’s annual report or CDP report for the reported emissions). Also, the agent will use publicly available data for sanity checks (e.g., if a company’s revenue is known, is the emissions figure roughly plausible for that industry?)

Processing Logic: Perform a systematic QA sweep:
2. ‘Identify Anomalies and Inconsistencies’
Identify any missing data fields: Any investment with blank emissions or missing EVIC or other needed input is catalogued (for example, “Property 123 – missing emissions data”)
2. Check for outliers or anomalies: Extremely high or low emission intensities (tCO₂e / £ invested) compared to peers. If a bond position in a small company shows an unusually large emission number, flag it for review - it could indicate a data error or a mismatch
2. Ensure consistency: If the same company appears multiple times (perhaps in bonds), verify that the emissions and EVIC data are identical for each instance (avoid duplication or divergence in data for the same entity). Also verify the currency and units alignment (no mixing of CO₂ scopes or units).

‘3. ‘Compare against expectation’ 
3 Compare aggregated figures with expectations: Compute a preliminary sum of emissions using available data to see if it’s in a reasonable range given known industry benchmarks.
‘Produce DQ report’ 

4 Document findings in a data quality report: Lists issues like missing values, anomalies, and preliminary data quality score. (Using PCAF’s scoring scheme, data from company disclosures = high quality, proxies = lower quality etc)

Outputs: 
Output from 4 A list of data issues that need resolving (e.g. 10 investments with missing emissions, 2 outliers to double-check etc) 
Output from 4 An initial data quality assessment for each data point (possibly tagging each investment’s emissions data with PCAF quality grade 1-5)
Output from 4 Also, an updated dataset where obvious errors have been corrected (if any minor fixes can be done immediately, like correcting a unit error). This sub-process sets the stage for targeted proxy data application and final confirmation

Sub-process 2.2: Apply proxy data & assumptions

Inputs
1 ‘Get Internal Data for Validation, Imputation and Estimation’ 
1. Internal data source - Climate Solutions: Guidance documents or tools from the Climate Solutions team on how to handle missing data. This may include an internal ’Proxy Methodology Paper’ that outlines accepted approaches (for example: “if a company’s emissions are missing, use the sector average emissions per revenue multiplied by the company’s revenue). Also, the team itself, which can generate proxy values using their models
1. Internal data source - Group Climate: Obtain have preferences based on regulatory expectations - e.g., to use conservative estimates or to disclose certain assumptions explicitly
1 ‘Get External Data for Validation, Imputation and Estimation’ 
1. External data sources - IEA, industry-average emission factors: Other secondary data identified in Phase 1 (energy benchmarks, sector intensity values, regional grids carbon intensity for power consumption, etc.). For example, if a property’s actual energy usage is unknown, use average energy usage per square meter for that building type and local grid emission factor to estimate its emissions. If a company’s emissions are missing, use an emissions-to-revenue ratio from a similar peer or sector average. Also, external databases like IEA or research papers for sector intensities serve as inputs.

Processing logic: For each data gap identified in 2.1, fill in a reasonable estimate:

5 ‘Estimate, Impute and Correct
5. If emissions data is missing for a corporate investment, calculate a proxy e.g. multiply the company’s revenue by the average emissions per revenue for that industry 5. and region (or use known emissions of a comparable company). If the company is known in size, scale by that. This yields an estimated Scope 1+2 emission figure
5. Real estate: If a real estate asset lacks measured emissions, estimate its emissions from building characteristics: use the size (square footage) * typical energy intensity (kWh/m²) * carbon factor (kgCO₂e/kWh). Adjust for occupancy or efficiency class if known (for instance, if it’s known as a green-certified building, adjust downward)
5. Document each assumption clearly: e.g. ‘Company X - no reported data, used sector average intensity of 0.5 tCO₂e/£m revenue from Source Y’ or ‘Property 123 - assumed energy usage of 200 kWh/m² based on UK average office benchmarks’. Apply a conservative approach to avoid underestimation (as recommended for early disclosures with data gaps) Mark these entries so that they can later be reported as estimated (this ties into transparency for TCFD reporting).

Outputs: 

An augmented portfolio dataset where all previously missing fields are now populated with either actual data or proxy estimates. The dataset now should be complete – every investment has an emissions value and other required inputs
Alongside this, produce an Assumptions Register detailing each proxy and assumption used. This register will be important for assurance and disclosure (showing where data is less certain). We also update the data quality scores: proxies would typically be categorized as lower quality (PCAF score 4 or 5) compared to reported data (score 1-3)
The output at this stage is effectively a finalised input dataset for calculation, with full coverage and noted quality flags.

Sub-process 2.3: Data verification and sign-off (asynchronous ‘human in the loop’ with an options for interim / immediate verification agents)
Inputs 
Internal data sources: The now-complete dataset and the assumptions register. Also, internal stakeholders are 1) Middle Office (verifies that investment values and any financial figures align with official records (no inadvertent changes during processing); 2) Climate Solutions team double-checks that proxies were applied correctly; 3) Group Climate team reviews the dataset against reporting requirements (ensuring, for instance, that any use of estimated data is acceptable & will be disclosed properly)
 
6. Review and Critic Agents 
6. Climate Solutions Team / Agent:  Validates that the technical aspects (emissions data and proxies) are handled correctly and aligns with methodologies. They ensure the dataset is consistent with PCAF standards and that data quality scores are assigned appropriately.
6. Middle Office  Team / Agent: Confirm that for each investment, the financial attributes (amounts, ownership percentages) match the official books. Any discrepancies (perhaps due to valuation dates, etc.) are reconciled.
6. Institutional Retirement Reporting Team / Agent:  Verifies that the dataset scope matches the intended reporting scope (e.g., if certain portfolios were meant to be included/excluded) and that the outputs can roll up to the level needed for disclosure (for instance, if they will report at an aggregate institutional level, ensure all relevant assets are included exactly once).
6. Group Climate Team / Agent:  Checks the dataset against regulatory expectations: for instance, if the TCFD report requires year-on-year changes, do we have last year’s data to compare; if required to disclose data quality or methodologies, is the info recorded. They might also ensure that scenario analysis data (outside this dataset) remains consistent (though scenario analysis is separate, no conflicting numbers).
Address any feedback: e.g., if a proxy seems too high-level, perhaps refine it; if an asset should be classified differently, adjust that classification.

Outputs: 
Output from 6 Validated and approved dataset (final input for calculations). At this point, we have effectively a green-light to proceed to emission calculations, with confidence in the data. All investments have emissions data (actual or estimated) and all inputs are vetted
The finalized assumptions log and a data quality summary. This could include metrics like “% of portfolio emissions based on reported data vs estimated” which might be disclosed or at least noted internally. The sign-off from relevant teams is recorded (for governance purposes, showing that multiple lines of defence have reviewed the data). By the end of Phase 2, the risk of errors is minimized



