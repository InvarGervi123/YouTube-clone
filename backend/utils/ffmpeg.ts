import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// Generate a thumbnail for a video file
export const generateThumbnail = (videoPath: string, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputFolder = path.dirname(videoPath);
    const thumbnailFilename = `thumb-${filename}.png`;
    const outputPath = path.join(outputFolder, thumbnailFilename);

    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: outputFolder,
        filename: thumbnailFilename,
        timestamps: ['10%'], // Take a screenshot at 10% of video
        size: '1280x720'
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg Error:', err);
        reject(err);
      });
  });
};

export const getVideoDuration = (videoPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
};