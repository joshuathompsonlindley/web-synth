"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Knob({ value, min, max, step = 0.01, label, unit = "", onChange, disabled = false }: KnobProps) {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const startValueRef = useRef(0);
  const startYRef = useRef(0);
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const rotation = -140 + normalizedValue * 280;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      setIsDragging(true);
      startValueRef.current = value;
      startYRef.current = e.clientY;

      e.preventDefault();
      e.stopPropagation();

      document.body.style.cursor = "grabbing";
    },
    [disabled, value],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;

      const pixelsPerFullRange = 200;
      const deltaY = startYRef.current - e.clientY;
      const normalizedDelta = deltaY / pixelsPerFullRange;
      const range = max - min;
      const totalChange = normalizedDelta * range;

      let newValue = startValueRef.current + totalChange;

      newValue = Math.max(min, Math.min(max, newValue));

      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      if (Math.abs(newValue - value) >= step) {
        onChange(newValue);
      }
    },
    [isDragging, disabled, min, max, step, value, onChange],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = "default";
    }
  }, [isDragging]);

  // Handle wheel events for fine control
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (disabled) return;

      e.preventDefault();

      const range = max - min;
      const wheelStep = range * 0.01;
      const delta = -e.deltaY > 0 ? wheelStep : -wheelStep;

      let newValue = value + delta;
      newValue = Math.max(min, Math.min(max, newValue));

      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      onChange(newValue);
    },
    [disabled, min, max, step, value, onChange],
  );

  const formatValue = useCallback(
    (val: number) => {
      if (step >= 1) return val.toFixed(0);
      if (step >= 0.1) return val.toFixed(1);
      return val.toFixed(2);
    },
    [step],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "default";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col items-center space-y-1 select-none">
      <label className="font-bold text-gray-300 text-center tracking-wide text-xs">{label}</label>
      <div className="relative">
        <div
          ref={knobRef}
          className={`
            w-10 h-10
            rounded-full 
            bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900
            border-2 border-gray-600
            shadow-lg
            cursor-grab
            select-none
            transition-all duration-100
            overflow-visible
            ${isDragging ? "shadow-2xl scale-105 cursor-grabbing" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl active:scale-105"}
          `}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-inner overflow-visible">
            <div className="absolute inset-0 overflow-visible" style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="absolute w-0.5 h-4 bg-blue-300 rounded-full shadow-sm top-0 left-1/2 transform -translate-x-1/2" />{" "}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-white rounded-full opacity-60" />{" "}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const angle = -140 + tick * 280;
            const isAtValue = Math.abs(normalizedValue - tick) < 0.05;
            const radius = 22;
            const tickLength = 2;
            const angleRad = ((angle - 90) * Math.PI) / 180; // -90 to align with top
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            return (
              <div
                key={i}
                className={`absolute w-0.5 rounded-full transition-colors duration-150 ${
                  isAtValue ? "bg-blue-300" : "bg-gray-400/40"
                }`}
                style={{
                  height: `${tickLength}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="text-gray-300/90 text-center  px-1 py-0.5 rounded-md transition-colors duration-150 text-xs ">
        {formatValue(value)}
        {unit && <span className="text-gray-400/60">{unit}</span>}
      </div>
    </div>
  );
}
