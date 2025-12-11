import React, { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In real app: call API
    try {
      const { user, token } = await mockApi.login(email);
      login(user, token);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-brand-dark">
       <div className="w-full max-w-md bg-[#272727] p-8 rounded-xl shadow-2xl">
          <div className="text-center mb-8">
             <h1 className="text-3xl font-bold text-white mb-2">OpenTube</h1>
             <p className="text-gray-400">Sign in to manage your videos</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
                  placeholder="demo@opentube.com"
                  required
                />
             </div>
             <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-[#121212] border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
                  placeholder="••••••••"
                  defaultValue="password"
                />
             </div>
             
             <button disabled={loading} className="w-full bg-blue-600 text-black font-bold py-3 rounded hover:bg-blue-500 transition-colors mt-2">
                {loading ? 'Signing in...' : 'Sign In'}
             </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-sm text-gray-500">
               Don't have an account? <span className="text-blue-400 cursor-pointer hover:underline">Create one</span>
             </p>
          </div>
       </div>
    </div>
  );
};