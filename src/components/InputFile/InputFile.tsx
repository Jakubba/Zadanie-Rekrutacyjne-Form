import React from "react";
import Label from "../Label/Label";
import ErrorText from "../ErrorText/ErrorText";

interface InputFileProps {
  label: string;
  name: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  error?: string;
}

const FileUploadInput: React.FC<{
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = ({ name, onChange, error }) => (
  <div className="relative flex flex-col justify-center items-center text-center">
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
      <span className="relative cursor-pointer text-[#761be4] mr-2 after:content-[''] after:absolute after:top-[80%] after:left-[50%] after:translate-x-[-50%] after:h-[1px] after:w-full after:bg-[#761be4]">
        Upload File
      </span>
      <p className="hidden md:block text-sm text-[#898DA9] pointer-events-none">
        or drag & drop here
      </p>
    </label>
    {error && <ErrorText message={error} />}
  </div>
);

const FilePreview: React.FC<{ file: File; onRemove: () => void; error?: string }> = ({
  file,
  onRemove,
  error,
}) => (
  <div className="flex justify-center items-center gap-2">
    <p className="text-sm">{file.name}</p>
    <button
      type="button"
      onClick={onRemove}
      className="cursor-pointer btn-delete h-[16px] w-[16px]"
    >
      <span className="delete-icon"></span>
    </button>
    {error && <ErrorText message={error} />}
  </div>
);

const InputFile: React.FC<InputFileProps> = ({ label, name, file, onChange, onRemove, error }) => {
  return (
    <div className="mb-4 flex flex-col justify-start">
      <Label htmlFor={`${name}-upload`}>{label}</Label>
      <div className="bg-white p-2 rounded-lg border border-[#cbb6e5] h-[96px] flex justify-center items-center">
        {!file ? (
          <FileUploadInput name={name} onChange={onChange} error={error} />
        ) : (
          <FilePreview file={file} onRemove={onRemove} error={error} />
        )}
      </div>
    </div>
  );
};

export default InputFile;
