import React, { useState, useRef, useEffect } from "react";
import Label from "../Label/Label";

interface InputRangeProps {
  label: string;
  name: string;
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputRange: React.FC<InputRangeProps> = ({ label, name, min, max, value, onChange }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateTooltipPosition();
  }, [value]);

  const updateTooltipPosition = () => {
    if (!sliderRef.current || !tooltipRef.current) return;

    const slider = sliderRef.current;
    const tooltip = tooltipRef.current;
    const sliderWidth = slider.offsetWidth;
    const thumbWidth = 16;
    const percent = (value - min) / (max - min);
    const newLeft = percent * (sliderWidth - thumbWidth) + thumbWidth / 2;

    tooltip.style.left = `${newLeft}px`;
  };

  return (
    <div className="mb-4 flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>

      <div className="flex justify-between text-sm text-gray-600">
        <span className="text-[12px]">{min}</span>
        <span className="text-[12px]">{max}</span>
      </div>

      <div className="relative">
        <input
          ref={sliderRef}
          id={name}
          type="range"
          name={name}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="w-full appearance-none focus:outline-none cursor-pointer custom-range"
        />

        <div
          ref={tooltipRef}
          className={`absolute bottom-[-45px]  bg-black text-[#761BE4] text-xs rounded-lg transition-opacity duration-200 custom-tootlip h-[40px] w-[40px] flex justify-center items-center ${
            showTooltip ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "translateX(-50%)" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default InputRange;
