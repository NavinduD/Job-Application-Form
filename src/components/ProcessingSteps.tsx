import {
  FiCheckCircle,
  FiDatabase,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";
import { ProcessingStep } from "@/types";

const steps: ProcessingStep[] = [
  { id: 1, name: "Upload", icon: FiUploadCloud },
  { id: 2, name: "Parse", icon: FiFileText },
  { id: 3, name: "Extract", icon: FiDatabase },
  { id: 4, name: "Complete", icon: FiCheckCircle },
];

export function ProcessingSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-4 flex gap-4">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-1
                ${
                  isActive
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                    : isCompleted
                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }
              `}
            >
              <step.icon size={16} />
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
