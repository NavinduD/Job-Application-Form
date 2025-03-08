import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;

export async function parseFileContent(file: File): Promise<string> {
  // For PDF files
  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse PDF: ${error.message}`);
      }
      throw new Error("Failed to parse PDF: Unknown error");
    }
  }

  // For DOC/DOCX files
  if (file.type.includes("word")) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse Word document: ${error.message}`);
      }
      throw new Error("Failed to parse Word document: Unknown error");
    }
  }

  // For plain text files
  if (file.type === "text/plain") {
    try {
      return await file.text();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read text file: ${error.message}`);
      }
      throw new Error("Failed to read text file: Unknown error");
    }
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}
