import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { Video, Comment } from '../types';
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Watch = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoId) {
      setLoading(true);
      Promise.all([
        mockApi.getVideoById(videoId),
        mockApi.getComments(videoId)
      ]).then(([vidData, commentData]) => {
        if(vidData) setVideo(vidData);
        setComments(commentData);
        setLoading(false);
      });
    }
  }, [videoId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
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
                  {video.uploader.username[0]}
               </div>
               <div>
                  <h3 className="font-bold">{video.uploader.username}</h3>
                  <p className="text-xs text-gray-400">{video.uploader.subscribersCount} subscribers</p>
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
             <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
          </div>
          <p className="whitespace-pre-wrap text-sm">{video.description}</p>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> {comments.length} Comments
          </h3>
          <div className="space-y-4">
             {/* Add Comment Input */}
             <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold">You</div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Add a comment..." 
                    className="w-full bg-transparent border-b border-gray-600 focus:border-white focus:outline-none py-1 mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button className="text-sm px-4 py-2 rounded-full hover:bg-[#3f3f3f]">Cancel</button>
                    <button className="text-sm px-4 py-2 bg-blue-600 text-black font-semibold rounded-full hover:bg-blue-500">Comment</button>
                  </div>
                </div>
             </div>

             {/* List */}
             {comments.map(comment => (
               <div key={comment._id} className="flex gap-4">
                 <div className="w-10 h-10 bg-purple-600 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm">
                   {comment.author.username[0]}
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-semibold text-sm">{comment.author.username}</span>
                     <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                   </div>
                   <p className="text-sm text-gray-200">{comment.content}</p>
                   <div className="flex items-center gap-4 mt-2">
                     <button className="p-1 hover:bg-gray-700 rounded-full"><ThumbsUp className="w-4 h-4" /></button>
                     <button className="p-1 hover:bg-gray-700 rounded-full"><ThumbsDown className="w-4 h-4" /></button>
                     <button className="text-xs hover:bg-gray-700 px-2 py-1 rounded-full font-medium">Reply</button>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Recommendations (Sidebar) */}
      <div className="lg:w-[350px] flex-shrink-0">
        <h3 className="font-bold mb-3">Recommended</h3>
        {/* Using mock videos list again for recommendations */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-2 mb-3 cursor-pointer group">
             <div className="w-40 h-24 bg-gray-700 rounded-lg overflow-hidden relative flex-shrink-0">
                <img src={`https://picsum.photos/seed/${i * 55}/300/200`} className="w-full h-full object-cover" />
             </div>
             <div>
                <h4 className="font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-blue-300">Recommended Video Title #{i}</h4>
                <p className="text-xs text-gray-400">Channel Name</p>
                <p className="text-xs text-gray-400">10K views • 2 days ago</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};