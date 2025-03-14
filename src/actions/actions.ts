"use server";
import { ParsedCV, FormData, Projects } from "@/types";
import { s3Client } from "../utils/cloudflareR2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Applicant } from "../models/applicants";
import { connectDB } from "../utils/database";
import { Project } from "../models/project";
import { Resend } from "resend";
import ConfirmationEmail from "@/emails/confirmation";

export async function getPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

async function saveProjects(projects: Projects[]) {
  return Promise.all(
    (projects || []).map(async (project) => {
      const newProject = new Project({
        name: project.name,
        description: project.description,
      });
      const savedProject = await newProject.save();
      return savedProject._id;
    })
  );
}

async function notifyWebhook(
  formData: FormData,
  cvData: ParsedCV,
  projectIds: string[]
) {
  return fetch("https://rnd-assignment.automations-3d6.workers.dev/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Candidate-Email": "r.l.t.n.rathnayaka@gmail.com",
    },
    body: JSON.stringify({
      cv_data: {
        personal_info: cvData.personalInfo,
        education: cvData.education || [],
        qualifications: cvData.qualifications || [],
        projects: projectIds,
        cv_public_link: `${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/${formData.filename}`,
      },
      metadata: {
        applicant_name: formData.name,
        email: formData.email,
        status: "testing",
        cv_processed: true,
        processed_timestamp: new Date().toISOString(),
      },
    }),
  });
}

async function sendConfirmationEmail(
  resend: Resend,
  email: string,
  name: string
) {
  const oneDayFromNow = new Date(
    Date.now() + 1000 * 60 * 60 * 24
  ).toISOString();
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your Application is Received",
    react: ConfirmationEmail({
      applicantName: name.split(" ")[0],
    }),
    scheduledAt: oneDayFromNow,
  });
}

export async function submitFormData(formData: FormData, cvData: ParsedCV) {
  try {
    await connectDB();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const projectIds = await saveProjects(cvData.projects);

    const applicant = new Applicant({
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phone,
      cvlink: `${process.env.NEXT_PUBLIC_CLOUDFLARE_URL}/${formData.filename}`,
      education: cvData.education || [],
      qualifications: cvData.qualifications || [],
      projects: projectIds,
    });

    const savedApplicant = await applicant.save();

    await Promise.all([
      notifyWebhook(formData, cvData, projectIds),
      sendConfirmationEmail(resend, formData.email, formData.name),
    ]);

    if (savedApplicant) {
      console.log("Applicant saved successfully");
      return "success";
    }
  } catch (error) {
    console.error("Error saving applicant:", error);
    return error;
  }
}
