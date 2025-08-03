"use client";

import type { ReactNode } from "react";

interface ModuleCardProps {
  children: ReactNode;
}

export function ModuleCard({ children }: ModuleCardProps) {
  return (
    <div className="bg-gray-900/60 border-2 border-gray-700 rounded-lg">
      <div className="p-4">{children}</div>
    </div>
  );
}
