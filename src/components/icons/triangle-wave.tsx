interface TriangleWaveProps {
  className?: string;
  color?: string;
}

export function TriangleWave({ className, color = "currentColor" }: TriangleWaveProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 16L9 8L15 16L21 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}