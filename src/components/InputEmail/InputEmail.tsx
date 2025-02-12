import React from "react";
import Label from "./../Label/Label";
import ErrorMessageWithIcon from "../ErrorMessageWithIcon/ErrorMessageWithIcon";

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
      <Label htmlFor={name}>{label}</Label>

      <input
        id={name}
        type="email"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className={`w-full border p-2 rounded-lg ${error ? "input-error" : ""}`}
      />

      {error && <ErrorMessageWithIcon message={error} />}
    </div>
  );
};

export default InputEmail;
