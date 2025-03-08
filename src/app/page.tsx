"use client";

import { getPresignedUrl, submitFormData } from "@/actions/actions";
import { parseFileContent } from "@/utils/fileParser";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { FormInput } from "@/components/FormInput";
import { FileUpload } from "@/components/FileUpload";
import { StatusMessage } from "@/components/StatusMessage";
import { FormData, ParsedCV } from "@/types";
import { extractCVSections } from "@/utils/cvParser";
import { appendToSheet } from "@/services/googleSheets";

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    filename: "",
  });
  const [cvData, setCvData] = useState<ParsedCV>();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];
    setCurrentStep(1);

    try {
      const contentTypeMap: { [key: string]: string } = {
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };

      const extension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
      const contentType =
        contentTypeMap[extension] || "application/octet-stream";
      const key = `CVs/${Date.now()}-${selectedFile.name}`;
      setFormData((prev) => {
        const updatedData = { ...prev, filename: key };
        return updatedData;
      });

      const presignedUrl = await getPresignedUrl(key, contentType);

      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      setCurrentStep(2);
      try {
        const parsed = await parseFileContent(selectedFile);
        setCurrentStep(3);

        const extractedData = await extractCVSections(parsed);
        const cvLink = `${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/${formData.filename}`;

        setCvData(extractedData.raw);

        await appendToSheet({
          personalInfo: extractedData.formatted.personalInfo,
          education: extractedData.formatted.education,
          qualifications: extractedData.formatted.qualifications,
          projects: extractedData.formatted.projects,
          cvLink,
        });

        setFile(selectedFile);
        setError(null);
        setCurrentStep(4);
      } catch (parseError: unknown) {
        setError("Failed to parse file");
        throw new Error(
          `Failed to parse file: ${parseError instanceof Error ? parseError.message : "Unknown error"}`
        );
      }
    } catch (err: unknown) {
      setError(
        "Failed to process file: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
      console.error("Processing error:", err);
      setCurrentStep(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !file) {
      setError("Please fill in all required fields and upload your CV");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!cvData) {
        setError("CV data is not available");
        return;
      }
      const res = await submitFormData(formData, cvData);
      if (res !== "success") {
        setError("Failed to submit application");
        throw new Error("Failed to submit application");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        filename: "",
      });
      setFile(null);
      setCurrentStep(0);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting your application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-blue-600 dark:bg-blue-800">
            <h1 className="text-2xl font-bold text-white">
              Job Application Form
            </h1>
            <p className="text-blue-100 mt-2">
              Fill out the form below to apply
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <FormInput
                label="Full Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Email Address"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Phone Number"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <FileUpload
                onDrop={onDrop}
                file={file}
                isSubmitting={isSubmitting}
                currentStep={currentStep}
              />
            </div>

            <StatusMessage error={error} success={submitSuccess} />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
