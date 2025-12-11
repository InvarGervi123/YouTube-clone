import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Video, Comment } from '../types';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      setError(null);
      Promise.all([
        api.getVideoById(videoId),
        api.getComments(videoId)
      ]).then(([vidData, commentData]) => {
        setVideo(vidData);
        setComments(commentData);
        setLoading(false);
      }).catch(err => {
        console.error("Error loading video", err);
        setError("Failed to load video. It might be deleted or the server is unavailable.");
        setLoading(false);
      });
    }
  }, [videoId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  
  if (error) return (
    <div className="p-10 text-center flex flex-col items-center justify-center">
       <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
       <p className="text-xl font-bold">{error}</p>
    </div>
  );

  if (!video) return <div className="p-10 text-center">Video not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Player Container */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-4 relative group">
          <video 
            src={video.url} 
            controls 
            autoPlay 
            className="w-full h-full"
            poster={video.thumbnailUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info */}
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">{video.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                  {video.uploader?.username?.[0]}
               </div>
               <div>
                  <h3 className="font-bold">{video.uploader?.username}</h3>
                  <p className="text-xs text-gray-400">{video.uploader?.subscribersCount || 0} subscribers</p>
               </div>
               <button className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 ml-4">
                 Subscribe
               </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-gray-600">
                  <ThumbsUp className="w-5 h-5" /> {video.likes}
                </button>
                <button className="px-4 py-2 hover:bg-[#3f3f3f]">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f]">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="p-2 bg-[#272727] rounded-full hover:bg-[#3f3f3f]">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#272727] p-4 rounded-xl mb-6 hover:bg-[#3f3f3f] cursor-pointer transition-colors">
          <div className="flex gap-4 font-bold text-sm mb-2">
             <span>{video.views.toLocaleString()} views</span>
             <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt)) : ''} ago</span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{video.description}</p>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> {comments.length} Comments
          </h3>
          <div className="text-center text-gray-500 py-4">
            Comments system is coming soon...
          </div>
        </div>
      </div>

      {/* Recommendations (Sidebar) */}
      <div className="lg:w-[350px] flex-shrink-0">
        <h3 className="font-bold mb-3">Recommended</h3>
        <p className="text-gray-500 text-sm">More videos coming soon...</p>
      </div>
    </div>
  );
};