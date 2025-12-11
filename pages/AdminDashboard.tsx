import React, { useState, useEffect } from 'react';
import { Shield, Users, Video as VideoIcon, AlertTriangle, Trash2, Ban, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { Video, User } from '../types';

const TabButton = ({ active, label, icon: Icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${active ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
  >
    <Icon className="w-5 h-5" /> {label}
  </button>
);

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'videos' | 'reports'>('videos');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-red-600 p-2 rounded">
           <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
           <p className="text-gray-400">Manage users, videos, and platform safety.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <StatCard label="Total Users" value="12" />
         <StatCard label="Total Videos" value="142" />
         <StatCard label="Storage Used" value="4.2 GB" />
         <StatCard label="Pending Reports" value="0" alert={false} />
      </div>

      <div className="border-b border-gray-700 flex mb-6">
         <TabButton active={activeTab === 'videos'} label="Videos" icon={VideoIcon} onClick={() => setActiveTab('videos')} />
         <TabButton active={activeTab === 'users'} label="Users" icon={Users} onClick={() => setActiveTab('users')} />
         <TabButton active={activeTab === 'reports'} label="Reports" icon={AlertTriangle} onClick={() => setActiveTab('reports')} />
      </div>

      <div className="bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800 min-h-[400px]">
         {activeTab === 'videos' && <VideosTable />}
         {activeTab === 'users' && <UsersTable />}
         {activeTab === 'reports' && <ReportsTable />}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, alert }: any) => (
  <div className={`bg-[#1f1f1f] p-5 rounded-xl border ${alert ? 'border-red-500/50' : 'border-gray-800'}`}>
     <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
     <p className={`text-3xl font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</p>
  </div>
);

// --- Sub-components for Tables ---

const VideosTable = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    setLoading(true);
    api.getVideos().then(data => {
      setVideos(data);
      setLoading(false);
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await api.deleteVideo(id);
        loadVideos(); // Refresh
      } catch (err) {
        alert('Failed to delete video');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading videos...</div>;

  return (
    <table className="w-full text-left">
      <thead className="bg-[#2a2a2a] text-gray-400 text-sm">
        <tr>
          <th className="p-4">Title</th>
          <th className="p-4">Uploader</th>
          <th className="p-4">Stats</th>
          <th className="p-4">Visibility</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {videos.map(video => (
          <tr key={video._id} className="hover:bg-[#2a2a2a]">
            <td className="p-4">
              <div className="flex gap-3">
                <div className="w-16 h-9 bg-gray-700 rounded overflow-hidden">
                  <img src={video.thumbnailUrl || 'https://via.placeholder.com/100x60'} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{video.title}</p>
                  <p className="text-xs text-gray-500">{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : ''}</p>
                </div>
              </div>
            </td>
            <td className="p-4">{video.uploader?.username || 'Unknown'}</td>
            <td className="p-4 text-sm text-gray-400">{video.views} views</td>
            <td className="p-4"><span className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded-full">{video.visibility}</span></td>
            <td className="p-4 text-right">
               <button onClick={() => handleDelete(video._id)} className="text-red-400 hover:bg-red-900/30 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const UsersTable = () => (
  <div className="p-8 text-center text-gray-400">User management coming soon...</div>
);

const ReportsTable = () => (
   <div className="p-12 text-center text-gray-500">
      <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>No open reports. Good job!</p>
   </div>
);