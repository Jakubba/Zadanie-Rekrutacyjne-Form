import React from "react";
import errorIcon from "./../../../assets/icons/error-icon.svg";
interface InputEmailProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputEmail: React.FC<InputEmailProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-4 flex flex-col justify-start">
      <label className="mb-[8px] text-left text-base text-[#000853]">{label}</label>
      <input
        type="email"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className={`w-full border p-2 rounded ${error ? "input-error" : ""}`}
      />
      {error && (
        <div className="flex justify-start items-start">
          <img src={errorIcon} alt="Error icon" className="w-4 h-4 mt-[8px] mr-[9px]" />
          <p className="mt-[4px] text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputEmail;
