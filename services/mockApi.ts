// This file simulates the backend responses for the MVP so the UI is functional without a running server.
// In a real scenario, this would be replaced by `api.ts` making axios calls to the Express backend.

import { User, Video, Comment, UserRole } from '../types';

const MOCK_DELAY = 600;

export const mockUser: User = {
  _id: 'u1',
  username: 'DemoCreator',
  email: 'demo@opentube.com',
  role: UserRole.ADMIN,
  subscribersCount: 1250,
  createdAt: new Date().toISOString()
};

const mockVideos: Video[] = [
  {
    _id: 'v1',
    title: 'Building a Clone in React',
    description: 'Learn how to build a video platform architecture.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png',
    views: 10543,
    duration: 596,
    uploader: mockUser,
    visibility: 'public',
    tags: ['react', 'coding'],
    likes: 520,
    dislikes: 12,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'v2',
    title: 'Nature Walk 4K',
    description: 'Relaxing sounds of nature.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Elephants_Dream_poster_source.jpg',
    views: 200,
    duration: 320,
    uploader: { ...mockUser, username: 'NatureLover', _id: 'u2' },
    visibility: 'public',
    tags: ['nature', '4k'],
    likes: 15,
    dislikes: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'v3',
    title: 'My Daily Setup',
    description: 'What I use to code every day.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217',
    views: 50000,
    duration: 120,
    uploader: { ...mockUser, username: 'TechGuru', _id: 'u3' },
    visibility: 'public',
    tags: ['tech', 'setup'],
    likes: 2000,
    dislikes: 50,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

export const mockApi = {
  getVideos: async (query?: string): Promise<Video[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query) resolve(mockVideos);
        else {
          const lowerQ = query.toLowerCase();
          resolve(mockVideos.filter(v => v.title.toLowerCase().includes(lowerQ)));
        }
      }, MOCK_DELAY);
    });
  },
  
  getVideoById: async (id: string): Promise<Video | undefined> => {
     return new Promise((resolve) => {
      setTimeout(() => resolve(mockVideos.find(v => v._id === id)), MOCK_DELAY);
    });
  },

  getComments: async (videoId: string): Promise<Comment[]> => {
     return new Promise((resolve) => {
      setTimeout(() => resolve([
        { _id: 'c1', content: 'Great video!', author: mockUser, videoId, createdAt: new Date().toISOString() },
        { _id: 'c2', content: 'Subscribed :)', author: { ...mockUser, username: 'Fan1', _id: 'u4' }, videoId, createdAt: new Date().toISOString() }
      ]), MOCK_DELAY);
    });
  },

  login: async (email: string, password?: string): Promise<{user: User, token: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        user: mockUser,
        token: 'mock-jwt-token-123'
      }), MOCK_DELAY);
    });
  },

  register: async (username: string, email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ message: 'User created' }), MOCK_DELAY);
    });
  },

  uploadVideo: async (formData: FormData, onProgress: (percent: number) => void): Promise<Video> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const newVideo: Video = {
            _id: `v${Date.now()}`,
            title: formData.get('title') as string || 'Untitled',
            description: formData.get('description') as string || '',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Mock URL
            thumbnailUrl: 'https://via.placeholder.com/400x225?text=New+Video',
            views: 0,
            duration: 180,
            uploader: mockUser,
            visibility: 'public',
            tags: [],
            likes: 0,
            dislikes: 0,
            createdAt: new Date().toISOString()
          };
          mockVideos.unshift(newVideo); // Add to local mock list
          resolve(newVideo);
        }
      }, 200);
    });
  },

  deleteVideo: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockVideos.findIndex(v => v._id === id);
        if (index > -1) mockVideos.splice(index, 1);
        resolve();
      }, MOCK_DELAY);
    });
  }
};