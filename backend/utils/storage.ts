import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure for Cloudflare R2 or AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'auto',
  endpoint: process.env.AWS_ENDPOINT, // Important for R2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME as string;

// Upload a file to S3/R2
export const uploadFile = async (filePath: string, fileName: string, mimeType: string) => {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    ContentType: mimeType,
    ACL: 'public-read' as const, // Depending on bucket settings
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Construct public URL
    // For R2, if you have a custom domain: https://pub-xxx.r2.dev/filename
    // Or if standard S3: https://bucket.s3.region.amazonaws.com/filename
    const publicUrl = process.env.PUBLIC_STORAGE_URL 
      ? `${process.env.PUBLIC_STORAGE_URL}/${fileName}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      
    return publicUrl;
  } catch (err) {
    console.error("S3 Upload Error", err);
    throw err;
  }
};

export const deleteFile = async (fileName: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
  };
  try {
    await s3Client.send(new DeleteObjectCommand(params));
  } catch (err) {
    console.error("S3 Delete Error", err);
  }
};