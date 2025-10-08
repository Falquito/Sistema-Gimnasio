// src/components/dashboard/MetricCard.tsx
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down";
}

export function MetricCard({ title, value, subtitle, trend }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {trend && (
          <div className={trend === "up" ? "text-green-500" : "text-red-500"}>
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && (
        <div className={`text-xs mt-1 ${
          trend === "up" ? "text-green-600" : 
          trend === "down" ? "text-red-600" : 
          "text-gray-500"
        }`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
