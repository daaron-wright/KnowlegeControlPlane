import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeDirection?: "up" | "down";
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, change, changeDirection, icon }: KpiCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 lg:p-4 shadow-sm min-h-[100px] lg:min-h-[120px] flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xs lg:text-sm font-medium text-black leading-tight flex-1 pr-1">{title}</h3>
        {icon && <div className="text-blue-500 flex-shrink-0">{icon}</div>}
      </div>
      <div className="text-lg lg:text-2xl font-bold text-black mb-1 leading-tight break-words">{value}</div>
      {change && (
        <div className="flex items-center gap-1 mt-auto">
          {changeDirection === "down" ? (
            <span className="text-green-500">↓</span>
          ) : (
            <span className="text-red-500">↑</span>
          )}
          <span className="text-xs lg:text-sm text-black truncate">{change}</span>
        </div>
      )}
    </div>
  );
} 