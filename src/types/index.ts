export interface FormData {
  name: string;
  email: string;
  phone: string;
  filename: string;
}

export interface FormInputProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export interface ProcessingStep {
  id: number;
  name: string;
  icon: React.ComponentType<{ size: number }>;
}

export interface ParsedContent {
  text: string;
  metadata?: {
    fileType: string;
    parseDate: Date;
  };
}

export interface ParsedCV {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  education: string[];
  qualifications: string[];
  projects: Array<{
    name: string;
    description: string;
  }>;
}

export interface CVExtractionResult {
  raw: any;
  formatted: ParsedCV;
}
