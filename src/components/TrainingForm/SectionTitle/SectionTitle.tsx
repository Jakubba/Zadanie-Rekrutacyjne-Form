import React from "react";

interface SectionTitleProps {
  level?: "h2" | "h3" | "h4";
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ level = "h2", children }) => {
  const TitleTag = level;

  return (
    <TitleTag className="text-2xl font-medium mb-4 text-[#000853] text-left">{children}</TitleTag>
  );
};

export default SectionTitle;
