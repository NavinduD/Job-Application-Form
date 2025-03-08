export const CV_EXTRACTION_PROMPT = `
Extract and format CV information for a spreadsheet. Return ONLY a valid JSON object with the following structure:
{
  "personalInfo": {
    "name": "Full Name (cleaned and properly cased)",
    "email": "email@example.com (lowercase)",
    "phone": "phone number (standardized format)"
  },
  "education": [
    "Each education item on new line",
    "Include degree, institution, and year",
    "Format: Degree - Institution (Year)"
  ],
  "qualifications": [
    "Each skill/qualification as separate item",
    "Remove duplicates",
    "Keep technical skills separate from soft skills"
  ],
  "projects": [
    {
      "name": "Project Name (clear and concise)",
      "description": "One-line project summary focusing on impact and technologies used"
    }
  ]
}

Format the data to be spreadsheet-friendly, avoiding special characters and maintaining consistent formatting.
If any section is not found, return an empty array or object for that section.

CV TEXT:
\${text}
`;
