import { JSX } from "react";

interface ControlHeaderProps {
  icon: JSX.Element;
  title: string;
}

export function ControlHeader({ icon, title }: ControlHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">{icon}</span>
      </div>
      <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-400 to-transparent"></div>
    </div>
  );
}
