export type UserRole = "R&D" | "MSAT";

export interface SavedScope {
  id: string;
  label: string;
  description: string;
  filters: string[];
  lastUpdated: string;
  role: UserRole;
}

export interface SourceToggle {
  id: string;
  label: string;
  description: string;
  activeByDefault: boolean;
}

export interface DocumentRecord {
  id: string;
  title: string;
  docType: string;
  version: string;
  status: "Approved" | "Archived" | "Draft" | "In Review";
  lastOpened: string;
  owner: string;
  confidence: number;
  lastValidated: string;
  highlight: string;
  source: string;
  validated: boolean;
}

export interface AssignmentTask {
  id: string;
  title: string;
  dueDate: string;
  owner: string;
  status: "Pending" | "In Progress" | "Due Soon";
  relatedDocument: string;
}

export interface SavedPrompt {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

export interface SearchExample {
  id: string;
  prompt: string;
  description: string;
}

export interface AgentTraceStep {
  id: string;
  stage: "Retrieve" | "Version Resolver" | "Validator" | "Summarizer" | string;
  toolName: string;
  startedAt: string;
  durationMs: number;
  tokensUsed: number;
  notes?: string;
  status: "completed" | "warning" | "error";
}

export interface AgentTraceRun {
  id: string;
  query: string;
  startedAt: string;
  totalDurationMs: number;
  totalTokens: number;
  steps: AgentTraceStep[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
}

export type JourneyActionVariant = "primary" | "secondary" | "ghost";

export interface JourneyActionFeedback {
  variant: "success" | "warning" | "error";
  message: string;
}

export interface JourneyAction {
  id: string;
  label: string;
  description?: string;
  variant: JourneyActionVariant;
  feedback?: JourneyActionFeedback;
}

export interface JourneyMatcher {
  id: string;
  keywords: string[];
}

export type JourneyTone = "default" | "info" | "warning" | "success" | "danger" | "muted" | "positive";

export type JourneyStatus = "completed" | "warning" | "pending";

export interface JourneyCopilotMessage {
  id: string;
  role: "user" | "assistant";
  author: string;
  content: string;
  timestamp?: string;
  highlights?: string[];
  suggestion?: string;
}

export interface JourneyCopilotFollowUp {
  id: string;
  label: string;
  description?: string;
  feedback?: JourneyActionFeedback;
}

export interface JourneyCopilotConfig {
  triggerLabel: string;
  summary: string;
  conversation: JourneyCopilotMessage[];
  followUps?: JourneyCopilotFollowUp[];
}

export type JourneySection =
  | {
      type: "description";
      text: string;
      emphasis?: boolean;
    }
  | {
      type: "chips";
      label?: string;
      chips: string[];
      tone?: JourneyTone;
    }
  | {
      type: "key-value";
      items: { label: string; value: string; tone?: JourneyTone }[];
      columns?: number;
    }
  | {
      type: "bullet-list";
      title?: string;
      items: { label: string; description?: string }[];
      ordered?: boolean;
    }
  | {
      type: "timeline";
      title?: string;
      steps: { title: string; description: string; status: JourneyStatus }[];
    }
  | {
      type: "table";
      title: string;
      columns: string[];
      rows: { cells: string[]; annotation?: string }[];
      footnotes?: string[];
    }
  | {
      type: "callout";
      title: string;
      body: string;
      tone: "info" | "warning" | "success" | "danger";
    }
  | {
      type: "insight";
      answer: string;
      sources: { title: string; snippet: string }[];
      assumptions: string[];
    }
  | {
      type: "memo";
      sections: { title: string; content: string; citation?: string }[];
    }
  | {
      type: "toggles";
      label?: string;
      note?: string;
      toggles: {
        id: string;
        label: string;
        description?: string;
        defaultState?: boolean;
        tone?: JourneyTone;
      }[];
    }
  | {
      type: "metrics";
      items: { label: string; value: string; tone?: JourneyTone }[];
    };

export interface JourneyFrame {
  id: string;
  title: string;
  subtitle: string;
  sections: JourneySection[];
  actions?: JourneyAction[];
  copilot?: JourneyCopilotConfig;
}

export interface JourneyEmptyState {
  id: string;
  title: string;
  description: string;
  resolution: string;
  tone: "info" | "warning" | "error";
}

export interface Journey {
  id: string;
  name: string;
  persona: string;
  description: string;
  defaultPrompt: string;
  scopeLabel: string;
  scopeDescription: string;
  sources: string[];
  frames: JourneyFrame[];
  emptyStates: JourneyEmptyState[];
  matchers: JourneyMatcher[];
}

