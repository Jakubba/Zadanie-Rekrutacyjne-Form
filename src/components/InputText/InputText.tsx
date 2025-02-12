import React from "react";
import Label from "./../Label/Label";
import ErrorMessageWithIcon from "./../ErrorMessageWithIcon/ErrorMessageWithIcon";

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
      <Label htmlFor={name}>{label}</Label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full border p-2 rounded-lg ${error ? "input-error" : ""}`}
      />
      {error && <ErrorMessageWithIcon message={error} />}
    </div>
  );
};

export default InputText;
