import React, { useState } from 'react';
import { UploadCloud, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // In real app, redirect to video manager or watch page
          setTimeout(() => navigate('/'), 1000); 
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#272727] rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6">Upload Video</h2>
      
      {!file ? (
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-[#3f3f3f] transition-colors relative">
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="bg-[#1f1f1f] p-4 rounded-full mb-4">
            <UploadCloud className="w-10 h-10 text-gray-400" />
          </div>
          <p className="font-bold text-lg mb-2">Drag and drop video files to upload</p>
          <p className="text-sm text-gray-400">Your videos will remain private until you publish them.</p>
          <button className="mt-6 bg-blue-600 text-black px-6 py-2 rounded font-medium">Select Files</button>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="bg-[#1f1f1f] p-4 rounded-lg flex items-center gap-4">
             <div className="bg-gray-800 p-2 rounded">
                <FilmIcon />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
             </div>
             <button type="button" onClick={() => setFile(null)} className="text-red-400 text-sm hover:underline">Change</button>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Title (required)</label>
             <input type="text" className="w-full bg-[#121212] border border-gray-600 rounded p-2 focus:border-blue-500 outline-none" placeholder="Video title" defaultValue={file.name} />
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Description</label>
             <textarea className="w-full bg-[#121212] border border-gray-600 rounded p-2 focus:border-blue-500 outline-none h-32" placeholder="Tell viewers about your video"></textarea>
          </div>

          <div>
             <label className="block text-sm font-medium mb-1">Visibility</label>
             <select className="w-full bg-[#121212] border border-gray-600 rounded p-2 focus:border-blue-500 outline-none">
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
             </select>
          </div>

          {uploading ? (
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span>Uploading...</span>
                   <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                   <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
             </div>
          ) : progress === 100 ? (
             <div className="flex items-center text-green-500 gap-2">
                <CheckCircle className="w-5 h-5" /> Upload Complete! Redirecting...
             </div>
          ) : (
             <div className="flex justify-end pt-4">
                <button type="submit" className="bg-blue-600 text-black font-bold px-6 py-2 rounded hover:bg-blue-500">
                   Upload
                </button>
             </div>
          )}
        </form>
      )}
    </div>
  );
};

const FilmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-film"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);