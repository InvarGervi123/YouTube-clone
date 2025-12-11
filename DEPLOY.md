# OpenTube Deployment Guide

## Prerequisites

1.  **MongoDB Atlas**: Create a free cluster and get the connection string (`MONGO_URI`).
2.  **Cloudflare R2** (or AWS S3):
    *   Create a bucket.
    *   Get `Access Key ID`, `Secret Access Key`, and `Endpoint`.
    *   Enable public access or configure a custom domain for the bucket.

## 1. Backend Deployment (Render / Railway)

You need a service that supports `ffmpeg` and persistent disk (optional, but helpful for temp files) or just a standard container.

### Option A: Render (Web Service)

1.  Create a new Web Service connected to your repo.
2.  **Runtime**: Docker (Recommended because we need ffmpeg).
3.  **Environment Variables**:
    *   `PORT`: `4000`
    *   `MONGO_URI`: `mongodb+srv://...`
    *   `JWT_SECRET`: `some_secure_string`
    *   `AWS_ACCESS_KEY_ID`: `...`
    *   `AWS_SECRET_ACCESS_KEY`: `...`
    *   `AWS_ENDPOINT`: `https://<accountid>.r2.cloudflarestorage.com` (for R2)
    *   `AWS_BUCKET_NAME`: `opentube-bucket`
    *   `AWS_REGION`: `auto`
    *   `PUBLIC_STORAGE_URL`: `https://pub-<id>.r2.dev` (Your public bucket URL)

The included `Dockerfile` installs `ffmpeg`.

## 2. Frontend Deployment (Vercel)

1.  Import project to Vercel.
2.  **Build Settings**:
    *   Framework Preset: Vite (or Create React App)
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
3.  **Environment Variables**:
    *   Vercel requires env vars starting with `VITE_` if using Vite.
    *   Since we hardcoded `localhost:4000` in `api.ts` for the MVP, you should change that line in `services/api.ts` before deploying:
        ```ts
        const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com/api';
        ```
    *   Add `VITE_API_URL` to Vercel config pointing to your backend URL.

## 3. Running Locally

1.  **Backend**:
    ```bash
    cd backend
    npm install
    # Create .env file with credentials
    npm start
    ```
2.  **Frontend**:
    ```bash
    # Root folder
    # Update services/api.ts to point to localhost:4000
    npm run dev
    ```

## Storage Notes
- The backend temporarily saves files to `backend/uploads/` before sending to S3. Ensure your production environment allows writing to this path. Docker containers usually allow this in the ephemeral file system.
