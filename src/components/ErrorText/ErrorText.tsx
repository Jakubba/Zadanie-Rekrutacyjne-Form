import React from "react";

interface ErrorTextProps {
  message: string;
}

const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  return <p className="text-sm mt-1">{message}</p>;
};

export default ErrorText;
