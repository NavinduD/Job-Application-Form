import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  cvlink: {
    type: String,
    required: true,
  },
  education: [
    {
      type: String,
    },
  ],
  qualifications: [
    {
      type: String,
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Applicant =
  mongoose.models.Applicant || mongoose.model("Applicant", applicantSchema);
