import axios from 'axios';
import { User, Video, Comment } from '../types';
import { mockApi } from './mockApi';

// Flag to track if we should stay in offline mode
let isOfflineMode = false;

// Helper to get base URL
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:4000/api';
  }
  return 'http://localhost:4000/api';
};

const API_URL = getBaseUrl();

console.log('Connecting to API at:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 second timeout
});

// Interceptor to add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('opentube_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Higher-order function to handle API calls with fallback
async function executeRequest<T>(
  apiFn: () => Promise<T>,
  mockFn: () => Promise<T>
): Promise<T> {
  // If we already detected the backend is down, use mock immediately
  if (isOfflineMode) {
    return mockFn();
  }

  try {
    return await apiFn();
  } catch (error: any) {
    // Check for network errors, connection refused, or timeout
    if (
      error.message === 'Network Error' || 
      error.code === 'ERR_NETWORK' || 
      error.code === 'ECONNABORTED' ||
      error.code === 'ECONNREFUSED'
    ) {
      if (!isOfflineMode) {
        console.warn('Backend unreachable. Switching to Demo/Offline Mode (Mock API).');
        isOfflineMode = true;
      }
      return mockFn();
    }
    // Re-throw other errors (like 400 Bad Request, 401 Unauthorized, etc.)
    throw error;
  }
}

export const api = {
  // Video Endpoints
  getVideos: (query?: string): Promise<Video[]> => 
    executeRequest(
      async () => {
        const params = query ? { search: query } : {};
        const response = await apiClient.get('/videos', { params });
        return response.data;
      },
      () => mockApi.getVideos(query)
    ),

  getVideoById: (id: string): Promise<Video> => 
    executeRequest(
      async () => {
        const response = await apiClient.get(`/videos/${id}`);
        return response.data;
      },
      async () => {
        const video = await mockApi.getVideoById(id);
        if (!video) throw new Error('Video not found in mock data');
        return video;
      }
    ),

  deleteVideo: (id: string): Promise<void> => 
    executeRequest(
      async () => {
        await apiClient.delete(`/videos/${id}`);
      },
      () => mockApi.deleteVideo(id)
    ),

  uploadVideo: (formData: FormData, onProgress: (percent: number) => void): Promise<Video> => 
    executeRequest(
      async () => {
        const response = await apiClient.post('/videos/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        });
        return response.data;
      },
      () => mockApi.uploadVideo(formData, onProgress)
    ),

  // Comment Endpoints
  getComments: (videoId: string): Promise<Comment[]> => 
    executeRequest(
      async () => {
        // Assuming backend has this route implemented or will implement it
        // If 404, we might catch it below, but for now fallback to mock is fine if route missing
        try {
           const response = await apiClient.get(`/videos/${videoId}/comments`);
           return response.data;
        } catch (e: any) {
           // If route doesn't exist yet on real backend, fallback to mock
           if (e.response && e.response.status === 404) return mockApi.getComments(videoId);
           throw e;
        }
      },
      () => mockApi.getComments(videoId)
    ),

  // Auth Endpoints
  login: (email: string, password: string = 'password'): Promise<{user: User, token: string}> => 
    executeRequest(
      async () => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
      },
      () => mockApi.login(email, password)
    ),
  
  register: (username: string, email: string, password: string): Promise<any> => 
    executeRequest(
      async () => {
        const response = await apiClient.post('/auth/register', { username, email, password });
        return response.data;
      },
      () => mockApi.register(username, email, password)
    )
};