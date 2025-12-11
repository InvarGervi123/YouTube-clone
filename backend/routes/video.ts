import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import util from 'util';
import Video from '../models/Video';
import { verifyToken, isAdmin, AuthRequest } from '../middleware/auth';
import { uploadFile, deleteFile } from '../utils/storage';
import { generateThumbnail, getVideoDuration } from '../utils/ffmpeg';

const router = express.Router();
const unlinkFile = util.promisify(fs.unlink);

// Multer config for temp storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// GET ALL VIDEOS
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { $text: { $search: search as string } };
    }
    const videos = await Video.find(query).populate('uploader', 'username avatar subscribersCount').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET VIDEO BY ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'username avatar subscribersCount');
    if (!video) return res.status(404).json({ error: 'Video not found' });
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// UPLOAD VIDEO
router.post('/upload', verifyToken, upload.single('video'), async (req: any, res: any) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No video file provided' });

  try {
    const { title, description, visibility } = req.body;
    const authReq = req as AuthRequest;
    
    // 1. Generate Thumbnail & Get Duration locally
    const thumbnailPath = await generateThumbnail(file.path, file.filename);
    const duration = await getVideoDuration(file.path);

    // 2. Upload Video to S3/R2
    const videoKey = `videos/${file.filename}`;
    const videoUrl = await uploadFile(file.path, videoKey, file.mimetype);

    // 3. Upload Thumbnail to S3/R2
    const thumbKey = `thumbnails/thumb-${file.filename}.png`;
    const thumbnailUrl = await uploadFile(thumbnailPath, thumbKey, 'image/png');

    // 4. Save to MongoDB
    const newVideo = new Video({
      title: title || file.originalname,
      description,
      url: videoUrl,
      thumbnailUrl,
      uploader: authReq.user.id,
      duration: Math.round(duration),
      visibility: visibility || 'public',
      tags: [],
    });

    await newVideo.save();

    // 5. Cleanup temp files
    await unlinkFile(file.path);
    await unlinkFile(thumbnailPath);

    res.status(201).json(newVideo);
  } catch (err) {
    console.error("Upload error:", err);
    // Attempt cleanup
    if (file) await unlinkFile(file.path).catch(() => {});
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// DELETE VIDEO
router.delete('/:id', verifyToken, isAdmin, async (req: any, res: any) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Delete from S3 (naive implementation: extracting key from URL might be needed depending on storage structure)
    // Here assuming the URL structure matches what we created
    const videoKey = `videos/${path.basename(video.url)}`; 
    const thumbKey = `thumbnails/${path.basename(video.thumbnailUrl)}`;

    await deleteFile(videoKey);
    await deleteFile(thumbKey);

    await Video.findByIdAndDelete(req.params.id);

    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;