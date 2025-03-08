import { appendToGoogleSheet } from "@/actions/sheets";
import { ParsedCV } from "@/types";

interface CVData extends ParsedCV {
  cvLink: string;
}

export async function appendToSheet(data: CVData) {
  try {
    const result = await appendToGoogleSheet(data);
    if (!result.success) {
      throw new Error("Failed to store data in sheets");
    }
    return true;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw error;
  }
}
