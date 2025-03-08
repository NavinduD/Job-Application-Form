import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface StatusMessageProps {
  error?: string | null;
  success?: boolean;
}

export function StatusMessage({ error, success }: StatusMessageProps) {
  if (error) {
    return (
      <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md flex items-start">
        <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md flex items-start">
        <FiCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
        <span className="text-sm">Application submitted successfully!</span>
      </div>
    );
  }

  return null;
}
