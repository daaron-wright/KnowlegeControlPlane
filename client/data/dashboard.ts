import type {
  AgentTraceRun,
  AssignmentTask,
  ChecklistItem,
  DocumentRecord,
  SavedPrompt,
  SavedScope,
  SearchExample,
  SourceToggle,
  UserRole,
} from "@/types/dashboard";

export const savedScopes: SavedScope[] = [
  {
    id: "rd-stability",
    label: "Stability Studies • Phase III",
    description: "AZD-7785 lots consolidated with linked deviations and PQ outcomes",
    filters: ["Molecule: AZD-7785", "Lot status: Released", "Window: 90 days"],
    lastUpdated: "2025-01-12T09:00:00Z",
    role: "R&D",
  },
  {
    id: "rd-sop-refresh",
    label: "SOP Refresh Tracker",
    description: "Change-control aligned SOPs with pending SME confirmations",
    filters: ["Status: Awaiting SME", "Site: Basel", "Criticality: High"],
    lastUpdated: "2025-01-08T15:12:00Z",
    role: "R&D",
  },
  {
    id: "msat-batch-scan",
    label: "MSAT • Batch Performance Watch",
    description: "Recent PQ and batch trend runs across Line 5",
    filters: ["Line: 5", "Deviation severity: Major", "Sensor drift < 2%"],
    lastUpdated: "2025-01-13T11:32:00Z",
    role: "MSAT",
  },
  {
    id: "msat-audit-prep",
    label: "Audit Prep: PQ Evidence",
    description: "Validation packets awaiting compliance approval",
    filters: ["Validation type: PQ", "Owner: MSAT", "Status: Draft"],
    lastUpdated: "2025-01-05T07:42:00Z",
    role: "MSAT",
  },
];

export const sourceToggles: SourceToggle[] = [
  {
    id: "sharepoint",
    label: "SharePoint",
    description: "PDF · DOCX · PPT repositories",
    activeByDefault: true,
  },
  {
    id: "validations",
    label: "Validations",
    description: "Qualification and PQ evidence",
    activeByDefault: true,
  },
  {
    id: "deviations",
    label: "Deviations",
    description: "Deviation and CAPA records",
    activeByDefault: true,
  },
  {
    id: "pq",
    label: "PQ",
    description: "Performance qualification runs",
    activeByDefault: false,
  },
  {
    id: "batch",
    label: "Batch",
    description: "Batch analytics + DCS extracts",
    activeByDefault: false,
  },
];

export const recentDocuments: DocumentRecord[] = [
  {
    id: "sop-123-v9",
    title: "SOP-123 v9",
    docType: "SOP",
    version: "v9",
    status: "Approved",
    lastOpened: "2025-01-14T14:15:00Z",
    owner: "Clara Lim",
    confidence: 0.97,
    lastValidated: "2024-12-03T10:20:00Z",
    highlight:
      "[[Validation summary]] confirms revised clean-in-place cycle meets updated disinfectant specs.",
    source: "SharePoint",
    validated: true,
  },
  {
    id: "sop-123-v8",
    title: "SOP-123 v8",
    docType: "SOP",
    version: "v8",
    status: "Archived",
    lastOpened: "2024-11-18T08:45:00Z",
    owner: "Clara Lim",
    confidence: 0.86,
    lastValidated: "2024-06-20T09:30:00Z",
    highlight:
      "Version [[v8 archived]] pending SME lock prior to retirement from active cases.",
    source: "SharePoint",
    validated: true,
  },
  {
    id: "deviation-24-d-311",
    title: "Deviation 24-D-311",
    docType: "Deviation",
    version: "Final",
    status: "In Review",
    lastOpened: "2025-01-11T17:22:00Z",
    owner: "Miguel Ortiz",
    confidence: 0.74,
    lastValidated: "2025-01-09T13:00:00Z",
    highlight:
      "Root cause [[sensor drift beyond 3.2%]] flagged for SME validation before release.",
    source: "Deviations",
    validated: false,
  },
  {
    id: "validation-vr-77",
    title: "Validation Report VR-77",
    docType: "Validation",
    version: "v2",
    status: "Approved",
    lastOpened: "2025-01-10T09:05:00Z",
    owner: "Priya Deshmukh",
    confidence: 0.92,
    lastValidated: "2024-12-22T06:15:00Z",
    highlight:
      "Performance metrics [[yield uplift 1.8%]] captured across three consecutive batches.",
    source: "Validations",
    validated: true,
  },
  {
    id: "pq-line-5-2024q4",
    title: "PQ-Line-5-2024Q4",
    docType: "PQ",
    version: "v1",
    status: "Approved",
    lastOpened: "2025-01-06T07:55:00Z",
    owner: "Noah Patel",
    confidence: 0.89,
    lastValidated: "2024-12-28T15:44:00Z",
    highlight:
      "Line 5 [[batch readiness checklist]] completed with no open actions pending QA.",
    source: "PQ",
    validated: true,
  },
];

export const assignedTasks: AssignmentTask[] = [
  {
    id: "assign-01",
    title: "Review VR-77 validation summary",
    dueDate: "2025-01-16T23:59:00Z",
    owner: "R&D",
    status: "Due Soon",
    relatedDocument: "Validation Report VR-77",
  },
  {
    id: "assign-02",
    title: "Approve deviation corrective plan",
    dueDate: "2025-01-18T17:00:00Z",
    owner: "MSAT",
    status: "Pending",
    relatedDocument: "Deviation 24-D-311",
  },
  {
    id: "assign-03",
    title: "Lock SOP-123 v9 as master",
    dueDate: "2025-01-15T12:00:00Z",
    owner: "Quality",
    status: "In Progress",
    relatedDocument: "SOP-123 v9",
  },
];

export const savedPrompts: SavedPrompt[] = [
  {
    id: "prompt-01",
    label: "Summarize batch excursion",
    description: "Condense sensor drift excursions for QA huddles",
    prompt: "Provide a concise summary of the latest batch excursion with root cause and CAPA owner.",
  },
  {
    id: "prompt-02",
    label: "Compare SOP revisions",
    description: "Highlight differences between v9 and v8 for audit logs",
    prompt: "Compare SOP-123 v9 against v8 for procedural, equipment, and approval deltas.",
  },
  {
    id: "prompt-03",
    label: "Route for review",
    description: "Draft cover note to assign PQ evidence to SME",
    prompt: "Generate a routing note assigning PQ-Line-5-2024Q4 to SME with validation highlights.",
  },
];

export const searchExamplesByRole: Record<UserRole, SearchExample[]> = {
  "R&D": [
    {
      id: "rd-01",
      prompt: "Show me validation evidence for AZD-7785 stability",
      description: "Focus on PQ and validation reports",
    },
    {
      id: "rd-02",
      prompt: "Summarize deviations impacting clean room 4 in 2024",
      description: "Highlight unresolved CAPAs",
    },
  ],
  MSAT: [
    {
      id: "msat-01",
      prompt: "Compare Line 5 PQ yields vs. baseline",
      description: "Include recent batch analytics",
    },
    {
      id: "msat-02",
      prompt: "List deviations awaiting MSAT validation",
      description: "Sort by due date",
    },
  ],
};

export const rolePlaceholderCopy: Record<UserRole, string> = {
  "R&D": "Search molecules, validations, and deviation learnings",
  MSAT: "Search batch performance, PQ packets, and open deviations",
};

export const getStartedChecklist: ChecklistItem[] = [
  {
    id: "check-01",
    title: "Pin your operating scopes",
    description: "Save molecule, line, and facility filters for quick recall.",
    actionLabel: "Pin scope",
  },
  {
    id: "check-02",
    title: "Upload validation packet",
    description: "Drop PQ evidence from SharePoint to enable traceable review.",
    actionLabel: "Upload",
  },
  {
    id: "check-03",
    title: "Invite SMEs",
    description: "Grant read/write access to keep audit trails complete.",
    actionLabel: "Manage access",
  },
];

export const complianceBadges = {
  dataPolicy: "21 CFR Part 11 aligned",
  environment: "Azure + Databricks",
};

export const agentTraceTemplate: AgentTraceRun = {
  id: "trace-01",
  query: "",
  startedAt: "",
  totalDurationMs: 0,
  totalTokens: 0,
  steps: [
    {
      id: "step-retrieve",
      stage: "Retrieve",
      toolName: "VectorSearch@Databricks",
      startedAt: "",
      durationMs: 520,
      tokensUsed: 820,
      notes: "Top 20 candidates filtered by role scopes.",
      status: "completed",
    },
    {
      id: "step-resolve",
      stage: "Version Resolver",
      toolName: "VersionResolver@SharePoint",
      startedAt: "",
      durationMs: 310,
      tokensUsed: 210,
      notes: "Normalized to latest approved + archived variants.",
      status: "completed",
    },
    {
      id: "step-validate",
      stage: "Validator",
      toolName: "ComplianceCheck@Azure",
      startedAt: "",
      durationMs: 420,
      tokensUsed: 180,
      notes: "Deviation 24-D-311 flagged for SME validation.",
      status: "warning",
    },
    {
      id: "step-summarize",
      stage: "Summarizer",
      toolName: "MedLM-AnswerSynth",
      startedAt: "",
      durationMs: 610,
      tokensUsed: 640,
      notes: "Traceable summary ready for case packaging.",
      status: "completed",
    },
  ],
};
