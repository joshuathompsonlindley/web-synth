interface HighPassProps {
  className?: string;
  color?: string;
}

export function HighPass({ className, color = "currentColor" }: HighPassProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 16C6 16 9 12 12 8C15 8 18 8 21 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}