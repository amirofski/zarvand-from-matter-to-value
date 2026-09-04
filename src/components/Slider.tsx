interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}

export function Slider({ min, max, step, value, onChange }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full py-2">
      <div className="h-1.5 w-full rounded-full bg-white/10 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#9B4D24] via-[#C8A45A] to-[#E6D3A3]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        aria-label="Weight Adjustment Slider"
      />
    </div>
  );
}
