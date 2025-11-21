"use client";

interface ActionPanelProps {
  selectedComponent: string | null;
}

export function ActionPanel({ selectedComponent }: ActionPanelProps) {
  // When a component is selected, the ComponentStats handles everything
  if (selectedComponent) {
    return null;
  }

  // Default state when no component is selected
  return (
    <div className="p-6 border-t border-gray-200">
      <div className="text-center py-8">
        <div className="text-4xl mb-3">⚙️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Component Actions</h3>
        <p className="text-sm text-gray-600">
          Select a component above to view available actions and recommendations.
        </p>
      </div>
    </div>
  );
}
