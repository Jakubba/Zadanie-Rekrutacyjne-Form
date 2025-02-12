import React from "react";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="mb-[8px] text-left text-base text-[#000853]">
      {children}
    </label>
  );
};

export default Label;
