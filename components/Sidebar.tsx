import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Clock, ThumbsUp, PlaySquare, Film } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const MenuItem = ({ icon: Icon, label, to }: { icon: any, label: string, to: string }) => (
  <Link to={to} className="flex items-center gap-4 px-3 py-2 hover:bg-brand-gray rounded-lg mb-1">
    <Icon className="w-6 h-6" />
    <span className="text-sm font-medium truncate">{label}</span>
  </Link>
);

export const Sidebar = ({ isOpen }: SidebarProps) => {
  if (!isOpen) return null;

  return (
    <aside className="w-60 h-full overflow-y-auto hidden md:block px-2 py-3 bg-brand-dark custom-scrollbar">
      <MenuItem icon={Home} label="Home" to="/" />
      <MenuItem icon={Compass} label="Shorts" to="/" />
      <MenuItem icon={PlaySquare} label="Subscriptions" to="/" />
      
      <hr className="my-3 border-brand-gray" />
      
      <MenuItem icon={Film} label="Library" to="/" />
      <MenuItem icon={Clock} label="History" to="/" />
      <MenuItem icon={ThumbsUp} label="Liked Videos" to="/" />

      <hr className="my-3 border-brand-gray" />
      
      <div className="px-3 py-2">
         <p className="text-sm text-gray-400 mb-2 font-semibold">SUBSCRIPTIONS</p>
         {/* Placeholder for subscriptions */}
         <p className="text-xs text-gray-500">Sign in to see subscriptions</p>
      </div>
    </aside>
  );
};