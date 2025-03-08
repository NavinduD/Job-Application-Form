import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const config: S3ClientConfig = {
  region: "auto",
  endpoint: process.env.CLOUDFLARE_URL,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
};

export const s3Client = new S3Client(config);
