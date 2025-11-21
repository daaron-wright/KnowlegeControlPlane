import type { Journey } from "@/types/dashboard";

const journeys: Journey[] = [
  {
    id: "rd-latest-protocol",
    name: "Journey 1 — R&D (Dr. Alex Meyer)",
    persona: "R&D Scientist",
    description:
      "Sequence guiding Dr. Alex Meyer from trigger query through validated protocol review, cluster insight, and approval packaging.",
    defaultPrompt:
      "Show me the latest validated protocol for Study X, and summarize result clusters across the last 6 runs.",
    scopeLabel: "R&D sources",
    scopeDescription: "SharePoint repositories filtered to validated protocols and run logs",
    sources: ["SharePoint PDFs", "PPT decks", "DOCX procedures"],
    matchers: [
      {
        id: "protocol-keywords",
        keywords: ["latest", "protocol", "study"],
      },
      {
        id: "cluster-keywords",
        keywords: ["cluster", "run"],
      },
    ],
    frames: [
      {
        id: "frame-trigger",
        title: "Frame 1 — Trigger",
        subtitle: "Workspace Home",
        sections: [
          {
            type: "description",
            text: "Micro-copy \"What do you need?\" anchors the global search entry point for scoped discovery.",
          },
          {
            type: "key-value",
            columns: 1,
            items: [
              {
                label: "Prompt typed",
                value:
                  "\"Show me the latest validated protocol for Study X, and summarize result clusters across the last 6 runs.\"",
              },
              {
                label: "Scope applied",
                value: "R&D sources",
                tone: "info",
              },
            ],
          },
          {
            type: "chips",
            label: "Source filters",
            chips: ["SharePoint PDFs", "PPT decks", "DOCX procedures"],
            tone: "default",
          },
        ],
      },
      {
        id: "frame-results",
        title: "Frame 2 — Results + Facets",
        subtitle: "Ranked retrieval with agent trace",
        sections: [
          {
            type: "key-value",
            columns: 1,
            items: [
              {
                label: "Top result",
                value: "Protocol SOP-123 (v9, approved 2024-12-03)",
                tone: "positive",
              },
              {
                label: "Diff vs v8",
                value: "Clean-in-place cycle shortened by 2.5 minutes; disinfectant concentration recalibrated to 0.8%.",
                tone: "info",
              },
              {
                label: "Validation",
                value: "Validator confirms SME lock; summarizer packages compliant excerpt for downstream use.",
                tone: "success",
              },
            ],
          },
          {
            type: "timeline",
            title: "Side trace",
            steps: [
              {
                title: "Retrieve",
                description: "Vector search ranks protocols filtered to R&D scope.",
                status: "completed",
              },
              {
                title: "Version resolver",
                description: "Latest approved vs archived SOPs resolved across SharePoint.",
                status: "completed",
              },
              {
                title: "Validator",
                description: "Compliance check flags deviations requiring SME confirmation.",
                status: "warning",
              },
              {
                title: "Summarizer",
                description: "Synthesizes diff summary aligned to cluster question.",
                status: "completed",
              },
            ],
          },
          {
            type: "metrics",
            items: [
              {
                label: "Preparation time",
                value: "2.3 s",
                tone: "info",
              },
              {
                label: "Validated sources",
                value: "9 documents cleared",
                tone: "success",
              },
              {
                label: "Active warnings",
                value: "1 validator follow-up",
                tone: "warning",
              },
            ],
          },
        ],
        copilot: {
          triggerLabel: "Review retrieval trace with Copilot",
          summary: "Copilot clarifies why SOP-123 v9 leads the results set and which compliance gates remain open.",
          conversation: [
            {
              id: "rd-results-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:12",
              content:
                "Why is SOP-123 v9 showing up first? Confirm the validator cleared it and explain the warning badge.",
            },
            {
              id: "rd-results-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:12",
              content:
                "SOP-123 v9 ranks first because it is the only version with SME lock in the R&D scope and it resolves the reagent variance you asked about.",
              highlights: [
                "Compliance gate: Validator pass 2/2 with audit watermark attached.",
                "Diff engine: 7 procedural deltas vs v8 prioritized around sanitation cycle.",
                "Usage telemetry: 12 recent cases adopted v9 without exceptions.",
              ],
              suggestion: "Open the agent trace to inspect the version resolver handoff.",
            },
            {
              id: "rd-results-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:13",
              content: "Line up the validator note so I can route it if needed.",
            },
            {
              id: "rd-results-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:13",
              content:
                "Validator flagged a pending SME follow-up on rinse manifold drift. The evidence bundle is staged for routing.",
              highlights: ["Sourcing validator event log V-8832", "SME routing note drafted with attachments"],
            },
          ],
          followUps: [
            {
              id: "rd-open-agent-trace",
              label: "Open agent trace",
              description: "Inspect each retrieval step with timestamps and tool usage.",
              feedback: {
                variant: "success",
                message: "Agent trace opened with compliance markers highlighted.",
              },
            },
            {
              id: "rd-escalate-validator",
              label: "Escalate validator warning",
              description: "Route the pending rinse manifold check to Quality.",
              feedback: {
                variant: "warning",
                message: "Validator warning escalated to the Quality reviewer queue.",
              },
            },
          ],
        },
      },
      {
        id: "frame-protocol-viewer",
        title: "Frame 3 — Document Viewer (Protocol)",
        subtitle: "Validated SOP detail pane",
        sections: [
          {
            type: "chips",
            label: "Right summary chips",
            chips: ["Changes since v8", "Critical Steps", "Materials", "Risk Flags"],
            tone: "info",
          },
          {
            type: "bullet-list",
            items: [
              {
                label: "Change tracking",
                description: "Highlights revised sanitation sequence, updated hold times, and instrumentation adjustments.",
              },
              {
                label: "Risk flags",
                description: "Validator warns about pending deviation 24-D-311 impacting rinse validation.",
              },
            ],
          },
          {
            type: "description",
            text: "AI overlay draws attention to altered sterilization dwell times and reagent dosing so reviewers see at a glance what shifted from v8.",
            emphasis: true,
          },
          {
            type: "toggles",
            label: "AI overlay controls",
            note: "All transformations are logged and reversible with audit snapshots.",
            toggles: [
              {
                id: "toggle-risk-hotspots",
                label: "Highlight risk hotspots in schematic",
                description: "Applies vision transform to annotate the CIP diagram with pressure warnings.",
                defaultState: true,
                tone: "info",
              },
              {
                id: "toggle-image-ocr",
                label: "Extract embedded tables via OCR",
                description: "Converts scanned tables into structured data for export and comparison.",
                defaultState: true,
                tone: "success",
              },
            ],
          },
        ],
        copilot: {
          triggerLabel: "Mark up protocol with Copilot",
          summary: "Copilot overlays change maps on SOP-123 and transforms diagrams into annotated assets for review.",
          conversation: [
            {
              id: "rd-protocol-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:15",
              content: "Show the sections that changed vs v8 and make sure sterile hold risks are obvious.",
            },
            {
              id: "rd-protocol-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:15",
              content:
                "Rendered a change heatmap across the sanitation sequence and pinned the single remaining sterile hold risk.",
              highlights: [
                "Diff overlay on sections 4.2–4.5 with inline notes.",
                "Validator warning surfaced with SME owner info.",
                "Materials table reconciled with v8 for traceability.",
              ],
            },
            {
              id: "rd-protocol-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:16",
              content: "Transform the CIP diagram so I can hand the annotated view to instrumentation.",
            },
            {
              id: "rd-protocol-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:16",
              content:
                "Converted the high-res CIP diagram into an SVG overlay with pressure thresholds highlighted and notes attached.",
              highlights: ["Overlay stored in Case Board assets", "Download link ready for instrumentation lead"],
              suggestion: "Generate a redline PDF if you need a frozen snapshot.",
            },
          ],
          followUps: [
            {
              id: "rd-generate-redline",
              label: "Generate redline PDF",
              description: "Produce a frozen comparison packet with overlays and notes.",
              feedback: {
                variant: "success",
                message: "Redline PDF generated with AI overlays embedded.",
              },
            },
            {
              id: "rd-share-annotated-protocol",
              label: "Share annotated protocol",
              description: "Send the transformed diagram and notes to instrumentation.",
              feedback: {
                variant: "success",
                message: "Annotated protocol shared with the instrumentation lead.",
              },
            },
          ],
        },
        actions: [
          {
            id: "lock-v9",
            label: "Use v9 in analysis",
            description: "Locks SOP-123 version 9 for the active session and adds it to the case workspace.",
            variant: "primary",
          },
        ],
      },
      {
        id: "frame-run-logs",
        title: "Frame 4 — Document Viewer (Run Logs bundle)",
        subtitle: "Multi-document comparison",
        sections: [
          {
            type: "description",
            text: "Cluster analysis spans six production runs with instrumentation telemetry and QA annotations.",
          },
          {
            type: "bullet-list",
            title: "Cluster summary",
            items: [
              {
                label: "Cluster A",
                description: "Expected yield 93–95% across reagent lot A with stable temperature control.",
              },
              {
                label: "Cluster B",
                description: "Low-yield 86–88% correlated with reagent lot B and rinse pressure dips.",
              },
            ],
          },
          {
            type: "description",
            text: "AI transforms raw telemetry attachments and imagery into aligned overlays so deviations stand out before diving deeper.",
            emphasis: true,
          },
          {
            type: "table",
            title: "Table extraction preview",
            columns: ["Column", "Source", "Lineage"],
            rows: [
              {
                cells: ["Run ID", "RunLogs_StudyX.csv", "Sheet: Runs • Cell B4"],
                annotation: "Validated",
              },
              {
                cells: ["Yield %", "RunLogs_StudyX.csv", "Sheet: Summary • Cell E9"],
                annotation: "Derived",
              },
              {
                cells: ["Reagent lot", "QC_Lots.xlsx", "Sheet: Lots • Cell C22"],
                annotation: "Authoritative",
              },
            ],
            footnotes: [
              "Column lineage tracks original cell references with audit locks.",
              "Derived values recomputed using compliant transform library v2.4.",
            ],
          },
          {
            type: "metrics",
            items: [
              {
                label: "Telemetry frames processed",
                value: "642 images normalised",
                tone: "info",
              },
              {
                label: "Documented exceptions",
                value: "2 anomaly clusters",
                tone: "warning",
              },
              {
                label: "Transformation latency",
                value: "1.6 s p95",
                tone: "success",
              },
            ],
          },
          {
            type: "callout",
            title: "Image + document transforms",
            body: "Microscopy captures converted to heatmaps and log tables verified, all saved with reversible audit trails.",
            tone: "info",
          },
        ],
        copilot: {
          triggerLabel: "Analyse run bundle with Copilot",
          summary: "Copilot synchronises telemetry with narrative logs and converts imagery into annotated overlays for investigation.",
          conversation: [
            {
              id: "rd-run-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:18",
              content: "Align the low-yield runs with telemetry and show the evidence supporting Cluster B.",
            },
            {
              id: "rd-run-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:18",
              content:
                "Synchronized six run logs with telemetry and highlighted the segments that correlate with the Cluster B drop.",
              highlights: [
                "Telemetry normalised to 5-second cadence and matched to batch events.",
                "Heatmap overlay shows rinse pressure dips during lot B usage.",
                "QA annotations linked so you can jump to deviation 24-D-311 evidence.",
              ],
              suggestion: "Use the compare baseline follow-up to see how the yields diverge.",
            },
            {
              id: "rd-run-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:19",
              content: "Transform the microscope photo to call out residue around the valve stem.",
            },
            {
              id: "rd-run-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:19",
              content:
                "Transformed the microscope photo into a false-colour heatmap isolating residue patches along the valve stem.",
              highlights: [
                "Segmentation reveals 18% residue coverage on the lot B sample.",
                "Converted asset stored as 'RunLogs_StudyX_heatmap.png' with lineage metadata.",
              ],
              suggestion: "Download the heatmap package if you need to email the lab.",
            },
          ],
          followUps: [
            {
              id: "rd-run-compare-baseline",
              label: "Compare to baseline runs",
              description: "Overlay the transformed bundle against the baseline lot.",
              feedback: {
                variant: "success",
                message: "Baseline comparison queued with heatmap overlays.",
              },
            },
            {
              id: "rd-run-export-heatmap",
              label: "Download heatmap package",
              description: "Export the AI-transformed imagery and structured tables.",
              feedback: {
                variant: "success",
                message: "Heatmap and table package prepared for download.",
              },
            },
          ],
        },
        actions: [
          {
            id: "explain-low-yield",
            label: "Explain drivers of low-yield cluster",
            description: "Launches targeted analysis focusing on reagent lot B excursions.",
            variant: "secondary",
          },
        ],
      },
      {
        id: "frame-insight",
        title: "Frame 5 — Insight Panel",
        subtitle: "Model answer with traceability",
        sections: [
          {
            type: "insight",
            answer:
              "Cluster variance is driven by reagent lot B introducing a 1.8% reduction in active compound concentration, amplified when rinse pressure dips below 2.1 bar. Corrective action recommends switching to lot A stock and recalibrating rinse cycle parameters.",
            sources: [
              {
                title: "RunLogs_StudyX.csv",
                snippet: "Rows 45–50 show yield drop aligned to lot B usage and pressure alarms.",
              },
              {
                title: "Deviation 24-D-311",
                snippet: "Root cause analysis flags rinse manifold pressure drift beyond validated threshold.",
              },
              {
                title: "SOP-123 v9",
                snippet: "Updated CIP cycle compensates for pressure variability with revised timing.",
              },
            ],
            assumptions: [
              "Lot B retains reduced potency across entire remaining inventory.",
              "Equipment recalibration can be executed within current maintenance window.",
            ],
          },
          {
            type: "metrics",
            items: [
              {
                label: "Confidence score",
                value: "0.87",
                tone: "success",
              },
              {
                label: "Evidence coverage",
                value: "3 documents + 1 transformed heatmap",
                tone: "info",
              },
              {
                label: "Open assumptions",
                value: "2 awaiting validation",
                tone: "warning",
              },
            ],
          },
        ],
        copilot: {
          triggerLabel: "Review insight with Copilot",
          summary: "Copilot narrates the root cause, ties citations to the transformed heatmap, and flags areas that still need validation.",
          conversation: [
            {
              id: "rd-insight-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:21",
              content: "Walk me through the root cause with the sources you trust most.",
            },
            {
              id: "rd-insight-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:21",
              content:
                "Lot B introduces a 1.8% potency loss, amplified whenever rinse pressure slips below 2.1 bar. The transformed heatmap shows residue accumulation matching the telemetry dip.",
              highlights: [
                "RunLogs_StudyX.csv rows 45–50 correlate yield drop to pressure alarms.",
                "Heatmap from microscope transform highlights residue at the valve stem.",
                "SOP-123 v9 mitigation aligns with the recommended corrective action.",
              ],
              suggestion: "Consider triggering the uncertainty highlight to review assumptions before sign-off.",
            },
            {
              id: "rd-insight-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:22",
              content: "How reliable is the image transform you referenced here?",
            },
            {
              id: "rd-insight-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:22",
              content:
                "The transform scored 0.82 similarity against the validated lab dataset and passed the QA checksum. I attached the lineage so auditors can replay it.",
              highlights: [
                "Transform log 18b matched against lab baseline.",
                "Checksum stored with the case evidence for replay.",
              ],
              suggestion: "Push this insight into the memo if you want it captured verbatim.",
            },
          ],
          followUps: [
            {
              id: "rd-insight-highlight-uncertainty",
              label: "Highlight uncertainty",
              description: "Surface the assumptions and lower-confidence segments inside the insight panel.",
              feedback: {
                variant: "warning",
                message: "Assumptions were highlighted for additional validation.",
              },
            },
            {
              id: "rd-insight-push-memo",
              label: "Push insight to memo",
              description: "Copy the narrated answer into the decision memo draft.",
              feedback: {
                variant: "success",
                message: "Insight copied to the decision memo with citations intact.",
              },
            },
          ],
        },
        actions: [
          {
            id: "ask-counter-examples",
            label: "Ask for counter-examples",
            variant: "primary",
          },
          {
            id: "strength-of-evidence",
            label: "Strength of evidence",
            variant: "secondary",
          },
          {
            id: "confidence-sources",
            label: "Confidence sources",
            variant: "ghost",
          },
        ],
      },
      {
        id: "frame-decision",
        title: "Frame 6 — Decision Compose (Case Board)",
        subtitle: "Auto-drafted memo with citations",
        sections: [
          {
            type: "memo",
            sections: [
              {
                title: "Objective",
                content: "Confirm validated protocol revision for Study X prior to next production cycle.",
                citation: "[1] SOP-123 v9",
              },
              {
                title: "Evidence",
                content: "SOP-123 v9 approves revised CIP sequence; run logs cluster analysis indicates yield recovery when lot A applied.",
                citation: "[2] RunLogs_StudyX.csv",
              },
              {
                title: "Risks",
                content: "Lot B inventory may continue to depress yields; deviation 24-D-311 requires close-out within 48 hours.",
                citation: "[3] Deviation 24-D-311",
              },
              {
                title: "Recommendation",
                content: "Adopt SOP-123 v9 immediately, quarantine lot B, and schedule rinse pressure recalibration before next batch.",
                citation: "[4] Insight synthesis",
              },
            ],
          },
          {
            type: "description",
            text: "Copilot pre-fills the memo with citations, transformed imagery lineage, and CAPA routing tasks so Alex only edits the narrative.",
            emphasis: true,
          },
        ],
        copilot: {
          triggerLabel: "Co-author memo with Copilot",
          summary: "Copilot keeps the memo aligned with cited evidence, transformed assets, and downstream CAPA owners.",
          conversation: [
            {
              id: "rd-memo-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:24",
              content: "Draft the memo using the root cause analysis and recommendation we agreed on.",
            },
            {
              id: "rd-memo-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:24",
              content:
                "Objective, evidence, risks, and recommendation now cite the validated SOP, run logs, and deviation analysis you reviewed.",
              highlights: [
                "Evidence section references RunLogs_StudyX.csv with AI annotations.",
                "Recommendation cites the transformed heatmap asset for visual support.",
                "Risks include the open deviation follow-up with 48-hour SLA.",
              ],
            },
            {
              id: "rd-memo-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:25",
              content: "Add a note that the heatmap transform has already been shared with instrumentation.",
            },
            {
              id: "rd-memo-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:25",
              content:
                "Added a line under Recommendation referencing the shared heatmap and tagged the instrumentation lead for visibility.",
              highlights: [
                "Instrumentation lead tagged with CAPA follow-up.",
                "Heatmap transform log linked in memo appendix.",
              ],
              suggestion: "Send the memo for peer review once you are ready.",
            },
          ],
          followUps: [
            {
              id: "rd-memo-send-peer-review",
              label: "Send for peer review",
              description: "Route the drafted memo and assets to the project lead.",
              feedback: {
                variant: "success",
                message: "Peer review package sent with all citations and assets attached.",
              },
            },
            {
              id: "rd-memo-generate-summary",
              label: "Generate summary email",
              description: "Produce an email-ready summary with key citations for stakeholders.",
              feedback: {
                variant: "success",
                message: "Summary email draft generated with memo highlights.",
              },
            },
          ],
        },
        actions: [
          {
            id: "request-peer-review",
            label: "Request Peer Review",
            description: "Routes memo and linked evidence to Project Lead for SME confirmation.",
            variant: "secondary",
          },
        ],
      },
      {
        id: "frame-approval",
        title: "Frame 7 — Approval & Export",
        subtitle: "Reviewer workflow",
        sections: [
          {
            type: "bullet-list",
            items: [
              {
                label: "Reviewer comments",
                description: "Inline annotations clarify sanitation timers and confirm reagent quarantine protocol.",
              },
              {
                label: "AI clarifications",
                description: "Suggests adding maintenance schedule excerpt to strengthen audit trail.",
              },
            ],
          },
          {
            type: "description",
            text: "Copilot monitors reviewer threads, resolves AI-generated clarifications, and tracks every export artifact for audit.",
            emphasis: true,
          },
          {
            type: "callout",
            title: "Finalize and export",
            body: "Generates PDF with citations, case ID, and audit footer capturing validation history.",
            tone: "success",
          },
        ],
        copilot: {
          triggerLabel: "Finalize with Copilot",
          summary: "Copilot compiles reviewer feedback, reconciles AI clarifications, and packages exports with full lineage.",
          conversation: [
            {
              id: "rd-approval-user-1",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:28",
              content: "Summarise the reviewer comments and make sure nothing blocks sign-off.",
            },
            {
              id: "rd-approval-assistant-1",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:28",
              content:
                "Two comments resolved sanitation timer wording, and one clarification is pending confirmation from instrumentation.",
              highlights: [
                "Reviewer Marta confirmed reagent quarantine protocol.",
                "Pending clarification tagged to instrumentation lead with due date EOD.",
              ],
              suggestion: "Log clarifications if you want the outstanding item tracked post-export.",
            },
            {
              id: "rd-approval-user-2",
              role: "user",
              author: "Dr. Alex Meyer",
              timestamp: "09:29",
              content: "Confirm the export will include the heatmap transform lineage and CAPA routing.",
            },
            {
              id: "rd-approval-assistant-2",
              role: "assistant",
              author: "Protocol Copilot",
              timestamp: "09:29",
              content:
                "Export bundle includes the heatmap transform log, CAPA routing, and reviewer resolution table with timestamps.",
              highlights: [
                "Audit footer references transform log 18b and memo appendix.",
                "Distribution list includes QA, MSAT, and instrumentation leads.",
              ],
              suggestion: "Trigger the export follow-up when ready; I will archive the clarification thread automatically.",
            },
          ],
          followUps: [
            {
              id: "rd-approval-log-clarifications",
              label: "Log clarifications",
              description: "Track the remaining reviewer clarification as a CAPA follow-up.",
              feedback: {
                variant: "warning",
                message: "Clarification logged with instrumentation owner and due date.",
              },
            },
            {
              id: "rd-approval-export-bundle",
              label: "Export audit bundle",
              description: "Generate the final PDF with lineage, transform logs, and distribution list.",
              feedback: {
                variant: "success",
                message: "Audit bundle exported with lineage metadata attached.",
              },
            },
          ],
        },
        actions: [
          {
            id: "finalize-export",
            label: "Finalize & Export PDF",
            description: "Locks memo, applies audit footer, and distributes to case stakeholders.",
            variant: "primary",
          },
        ],
      },
    ],
    emptyStates: [
      {
        id: "no-match",
        title: "No validated protocol match",
        description: "Closest approved version is SOP-123 v8 with pending validation for v9.",
        resolution: "Show diff preview and prompt user to request validation of v9 before citing.",
        tone: "warning",
      },
      {
        id: "conflicting-docs",
        title: "Conflicting versions detected",
        description: "Two protocol files are both marked as latest in SharePoint.",
        resolution: "Open validation flow to reconcile ownership and lock the correct master version.",
        tone: "error",
      },
      {
        id: "low-confidence",
        title: "Low confidence synthesis",
        description: "Answer confidence falls below 0.75 due to sparse evidence alignment.",
        resolution: "Require human review by adding additional reviewers before memo publication.",
        tone: "warning",
      },
    ],
  },
  {
    id: "msat-deviation-triage",
    name: "Journey 2 — MSAT (Jacob Weiss)",
    persona: "MSAT Engineer",
    description:
      "Workflow for Jacob Weiss to triage deviation 24-D-311, compare precedents, build a hypothesis, and drive CAPA handoff.",
    defaultPrompt:
      "Deviation 24-D-311: sticky valve during fill—show similar deviations and resolutions.",
    scopeLabel: "MSAT lens",
    scopeDescription: "MSAT lens filters deviations, validations, PQ evidence, and batch telemetry.",
    sources: ["Deviations", "Validations", "PQ", "Batch records"],
    matchers: [
      {
        id: "deviation-keywords",
        keywords: ["deviation", "similar", "resolutions"],
      },
      {
        id: "sticky-valve",
        keywords: ["sticky", "valve"],
      },
    ],
    frames: [
      {
        id: "msat-frame-trigger",
        title: "Frame 1 ��� Trigger",
        subtitle: "Workspace Home",
        sections: [
          {
            type: "description",
            text: "Prompt field surfaces MSAT copy “What do you need?” with deviation-centric auto-complete.",
          },
          {
            type: "key-value",
            columns: 1,
            items: [
              {
                label: "Prompt typed",
                value:
                  "“Deviation 24-D-311: sticky valve during fill—show similar deviations and resolutions.”",
              },
              {
                label: "Scope applied",
                value: "MSAT lens",
                tone: "info",
              },
            ],
          },
          {
            type: "chips",
            label: "Pre-filters",
            chips: ["Deviations", "Validations", "PQ", "Batch records"],
            tone: "info",
          },
        ],
      },
      {
        id: "msat-frame-results",
        title: "Frame 2 — Results + Facets",
        subtitle: "Clustered retrieval overview",
        sections: [
          {
            type: "key-value",
            columns: 1,
            items: [
              {
                label: "Cluster result",
                value: "9 similar deviations (18 months).",
                tone: "positive",
              },
              {
                label: "Facet highlight",
                value: "Sorted by fill line equipment, lubricant lot, and shift.",
                tone: "info",
              },
            ],
          },
          {
            type: "metrics",
            items: [
              {
                label: "Median time-to-resolve",
                value: "36 hours",
                tone: "success",
              },
              {
                label: "Top causes",
                value: "Valve wear • Lubricant drift",
                tone: "muted",
              },
              {
                label: "Common fixes",
                value: "Seal kit swap • Fill pressure recalibration",
                tone: "muted",
              },
            ],
          },
          {
            type: "timeline",
            title: "Agent trace",
            steps: [
              {
                title: "Retriever",
                description: "Vectors filtered to deviations with fill-line equipment metadata.",
                status: "completed",
              },
              {
                title: "Clusterer",
                description: "Grouped by valve series, lubricant lot, and recurrence pattern.",
                status: "completed",
              },
              {
                title: "Facet scorer",
                description: "Flagged lubricant viscosity as leading signal requiring review.",
                status: "warning",
              },
            ],
          },
        ],
        actions: [
          {
            id: "open-cluster",
            label: "Open cluster",
            variant: "primary",
            feedback: {
              variant: "success",
              message: "Investigative cluster opened with pre-filtered deviation packets",
            },
          },
          {
            id: "compare-similar",
            label: "Compare similar deviations",
            variant: "secondary",
            feedback: {
              variant: "success",
              message: "Comparison workspace queued with top-ranked similar deviations",
            },
          },
        ],
        copilot: {
          triggerLabel: "Open Investigation Copilot",
          summary: "Copilot prepared cluster analytics and suggested facets based on the initial deviation query.",
          conversation: [
            {
              id: "res-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:04",
              content: "Show me similar deviations to 24-D-311 and highlight anything QA already validated.",
            },
            {
              id: "res-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:04",
              content: "Found nine validated precedents across the last 18 months. Clustered by valve series, lubricant lot, and production shift.",
              highlights: [
                "Median time-to-resolve is 36 hours",
                "Lubricant viscosity drift appears in 7 / 9 cases",
                "Recommended facets: equipment, maintenance window, operator shift",
              ],
              suggestion: "Would you like me to compare lubricant lots across these deviations?",
            },
          ],
          followUps: [
            {
              id: "res-follow-compare",
              label: "Queue comparative analysis",
              description: "Copilot will load differential stats for the top three similar deviations.",
              feedback: {
                variant: "success",
                message: "Comparative analysis queued with lubricant lot differentials",
              },
            },
            {
              id: "res-follow-alert",
              label: "Subscribe to new matches",
              description: "Receive a Copilot ping if new deviations match this cluster signature.",
              feedback: {
                variant: "success",
                message: "Alert rule created for matching deviations over the next 30 days",
              },
            },
          ],
        },
      },
      {
        id: "msat-frame-exemplar",
        title: "Frame 3 — Document Viewer (Exemplar Deviation)",
        subtitle: "Deviation 21-D-044 reference packet",
        sections: [
          {
            type: "key-value",
            columns: 2,
            items: [
              {
                label: "Suspected cause",
                value: "Lubricant viscosity drift on valve series V-14.",
                tone: "danger",
              },
              {
                label: "Impact",
                value: "12% fill rate slowdown, 2 lots quarantined.",
                tone: "warning",
              },
              {
                label: "Resolution",
                value: "Replaced seal kit and flushed line; resumed within 8 hours.",
                tone: "success",
              },
              {
                label: "Recurrence",
                value: "No recurrence post-maintenance cycle (90 days).",
                tone: "muted",
              },
            ],
          },
        ],
        actions: [
          {
            id: "build-hypothesis",
            label: "Build Hypothesis",
            description: "Sends selected evidence to the active case board for synthesis.",
            variant: "primary",
            feedback: {
              variant: "success",
              message: "Evidence bundle pinned to Hypothesis Builder workspace",
            },
          },
        ],
        copilot: {
          triggerLabel: "Review exemplar with Copilot",
          summary: "Copilot extracted cause, impact, and resolution from the reference deviation for quick comparison.",
          conversation: [
            {
              id: "exp-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:06",
              content: "Summarise the exemplar deviation and confirm if the root cause aligns with 24-D-311.",
            },
            {
              id: "exp-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:06",
              content: "Deviation 21-D-044 resolved after replacing the seal kit and re-lubricating valve V-14. Impact mirrored current fill slowdowns with two quarantined lots.",
              highlights: [
                "Resolution within 8 hours after maintenance",
                "No recurrence in 90 days post-change",
                "Lubricant viscosity outside spec prior to fix",
              ],
              suggestion: "Would you like me to package these findings into the hypothesis workspace?",
            },
          ],
          followUps: [
            {
              id: "exp-follow-case",
              label: "Send evidence to case",
              description: "Attach the exemplar deviation excerpts to the active case board.",
              feedback: {
                variant: "success",
                message: "Exemplar deviation excerpts attached to the active case",
              },
            },
            {
              id: "exp-follow-share",
              label: "Share summary with QA",
              description: "Generate a QA-ready summary of the exemplar deviation.",
              feedback: {
                variant: "success",
                message: "QA summary drafted and awaiting review",
              },
            },
          ],
        },
      },
      {
        id: "msat-frame-hypothesis",
        title: "Frame 4 — Hypothesis Builder (Case Board)",
        subtitle: "AI synthesis and evidence curation",
        sections: [
          {
            type: "description",
            text: "AI draft: “Most likely: lubricant viscosity drift with valve series V-14; evidence in 3 reports.”",
          },
          {
            type: "bullet-list",
            title: "Evidence tiles",
            items: [
              {
                label: "Deviation 21-D-044",
                description: "Primary match with identical valve assembly.",
              },
              {
                label: "BatchLog_FillLine5_Q3",
                description: "Telemetry shows pressure oscillation during fill step.",
              },
              {
                label: "MaintenanceTicket_MSAT_882",
                description: "Lubricant changeover overdue by 2 shifts.",
              },
            ],
          },
          {
            type: "toggles",
            label: "Investigation toggles",
            note: "Toggles queue additional agent passes; outputs append to the case timeline.",
            toggles: [
              {
                id: "toggle-disconfirm",
                label: "Ask for disconfirming evidence",
                description: "Surface counterexamples where valve V-14 performed within spec.",
                defaultState: true,
                tone: "warning",
              },
              {
                id: "toggle-comparative",
                label: "Run comparative analysis (lots, ambient temp, shift)",
                description: "Cross-check yield, ambient data, and operator logs across candidate runs.",
                defaultState: true,
                tone: "success",
              },
            ],
          },
        ],
        copilot: {
          triggerLabel: "Review hypothesis with Copilot",
          summary: "Copilot synthesised the strongest hypothesis and queued additional analysis toggles.",
          conversation: [
            {
              id: "hyp-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:08",
              content: "Draft the leading hypothesis and highlight the supporting evidence tiles.",
            },
            {
              id: "hyp-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:08",
              content: "Primary hypothesis: lubricant viscosity drift on valve series V-14 driven by maintenance overdue by two shifts.",
              highlights: [
                "Deviation 21-D-044 mirrors the failure signature",
                "BatchLog_FillLine5_Q3 shows pressure oscillations aligning with the incident",
                "Maintenance ticket indicates lubricant changeover delay",
              ],
              suggestion: "You can toggle disconfirming evidence or comparative analysis and I will append findings to the case timeline.",
            },
          ],
          followUps: [
            {
              id: "hyp-follow-disconfirm",
              label: "Request disconfirming evidence",
              description: "Copilot will search for runs where valve V-14 met spec during similar conditions.",
              feedback: {
                variant: "success",
                message: "Disconfirming evidence search launched across the last 12 months",
              },
            },
            {
              id: "hyp-follow-compare",
              label: "Run comparative analysis",
              description: "Initiate ambient temperature and lot comparison across the selected runs.",
              feedback: {
                variant: "success",
                message: "Comparative analysis queued with ambient temperature overlays",
              },
            },
          ],
        },
      },
      {
        id: "msat-frame-compare",
        title: "Frame 5 — Compare Panel",
        subtitle: "Side-by-side analysis",
        sections: [
          {
            type: "table",
            title: "Deviation comparison",
            columns: ["Attribute", "24-D-311", "Case A", "Case B"],
            rows: [
              {
                cells: ["Valve series", "V-14", "V-14", "V-12"],
              },
              {
                cells: ["Lubricant lot", "B-204", "B-198", "B-204"],
                annotation: "Outlier",
              },
              {
                cells: ["Time to resolve", "42 h", "30 h", "48 h"],
              },
              {
                cells: ["Ambient temp", "21.3 °C", "20.9 °C", "23.1 °C"],
              },
            ],
            footnotes: [
              "Outlier lots highlight unique lubricant batch overlap.",
              "Data normalized via MSAT analytics pipeline v5.2.",
            ],
          },
          {
            type: "metrics",
            items: [
              {
                label: "Yield trend Δ",
                value: "-3.2%",
                tone: "danger",
              },
              {
                label: "Pressure variance",
                value: "+18% vs baseline",
                tone: "warning",
              },
              {
                label: "Sparkline insight",
                value: "Spike at shift C start",
                tone: "info",
              },
            ],
          },
          {
            type: "callout",
            title: "Outlier lots flagged",
            body: "Cluster analysis recommends quarantining lubricant lot B-204 until confirmatory tests complete.",
            tone: "danger",
          },
          {
            type: "timeline",
            title: "Trace sequence",
            steps: [
              {
                title: "Table Extractor",
                description: "Parsed multi-format logs and structured telemetry for comparison.",
                status: "completed",
              },
              {
                title: "Normalizer",
                description: "Aligned units and timestamps across deviations.",
                status: "completed",
              },
              {
                title: "Stats test",
                description: "ANOVA flagged lubricant lot effect with p-value 0.04.",
                status: "completed",
              },
              {
                title: "Rank hypotheses",
                description: "Queued deeper review due to lubricant lot anomaly.",
                status: "pending",
              },
            ],
          },
        ],
        actions: [
          {
            id: "share-comparison",
            label: "Share comparative panel",
            variant: "secondary",
            feedback: {
              variant: "success",
              message: "Comparative analysis panel shared with QA reviewers",
            },
          },
          {
            id: "flag-outliers",
            label: "Flag affected lots",
            variant: "ghost",
            feedback: {
              variant: "warning",
              message: "Lot B-204 flagged for quarantine pending confirmation",
            },
          },
        ],
        copilot: {
          triggerLabel: "Analyse comparisons with Copilot",
          summary: "Copilot aligned telemetry, maintenance, and statistical tests to isolate the lubricant lot anomaly.",
          conversation: [
            {
              id: "cmp-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:11",
              content: "Walk me through the comparative stats and call out anything that looks anomalous.",
            },
            {
              id: "cmp-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:11",
              content: "Lot B-204 shows an 8.1% drop in viscosity and +175% increase in valve cycles vs normal lots. Pressure variance spikes during shift C align with the incident.",
              highlights: [
                "Statistical confidence above 99% for viscosity variance",
                "Maintenance interval exceeded by 3.5 months",
                "Operator shift C correlates with cycle count spikes",
              ],
              suggestion: "Ready to push these findings into the action proposal or notify QA reviewers?",
            },
          ],
          followUps: [
            {
              id: "cmp-follow-export",
              label: "Export comparison snapshot",
              description: "Generate a PDF snapshot of the comparative analysis for external review.",
              feedback: {
                variant: "success",
                message: "Comparison snapshot exported to evidence locker",
              },
            },
            {
              id: "cmp-follow-adjust",
              label: "Adjust thresholds",
              description: "Update anomaly detection thresholds based on this comparison.",
              feedback: {
                variant: "success",
                message: "Detection thresholds updated with new lubricant variance bounds",
              },
            },
          ],
        },
      },
      {
        id: "msat-frame-action",
        title: "Frame 6 — Action Proposal",
        subtitle: "Recommended controls",
        sections: [
          {
            type: "bullet-list",
            title: "Suggested SOP references",
            items: [
              {
                label: "SOP-FillLine-112 v7",
                description: "Temporary control: increase lubricant change frequency.",
              },
              {
                label: "MSAT-Checklist-VALV",
                description: "Add valve inspection steps pre-shift C.",
              },
            ],
          },
          {
            type: "callout",
            title: "Temporary controls",
            body: "Auto-proposes interim inspection cadence and lubricant lot quarantine until CAPA approval.",
            tone: "warning",
          },
        ],
        actions: [
          {
            id: "draft-capa",
            label: "Draft CAPA",
            description: "Pre-fills CAPA form with selected evidence and hypothesis context.",
            variant: "primary",
            feedback: {
              variant: "success",
              message: "CAPA form drafted with linked evidence bundle",
            },
          },
          {
            id: "create-change-control",
            label: "Create Change Control ticket",
            description: "Opens TrackWise request with linked evidence bundle.",
            variant: "ghost",
            feedback: {
              variant: "success",
              message: "Change control draft assembled with CAPA references",
            },
          },
        ],
        copilot: {
          triggerLabel: "Review controls with Copilot",
          summary: "Copilot translated comparative findings into immediate and long-term control steps with SOP citations.",
          conversation: [
            {
              id: "act-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:14",
              content: "Generate recommended control steps and cite the SOPs we need to follow.",
            },
            {
              id: "act-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:14",
              content: "Drafted immediate measures: enhance pre-fill inspection per SOP-V421 and quarantine lot B-204. Longer-term strategy adds temperature monitoring and lubricant specification updates.",
              highlights: [
                "SOP-V421 governs valve inspection cadence",
                "MNT-SOP-118 covers temperature-specific lubricant selection",
                "QC-LUB-042 defines sampling requirements for lubricant verification",
              ],
              suggestion: "Ready to draft the CAPA or open a change control ticket with these references included.",
            },
          ],
          followUps: [
            {
              id: "act-follow-capa",
              label: "Draft CAPA now",
              description: "Copilot pre-fills the CAPA form with evidence and owners.",
              feedback: {
                variant: "success",
                message: "CAPA draft populated with timeline and owners",
              },
            },
            {
              id: "act-follow-share",
              label: "Share plan with operations",
              description: "Send the recommended steps to operations leads for awareness.",
              feedback: {
                variant: "success",
                message: "Operations leads notified with action proposal summary",
              },
            },
          ],
        },
      },
      {
        id: "msat-frame-decision",
        title: "Frame 7 — Decision & Handoff",
        subtitle: "Approvals and export",
        sections: [
          {
            type: "key-value",
            columns: 1,
            items: [
              {
                label: "Decision summary",
                value: "Approve lubricant lot quarantine and valve maintenance CAPA.",
                tone: "success",
              },
              {
                label: "Approver",
                value: "Quality Engineering Lead • Role-based dropdown defaulted to Priya Deshmukh.",
              },
              {
                label: "Follow-up check",
                value: "Schedule verification run for 2025-01-22.",
                tone: "info",
              },
            ],
          },
          {
            type: "callout",
            title: "Compliance & audit",
            body: "Exports CAPA packet as PDF with case hash, user role stamp (Jacob Weiss • MSAT Engineer), and immutable audit footer.",
            tone: "info",
          },
        ],
        actions: [
          {
            id: "export-capa-packet",
            label: "Export CAPA packet",
            variant: "secondary",
            feedback: {
              variant: "success",
              message: "Export package compiled with audit trail",
            },
          },
          {
            id: "schedule-follow-up",
            label: "Schedule follow-up check",
            variant: "ghost",
            feedback: {
              variant: "success",
              message: "Follow-up reminder scheduled with effectiveness check",
            },
          },
          {
            id: "request-approvals",
            label: "Request approvals",
            variant: "primary",
            feedback: {
              variant: "success",
              message: "Approval requests sent to QA Manager, Production Director, Engineering Lead",
            },
          },
        ],
        copilot: {
          triggerLabel: "Handle handoff with Copilot",
          summary: "Copilot packaged the decision memo, approvals, and exports for final sign-off.",
          conversation: [
            {
              id: "dec-1",
              role: "user",
              author: "Jacob Weiss",
              timestamp: "14:18",
              content: "Summarise the decision and prep the approval workflow.",
            },
            {
              id: "dec-2",
              role: "assistant",
              author: "Investigation Copilot",
              timestamp: "14:18",
              content: "Decision summary drafted with 92% confidence. Approval routing prepared for QA, Production, and Engineering leads. Export packet ready with CAPA, audit log, and executive summary.",
              highlights: [
                "CAPA packet includes 9 similar deviations and 14 SOP citations",
                "Audit trail captures investigation actions with timestamps",
                "Follow-up reminder defaults to 7 days post-implementation",
              ],
              suggestion: "Send approval requests or schedule the effectiveness check now?",
            },
          ],
          followUps: [
            {
              id: "dec-follow-approvals",
              label: "Send approval requests",
              description: "Route approvals to QA, production, and engineering leads with context.",
              feedback: {
                variant: "success",
                message: "Approval requests routed with audit-ready summary",
              },
            },
            {
              id: "dec-follow-export",
              label: "Export decision packet",
              description: "Generate final PDF packet with CAPA, audit log, and executive summary.",
              feedback: {
                variant: "success",
                message: "Decision packet exported to secure workspace",
              },
            },
          ],
        },
      },
    ],
    emptyStates: [
      {
        id: "few-matches",
        title: "Few similar deviations found",
        description: "Current filters return fewer than three precedents.",
        resolution: "Propose widening equipment window or include adjacent fill lines.",
        tone: "warning",
      },
      {
        id: "mixed-format",
        title: "Mixed source formats detected",
        description: "Two evidence files require OCR before extraction.",
        resolution: "Prompt user to run OCR helper for unparsed tables, then retry clustering.",
        tone: "info",
      },
      {
        id: "non-validated-sources",
        title: "Non-validated sources in cluster",
        description: "One batch log lacks SME validation stamp.",
        resolution: "Display banner and route to SME review before CAPA drafting.",
        tone: "error",
      },
    ],
  },
];

const normalise = (value: string) => value.toLowerCase();

const matchesKeywords = (query: string, keywords: string[]) => {
  const normalizedQuery = normalise(query);
  return keywords.every((keyword) => normalizedQuery.includes(normalise(keyword)));
};

export const findJourneyForQuery = (query: string) => {
  if (!query.trim()) {
    return null;
  }

  const normalizedQuery = normalise(query);

  return (
    journeys.find((journey) => {
      if (normalise(journey.defaultPrompt) === normalizedQuery) {
        return true;
      }
      return journey.matchers.some((matcher) => matchesKeywords(query, matcher.keywords));
    }) ?? null
  );
};

export const getJourneyById = (id: string) => journeys.find((journey) => journey.id === id) ?? null;

export { journeys };
