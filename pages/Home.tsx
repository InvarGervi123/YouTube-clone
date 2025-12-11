import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Video } from '../types';
import { api } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { WifiOff } from 'lucide-react';

export const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getVideos(query || undefined)
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch videos", err);
        setError("Unable to connect to the server. Please ensure the backend is running.");
        setLoading(false);
      });
  }, [query]);

  if (loading) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
      <WifiOff className="w-16 h-16 text-gray-600 mb-4" />
      <h3 className="text-xl font-bold mb-2">Connection Error</h3>
      <p className="text-gray-400 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 rounded-full font-medium hover:bg-blue-500"
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">{query ? `Search results for "${query}"` : 'Recommended'}</h2>
      </div>
      
      {videos.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No videos found. Be the first to upload!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
          {videos.map((video) => (
            <Link key={video._id} to={`/watch/${video._id}`} className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-800">
                <img 
                  src={video.thumbnailUrl || 'https://via.placeholder.com/400x225?text=No+Thumb'} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Error'; }}
                />
                <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                  {Math.floor(video.duration / 60)}:{String(Math.floor(video.duration % 60)).padStart(2, '0')}
                </span>
              </div>
              
              <div className="flex gap-3 px-1">
                <div className="flex-shrink-0">
                   <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {video.uploader?.username?.[0] || 'U'}
                   </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-blue-300">
                    {video.title}
                  </h3>
                  <div className="text-gray-400 text-sm">
                    <p className="hover:text-white">{video.uploader?.username || 'Unknown'}</p>
                    <p className="flex items-center gap-1">
                      <span>{Intl.NumberFormat('en-US', { notation: "compact" }).format(video.views)} views</span>
                      <span>•</span>
                      <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) : 'just now'} ago</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};