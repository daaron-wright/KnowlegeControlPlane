# 🔍 Complete DAG Node Descriptions

> Comprehensive analysis of all 65 nodes across 4 workflows

Generated on: 8/26/2025, 7:59:26 AM

## 📚 Table of Contents

- [Measles Outbreak Workflow](#measles-outbreak-workflow) (14 nodes)
- [ESG Portfolio Workflow](#esg-portfolio-workflow) (19 nodes)
- [Isuzu Production Workflow](#isuzu-production-workflow) (15 nodes)
- [Back-to-School Workflow](#back-to-school-workflow) (17 nodes)

---

## 📊 Summary Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Nodes** | 65 | 100% |
| **Async Nodes** | 19 | 29.2% |
| **Sync Nodes** | 46 | 70.8% |
| **Nodes with Input Schema** | 3 | 4.6% |
| **Nodes with Output Schema** | 3 | 4.6% |

## Measles Outbreak Workflow

**Overview:**
- **Total Nodes:** 14
- **Async Nodes:** 6 (42.9%)
- **Sync Nodes:** 8 (57.1%)
- **Average Processing Time:** 5.6 seconds
- **Node Types:** custom(10), cloud(2), onprem(2)

### [1] Q0 - Parse User Query

| Property | Value |
|----------|-------|
| **Node ID** | Q0 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #2c5282 |

**Description:**
Extract intents, entities, timeframe, urgency from minister's prompt.

**Tools Used:**
- `nlu.parse`

**Outputs:**
- intent_schema
- key_phrases

**Metrics:**
- **Priority:** high
- **Retries:** 3

**Technical Details:**
- Tool: nlu.parse
- Async: false
- Outputs: intent_schema, key_phrases

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string",
      "description": "The user query to process"
    },
    "parameters": {
      "type": "object",
      "properties": {
        "maxResults": {
          "type": "number",
          "default": 10
        },
        "includeMetadata": {
          "type": "boolean",
          "default": true
        },
        "filters": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "When the query was submitted"
    }
  },
  "required": [
    "query"
  ]
}
```

**Output Schema:**
```json
{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "score": {
            "type": "number"
          },
          "content": {
            "type": "string"
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "totalResults": {
          "type": "number"
        },
        "processingTime": {
          "type": "number"
        },
        "confidence": {
          "type": "number"
        }
      }
    },
    "status": {
      "type": "string",
      "enum": [
        "success",
        "partial",
        "failed"
      ]
    }
  },
  "required": [
    "results",
    "status"
  ]
}
```

---

### [2] D1 - Fetch Epidemiological Data

| Property | Value |
|----------|-------|
| **Node ID** | D1 |
| **Type** | cloud |
| **Async** | ❌ No |
| **Processing Time** | 5s |
| **Color** | #3b82f6 |

**Description:**
Pull latest measles case counts by emirate and district from cloud data warehouse.

**Tools Used:**
- `data.fetch_api`

**Metrics:**
- **Async:** true
- **Output:** cases_tbl

**Technical Details:**
- Tool: data.fetch_api
- Sources: MoH, WHO, DHIS2
- Window: P30D
- Schedule: */15 * * * *

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "startDate": {
      "type": "string",
      "format": "date"
    },
    "endDate": {
      "type": "string",
      "format": "date"
    },
    "regions": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "startDate",
    "endDate"
  ]
}
```

**Output Schema:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "region": {
        "type": "string"
      },
      "date": {
        "type": "string",
        "format": "date"
      },
      "cases": {
        "type": "number"
      }
    }
  }
}
```

---

### [3] S1 - Stream Social Chatter

| Property | Value |
|----------|-------|
| **Node ID** | S1 |
| **Type** | onprem |
| **Async** | ❌ No |
| **Processing Time** | 3s |
| **Color** | #64748b |

**Description:**
Real-time scrape of keywords across social platforms from on-prem servers.

**Tools Used:**
- `social.stream`

**Metrics:**
- **Async:** true
- **Output:** raw_posts

**Technical Details:**
- Tool: social.stream
- Keywords: measles, rash, vaccination, MMR
- Languages: ar, en, ur
- Schedule: realtime
- Concurrency group: stream

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "keywords": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "languages": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "keywords",
    "languages"
  ]
}
```

**Output Schema:**
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "platform": {
        "type": "string"
      },
      "text": {
        "type": "string"
      },
      "timestamp": {
        "type": "string",
        "format": "date-time"
      },
      "location": {
        "type": "string"
      }
    }
  }
}
```

---

### [4] G1 - Geocode Chatter

| Property | Value |
|----------|-------|
| **Node ID** | G1 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #2b6cb0 |

**Description:**
Convert raw social posts into GeoJSON points.

**Tools Used:**
- `geo.enrich`

**Dependencies:**
- S1

**Metrics:**
- **Output:** posts_geo
- **Retries:** 3

**Technical Details:**
- Tool: geo.enrich
- Depends on: S1
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [5] C1 - Compute Chatter Case Latency

| Property | Value |
|----------|-------|
| **Node ID** | C1 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 6s |
| **Color** | #2b6cb0 |

**Description:**
Calculate lag/lead between chatter spikes and case reports.

**Tools Used:**
- `stats.timeseries`

**Dependencies:**
- G1
- D1

**Metrics:**
- **Output:** latency_metrics
- **Priority:** high

**Technical Details:**
- Tool: stats.timeseries
- Depends on: G1, D1
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [6] V1 - Generate Risk Map

| Property | Value |
|----------|-------|
| **Node ID** | V1 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 8s |
| **Color** | #3b82f6 |

**Description:**
Create animated heat-map of cases and chatter intensity using cloud compute.

**Tools Used:**
- `viz.map`

**Dependencies:**
- G1
- D1
- C1

**Metrics:**
- **Output:** risk_map_url
- **Priority:** high

**Technical Details:**
- Tool: viz.map
- Depends on: G1, D1, C1
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [7] L0 - Detect Potential Leads

| Property | Value |
|----------|-------|
| **Node ID** | L0 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 7s |
| **Color** | #6b46c1 |

**Description:**
Cluster social posts to surface emerging health-risk topics.

**Tools Used:**
- `nlp.cluster`

**Dependencies:**
- S1

**Metrics:**
- **Output:** leads_summary
- **Async:** true

**Technical Details:**
- Tool: nlp.cluster
- Depends on: S1
- Dynamic spawn: LEAD_INVESTIGATION template
- Max children: 25

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [8] TEMPLATE - Lead Investigation Template

| Property | Value |
|----------|-------|
| **Node ID** | TEMPLATE |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 4s |
| **Color** | #4a5568 |

**Description:**
Deep-dive analysis of potential misinformation clusters.

**Tools Used:**
- `nlp.lead_investigate`

**Outputs:**
- lead_report_{{cluster_id}}

**Metrics:**
- **Max instances:** 25
- **Async:** true

**Technical Details:**
- Tool: nlp.lead_investigate
- Inputs: cluster_payload
- Outputs: lead_report_{{cluster_id}}
- On success: append to leads_summary

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [9] VHX - Compare Hesitancy vs Vax Rates

| Property | Value |
|----------|-------|
| **Node ID** | VHX |
| **Type** | onprem |
| **Async** | ✅ Yes |
| **Processing Time** | 5s |
| **Color** | #64748b |

**Description:**
Overlay vaccine-hesitant chatter with vaccination-rate registry from on-prem database.

**Tools Used:**
- `stats.compare_regions`

**Dependencies:**
- G1
- D1

**Metrics:**
- **Output:** hesitancy_hotspots
- **Priority:** high

**Technical Details:**
- Tool: stats.compare_regions
- Depends on: G1, D1
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [10] NLP1 - Sentiment and Topic Model

| Property | Value |
|----------|-------|
| **Node ID** | NLP1 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 6s |
| **Color** | #805ad5 |

**Description:**
Real-time sentiment, fear, and misinformation tagging.

**Tools Used:**
- `nlp.sentiment_topic`

**Dependencies:**
- S1

**Metrics:**
- **Outputs:** sentiment_dash, top_topics, misinformation_score
- **Priority:** high

**Technical Details:**
- Tool: nlp.sentiment_topic
- Depends on: S1
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [11] CM1 - Generate Localised Messages

| Property | Value |
|----------|-------|
| **Node ID** | CM1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 9s |
| **Color** | #dd6b20 |

**Description:**
Draft hyper-local public-health messages for hotspots.

**Tools Used:**
- `comms.generate`

**Dependencies:**
- VHX
- NLP1
- latency_metrics

**Metrics:**
- **Output:** draft_messages
- **Async:** true

**Technical Details:**
- Tool: comms.generate
- Style guide: MoH-Arabic-EN-2024
- Depends on: VHX, NLP1, latency_metrics
- Requires approval: MoH_Comms_Director (2h timeout)

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [12] FAQ0 - Offer FAQ Portal

| Property | Value |
|----------|-------|
| **Node ID** | FAQ0 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 7s |
| **Color** | #dd6b20 |

**Description:**
Auto-scaffold a FAQ microsite when misinformation spikes.

**Tools Used:**
- `webgen.scaffold`

**Dependencies:**
- NLP1

**Metrics:**
- **Output:** faq_site_stub
- **Priority:** high

**Technical Details:**
- Tool: webgen.scaffold
- Depends on: NLP1
- Condition: NLP1.misinformation_score > 0.6
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [13] BR1 - Compile Ministerial Brief

| Property | Value |
|----------|-------|
| **Node ID** | BR1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 10s |
| **Color** | #744210 |

**Description:**
Summarise insights, impacts, and recommended actions.

**Tools Used:**
- `doc.generate`

**Dependencies:**
- V1
- leads_summary
- hesitancy_hotspots
- top_topics
- draft_messages

**Metrics:**
- **Output:** brief_pdf
- **Priority:** high

**Technical Details:**
- Tool: doc.generate
- Depends on: V1, leads_summary, hesitancy_hotspots, top_topics, draft_messages
- Impact tags: Early_detection, Optimised_resource_allocation, Public_trust, Vaccination_uptake, Economic_resilience
- Async: false

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [14] COMPLETE - DAG Completion Hook

| Property | Value |
|----------|-------|
| **Node ID** | COMPLETE |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #1a202c |

**Description:**
Actions to take when the entire workflow completes successfully.

**Metrics:**
- **Type:** on_complete
- **Priority:** high

**Technical Details:**
- Notify: Minister_of_Health, Public_Comms_Team
- Deliverables: brief_pdf, risk_map_url, draft_messages, faq_site_stub

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---


## ESG Portfolio Workflow

**Overview:**
- **Total Nodes:** 19
- **Async Nodes:** 6 (31.6%)
- **Sync Nodes:** 13 (68.4%)
- **Average Processing Time:** 7.6 seconds
- **Node Types:** custom(13), cloud(4), onprem(2)

### [1] Q0 - Parse ESG Query (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | Q0 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #059669 |

**Description:**
Extract portfolio scope, ESG metrics, and analysis requirements.

**Tools Used:**
- `esg.parse_portfolio_query`

**Outputs:**
- portfolio_scope
- esg_metrics_requested
- analysis_timeframe

**Metrics:**
- **Priority:** high
- **Retries:** 3
- **QueryType:** ESG Analysis

**Technical Details:**
- Tool: esg.parse_portfolio_query
- Async: false
- Outputs: portfolio_scope, esg_metrics_requested, analysis_timeframe

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [2] D1 - Portfolio Holdings Data (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D1 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #059669 |

**Description:**
Fetch current portfolio composition, allocations, and performance metrics.

**Tools Used:**
- `portfolio.fetch_holdings_data`

**Metrics:**
- **DataSource:** Bloomberg/Refinitiv Cloud
- **Holdings:** 2,847 securities
- **AUM:** $12.8B
- **Coverage:** Global equities, bonds, alternatives

**Technical Details:**
- Tool: portfolio.fetch_holdings_data
- Source: Portfolio Management System (Cloud)
- Window: Real-time + 5Y history
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [3] D2 - ESG Ratings & Scores (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D2 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 3s |
| **Color** | #059669 |

**Description:**
Retrieve ESG ratings, scores, and sustainability metrics for all holdings.

**Tools Used:**
- `esg.fetch_ratings_data`

**Metrics:**
- **DataSource:** MSCI ESG Research
- **Coverage:** 7,500+ companies
- **UpdateFrequency:** Monthly
- **HistoricalData:** 15+ years

**Technical Details:**
- Tool: esg.fetch_ratings_data
- Sources: MSCI, Sustainalytics, S&P Global (Cloud)
- Metrics: ESG scores, E/S/G pillars, controversies
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [4] D3 - Carbon Footprint Data (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D3 |
| **Type** | onprem |
| **Async** | ✅ Yes |
| **Processing Time** | 5s |
| **Color** | #059669 |

**Description:**
Collect carbon emissions, climate risk, and environmental impact data.

**Tools Used:**
- `carbon.fetch_emissions_data`

**Metrics:**
- **DataSource:** Carbon Disclosure Project
- **CompanyCoverage:** 13,000+ companies
- **EmissionsScope:** 1, 2, 3
- **ClimateRisk:** Physical & transition

**Technical Details:**
- Tool: carbon.fetch_emissions_data
- Sources: CDP, TCFD, company disclosures (On-Prem)
- Metrics: Scope 1, 2, 3 emissions
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [5] D4 - Regulatory & Compliance (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D4 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #059669 |

**Description:**
Fetch regulatory requirements, compliance status, and policy updates.

**Tools Used:**
- `compliance.fetch_regulatory_data`

**Metrics:**
- **Jurisdictions:** 25+ countries
- **Regulations:** SFDR, TCFD, SEC Climate
- **ComplianceScore:** 96.2%
- **PolicyUpdates:** Weekly monitoring

**Technical Details:**
- Tool: compliance.fetch_regulatory_data
- Sources: SEC, EU SFDR, UK FCA, global regulators (Cloud)
- Coverage: ESG disclosure requirements
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [6] D5 - Market & Benchmark Data (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D5 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 3s |
| **Color** | #059669 |

**Description:**
Retrieve ESG benchmark performance and market trends data.

**Tools Used:**
- `market.fetch_benchmark_data`

**Metrics:**
- **Benchmarks:** 15+ ESG indices
- **MarketCap:** $45T+ covered
- **Performance:** 10Y track record
- **Sectors:** All GICS sectors

**Technical Details:**
- Tool: market.fetch_benchmark_data
- Sources: MSCI ESG indices, FTSE Russell ESG (Cloud)
- Benchmarks: Global ESG leaders, thematic indices
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [7] D6 - Controversy & News Data (Data Acquisition Agent)

| Property | Value |
|----------|-------|
| **Node ID** | D6 |
| **Type** | onprem |
| **Async** | ✅ Yes |
| **Processing Time** | 7s |
| **Color** | #059669 |

**Description:**
Monitor ESG controversies, news sentiment, and reputational risks.

**Tools Used:**
- `news.fetch_controversy_data`

**Metrics:**
- **NewsSources:** 50,000+ global sources
- **Languages:** 20+ languages
- **UpdateFrequency:** Real-time
- **SentimentAccuracy:** 89.3%

**Technical Details:**
- Tool: news.fetch_controversy_data
- Sources: RepRisk, Factiva, ESG news feeds (On-Prem)
- Analysis: NLP sentiment analysis
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [8] P1 - Portfolio ESG Scoring (Data Validation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | P1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #3b82f6 |

**Description:**
Calculate weighted portfolio ESG scores and factor exposures.

**Tools Used:**
- `analytics.process_portfolio_esg`

**Dependencies:**
- D1
- D2

**Outputs:**
- portfolio_esg_score
- factor_exposure
- sector_breakdown

**Metrics:**
- **Priority:** high
- **ProcessingType:** Real-time
- **ESGScore:** Portfolio-weighted composite
- **Methodology:** MSCI + proprietary

**Technical Details:**
- Tool: analytics.process_portfolio_esg
- Depends on: D1, D2
- Outputs: portfolio_esg_score, factor_exposure, sector_breakdown

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [9] P4 - Performance Attribution (Data Validation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | P4 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 10s |
| **Color** | #3b82f6 |

**Description:**
Attribute portfolio performance to ESG factors and benchmark analysis.

**Tools Used:**
- `analytics.process_performance_attribution`

**Dependencies:**
- D5

**Outputs:**
- esg_attribution
- benchmark_comparison
- factor_returns

**Metrics:**
- **Priority:** high
- **ProcessingType:** Factor model
- **Attribution:** Barra ESG factors
- **Benchmarks:** MSCI ACWI ESG Universal

**Technical Details:**
- Tool: analytics.process_performance_attribution
- Depends on: D5
- Outputs: esg_attribution, benchmark_comparison, factor_returns

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [10] P5 - Sentiment & Risk Monitoring (Data Validation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | P5 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 9s |
| **Color** | #3b82f6 |

**Description:**
Process news sentiment and identify emerging ESG risks.

**Tools Used:**
- `ml.process_sentiment_analysis`

**Dependencies:**
- D6

**Outputs:**
- sentiment_scores
- risk_alerts
- reputation_metrics

**Metrics:**
- **Priority:** medium
- **ProcessingType:** NLP + ML
- **ModelType:** Transformer-based
- **AlertThreshold:** Severe negative sentiment

**Technical Details:**
- Tool: ml.process_sentiment_analysis
- Depends on: D6
- Outputs: sentiment_scores, risk_alerts, reputation_metrics

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [11] P2 - Climate Risk Analysis (Emission Calculation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | P2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 12s |
| **Color** | #7c3aed |

**Description:**
Assess portfolio carbon intensity and climate transition risks.

**Tools Used:**
- `analytics.process_climate_risk`

**Dependencies:**
- D3

**Outputs:**
- carbon_intensity
- climate_var
- transition_risk_score

**Metrics:**
- **Priority:** high
- **ProcessingType:** Scenario analysis
- **RiskModels:** NGFS climate scenarios
- **TimeHorizon:** 2030, 2050 targets

**Technical Details:**
- Tool: analytics.process_climate_risk
- Depends on: D3
- Outputs: carbon_intensity, climate_var, transition_risk_score

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [12] A1 - ESG Portfolio Optimization (Emission Calculation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | A1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 15s |
| **Color** | #7c3aed |

**Description:**
Generate optimized portfolio allocations based on ESG constraints.

**Tools Used:**
- `optimization.generate_esg_allocation`

**Dependencies:**
- P1
- P4

**Outputs:**
- optimal_allocation
- esg_efficiency_frontier
- risk_metrics

**Metrics:**
- **Priority:** high
- **OptimizationType:** Mean-variance + ESG
- **Constraints:** ESG score > 70, carbon < 50% benchmark
- **ExpectedImprovement:** +15 ESG score, -25% carbon

**Technical Details:**
- Tool: optimization.generate_esg_allocation
- Depends on: P1, P4
- Outputs: optimal_allocation, esg_efficiency_frontier, risk_metrics

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [13] A2 - Climate Scenario Analysis (Emission Calculation Agent)

| Property | Value |
|----------|-------|
| **Node ID** | A2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 18s |
| **Color** | #7c3aed |

**Description:**
Run climate stress tests and scenario analysis on portfolio.

**Tools Used:**
- `scenario.run_climate_analysis`

**Dependencies:**
- P2

**Outputs:**
- scenario_results
- climate_var
- transition_pathways

**Metrics:**
- **Priority:** high
- **Scenarios:** NGFS orderly, disorderly, hot house
- **TimeHorizon:** 2030, 2040, 2050
- **ClimateVaR:** 1%, 5%, 10% confidence levels

**Technical Details:**
- Tool: scenario.run_climate_analysis
- Depends on: P2
- Outputs: scenario_results, climate_var, transition_pathways

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [14] P3 - Regulatory Mapping (Assurance Agent)

| Property | Value |
|----------|-------|
| **Node ID** | P3 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 6s |
| **Color** | #ea580c |

**Description:**
Map portfolio holdings to regulatory requirements and disclosure gaps.

**Tools Used:**
- `analytics.process_regulatory_mapping`

**Dependencies:**
- D4

**Outputs:**
- compliance_matrix
- disclosure_gaps
- regulatory_risk

**Metrics:**
- **Priority:** medium
- **ProcessingType:** Rule-based mapping
- **Regulations:** SFDR Article 6/8/9
- **GapAnalysis:** Automated detection

**Technical Details:**
- Tool: analytics.process_regulatory_mapping
- Depends on: D4
- Outputs: compliance_matrix, disclosure_gaps, regulatory_risk

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [15] A3 - Regulatory Impact Assessment (Assurance Agent)

| Property | Value |
|----------|-------|
| **Node ID** | A3 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 12s |
| **Color** | #ea580c |

**Description:**
Assess portfolio readiness for upcoming ESG regulations.

**Tools Used:**
- `regulatory.assess_compliance_readiness`

**Dependencies:**
- P3
- P5

**Outputs:**
- compliance_score
- readiness_gaps
- implementation_roadmap

**Metrics:**
- **Priority:** medium
- **Assessment:** EU SFDR, SEC Climate Rule
- **ComplianceGap:** 12% of holdings
- **Implementation:** Q2 2026 target

**Technical Details:**
- Tool: regulatory.assess_compliance_readiness
- Depends on: P3, P5
- Outputs: compliance_score, readiness_gaps, implementation_roadmap

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [16] V1 - ESG Analytics Dashboard (Reporting Agent)

| Property | Value |
|----------|-------|
| **Node ID** | V1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #dc2626 |

**Description:**
Generate comprehensive ESG portfolio dashboard with interactive visualizations.

**Tools Used:**
- `visualization.generate_esg_dashboard`

**Dependencies:**
- A1
- A2
- A3

**Outputs:**
- executive_dashboard
- detailed_analytics
- interactive_charts

**Metrics:**
- **DashboardType:** Executive + detailed views
- **Visualizations:** 25+ charts and metrics
- **Interactivity:** Drill-down capabilities
- **ExportFormats:** PDF, Excel, PowerBI

**Technical Details:**
- Tool: visualization.generate_esg_dashboard
- Depends on: A1, A2, A3
- Outputs: executive_dashboard, detailed_analytics, interactive_charts

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [17] O1 - ESG Investment Report (Reporting Agent)

| Property | Value |
|----------|-------|
| **Node ID** | O1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 6s |
| **Color** | #dc2626 |

**Description:**
Generate comprehensive ESG investment analysis and recommendations.

**Tools Used:**
- `reporting.generate_esg_investment_report`

**Dependencies:**
- V1

**Outputs:**
- investment_recommendations
- esg_scorecard
- regulatory_summary

**Metrics:**
- **ReportLength:** 45 pages
- **Sections:** Executive summary, detailed analysis, appendices
- **Recommendations:** Portfolio optimization, risk mitigation
- **DeliveryTime:** < 5 minutes

**Technical Details:**
- Tool: reporting.generate_esg_investment_report
- Depends on: V1
- Outputs: investment_recommendations, esg_scorecard, regulatory_summary
- Recipients: Investment_Committee, Risk_Team, Compliance_Team

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [18] O2 - Regulatory Compliance Package (Reporting Agent)

| Property | Value |
|----------|-------|
| **Node ID** | O2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 10s |
| **Color** | #dc2626 |

**Description:**
Generate regulatory filing documents and compliance reports.

**Tools Used:**
- `compliance.generate_regulatory_package`

**Dependencies:**
- V1

**Outputs:**
- sfdr_disclosure
- tcfd_report
- sec_climate_filing

**Metrics:**
- **FilingTypes:** SFDR, TCFD, SEC Climate
- **ComplianceScore:** 98.7%
- **AutomationLevel:** 85% automated
- **ReviewTime:** 2 business days

**Technical Details:**
- Tool: compliance.generate_regulatory_package
- Depends on: V1
- Outputs: sfdr_disclosure, tcfd_report, sec_climate_filing
- Recipients: Compliance_Team, Legal_Team, Regulators

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [19] COMPLETE - ESG Analysis Complete (Reporting Agent)

| Property | Value |
|----------|-------|
| **Node ID** | COMPLETE |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #dc2626 |

**Description:**
Archive ESG analysis results and notify stakeholders of completion.

**Tools Used:**
- `system.complete_esg_workflow`

**Dependencies:**
- O1
- O2

**Outputs:**
- completion_log
- archived_analysis
- stakeholder_notifications

**Metrics:**
- **Type:** on_complete
- **Priority:** high
- **TotalProcessingTime:** 8 minutes
- **ArchiveRetention:** 7 years

**Technical Details:**
- Tool: system.complete_esg_workflow
- Depends on: O1, O2
- Outputs: completion_log, archived_analysis, stakeholder_notifications
- Notify: Investment_Team, Risk_Committee, Compliance_Team

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---


## Isuzu Production Workflow

**Overview:**
- **Total Nodes:** 15
- **Async Nodes:** 5 (33.3%)
- **Sync Nodes:** 10 (66.7%)
- **Average Processing Time:** 6.1 seconds
- **Node Types:** custom(10), onprem(2), cloud(3)

### [1] Q0 - Parse User Query

| Property | Value |
|----------|-------|
| **Node ID** | Q0 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #2c5282 |

**Description:**
Extract vehicle model, metrics, and analysis requirements.

**Tools Used:**
- `nlu.parse_vehicle_query`

**Outputs:**
- vehicle_model
- metrics_requested
- analysis_scope

**Metrics:**
- **Priority:** high
- **Retries:** 3

**Technical Details:**
- Tool: nlu.parse_vehicle_query
- Async: false
- Outputs: vehicle_model, metrics_requested, analysis_scope

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [2] D1 - Extract MES Production Data

| Property | Value |
|----------|-------|
| **Node ID** | D1 |
| **Type** | onprem |
| **Async** | ✅ Yes |
| **Processing Time** | 5s |
| **Color** | #4a5568 |

**Description:**
Pull real-time assembly line metrics from Manufacturing Execution System.

**Tools Used:**
- `mes.fetch_production_metrics`

**Metrics:**
- **DataSource:** MES On-Prem
- **Output:** production_metrics
- **RecordCount:** ~2.3M records

**Technical Details:**
- Tool: mes.fetch_production_metrics
- Sources: Isuzu MES (On-Prem)
- Window: Last 30 days
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [3] D2 - Extract ERP Financial Data

| Property | Value |
|----------|-------|
| **Node ID** | D2 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #38b2ac |

**Description:**
Retrieve cost, labor, and resource allocation data from cloud ERP.

**Tools Used:**
- `erp.fetch_financial_metrics`

**Metrics:**
- **DataSource:** SAP Cloud
- **Output:** financial_metrics
- **RecordCount:** ~850K records

**Technical Details:**
- Tool: erp.fetch_financial_metrics
- Sources: SAP Cloud ERP
- Window: Current quarter
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [4] D3 - Extract Car 3D Digital Twin

| Property | Value |
|----------|-------|
| **Node ID** | D3 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 8s |
| **Color** | #38b2ac |

**Description:**
Access 3D vehicle model and simulation data from digital twin platform.

**Tools Used:**
- `digitaltwin.fetch_3d_model_data`

**Metrics:**
- **DataSource:** 3D Twin Platform
- **Output:** digital_twin_data
- **ModelSize:** ~1.2GB

**Technical Details:**
- Tool: digitaltwin.fetch_3d_model_data
- Sources: Isuzu Digital Twin Platform (AWS)
- Window: Latest model iteration
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [5] D5 - Extract Environmental Data

| Property | Value |
|----------|-------|
| **Node ID** | D5 |
| **Type** | onprem |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #4a5568 |

**Description:**
Retrieve emissions, energy usage, and waste metrics from sensors.

**Tools Used:**
- `ems.fetch_environmental_metrics`

**Metrics:**
- **DataSource:** EMS On-Prem
- **Output:** environmental_metrics
- **CO2Reduction:** 15%

**Technical Details:**
- Tool: ems.fetch_environmental_metrics
- Sources: Environmental Management System
- Window: Current quarter
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [6] D6 - Extract Supply Chain Data

| Property | Value |
|----------|-------|
| **Node ID** | D6 |
| **Type** | cloud |
| **Async** | ✅ Yes |
| **Processing Time** | 6s |
| **Color** | #38b2ac |

**Description:**
Fetch supplier performance, logistics, and material costs.

**Tools Used:**
- `scm.fetch_logistics_data`

**Metrics:**
- **DataSource:** SCM Cloud
- **Output:** supply_metrics
- **SupplierCount:** 450+

**Technical Details:**
- Tool: scm.fetch_logistics_data
- Sources: Supply Chain Management (Cloud)
- Window: Last quarter
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [7] P1 - Analyze Production Efficiency

| Property | Value |
|----------|-------|
| **Node ID** | P1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #2b6cb0 |

**Description:**
Calculate productivity KPIs, bottlenecks, and optimization opportunities.

**Tools Used:**
- `analytics.process_production_data`

**Dependencies:**
- D1

**Outputs:**
- efficiency_score
- bottleneck_analysis

**Metrics:**
- **Priority:** high
- **ProcessingType:** Real-time
- **EfficiencyGain:** +12%

**Technical Details:**
- Tool: analytics.process_production_data
- Depends on: D1
- Outputs: efficiency_score, bottleneck_analysis

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [8] P2 - Analyze Financial Performance

| Property | Value |
|----------|-------|
| **Node ID** | P2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 6s |
| **Color** | #2b6cb0 |

**Description:**
Process cost efficiency, ROI, and budget allocation optimization.

**Tools Used:**
- `analytics.process_financial_data`

**Dependencies:**
- D2
- D6

**Outputs:**
- cost_analysis
- roi_metrics
- budget_optimization

**Metrics:**
- **Priority:** high
- **ProcessingType:** Batch
- **CostReduction:** 8%

**Technical Details:**
- Tool: analytics.process_financial_data
- Depends on: D2, D6
- Outputs: cost_analysis, roi_metrics, budget_optimization

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [9] P3 - Process Digital Twin Analysis

| Property | Value |
|----------|-------|
| **Node ID** | P3 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 12s |
| **Color** | #9333ea |

**Description:**
Run ML simulations on 3D model for design optimization insights.

**Tools Used:**
- `ml.process_digital_twin`

**Dependencies:**
- D3

**Outputs:**
- design_optimization
- performance_predictions

**Metrics:**
- **Priority:** medium
- **ProcessingType:** ML Pipeline
- **ModelAccuracy:** 94.2%

**Technical Details:**
- Tool: ml.process_digital_twin
- Depends on: D3
- Outputs: design_optimization, performance_predictions

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [10] P4 - Analyze Environmental Impact

| Property | Value |
|----------|-------|
| **Node ID** | P4 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 5s |
| **Color** | #2b6cb0 |

**Description:**
Evaluate carbon footprint, waste reduction, and sustainable materials.

**Tools Used:**
- `analytics.process_sustainability_data`

**Dependencies:**
- D5

**Outputs:**
- carbon_metrics
- waste_analysis
- sustainability_score

**Metrics:**
- **Priority:** high
- **ProcessingType:** Real-time
- **EmissionReduction:** 18%

**Technical Details:**
- Tool: analytics.process_sustainability_data
- Depends on: D5
- Outputs: carbon_metrics, waste_analysis, sustainability_score

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [11] A1 - Generate Production Insights

| Property | Value |
|----------|-------|
| **Node ID** | A1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 9s |
| **Color** | #805ad5 |

**Description:**
Combine production and financial data for comprehensive productivity analysis.

**Tools Used:**
- `insights.generate_production_analysis`

**Dependencies:**
- P1
- P2

**Outputs:**
- productivity_report
- optimization_roadmap

**Metrics:**
- **Priority:** high
- **OutputFormat:** Executive Report
- **ImprovementOpportunities:** 23

**Technical Details:**
- Tool: insights.generate_production_analysis
- Depends on: P1, P2
- Outputs: productivity_report, optimization_roadmap

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [12] A2 - Generate Sustainability Insights

| Property | Value |
|----------|-------|
| **Node ID** | A2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #805ad5 |

**Description:**
Create environmental impact assessment and design optimization strategies.

**Tools Used:**
- `insights.generate_sustainability_analysis`

**Dependencies:**
- P3
- P4

**Outputs:**
- sustainability_report
- green_initiatives

**Metrics:**
- **Priority:** high
- **OutputFormat:** Sustainability Dashboard
- **CarbonReduction:** 22%

**Technical Details:**
- Tool: insights.generate_sustainability_analysis
- Depends on: P3, P4
- Outputs: sustainability_report, green_initiatives

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [13] V1 - Generate Integrated Dashboard

| Property | Value |
|----------|-------|
| **Node ID** | V1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 10s |
| **Color** | #7b341e |

**Description:**
Combine all insights into unified executive dashboard with 3D visualization.

**Tools Used:**
- `dashboard.generate_isuzu_insights`

**Dependencies:**
- A1
- A2

**Outputs:**
- integrated_dashboard
- executive_summary
- 3d_models

**Metrics:**
- **Priority:** high
- **OutputFormat:** Executive Dashboard
- **KPIs:** 32 metrics

**Technical Details:**
- Tool: dashboard.generate_isuzu_insights
- Depends on: A1, A2
- Outputs: integrated_dashboard, executive_summary, 3d_models

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [14] O1 - Deliver Insights Report

| Property | Value |
|----------|-------|
| **Node ID** | O1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 3s |
| **Color** | #744210 |

**Description:**
Send comprehensive report to manufacturing and sustainability teams.

**Tools Used:**
- `reporting.send_insights_report`

**Dependencies:**
- V1

**Outputs:**
- email_confirmation
- report_archive

**Metrics:**
- **Priority:** high
- **Recipients:** Manufacturing & Sustainability Teams
- **ReportSize:** 35 pages

**Technical Details:**
- Tool: reporting.send_insights_report
- Depends on: V1
- Outputs: email_confirmation, report_archive

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [15] COMPLETE - DAG Complete

| Property | Value |
|----------|-------|
| **Node ID** | COMPLETE |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #1a202c |

**Description:**
Archive results and notify stakeholders of completion.

**Tools Used:**
- `system.complete_isuzu_workflow`

**Dependencies:**
- O1

**Outputs:**
- completion_log
- archived_insights

**Metrics:**
- **Type:** on_complete
- **Priority:** high
- **TotalProcessingTime:** 3 minutes

**Technical Details:**
- Tool: system.complete_isuzu_workflow
- Depends on: O1
- Outputs: completion_log, archived_insights
- Notify: Manufacturing_Team, Sustainability_Team, Executive_Team

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---


## Back-to-School Workflow

**Overview:**
- **Total Nodes:** 17
- **Async Nodes:** 2 (11.8%)
- **Sync Nodes:** 15 (88.2%)
- **Average Processing Time:** 4.8 seconds
- **Node Types:** custom(17)

### [1] P1 - Parse User Prompt

| Property | Value |
|----------|-------|
| **Node ID** | P1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #2c5282 |

**Description:**
Extract intent, customer segment, KPI targets, and timeframe.

**Tools Used:**
- `omnis.intent_parser`

**Outputs:**
- intent
- entities
- kpi_targets

**Metrics:**
- **Priority:** high
- **Retries:** 3

**Technical Details:**
- Tool: omnis.intent_parser
- Priority: high
- Outputs: intent, entities, kpi_targets

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [2] C1 - Identify Customer Segment

| Property | Value |
|----------|-------|
| **Node ID** | C1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 3s |
| **Color** | #285e61 |

**Description:**
Classify Emily Johnson persona and segment characteristics.

**Tools Used:**
- `tvg_ml.segment_classifier`

**Outputs:**
- persona_segment

**Metrics:**
- **DataSource:** Customer ML Model
- **Output:** persona_segment

**Technical Details:**
- Tool: tvg_ml.segment_classifier
- Input: Emily Johnson
- Output: persona_segment

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [3] D1 - Fetch Salesforce CRM Data

| Property | Value |
|----------|-------|
| **Node ID** | D1 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #00a1e0 |

**Description:**
Pull customer profiles, purchase history, and preferences.

**Tools Used:**
- `salesforce.fetch_customers`

**Outputs:**
- crm_profiles

**Metrics:**
- **DataSource:** Salesforce Cloud
- **Output:** crm_profiles

**Technical Details:**
- Tool: salesforce.fetch_customers
- Source: Salesforce Cloud
- Output: crm_profiles
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [4] D2 - Query Purchase History

| Property | Value |
|----------|-------|
| **Node ID** | D2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 5s |
| **Color** | #4a5568 |

**Description:**
Extract transaction data from on-premises data warehouse.

**Tools Used:**
- `tvg_sql.query_transactions`

**Outputs:**
- transaction_data

**Metrics:**
- **DataSource:** On-Prem DB
- **Output:** transaction_data

**Technical Details:**
- Tool: tvg_sql.query_transactions
- Source: TVG On-Prem Data Warehouse
- Output: transaction_data
- Window: P90D

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [5] D3 - Extract Clickstream Data

| Property | Value |
|----------|-------|
| **Node ID** | D3 |
| **Type** | custom |
| **Async** | ✅ Yes |
| **Processing Time** | 4s |
| **Color** | #ff0000 |

**Description:**
Pull session logs, page views, and behavioral data.

**Tools Used:**
- `adobe_analytics.fetch_events`

**Outputs:**
- web_sessions

**Metrics:**
- **DataSource:** Adobe Analytics
- **Output:** web_sessions

**Technical Details:**
- Tool: adobe_analytics.fetch_events
- Source: Adobe Analytics Cloud
- Output: web_sessions
- Async: true

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [6] D4 - Pull Service Contact Logs

| Property | Value |
|----------|-------|
| **Node ID** | D4 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 3s |
| **Color** | #03363d |

**Description:**
Extract customer service interactions and WISMO queries.

**Tools Used:**
- `zendesk.fetch_contacts`

**Outputs:**
- service_contacts

**Metrics:**
- **DataSource:** Zendesk Cloud
- **Output:** service_contacts

**Technical Details:**
- Tool: zendesk.fetch_contacts
- Source: Zendesk Cloud
- Output: service_contacts
- Window: P30D

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [7] A1 - Causal Inference on WISMO Drivers

| Property | Value |
|----------|-------|
| **Node ID** | A1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #805ad5 |

**Description:**
Identify root causes of customer contact volume.

**Tools Used:**
- `causalnex.estimate_effects`

**Dependencies:**
- D2
- D4

**Outputs:**
- wismo_drivers

**Metrics:**
- **Priority:** high
- **ProcessingType:** Causal Analysis

**Technical Details:**
- Tool: causalnex.estimate_effects
- Depends on: D2, D4
- Output: wismo_drivers

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [8] A2 - Time Series Sales Forecast

| Property | Value |
|----------|-------|
| **Node ID** | A2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 6s |
| **Color** | #805ad5 |

**Description:**
Predict Back-to-School sales trends and peak periods.

**Tools Used:**
- `prophet.sales_forecast`

**Dependencies:**
- D2

**Outputs:**
- sales_forecast

**Metrics:**
- **Priority:** medium
- **ProcessingType:** Time Series

**Technical Details:**
- Tool: prophet.sales_forecast
- Depends on: D2
- Output: sales_forecast

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [9] A3 - A/B Test Bundle Simulations

| Property | Value |
|----------|-------|
| **Node ID** | A3 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 7s |
| **Color** | #805ad5 |

**Description:**
Simulate cross-sell bundle performance and uplift.

**Tools Used:**
- `optimizely.simulate`

**Dependencies:**
- D2
- D3

**Outputs:**
- bundle_uplift_predictions

**Metrics:**
- **Priority:** high
- **ProcessingType:** A/B Simulation

**Technical Details:**
- Tool: optimizely.simulate
- Depends on: D2, D3
- Output: bundle_uplift_predictions

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [10] A4 - Real-Time Basket Gap Analysis

| Property | Value |
|----------|-------|
| **Node ID** | A4 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 5s |
| **Color** | #7b341e |

**Description:**
Identify missing items in customer baskets in real-time.

**Tools Used:**
- `tvg_ml.basket_gap_model`

**Dependencies:**
- D3

**Outputs:**
- gap_insights

**Metrics:**
- **Priority:** high
- **ProcessingType:** Real-time ML

**Technical Details:**
- Tool: tvg_ml.basket_gap_model
- Depends on: D3
- Output: gap_insights

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [11] A5 - Contact Deflection Impact

| Property | Value |
|----------|-------|
| **Node ID** | A5 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 6s |
| **Color** | #7b341e |

**Description:**
Predict reduction in WISMO contacts from proactive updates.

**Tools Used:**
- `omnis.simulate_deflection`

**Dependencies:**
- A1
- D4

**Outputs:**
- contact_deflection_scenarios

**Metrics:**
- **Priority:** high
- **ProcessingType:** Simulation

**Technical Details:**
- Tool: omnis.simulate_deflection
- Depends on: A1, D4
- Output: contact_deflection_scenarios

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [12] A6 - Optimize Nudge Timing & Channel

| Property | Value |
|----------|-------|
| **Node ID** | A6 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 7s |
| **Color** | #744210 |

**Description:**
Determine optimal timing and channels for cross-sell nudges.

**Tools Used:**
- `tvg_ml.channel_optimizer`

**Dependencies:**
- D1
- D3

**Outputs:**
- nudge_strategy

**Metrics:**
- **Priority:** high
- **ProcessingType:** Optimization

**Technical Details:**
- Tool: tvg_ml.channel_optimizer
- Depends on: D1, D3
- Output: nudge_strategy

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [13] A7 - Generate Marketing Insights

| Property | Value |
|----------|-------|
| **Node ID** | A7 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 5s |
| **Color** | #744210 |

**Description:**
Create targeting plan and campaign recommendations.

**Tools Used:**
- `omnis.marketing_insights`

**Dependencies:**
- A2
- A3
- A6

**Outputs:**
- targeting_plan

**Metrics:**
- **Priority:** medium
- **ProcessingType:** Insight Generation

**Technical Details:**
- Tool: omnis.marketing_insights
- Depends on: A2, A3, A6
- Output: targeting_plan

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [14] A8 - Create Brand Kit Variants

| Property | Value |
|----------|-------|
| **Node ID** | A8 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 4s |
| **Color** | #38b2ac |

**Description:**
Generate creative assets for A/B testing campaigns.

**Tools Used:**
- `adcreative.generate_variants`

**Dependencies:**
- A6

**Outputs:**
- creative_assets

**Metrics:**
- **Priority:** medium
- **ProcessingType:** Creative Generation

**Technical Details:**
- Tool: adcreative.generate_variants
- Depends on: A6
- Output: creative_assets

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [15] V1 - Generate Unified Dashboard

| Property | Value |
|----------|-------|
| **Node ID** | V1 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 8s |
| **Color** | #7b341e |

**Description:**
Compile all insights into interactive dashboard.

**Tools Used:**
- `omnis.dashboard.generate`

**Dependencies:**
- A1
- A2
- A3
- A4
- A5
- A6
- A7
- A8

**Outputs:**
- dashboard_url
- summary_pdf

**Metrics:**
- **Priority:** high
- **OutputFormat:** Interactive

**Technical Details:**
- Tool: omnis.dashboard.generate
- Depends on: A1, A2, A3, A4, A5, A6, A7, A8
- Output: dashboard_url, summary_pdf

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [16] V2 - Send Summary to Stakeholders

| Property | Value |
|----------|-------|
| **Node ID** | V2 |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 3s |
| **Color** | #1a202c |

**Description:**
Distribute insights to CX, Marketing, and Product teams.

**Tools Used:**
- `notification.send_summary`

**Dependencies:**
- V1

**Metrics:**
- **Priority:** high
- **Recipients:** 3 Teams

**Technical Details:**
- Tool: notification.send_summary
- Depends on: V1
- Recipients: Head of CX, Marketing, Digital Product

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---

### [17] COMPLETE - DAG Complete

| Property | Value |
|----------|-------|
| **Node ID** | COMPLETE |
| **Type** | custom |
| **Async** | ❌ No |
| **Processing Time** | 2s |
| **Color** | #1a202c |

**Description:**
Log completion and archive workflow artifacts.

**Tools Used:**
- `system.complete_workflow`

**Dependencies:**
- V2

**Outputs:**
- completion_log

**Metrics:**
- **Type:** on_complete
- **Priority:** high

**Technical Details:**
- Tool: system.complete_workflow
- Depends on: V2
- Output: completion_log

**Input Schema:** ❌ Not defined

**Output Schema:** ❌ Not defined

---


## 🔧 Complete Tools Inventory

Total unique tools: **64**

 1. **adcreative.generate_variants**
    - Used in 1 node(s): A8

 2. **adobe_analytics.fetch_events**
    - Used in 1 node(s): D3

 3. **analytics.process_climate_risk**
    - Used in 1 node(s): P2

 4. **analytics.process_financial_data**
    - Used in 1 node(s): P2

 5. **analytics.process_performance_attribution**
    - Used in 1 node(s): P4

 6. **analytics.process_portfolio_esg**
    - Used in 1 node(s): P1

 7. **analytics.process_production_data**
    - Used in 1 node(s): P1

 8. **analytics.process_regulatory_mapping**
    - Used in 1 node(s): P3

 9. **analytics.process_sustainability_data**
    - Used in 1 node(s): P4

10. **carbon.fetch_emissions_data**
    - Used in 1 node(s): D3

11. **causalnex.estimate_effects**
    - Used in 1 node(s): A1

12. **comms.generate**
    - Used in 1 node(s): CM1

13. **compliance.fetch_regulatory_data**
    - Used in 1 node(s): D4

14. **compliance.generate_regulatory_package**
    - Used in 1 node(s): O2

15. **dashboard.generate_isuzu_insights**
    - Used in 1 node(s): V1

16. **data.fetch_api**
    - Used in 1 node(s): D1

17. **digitaltwin.fetch_3d_model_data**
    - Used in 1 node(s): D3

18. **doc.generate**
    - Used in 1 node(s): BR1

19. **ems.fetch_environmental_metrics**
    - Used in 1 node(s): D5

20. **erp.fetch_financial_metrics**
    - Used in 1 node(s): D2

21. **esg.fetch_ratings_data**
    - Used in 1 node(s): D2

22. **esg.parse_portfolio_query**
    - Used in 1 node(s): Q0

23. **geo.enrich**
    - Used in 1 node(s): G1

24. **insights.generate_production_analysis**
    - Used in 1 node(s): A1

25. **insights.generate_sustainability_analysis**
    - Used in 1 node(s): A2

26. **market.fetch_benchmark_data**
    - Used in 1 node(s): D5

27. **mes.fetch_production_metrics**
    - Used in 1 node(s): D1

28. **ml.process_digital_twin**
    - Used in 1 node(s): P3

29. **ml.process_sentiment_analysis**
    - Used in 1 node(s): P5

30. **news.fetch_controversy_data**
    - Used in 1 node(s): D6

31. **nlp.cluster**
    - Used in 1 node(s): L0

32. **nlp.lead_investigate**
    - Used in 1 node(s): TEMPLATE

33. **nlp.sentiment_topic**
    - Used in 1 node(s): NLP1

34. **nlu.parse**
    - Used in 1 node(s): Q0

35. **nlu.parse_vehicle_query**
    - Used in 1 node(s): Q0

36. **notification.send_summary**
    - Used in 1 node(s): V2

37. **omnis.dashboard.generate**
    - Used in 1 node(s): V1

38. **omnis.intent_parser**
    - Used in 1 node(s): P1

39. **omnis.marketing_insights**
    - Used in 1 node(s): A7

40. **omnis.simulate_deflection**
    - Used in 1 node(s): A5

41. **optimization.generate_esg_allocation**
    - Used in 1 node(s): A1

42. **optimizely.simulate**
    - Used in 1 node(s): A3

43. **portfolio.fetch_holdings_data**
    - Used in 1 node(s): D1

44. **prophet.sales_forecast**
    - Used in 1 node(s): A2

45. **regulatory.assess_compliance_readiness**
    - Used in 1 node(s): A3

46. **reporting.generate_esg_investment_report**
    - Used in 1 node(s): O1

47. **reporting.send_insights_report**
    - Used in 1 node(s): O1

48. **salesforce.fetch_customers**
    - Used in 1 node(s): D1

49. **scenario.run_climate_analysis**
    - Used in 1 node(s): A2

50. **scm.fetch_logistics_data**
    - Used in 1 node(s): D6

51. **social.stream**
    - Used in 1 node(s): S1

52. **stats.compare_regions**
    - Used in 1 node(s): VHX

53. **stats.timeseries**
    - Used in 1 node(s): C1

54. **system.complete_esg_workflow**
    - Used in 1 node(s): COMPLETE

55. **system.complete_isuzu_workflow**
    - Used in 1 node(s): COMPLETE

56. **system.complete_workflow**
    - Used in 1 node(s): COMPLETE

57. **tvg_ml.basket_gap_model**
    - Used in 1 node(s): A4

58. **tvg_ml.channel_optimizer**
    - Used in 1 node(s): A6

59. **tvg_ml.segment_classifier**
    - Used in 1 node(s): C1

60. **tvg_sql.query_transactions**
    - Used in 1 node(s): D2

61. **visualization.generate_esg_dashboard**
    - Used in 1 node(s): V1

62. **viz.map**
    - Used in 1 node(s): V1

63. **webgen.scaffold**
    - Used in 1 node(s): FAQ0

64. **zendesk.fetch_contacts**
    - Used in 1 node(s): D4


---

*This document was automatically generated from the DAG workflow definitions.*
