interface LowPassProps {
  className?: string;
  color?: string;
}

export function LowPass({ className, color = "currentColor" }: LowPassProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8C6 8 9 8 12 8C15 12 18 16 21 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}