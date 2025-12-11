import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Search, Menu, Upload, User as UserIcon, LogOut, Shield } from 'lucide-react';

export const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-brand-dark border-b border-brand-gray sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-brand-gray rounded-full">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <div className="bg-brand-red text-white p-1 rounded font-bold text-xl">OT</div>
          <span className="text-xl font-bold tracking-tighter hidden sm:block">OpenTube</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 hidden sm:flex">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#121212] border border-brand-gray rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-brand-gray border border-l-0 border-brand-gray rounded-r-full px-6 hover:bg-[#3f3f3f]">
            <Search className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Link to="/upload" title="Upload Video" className="p-2 hover:bg-brand-gray rounded-full">
              <Upload className="w-6 h-6 text-white" />
            </Link>
            
            {isAdmin && (
               <Link to="/admin" title="Admin Dashboard" className="p-2 hover:bg-brand-gray rounded-full text-red-500">
                <Shield className="w-6 h-6" />
              </Link>
            )}

            <div className="relative group ml-2">
               <button className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="font-bold text-sm">{user?.username?.[0].toUpperCase()}</span>
                    </div>
                  )}
               </button>
               {/* Dropdown */}
               <div className="absolute right-0 top-full mt-2 w-48 bg-brand-gray rounded shadow-lg hidden group-hover:block p-2">
                  <div className="px-4 py-2 border-b border-gray-600 mb-2">
                    <p className="font-bold truncate">{user?.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-[#3f3f3f] rounded flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
               </div>
            </div>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 border border-brand-gray text-blue-400 px-4 py-1.5 rounded-full hover:bg-blue-400/10 font-medium">
            <UserIcon className="w-5 h-5" />
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
};