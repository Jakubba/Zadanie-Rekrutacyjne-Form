import React from "react";
import errorIcon from "./../../../assets/icons/error-icon.svg";

interface InputTextProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputText: React.FC<InputTextProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4 flex flex-col justify-start">
      <label className="mb-[8px] text-left text-base text-[#000853]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full border p-2 rounded ${error ? "input-error" : ""}`}
      />
      {error && (
        <div className="flex justify-start items-start">
          <img src={errorIcon} alt="Error icon" className="w-4 h-4 mt-[2px] mr-[9px]" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputText;
