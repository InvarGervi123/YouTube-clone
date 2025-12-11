import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Video } from '../types';
import { mockApi } from '../services/mockApi';
import { formatDistanceToNow } from 'date-fns';

export const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    setLoading(true);
    mockApi.getVideos(query || undefined).then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, [query]);

  if (loading) return <div className="p-10 text-center">Loading videos...</div>;

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">{query ? `Search results for "${query}"` : 'Recommended'}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
        {videos.map((video) => (
          <Link key={video._id} to={`/watch/${video._id}`} className="group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
              </span>
            </div>
            
            <div className="flex gap-3 px-1">
              <div className="flex-shrink-0">
                 <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {video.uploader.username[0]}
                 </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-semibold leading-snug line-clamp-2 mb-1 group-hover:text-blue-300">
                  {video.title}
                </h3>
                <div className="text-gray-400 text-sm">
                  <p className="hover:text-white">{video.uploader.username}</p>
                  <p className="flex items-center gap-1">
                    <span>{Intl.NumberFormat('en-US', { notation: "compact" }).format(video.views)} views</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};