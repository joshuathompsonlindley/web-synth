interface SquareWaveProps {
  className?: string;
  color?: string;
}

export function SquareWave({ className, color = "currentColor" }: SquareWaveProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 16V8H9V16H15V8H21V16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}