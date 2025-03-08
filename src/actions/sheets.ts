"use server";

import { google } from "googleapis";
import { ParsedCV } from "@/types";

interface CVData extends ParsedCV {
  cvLink: string;
}

export async function appendToGoogleSheet(data: CVData) {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email:
          "metana-assignment@metana-assessment.iam.gserviceaccount.com",
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
      ],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const row = [
      new Date().toISOString(),
      data.personalInfo.name || "",
      data.personalInfo.email || "",
      data.personalInfo.phone || "",
      data.education.join("\n"),
      data.qualifications.join("\n"),
      data.projects.map((p) => `${p.name}: ${p.description}`).join("\n"),
      data.cvLink,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Sheets API Error:", error);
    throw new Error("Failed to store data in sheets");
  }
}
