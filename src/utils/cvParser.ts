"use server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import type { ParsedCV, CVExtractionResult } from "../types";
import { CV_EXTRACTION_PROMPT } from "./constants";

export async function extractCVSections(
  text: string
): Promise<CVExtractionResult> {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: text must be a non-empty string");
  }

  try {
    const { text: result } = await generateText({
      model: groq("gemma2-9b-it"),
      prompt: CV_EXTRACTION_PROMPT.replace("${text}", text),
    });

    const cleanedResult = result
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "");

    try {
      const parsedResult = JSON.parse(cleanedResult) as ParsedCV;

      const formatted: ParsedCV = {
        personalInfo: {
          name: (parsedResult.personalInfo.name || "").trim(),
          email: (parsedResult.personalInfo.email || "").toLowerCase().trim(),
          phone: (parsedResult.personalInfo.phone || "")
            .replace(/[^\d+\-()]/g, "")
            .trim(),
        },
        education: (parsedResult.education || [])
          .filter(Boolean)
          .map((edu) => edu.replace(/[\n\r]/g, " ").trim()),
        qualifications: (parsedResult.qualifications || [])
          .filter(Boolean)
          .map((qual) => qual.replace(/[\n\r,]/g, " ").trim()),
        projects: (parsedResult.projects || []).map((proj) => ({
          name: proj.name.replace(/[\n\r]/g, " ").trim(),
          description: proj.description.replace(/[\n\r]/g, " ").trim(),
        })),
      };

      if (!formatted.personalInfo.name || !formatted.personalInfo.email) {
        throw new Error("Missing required personal information");
      }

      return { formatted, raw: parsedResult };
    } catch (parseError) {
      console.error("AI parsing error:", parseError);
      throw new Error("Failed to parse CV data for sheets");
    }
  } catch (error) {
    console.error("CV extraction error:", error);
    throw error;
  }
}
