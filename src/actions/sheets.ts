"use server";

import { google } from "googleapis";
import { ParsedCV } from "@/types";

interface CVData extends ParsedCV {
  cvLink: string;
}

export async function appendToGoogleSheet(data: CVData) {
  try {
    const base64EncodedCredentials = process.env.BASE64_GOOGLE_CREDENTIALS;
    if (!base64EncodedCredentials) {
      throw new Error("Service account email is not configured");
    }
    const decodedCredentials = Buffer.from(
      base64EncodedCredentials,
      "base64"
    ).toString("utf-8");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(decodedCredentials),
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
