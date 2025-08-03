interface SawWaveProps {
  className?: string;
  color?: string;
}

export function SawWave({ className, color = "currentColor" }: SawWaveProps) {
  return (
    <svg className={`${className} rotate-180`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 16L9 8L9 16L15 8L15 16L21 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}