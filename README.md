## Key Packages

Install dependencies with `pnpm install` (lockfile provided). Required runtime packages:

- `react`, `react-dom`, `react-router-dom`
- `lucide-react` for icons
- `recharts` for dashboards
- Radix primitives (via UI kit) already wrapped inside the repo

## Repository Layout

```
client/
  App.tsx                         # App shell + router
  main.tsx                        # Vite entry
  components/
    dashboard/
      DocumentIntelligenceShowcase.tsx
      DocumentSelectionPanel.tsx
      ContextualInsightSpotlight.tsx
      GlobalSearchPanel.tsx
      ...
    layout/                       # Header, LeftRail, MainLayout wrappers
    ui/                           # Design-system primitives (Button, Tabs, Badge, etc.)
  context/layout-context.tsx      # Workspace context + toast utilities
  data/dashboard.ts               # Mocked scopes, prompts, documents, charts
  pages/Index.tsx                 # Home route wiring components together
shared/api.ts                     # Fetch helpers (stubbed)
tailwind.config.ts                # Tailwind tokens + plugins
vite.config.ts                    # Build tooling
```

## Core Components

| Component | Responsibility |
| --- | --- |
| `DocumentIntelligenceShowcase` | Orchestrates the selection, prompting, contextual insight spotlight, charts, and highlights for a given query/role. Gating ensures insights render only after prompting succeeds. |
| `DocumentSelectionPanel` | Single-column selector with inline prompt + focus controls. Tracks selected/prompted documents and feeds the spotlight. |
| `ContextualInsightSpotlight` | Tabbed card (Insight / Evidence / Plan / Scope) summarizing AI output, metadata, recommended actions, and scope filters. |
| `GlobalSearchPanel` | Hero search form with scopes, saved prompts, and example queries. |
| `LayoutContext` | Provides role, scope, toast handlers, and shared state required by downstream components. |

Supporting data & utilities live in `client/data` (mock data sets) and `client/lib/formatters.ts` (date/confidence helpers).

## Running the Workspace Locally

```bash
pnpm install
pnpm dev
```

Vite serves the app on http://localhost:5173 (or the next available port).

## Integrating Components

1. **Copy Core Files**: Bring over the dashboard components under `client/components/dashboard`, the shared layout pieces you need, and the supporting utilities (`client/lib`, `client/context/layout-context.tsx`).
2. **Provide the Design System**: Ensure the consuming app includes the UI primitives in `client/components/ui` and Tailwind tokens from `client/global.css` / `tailwind.config.ts`. These components expect Tailwind classes to be available.
3. **Wrap in `LayoutContext`**: Upstream application must initialize `<LayoutContext.Provider>` with the fields defined in `client/context/layout-context.tsx` (role, toast handler, scope state, etc.). The existing implementation in `client/App.tsx` demonstrates the provider wiring.
4. **Routing & Toasts**: `DocumentIntelligenceShowcase` navigates via `useNavigate`. Keep React Router in place or adapt navigation + toast utilities if embedding elsewhere.
5. **Provide Data Models**: Pass real `DocumentRecord[]`, `SavedScope`, prompts, and chart data that follow the interfaces in `client/types/dashboard.ts`. Replace the mocks in `client/data/dashboard.ts` with live data sources or API calls.
6. **Charts Dependency**: Ensure Recharts is installed and the theme tokens exist. Charts expect responsive parents; keep them in flex/grid containers similar to `DocumentIntelligenceShowcase`.
7. **Example Mount**:

```tsx
import { LayoutProvider } from "./providers/LayoutProvider"; // implement provider using LayoutContextValue
import { DocumentIntelligenceShowcase } from "./components/dashboard/DocumentIntelligenceShowcase";

export function DocumentWorkspace() {
  return (
    <LayoutProvider>
      <DocumentIntelligenceShowcase
        query={"Production deviation detected"}
        role="R&D"
        documents={documentsFromApi}
        activeScope={activeScope}
      />
    </LayoutProvider>
  );
}
```

## Handoff Checklist

- [ ] Install dependencies with `pnpm install`
- [ ] Ensure Tailwind config + PostCSS settings are merged into the host app
- [ ] Mount `LayoutContext` provider and wire toast notifications
- [ ] Replace mock data with API integrations
- [ ] Validate Recharts styling after theme integration
- [ ] Run `pnpm dev` (or `pnpm build`) to confirm compiling without type errors
