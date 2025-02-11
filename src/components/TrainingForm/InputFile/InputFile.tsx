import React from "react";
import deleteIcon from "./../../../assets/icons/default-close-icon.svg";

interface InputFileProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  error?: string;
}

const InputFile: React.FC<InputFileProps> = ({ label, name, file, onChange, onRemove, error }) => {
  return (
    <div className="mb-4 flex flex-col justify-start">
      <label htmlFor={`${name}-upload`} className="block mb-2 text-left text-base text-[#000853]">
        {label}
      </label>
      <div className="bg-white p-2 rounded border border-[#cbb6e5] h-[96px] flex justify-center items-center">
        {!file ? (
          <div className="relative flex justify-center items-center text-center">
            <input
              id={`${name}-upload`}
              type="file"
              name={name}
              accept="image/*"
              onChange={onChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor={`${name}-upload`}
              className="flex justify-center items-center w-full h-full flex-nowrap"
            >
              <button className="relative cursor-pointer text-[#761be4] mr-2 after:content-[''] after:absolute after:top-[80%] after:left-[50%] after:translate-x-[-50%] after:h-[1px] after:w-full after:bg-[#761be4]">
                Upload File
              </button>
              <p className="hidden md:block text-sm text-[#898DA9] pointer-events-none">
                or drag & drop here
              </p>
            </label>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <p className="text-sm">{file.name}</p>
            <button type="button" onClick={onRemove} className="cursor-pointer">
              <img src={deleteIcon} alt="delete icon" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputFile;
