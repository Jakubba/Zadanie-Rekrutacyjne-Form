import React, { useState } from "react";

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
  const tooltipPosition = ((value - min) / (max - min)) * 100;

  return (
    <div className="mb-4 flex flex-col justify-start">
      <label className="mb-[8px] text-left text-base text-[#000853]">{label}</label>

      <div className="flex justify-between items-center pl-[5px]">
        <span className="text-[12px]">{min}</span>
        <span className="text-[12px]">{max}</span>
      </div>

      <div className="relative">
        <input
          type="range"
          name={name}
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-full mt-1 custom-range"
        />
        <div
          className={`absolute bottom-[-30px] px-2 py-1 bg-white text-[#761be4] text-xs rounded ${
            showTooltip ? "visible" : "hidden"
          }`}
          style={{ left: `calc(${tooltipPosition}% - 10px)` }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

export default InputRange;
