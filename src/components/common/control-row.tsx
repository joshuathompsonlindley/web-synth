import { ReactNode } from "react";

interface ControlRowProps {
  children: ReactNode | ReactNode[];
}

export function ControlRow({ children }: ControlRowProps) {
  return <div className="flex items-center mx-6 gap-x-12">{children}</div>;
}
