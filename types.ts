export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  subscribersCount: number;
  createdAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  url: string; // URL to the video file (e.g., S3/R2)
  thumbnailUrl: string;
  views: number;
  duration: number; // in seconds
  uploader: User;
  visibility: 'public' | 'unlisted' | 'private';
  tags: string[];
  createdAt: string;
  likes: number;
  dislikes: number;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  videoId: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface Report {
  _id: string;
  videoId?: string; // Populated
  commentId?: string; // Populated
  reporterId: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}