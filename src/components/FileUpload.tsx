import { FiFile, FiUpload } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import { ProcessingSteps } from "./ProcessingSteps";

interface FileUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  file: File | null;
  isSubmitting: boolean;
  currentStep: number;
}

export function FileUpload({
  onDrop,
  file,
  isSubmitting,
  currentStep,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    disabled: isSubmitting,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Upload CV <span className="text-red-500">*</span>
      </label>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center">
            <FiFile className="text-blue-500 mr-2" size={24} />
            <span className="text-sm truncate">{file.name}</span>
          </div>
        ) : isDragActive ? (
          <div className="text-blue-500">
            <FiUpload size={36} className="mx-auto mb-2" />
            <p>Drop your CV here</p>
          </div>
        ) : (
          <div>
            <FiUpload size={36} className="mx-auto mb-2 text-slate-400" />
            <p>Drag & drop your CV here, or click to select</p>
            <p className="text-xs text-slate-500 mt-2">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>
        )}
      </div>
      {currentStep > 0 && <ProcessingSteps currentStep={currentStep} />}
    </div>
  );
}
