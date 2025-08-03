import { JSX, ReactNode } from "react";

interface ToggleButtonProps {
  enabled: boolean;
  onClick: () => void;
  icon: JSX.Element;
}

interface ToggleButtonGroup {
  title: string;
  children: ReactNode | ReactNode[];
}

export function ToggleButton({ enabled, onClick, icon }: ToggleButtonProps) {
  return (
    <button
      className={`p-3 rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${
        enabled
          ? "bg-blue-500/30 border-blue-400 text-white shadow-lg shadow-blue-500/20"
          : "bg-slate-700/50 border-slate-600 cursor-pointer  text-slate-300 hover:bg-slate-600/50 hover:border-slate-500"
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export function ToggleButtonGroup({ title, children }: ToggleButtonGroup) {
  return (
    <div className="mb-4 flex-shrink-0">
      <label className="block text-xs font-bold text-slate-200 mb-2 tracking-wider">{title}</label>
      <div className="flex justify-center gap-2">{children}</div>
    </div>
  );
}
