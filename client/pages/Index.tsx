import { useEffect, useMemo, useState } from "react";

import { useLayoutContext } from "@/context/layout-context";
import {
  agentTraceTemplate,
  recentDocuments,
  savedPrompts,
  savedScopes,
  searchExamplesByRole,
  rolePlaceholderCopy,
} from "@/data/dashboard";
import { findJourneyForQuery } from "@/data/journeys";
import { GlobalSearchPanel } from "@/components/dashboard/GlobalSearchPanel";
import { JourneyTimeline } from "@/components/journeys/JourneyTimeline";
import { SavedPromptList } from "@/components/dashboard/SavedPromptList";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { DocumentIntelligenceShowcase } from "@/components/dashboard/DocumentIntelligenceShowcase";
import type {
  AgentTraceRun,
  Journey,
  SavedPrompt,
  SavedScope,
  UserRole,
} from "@/types/dashboard";

const cloneTrace = (query: string): AgentTraceRun => {
  const startedAt = new Date();
  const steps = agentTraceTemplate.steps.map((step, index) => ({
    ...step,
    startedAt: new Date(startedAt.getTime() + index * 320).toISOString(),
  }));

  const totalDurationMs = steps.reduce((acc, step) => acc + step.durationMs, 0);
  const totalTokens = steps.reduce((acc, step) => acc + step.tokensUsed, 0);

  return {
    ...agentTraceTemplate,
    id: `trace-${Date.now()}`,
    query,
    startedAt: startedAt.toISOString(),
    totalDurationMs,
    totalTokens,
    steps,
  };
};

const Index = () => {
  const {
    role,
    setAgentTrace,
    triggerToast,
    activeScopeId,
    setActiveScopeId,
    activeSources,
  } = useLayoutContext();
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [showPermissionBanner, setShowPermissionBanner] = useState(false);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

  const scopesForRole = useMemo(
    () => savedScopes.filter((scope) => scope.role === role),
    [role],
  );
  const activeScope = useMemo(
    () => scopesForRole.find((scope) => scope.id === activeScopeId) ?? scopesForRole[0],
    [activeScopeId, scopesForRole],
  );

  useEffect(() => {
    if (scopesForRole.length > 0 && (!activeScopeId || !scopesForRole.some((scope) => scope.id === activeScopeId))) {
      setActiveScopeId(scopesForRole[0].id);
    }
  }, [activeScopeId, scopesForRole, setActiveScopeId]);

  useEffect(() => {
    setActiveJourney(null);
    setHasSearched(false);
  }, [role]);

  const examples = searchExamplesByRole[role];
  const placeholder = rolePlaceholderCopy[role];
  const handleSearch = (input?: string) => {
    const baseQuery = input ?? query;
    const effectiveQuery = (baseQuery || placeholder).trim();
    if (!effectiveQuery) {
      return;
    }
    setQuery(effectiveQuery);
    const trace = cloneTrace(effectiveQuery);
    setAgentTrace(trace);
    setHasSearched(true);
    setShowPermissionBanner(false);
    const matchedJourney = findJourneyForQuery(effectiveQuery);
    setActiveJourney(matchedJourney);
    triggerToast("success", "Semantic search completed with compliant trace.");
  };

  const handlePromptSelect = (prompt: SavedPrompt) => {
    handleSearch(prompt.prompt);
  };

  const handleScopeChange = (scope: SavedScope) => {
    setActiveScopeId(scope.id);
    triggerToast("success", `${scope.label} scope locked for search and case flows.`);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setHasSearched(false);
      setActiveJourney(null);
    }
  };

  const isSourceEnabled = (source: string) => {
    const normalized = source.toLowerCase();
    if (normalized === "batch records") {
      return activeSources.batch ?? false;
    }
    return activeSources[normalized] ?? true;
  };

  const filteredDocuments = recentDocuments.filter((doc) => isSourceEnabled(doc.source));
  const nonValidatedDocs = filteredDocuments.filter((doc) => !doc.validated);
  const shouldShowValidationBanner = hasSearched && nonValidatedDocs.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <GlobalSearchPanel
        query={query}
        onQueryChange={handleQueryChange}
        onSubmit={() => handleSearch()}
        placeholder={placeholder}
        activeScope={activeScope}
        scopes={scopesForRole}
        onScopeChange={handleScopeChange}
        examples={examples}
      />

      <SavedPromptList prompts={savedPrompts} onSelect={handlePromptSelect} />

      {hasSearched && (
        <DocumentIntelligenceShowcase
          query={query}
          role={role}
          documents={filteredDocuments}
          activeScope={activeScope}
        />
      )}

      {activeJourney && <JourneyTimeline journey={activeJourney} />}

      {shouldShowValidationBanner && (
        <StatusBanner
          type="warning"
          title="Search returned sources pending SME validation"
          description="Flagged documents require SME approval before inclusion in cases or downstream reporting."
          actionLabel="Route for SME validation"
          onAction={() => triggerToast("warning", "Route for SME validation started.")}
        />
      )}

      {showPermissionBanner && (
        <StatusBanner
          type="error"
          title="Permission denied"
          description="Your role lacks access to the archived revision. Request elevated privileges to proceed."
          actionLabel="Request access"
          onAction={() => {
            triggerToast("error", "Access request submitted to compliance queue.");
            setShowPermissionBanner(false);
          }}
        />
      )}
    </div>
  );
};

export default Index;
