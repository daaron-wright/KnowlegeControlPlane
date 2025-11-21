"use client";

import { ReactNode } from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLayoutContext } from "@/context/layout-context";
import type { DocumentRecord, SavedScope, UserRole } from "./adapters/types";
import { formatConfidence, formatRelativeTime, formatDate } from "./adapters/formatters";

import { ContextualInsightSpotlight } from "./ContextualInsightSpotlight";
import { DocumentSelectionPanel } from "./DocumentSelectionPanel";

interface DocumentIntelligenceShowcaseProps {
  query: string;
  role?: UserRole; // Optional - will use context if not provided
  documents?: DocumentRecord[];
  activeScope?: SavedScope | null;
}

interface Highlight {
  id: string;
  stage: string;
  summary: string;
  action: string;
}

interface ChartCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  height: number;
  render: () => ReactNode;
}

const highlightText = (text: string) => {
  const parts = text.split(/(\[\[|\]\])/);
  const content: ReactNode[] = [];
  let isHighlight = false;

  parts.forEach((part, index) => {
    if (part === "[[") {
      isHighlight = true;
      return;
    }
    if (part === "]]" && isHighlight) {
      isHighlight = false;
      return;
    }
    if (!part) return;

    content.push(
      isHighlight ? (
        <mark key={`${part}-${index}`} className="rounded bg-primary/15 px-1 font-semibold text-primary">
          {part}
        </mark>
      ) : (
        <Fragment key={`${part}-${index}`}>{part}</Fragment>
      ),
    );
  });

  return content;
};

interface Scenario {
  id: string;
  title: string;
  description: string;
  badge: string;
  promptFallback: string;
  keywords: string[];
  charts: ChartCard[];
  highlights: Highlight[];
}

// Chart data constants (keeping all the data from original)
const sensorDriftData = [
  { time: "08:00", drift: 1.6, limit: 2.5 },
  { time: "09:00", drift: 2.0, limit: 2.5 },
  { time: "10:00", drift: 2.4, limit: 2.5 },
  { time: "11:00", drift: 2.7, limit: 2.5 },
  { time: "12:00", drift: 3.1, limit: 2.5 },
  { time: "13:00", drift: 2.8, limit: 2.5 },
];

const capaThroughputData = [
  { stage: "Immediate", open: 2, closed: 4 },
  { stage: "Short term", open: 3, closed: 5 },
  { stage: "Sustaining", open: 1, closed: 3 },
];

const sopDeltaData = [
  { category: "Procedure steps", v8: 14, v9: 18 },
  { category: "Equipment checks", v8: 9, v9: 12 },
  { category: "Approvals", v8: 4, v9: 6 },
];

const approvalTimelineData = [
  { week: "W-3", v8: 62, v9: 48 },
  { week: "W-2", v8: 54, v9: 36 },
  { week: "W-1", v8: 38, v9: 18 },
  { week: "Go-live", v8: 30, v9: 8 },
];

const pqReadinessData = [
  { day: "Mon", ready: 58, backlog: 22 },
  { day: "Tue", ready: 64, backlog: 18 },
  { day: "Wed", ready: 72, backlog: 15 },
  { day: "Thu", ready: 78, backlog: 11 },
  { day: "Fri", ready: 83, backlog: 8 },
];

const reviewerLoadData = [
  { reviewer: "QA", assigned: 5, completed: 3 },
  { reviewer: "MSAT", assigned: 4, completed: 4 },
  { reviewer: "Manufacturing", assigned: 3, completed: 2 },
];

const yieldDistribution = [
  { run: "Run 1", expected: 95.4, low: 87.1 },
  { run: "Run 2", expected: 94.8, low: 86.9 },
  { run: "Run 3", expected: 95.9, low: 88.4 },
  { run: "Run 4", expected: 94.2, low: 86.1 },
  { run: "Run 5", expected: 95.6, low: 87.6 },
  { run: "Run 6", expected: 94.9, low: 86.7 },
];

const densityVsYield = [
  { cellDensity: 3.8, yield: 95.1, cluster: "Expected" },
  { cellDensity: 3.7, yield: 94.9, cluster: "Expected" },
  { cellDensity: 3.9, yield: 95.4, cluster: "Expected" },
  { cellDensity: 3.5, yield: 93.8, cluster: "Expected" },
  { cellDensity: 3.4, yield: 92.9, cluster: "Low" },
  { cellDensity: 3.2, yield: 92.3, cluster: "Low" },
  { cellDensity: 3.1, yield: 91.7, cluster: "Low" },
  { cellDensity: 3.0, yield: 90.9, cluster: "Low" },
];

const phStability = [
  { day: "Day 1", expected: 7.35, low: 7.18 },
  { day: "Day 2", expected: 7.32, low: 7.12 },
  { day: "Day 3", expected: 7.3, low: 7.04 },
  { day: "Day 4", expected: 7.29, low: 6.96 },
  { day: "Day 5", expected: 7.31, low: 6.92 },
  { day: "Day 6", expected: 7.33, low: 6.88 },
];

const temperatureConsistency = [
  { hour: "0", expected: 37.2, low: 37.1 },
  { hour: "2", expected: 37.1, low: 36.9 },
  { hour: "4", expected: 37.0, low: 36.6 },
  { hour: "6", expected: 36.9, low: 36.4 },
  { hour: "8", expected: 36.8, low: 36.1 },
  { hour: "10", expected: 36.8, low: 35.9 },
  { hour: "12", expected: 36.7, low: 35.6 },
];

const lineYieldTrend = [
  { shift: "Shift A", actual: 95.6, target: 96.2 },
  { shift: "Shift B", actual: 94.8, target: 96.2 },
  { shift: "Shift C", actual: 95.9, target: 96.2 },
  { shift: "Shift D", actual: 95.4, target: 96.2 },
];

const capabilityIndex = [
  { parameter: "Fill pressure", ppk: 1.46, threshold: 1.33 },
  { parameter: "Viscosity", ppk: 1.38, threshold: 1.33 },
  { parameter: "Temperature", ppk: 1.41, threshold: 1.33 },
  { parameter: "Torque", ppk: 1.34, threshold: 1.33 },
];

const deviationAgingBuckets = [
  { bucket: "< 24h", open: 1, resolved: 4 },
  { bucket: "1-3d", open: 2, resolved: 5 },
  { bucket: "3-5d", open: 1, resolved: 3 },
  { bucket: ">5d", open: 2, resolved: 2 },
];

const capaCapacityOutlook = [
  { week: "W-2", capacity: 6, demand: 7 },
  { week: "W-1", capacity: 6, demand: 8 },
  { week: "This week", capacity: 7, demand: 6 },
  { week: "Next week", capacity: 8, demand: 5 },
];

const auditEvidenceProgress = [
  { packet: "PQ evidence", completed: 82, outstanding: 18 },
  { packet: "Deviation summaries", completed: 76, outstanding: 24 },
  { packet: "Training logs", completed: 91, outstanding: 9 },
];

const reviewerCapacityTrend = [
  { day: "Mon", assigned: 6, capacity: 8 },
  { day: "Tue", assigned: 5, capacity: 7 },
  { day: "Wed", assigned: 7, capacity: 7 },
  { day: "Thu", assigned: 6, capacity: 8 },
  { day: "Fri", assigned: 5, capacity: 8 },
];

const colorMap: Record<string, string> = {
  Expected: "#2563eb",
  Low: "#f97316",
};

// Scenario definitions (keeping all scenarios from original)
const batchExcursionScenario: Scenario = {
  id: "batch-excursion",
  title: "Batch excursion investigation",
  description:
    "Sensor drift excursion summarized with CAPA throughput so QA can close the loop from alert to sustaining action.",
  badge: "Deviation case",
  promptFallback: "Provide a concise summary of the latest batch excursion with root cause and CAPA owner.",
  keywords: ["batch excursion", "sensor drift", "capa", "root cause", "excursion", "drift"],
  charts: [
    {
      id: "sensor-drift",
      badge: "Deviation summary",
      title: "Fill line drift against limit",
      subtitle: "Line 5 lubricant pressure sensor",
      cta: "Open CAPA workspace",
      height: 224,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensorDriftData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis unit="%" stroke="rgba(148, 163, 184, 0.9)" domain={[1, 3.5]} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={2.5} stroke="#f97316" strokeDasharray="4 4" label={{ value: "Limit", position: "insideTop" }} />
            <Line type="monotone" dataKey="drift" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Observed drift" />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "capa-throughput",
      badge: "Remediation progress",
      title: "CAPA status by phase",
      subtitle: "Work orders grouped by action window",
      cta: "Commit closure dates",
      height: 220,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={capaThroughputData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="stage" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" name="Open" fill="#f97316" radius={[6, 6, 0, 0]} />
            <Bar dataKey="closed" name="Closed" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "excursion-notes",
      stage: "Root cause",
      summary: "Lubricant viscosity shift linked to ambient humidity spike at 12:04.",
      action: "Log countermeasure",
    },
    {
      id: "capa-owner",
      stage: "Owner",
      summary: "Mechanical engineering owns immediate actions; QA signs off sustaining plan.",
      action: "Assign follow-up",
    },
    {
      id: "stability-window",
      stage: "Monitoring",
      summary: "Additional sampling scheduled every 30 minutes until drift < 2%.",
      action: "Preview sampling plan",
    },
    {
      id: "audit-log",
      stage: "Audit",
      summary: "Deviation notes and CAPA commitments synced to case #24-D-311.",
      action: "View case record",
    },
  ],
};

const sopDiffScenario: Scenario = {
  id: "sop-compare",
  title: "SOP revision comparison",
  description:
    "Procedure deltas between SOP-123 v9 and v8 with sign-off velocity so auditors can trace exactly what changed.",
  badge: "Change control",
  promptFallback: "Compare SOP-123 v9 against v8 for procedural, equipment, and approval deltas.",
  keywords: ["compare sop", "sop-123", "revision", "v9", "v8", "difference", "change"],
  charts: [
    {
      id: "sop-deltas",
      badge: "Process impact",
      title: "Step counts by section",
      subtitle: "Increase in required checks with v9 rollout",
      cta: "Download diff report",
      height: 220,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sopDeltaData} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="category" stroke="rgba(148, 163, 184, 0.9)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="v8" name="v8" fill="#94a3b8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="v9" name="v9" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "approval-velocity",
      badge: "Workflow speed",
      title: "Approval cycle time",
      subtitle: "Average hours remaining until sign-off",
      cta: "Route for signature",
      height: 220,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={approvalTimelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="week" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="v8" name="v8" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="v9" name="v9" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "change-summary",
      stage: "Summary",
      summary: "Five new aseptic checks introduced; cleaning cycle extended by 12 minutes.",
      action: "Generate memo",
    },
    {
      id: "training",
      stage: "Training",
      summary: "Operator training completion at 94%; two sessions scheduled this week.",
      action: "View roster",
    },
    {
      id: "risk-flags",
      stage: "Risk",
      summary: "No deviations triggered in pilot runs; monitoring emphasis on filtration steps.",
      action: "Review monitoring plan",
    },
    {
      id: "audit-status",
      stage: "Audit",
      summary: "Change-control ticket CC-452 closed with embedded comparison log.",
      action: "Open ticket",
    },
  ],
};

const pqRoutingScenario: Scenario = {
  id: "pq-routing",
  title: "PQ routing briefing",
  description:
    "Routing note blends readiness metrics with reviewer workload so SMEs can accept PQ-Line-5-2024Q4 quickly.",
  badge: "PQ handoff",
  promptFallback: "Generate a routing note assigning PQ-Line-5-2024Q4 to SME with validation highlights.",
  keywords: ["routing note", "pq-line-5", "pq", "sme", "handoff", "route"],
  charts: [
    {
      id: "readiness-progress",
      badge: "Readiness outlook",
      title: "Completion vs backlog",
      subtitle: "Automation readiness across the current week",
      cta: "Send routing note",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pqReadinessData}>
            <defs>
              <linearGradient id="readyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="backlogGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="day" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="ready" name="Ready %" stroke="#2563eb" fill="url(#readyGradient)" />
            <Area type="monotone" dataKey="backlog" name="Backlog %" stroke="#f97316" fill="url(#backlogGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "reviewer-load",
      badge: "Reviewer balance",
      title: "Assignments per reviewer",
      subtitle: "Shows total routed vs completed packets",
      cta: "Balance workload",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reviewerLoadData} barGap={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="reviewer" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="assigned" name="Assigned" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "validation-callouts",
      stage: "Validation",
      summary: "Yield uplift sustained at +2.1% with all holds released.",
      action: "Attach summary",
    },
    {
      id: "handoff",
      stage: "Next step",
      summary: "Send to QA (Priya Deshmukh) with priority flag to meet Friday cutoff.",
      action: "Route now",
    },
    {
      id: "evidence",
      stage: "Evidence",
      summary: "Five PQ attachments included with lineage metadata.",
      action: "Review attachments",
    },
    {
      id: "sla",
      stage: "SLA",
      summary: "Current reviewer workload leaves 6-hour buffer for compliance check.",
      action: "Update SLA",
    },
  ],
};

const defaultScenario: Scenario = {
  id: "default",
  title: "Run log comparison intelligence",
  description:
    "Charts generated from the retrieved SOP and run logs to validate clusters, monitor stability, and brief stakeholders.",
  badge: "Live outputs",
  promptFallback: "Show latest SOP-123 visuals",
  keywords: [],
  charts: [
    {
      id: "yield-distribution",
      badge: "Cluster summary",
      title: "Yield distribution by run",
      subtitle: "Expected vs low-yield cluster",
      cta: "Explore lot variance",
      height: 224,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={yieldDistribution} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="run" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis unit="%" stroke="rgba(148, 163, 184, 0.9)" domain={[84, 98]} />
            <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.12)" }} />
            <Legend />
            <Bar dataKey="expected" name="Expected yield" radius={[6, 6, 0, 0]} fill={colorMap.Expected} />
            <Bar dataKey="low" name="Low-yield cluster" radius={[6, 6, 0, 0]} fill={colorMap.Low} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "cell-density",
      badge: "Deviation focus",
      title: "Cell density vs yield",
      subtitle: "Cluster split by cohort",
      cta: "View lot B precedent",
      height: 224,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              dataKey="cellDensity"
              name="Cell density"
              unit="×10⁶/mL"
              stroke="rgba(148, 163, 184, 0.9)"
              domain={[2.8, 4.1]}
            />
            <YAxis dataKey="yield" name="Yield" unit="%" stroke="rgba(148, 163, 184, 0.9)" domain={[90, 97]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {Object.keys(colorMap).map((cluster) => (
              <Scatter
                key={cluster}
                name={cluster}
                data={densityVsYield.filter((point) => point.cluster === cluster)}
                fill={colorMap[cluster]}
              />
            ))}
            <ReferenceLine y={93} stroke="rgba(148, 163, 184, 0.6)" strokeDasharray="4 4" />
          </ScatterChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "ph-stability",
      badge: "Process stability",
      title: "pH trend comparison",
      subtitle: "Expected window vs low-yield set",
      cta: "Flag pH drift action",
      height: 208,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={phStability}>
            <defs>
              <linearGradient id="expectedPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorMap.Expected} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colorMap.Expected} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lowPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorMap.Low} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colorMap.Low} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="day" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" domain={[6.6, 7.4]} />
            <Tooltip />
            <Legend />
            <ReferenceArea y1={7.2} y2={7.4} fill="rgba(37, 99, 235, 0.08)" stroke="none" />
            <Area type="monotone" dataKey="expected" stroke={colorMap.Expected} fill="url(#expectedPh)" name="Expected" />
            <Area type="monotone" dataKey="low" stroke={colorMap.Low} fill="url(#lowPh)" name="Low-yield" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "temperature",
      badge: "Environmental watch",
      title: "Temperature consistency",
      subtitle: "Hourly tracking",
      cta: "Attach to memo timeline",
      height: 208,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureConsistency}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="hour" stroke="rgba(148, 163, 184, 0.9)" label={{ value: "Hours", position: "insideBottom", offset: -6 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" domain={[35, 38]} label={{ value: "°C", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expected" stroke={colorMap.Expected} strokeWidth={2} dot={false} name="Expected" />
            <Line type="monotone" dataKey="low" stroke={colorMap.Low} strokeWidth={2} dot={{ r: 3 }} name="Low-yield" />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "cluster-summary",
      stage: "Cluster",
      summary: "Lot B drives the low-yield cohort with 86–88% output across two runs.",
      action: "Review cluster insight",
    },
    {
      id: "evidence-strength",
      stage: "Evidence",
      summary: "Evidence strength remains High for reagent lot correlation and Moderate for dissolved oxygen.",
      action: "Evaluate robustness",
    },
    {
      id: "memo-draft",
      stage: "Decision",
      summary: "Decision memo drafted with citations ready for peer review.",
      action: "Edit decision memo",
    },
    {
      id: "approval",
      stage: "Approval",
      summary: "Review timeline shows QA sign-off pending with 2 comments open.",
      action: "Finalize export",
    },
  ],
};

const msatLineHealthScenario: Scenario = {
  id: "msat-line-health",
  title: "Line 5 performance command center",
  description:
    "Yield variance and capability insights across the last four shifts so MSAT can stabilise throughput without pausing the line.",
  badge: "Batch performance",
  promptFallback: "Compare Line 5 PQ yields vs baseline.",
  keywords: ["line 5", "batch performance", "yield", "throughput", "baseline", "performance"],
  charts: [
    {
      id: "line-yield",
      badge: "Shift variance",
      title: "Yield vs target by shift",
      subtitle: "Rolling average across the last 4 shifts",
      cta: "Open shift dossier",
      height: 224,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineYieldTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="shift" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis unit="%" stroke="rgba(148, 163, 184, 0.9)" domain={[94, 97]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "capability-index",
      badge: "Capability",
      title: "Process capability window",
      subtitle: "Ppk vs quality threshold",
      cta: "Launch SPC overlay",
      height: 224,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={capabilityIndex} barGap={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="parameter" stroke="rgba(148, 163, 184, 0.9)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" domain={[1.2, 1.6]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="ppk" name="Ppk" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="threshold" name="Threshold" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "yield-alert",
      stage: "Yield insight",
      summary: "Shift B trending 0.8% under target; humidity telemetry flagged for overlay review.",
      action: "Open telemetry overlay",
    },
    {
      id: "capability-watch",
      stage: "Capability",
      summary: "Fill pressure Ppk at 1.46 with torque nearing threshold—schedule gasket check before next run.",
      action: "Create maintenance task",
    },
    {
      id: "spc-note",
      stage: "SPC",
      summary: "Control chart will trigger if actual yield dips below 94.7% in the next shift.",
      action: "Preview SPC chart",
    },
    {
      id: "handover",
      stage: "Handover",
      summary: "Include variance summary in shift handover package for Ops supervisor.",
      action: "Push to handover",
    },
  ],
};

const msatDeviationScenario: Scenario = {
  id: "msat-deviation",
  title: "Deviation triage briefing",
  description:
    "Ageing distribution of open deviations with CAPA demand so MSAT can rebalance resources before SLA hits.",
  badge: "Deviation recovery",
  promptFallback: "List deviations awaiting MSAT validation.",
  keywords: ["deviation", "triage", "awaiting validation", "capa", "corrective", "root cause"],
  charts: [
    {
      id: "deviation-aging",
      badge: "Age buckets",
      title: "Open vs resolved by age",
      subtitle: "Focus on keeping >5d cases under control",
      cta: "Prioritise oldest cases",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={deviationAgingBuckets} barGap={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="bucket" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" name="Open" fill="#f97316" radius={[6, 6, 0, 0]} />
            <Bar dataKey="resolved" name="Resolved" fill="#16a34a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "capa-outlook",
      badge: "Capacity",
      title: "CAPA capacity vs demand",
      subtitle: "Next two-week outlook",
      cta: "Reassign SMEs",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={capaCapacityOutlook}>
            <defs>
              <linearGradient id="capacityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="week" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="capacity" name="Capacity" stroke="#16a34a" fill="url(#capacityGradient)" />
            <Area type="monotone" dataKey="demand" name="Demand" stroke="#f97316" fill="url(#demandGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "aging-focus",
      stage: "Ageing",
      summary: "Two deviations over five days require immediate SME attention to avoid SLA breach.",
      action: "Escalate to SME",
    },
    {
      id: "capacity-gap",
      stage: "Capacity",
      summary: "Demand outpaces capacity this week; redeploy validation analyst from line 6.",
      action: "Rebalance staffing",
    },
    {
      id: "capa-note",
      stage: "CAPA",
      summary: "Draft CAPA templates queued for lubrication valve family to accelerate closure.",
      action: "Review templates",
    },
    {
      id: "communication",
      stage: "Comms",
      summary: "Send deviation digest before 15:00 to keep QA in sync on action status.",
      action: "Send digest",
    },
  ],
};

const msatAuditScenario: Scenario = {
  id: "msat-audit",
  title: "Audit readiness progress",
  description:
    "Evidence packet status and reviewer load so MSAT can certify PQ documentation ahead of audit day.",
  badge: "Audit prep",
  promptFallback: "Prepare audit readout for PQ evidence and reviewer load.",
  keywords: ["audit", "pq evidence", "reviewer", "readiness", "approval", "packet"],
  charts: [
    {
      id: "evidence-progress",
      badge: "Evidence",
      title: "Packet completion status",
      subtitle: "Completed vs outstanding items",
      cta: "Open audit checklist",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={auditEvidenceProgress} barGap={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="packet" stroke="rgba(148, 163, 184, 0.9)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" name="Completed %" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="outstanding" name="Outstanding %" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "reviewer-capacity",
      badge: "Workload",
      title: "Reviewer capacity vs assignments",
      subtitle: "Daily view across QA and MSAT reviewers",
      cta: "Balance assignments",
      height: 216,
      render: () => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={reviewerCapacityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis dataKey="day" stroke="rgba(148, 163, 184, 0.9)" />
            <YAxis stroke="rgba(148, 163, 184, 0.9)" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="capacity" name="Capacity" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="assigned" name="Assigned" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  ],
  highlights: [
    {
      id: "evidence-gap",
      stage: "Evidence",
      summary: "Deviation summaries at 76% completion—flag SMEs to attach sign-off notes.",
      action: "Ping SMEs",
    },
    {
      id: "reviewer-load",
      stage: "Workload",
      summary: "Wednesday workload matches capacity; consider pre-assigning Friday packets now.",
      action: "Pre-assign packets",
    },
    {
      id: "audit-brief",
      stage: "Brief",
      summary: "Draft audit brief available with updated metrics—share with compliance lead.",
      action: "Share audit brief",
    },
    {
      id: "sla-check",
      stage: "SLA",
      summary: "Outstanding items maintain 6-hour buffer before audit freeze window.",
      action: "Confirm freeze window",
    },
  ],
};

const msatDefaultScenario = msatLineHealthScenario;

const scenariosByRole: Record<UserRole, Scenario[]> = {
  "R&D": [batchExcursionScenario, sopDiffScenario, pqRoutingScenario],
  MSAT: [msatLineHealthScenario, msatDeviationScenario, msatAuditScenario],
};

const defaultScenarioByRole: Record<UserRole, Scenario> = {
  "R&D": defaultScenario,
  MSAT: msatDefaultScenario,
};

const selectScenario = (role: UserRole, query: string): Scenario => {
  const normalized = query.trim().toLowerCase();
  const scenarios = scenariosByRole[role];
  const defaultForRole = defaultScenarioByRole[role];

  if (!normalized) {
    return defaultForRole;
  }

  // Prioritize specific keywords that should match regardless of role
  // Check for "batch excursion" first - this should always match batchExcursionScenario
  if (normalized.includes("batch excursion") || (normalized.includes("batch") && normalized.includes("excursion"))) {
    return batchExcursionScenario;
  }

  // Check for "compare sop" or SOP revision keywords
  if (normalized.includes("compare sop") || (normalized.includes("compare") && (normalized.includes("sop") || normalized.includes("revision")))) {
    return sopDiffScenario;
  }

  // Check for routing/PQ keywords
  if (normalized.includes("routing") && (normalized.includes("pq") || normalized.includes("sme"))) {
    return pqRoutingScenario;
  }

  // Then check role-specific scenarios via keyword matching
  const directMatch = scenarios.find((scenario) =>
    scenario.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (directMatch) {
    return directMatch;
  }

  // Fallback to role-based keyword matching
  if (role === "R&D") {
    if (normalized.includes("excursion") || normalized.includes("root cause")) {
      return batchExcursionScenario;
    }
    if (normalized.includes("compare") || normalized.includes("revision") || normalized.includes("v9")) {
      return sopDiffScenario;
    }
    if (normalized.includes("routing") || normalized.includes("pq") || normalized.includes("sme")) {
      return pqRoutingScenario;
    }
  } else {
    // For MSAT, only match deviation/triage if it's NOT a batch excursion
    if ((normalized.includes("deviation") || normalized.includes("triage")) && !normalized.includes("batch excursion") && !normalized.includes("excursion")) {
      return msatDeviationScenario;
    }
    if (normalized.includes("audit") || normalized.includes("reviewer")) {
      return msatAuditScenario;
    }
    if (normalized.includes("line 5") || normalized.includes("performance") || normalized.includes("yield")) {
      return msatLineHealthScenario;
    }
  }

  return defaultForRole;
};

export const DocumentIntelligenceShowcase = ({ query, role: roleProp, documents = [], activeScope }: DocumentIntelligenceShowcaseProps) => {
  // Note: router is available but navigation is handled via toast messages for now
  // const router = useRouter();
  const { triggerToast, role: contextRole } = useLayoutContext();
  // Use role from props if provided, otherwise use context role
  const role = roleProp ?? contextRole;
  const scenario = selectScenario(role, query);

  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [focusedDocumentId, setFocusedDocumentId] = useState<string | null>(null);
  const [promptedDocumentIds, setPromptedDocumentIds] = useState<string[]>([]);
  const [lastPromptedDocumentId, setLastPromptedDocumentId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDocumentIds([]);
    setFocusedDocumentId(null);
    setPromptedDocumentIds([]);
    setLastPromptedDocumentId(null);
  }, [query, role]);

  useEffect(() => {
    setSelectedDocumentIds((prev) => prev.filter((id) => documents.some((doc) => doc.id === id)));
  }, [documents]);

  useEffect(() => {
    setPromptedDocumentIds((prev) => {
      const filtered = prev.filter((id) => selectedDocumentIds.includes(id));
      if (filtered.length !== prev.length) {
        setLastPromptedDocumentId((current) => (current && filtered.includes(current) ? current : null));
      }
      return filtered;
    });
  }, [selectedDocumentIds]);

  useEffect(() => {
    if (selectedDocumentIds.length === 0) {
      setFocusedDocumentId(null);
      return;
    }
    if (focusedDocumentId && selectedDocumentIds.includes(focusedDocumentId)) {
      return;
    }
    setFocusedDocumentId(selectedDocumentIds[0]);
  }, [focusedDocumentId, selectedDocumentIds]);

  const handleToggleDocument = (id: string) => {
    const isSelected = selectedDocumentIds.includes(id);
    setSelectedDocumentIds((prev) =>
      isSelected ? prev.filter((docId) => docId !== id) : [...prev, id],
    );
    if (isSelected) {
      setPromptedDocumentIds((prev) => prev.filter((docId) => docId !== id));
      setLastPromptedDocumentId((prev) => (prev === id ? null : prev));
    } else {
      setFocusedDocumentId(id);
    }
  };

  const handleFocusDocument = (id: string) => {
    if (!selectedDocumentIds.includes(id)) {
      setSelectedDocumentIds((prev) => [...prev, id]);
    }
    setFocusedDocumentId(id);
  };

  const handleClearSelection = () => {
    setSelectedDocumentIds([]);
    setFocusedDocumentId(null);
    setPromptedDocumentIds([]);
    setLastPromptedDocumentId(null);
  };

  const handleDocumentPrompt = (document: DocumentRecord) => {
    if (!selectedDocumentIds.includes(document.id)) {
      setSelectedDocumentIds((prev) => [...prev, document.id]);
    }
    setFocusedDocumentId(document.id);
    const alreadyPrompted = promptedDocumentIds.includes(document.id);
    setPromptedDocumentIds((prev) => {
      if (prev.includes(document.id)) {
        return prev;
      }
      return [...prev, document.id];
    });
    if (!alreadyPrompted) {
      setLastPromptedDocumentId(document.id);
    }
    triggerToast(
      "success",
      `${alreadyPrompted ? "Prompt refreshed" : "Prompting"} contextual insight for ${document.title}.`,
    );
  };

  const selectedDocuments = useMemo(
    () => documents.filter((doc) => selectedDocumentIds.includes(doc.id)),
    [documents, selectedDocumentIds],
  );
  const hasSelection = selectedDocuments.length > 0;

  const contextualDocuments = role === "R&D" ? selectedDocuments : [];

  const promptReadyDocuments = useMemo(
    () => contextualDocuments.filter((doc) => promptedDocumentIds.includes(doc.id)),
    [contextualDocuments, promptedDocumentIds],
  );
  const validatedPromptedDocuments = useMemo(
    () => promptReadyDocuments.filter((doc) => doc.validated),
    [promptReadyDocuments],
  );
  const hasContextualInsight = promptReadyDocuments.length > 0;
  const canAccessInsights = role === "R&D";
  
  // Track any selected and prompted documents (for charts display)
  const promptedSelectedDocuments = useMemo(
    () => selectedDocuments.filter((doc) => promptedDocumentIds.includes(doc.id)),
    [selectedDocuments, promptedDocumentIds],
  );
  const hasPromptedDocuments = promptedSelectedDocuments.length > 0;

  const gateStepLabel = canAccessInsights
    ? hasSelection
      ? "Step B · Prompt insights"
      : "Step A · Select documents"
    : "Access required";

  const gateTitle = !canAccessInsights
    ? "AI document intelligence requires an R&D role"
    : hasSelection
      ? "Prompt a focused document to activate contextual insights"
      : "Select a document to start AI document intelligence";

  const gateDescription = !canAccessInsights
    ? "Switch to an R&D permission set to generate contextual recommendations. You can still route documents using the navigation above."
    : hasSelection
      ? "Use the prompt controls inside the document selection grid to ask targeted questions. Once a prompt runs, contextual summaries, evidence metadata, and routing plans unlock here."
      : "Choose at least one validated document from the selection grid. Focus it to tell AI Document Intelligence what to brief.";

  const gateChecklist = !canAccessInsights
    ? [
        "Confirm your workspace permissions include AI Document Intelligence access.",
        "Work with an R&D teammate or request elevated access before prompting insights.",
      ]
    : hasSelection
      ? [
          "Trigger a prompt on one of the selected documents from the grid controls.",
          "Focus the document you want in the spotlight for follow-on actions.",
        ]
      : [
          "Select validated documents from the left-hand selection panel.",
          "Focus a document to prepare it for prompting and routing.",
        ];

  const gateActionLabel = !canAccessInsights
    ? "Request access"
    : hasSelection
      ? "Next action · Prompt insights"
      : "First action · Select documents";

  const primaryDocument = promptReadyDocuments.length
    ? validatedPromptedDocuments.find((doc) => doc.id === focusedDocumentId) ??
      promptReadyDocuments.find((doc) => doc.id === focusedDocumentId) ??
      validatedPromptedDocuments[0] ??
      promptReadyDocuments[0]
    : null;

  const supportingDocument =
    primaryDocument && promptReadyDocuments.length > 1
      ? validatedPromptedDocuments.find((doc) => doc.id !== primaryDocument.id) ??
        promptReadyDocuments.find((doc) => doc.id !== primaryDocument.id) ??
        null
      : null;

  const promptUsed = useMemo(() => {
    if (query.trim()) {
      return query;
    }
    if (primaryDocument) {
      return `${scenario.promptFallback} — focus on ${primaryDocument.title}`;
    }
    return scenario.promptFallback;
  }, [primaryDocument, query, scenario.promptFallback]);

  const primarySummary =
    primaryDocument?.highlight ? highlightText(primaryDocument.highlight) : scenario.description;
  const supportingSummary = supportingDocument?.highlight ? highlightText(supportingDocument.highlight) : null;

  const destinationMetadata: Record<string, { label: string; detail: string }> = {
    "/": {
      label: "the Search workspace",
      detail: "Surface cross-repository evidence with contextual AI insights and scoped filters.",
    },
    "/cases": {
      label: "the Cases workspace",
      detail: "Organize contextual briefs, evidence packets, and SME routing for handoffs.",
    },
    "/reviews": {
      label: "the Reviews queue",
      detail: "Track approvals, CAPA follow-ups, and validation reviews awaiting action.",
    },
    "/admin": {
      label: "the Admin console",
      detail: "Manage scopes, permissions, automation policies, and retention controls.",
    },
  };

  const resolveActionDestination = (label: string) => {
    const normalized = label.toLowerCase();
    if (
      normalized.includes("case") ||
      normalized.includes("capa") ||
      normalized.includes("memo") ||
      normalized.includes("brief") ||
      normalized.includes("packet")
    ) {
      return "/cases";
    }
    if (
      normalized.includes("review") ||
      normalized.includes("approve") ||
      normalized.includes("signature") ||
      normalized.includes("assign") ||
      normalized.includes("queue")
    ) {
      return "/reviews";
    }
    if (
      normalized.includes("automation") ||
      normalized.includes("admin") ||
      normalized.includes("policy") ||
      normalized.includes("configure")
    ) {
      return "/admin";
    }
    return "/";
  };

  const navigateWithMessage = (path: string, summary: string) => {
    const destination = destinationMetadata[path] ?? destinationMetadata["/"];
    // For now, just show toast - navigation can be implemented later if needed
    triggerToast("success", `${summary} → ${destination.label}. ${destination.detail}`);
  };

  const handleAction = (actionLabel: string, context: string) => {
    const path = resolveActionDestination(actionLabel);
    const summary = context ? `${actionLabel} — ${context}` : actionLabel;
    navigateWithMessage(path, summary);
  };

  const contextFilters = activeScope?.filters.slice(0, 3) ?? [];

  return (
    <section className="rounded-[32px] border border-border/50 bg-card/95 p-8 shadow-[0_32px_80px_-50px_rgba(33,71,182,0.45)]">
      <div className="flex flex-col gap-8">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">AI document intelligence</p>
            <h2 className="text-3xl font-semibold leading-tight text-foreground">{scenario.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground/85">{scenario.description}</p>
            <p className="text-xs text-muted-foreground/80/75">
              Prompt used: <span className="font-semibold text-foreground">"{promptUsed}"</span>
            </p>
          </div>
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {scenario.badge}
          </Badge>
        </header>

        <div className="rounded-[24px] border border-primary/30 bg-primary/5 p-4 text-xs text-primary">
          <div className="flex flex-wrap items-center gap-3 font-semibold uppercase tracking-[0.35em]">
            <span>Workflow anchors</span>
            <span className="h-0.5 flex-1 bg-primary/40" aria-hidden />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">Step A</p>
              <p className="mt-1 text-sm font-semibold text-primary">Select documents</p>
              <p className="text-xs text-primary/80">Choose validated sources powering insights.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">Step B</p>
              <p className="mt-1 text-sm font-semibold text-primary">Prompt insights</p>
              <p className="text-xs text-primary/80">Generate contextual guidance per document.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em]">Step C</p>
              <p className="mt-1 text-sm font-semibold text-primary">Route actions</p>
              <p className="text-xs text-primary/80">Send briefs to cases, reviews, or admin.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <DocumentSelectionPanel
            documents={documents}
            selectedIds={selectedDocumentIds}
            focusedId={primaryDocument?.id ?? focusedDocumentId}
            promptedIds={promptedDocumentIds}
            onToggle={handleToggleDocument}
            onFocus={handleFocusDocument}
            onPrompt={handleDocumentPrompt}
            onClear={handleClearSelection}
            lastPromptedId={lastPromptedDocumentId}
          />

          {/* Show charts when documents are prompted OR when we have a scenario with charts and at least one document selected */}
          {(hasPromptedDocuments || (scenario.charts.length > 0 && hasSelection)) && (
            <>
              <div className="grid grid-cols-1 gap-5">
                {scenario.charts.slice(0, 2).map((card) => (
                  <article
                    key={card.id}
                    className="flex h-full flex-col gap-4 rounded-[28px] border border-border/60 bg-surface-base/80 p-5 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">{card.badge}</p>
                        <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                        <p className="text-xs text-muted-foreground/80">{card.subtitle}</p>
                      </div>
                    </div>
                    <div style={{ height: card.height }}>{card.render()}</div>
                    <Button
                      variant="outline"
                      className="mt-auto w-fit rounded-full border-border/60 px-5 py-2 text-sm font-semibold text-primary hover:border-primary/40 hover:bg-primary/10"
                      onClick={() => handleAction(card.cta, card.title)}
                    >
                      {card.cta}
                      <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                    </Button>
                  </article>
                ))}
              </div>

              {scenario.charts.length > 2 && (
                <div className="grid grid-cols-1 gap-5">
                  {scenario.charts.slice(2).map((card) => (
                    <article
                      key={card.id}
                      className="flex h-full flex-col gap-4 rounded-[28px] border border-border/60 bg-surface-base/80 p-5 shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">{card.badge}</p>
                          <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                          <p className="text-xs text-muted-foreground/80">{card.subtitle}</p>
                        </div>
                      </div>
                      <div style={{ height: card.height }}>{card.render()}</div>
                      <Button
                        variant="outline"
                        className="mt-auto w-fit rounded-full border-border/60 px-5 py-2 text-sm font-semibold text-primary hover:border-primary/40 hover:bg-primary/10"
                        onClick={() => handleAction(card.cta, card.title)}
                      >
                        {card.cta}
                        <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {hasContextualInsight && primaryDocument ? (
            <>
              <ContextualInsightSpotlight
                primaryDocument={primaryDocument}
                supportingDocument={supportingDocument}
                primarySummary={primarySummary}
                supportingSummary={supportingSummary}
                prompt={promptUsed}
                scope={activeScope ?? null}
                contextFilters={contextFilters}
                onOpenBrief={() =>
                  navigateWithMessage(
                    "/cases",
                    `Contextual brief staged for ${primaryDocument.title}`,
                  )
                }
                onRouteAction={handleAction}
              />
            </>
          ) : null}

          {scenario.highlights.length > 0 && (
                <div className="rounded-[28px] border border-border/60 bg-surface-base/80 p-5 shadow-lg">
                  <Tabs defaultValue={scenario.highlights[0]?.id ?? ""} className="w-full">
                    <div className="flex flex-col gap-4">
                      <TabsList className="flex w-full flex-wrap gap-2 rounded-2xl bg-primary/10 p-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/70">
                        {scenario.highlights.map((highlight) => (
                          <TabsTrigger
                            key={highlight.id}
                            value={highlight.id}
                            className="flex-1 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {highlight.stage}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {scenario.highlights.map((highlight) => (
                        <TabsContent
                          key={highlight.id}
                          value={highlight.id}
                          className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                        >
                          <div className="space-y-4">
                            <p className="text-sm font-semibold text-foreground">{highlight.summary}</p>
                            <Button
                              variant="ghost"
                              className="h-auto w-fit px-0 text-sm font-semibold text-primary"
                              onClick={() => handleAction(highlight.action, highlight.summary)}
                            >
                              {highlight.action}
                              <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden />
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </Tabs>
                </div>
              )}

          {!hasContextualInsight && !canAccessInsights && (
            <div className="relative overflow-hidden rounded-[28px] border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-background p-6 text-left shadow-[0_24px_60px_-40px_rgba(37,99,235,0.45)]">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
                  {gateStepLabel}
                </Badge>
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-primary/70">
                  AI document intelligence
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{gateTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">{gateDescription}</p>
              <ul className="mt-4 space-y-2 text-xs text-muted-foreground/75">
                {gateChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                {gateActionLabel}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

