interface SineWaveProps {
  className?: string;
  color?: string;
}

export function SineWave({ className, color = "currentColor" }: SineWaveProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12C6 8 9 8 12 12C15 16 18 16 21 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}