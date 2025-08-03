import { Power } from "lucide-react";

interface PowerButtonProps {
  enabled: boolean;
  onClick: () => void;
}

export function PowerButton({ enabled, onClick }: PowerButtonProps) {
  return (
    <button
      className={`
          flex items-center cursor-pointer justify-center gap-2 rounded-md border transition-all duration-200 px-3 py-1.5 text-xs
          ${
            enabled
              ? "font-medium bg-green-700/40 border-green-500/60 text-white shadow-lg"
              : "bg-red-800/5 border-red-700/20 text-red-400"
          }
        `}
      onClick={onClick}
    >
      <Power className="w-4 h-4" />
    </button>
  );
}
