import React from "react";
import errorIcon from "./../../assets/icons/error-icon.svg";

interface ErrorMessageWithIconProps {
  message: string;
}

const ErrorMessageWithIcon: React.FC<ErrorMessageWithIconProps> = ({ message }) => {
  return (
    <div className="flex justify-start items-start mt-1">
      <img src={errorIcon} alt="" className="w-4 h-4 mt-[2px] mr-[9px]" />
      <p className="text-sm text-start">{message}</p>
    </div>
  );
};

export default ErrorMessageWithIcon;
