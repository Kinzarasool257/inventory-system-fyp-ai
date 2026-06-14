import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Database, MessageSquare } from 'lucide-react';

const TopNavbar = ({ setSidebarOpen, isSidebarOpen, role = "manager" }) => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // 🔐 Safe userData fallback initialization
  const [userData] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : { name: 'Manager', email: 'manager@smartstock.com', role: 'store1' };
    } catch (e) {
      return { name: 'Manager', email: 'manager@smartstock.com', role: 'store1' };
    }
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine if explicitly configured as an admin view
  const isAdmin = role === "admin" || userData?.role === "admin";

  return (
    <nav className="h-20 bg-[#e2eff5]/80 backdrop-blur-md border-b border-[#d1e2e8] flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors">
          <Menu size={20} className="text-[#2b3a4a]"/>
        </button>
        <h2 className="text-xl font-black italic text-[#4b7291] tracking-tight text-left">
          Welcome {isAdmin ? 'Admin' : 'Manager'} !
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* 🤖 Chatbot icon is visible ONLY on the admin dashboard header layout */}
        {isAdmin ? (
          <button 
            onClick={() => navigate('/admin-chat')}
            className="p-2 bg-white border-2 border-[#2b3a4a] text-[#2b3a4a] rounded-xl hover:bg-slate-50 transition-all relative shadow-sm group"
            title="Open Strategic AI Assistant"
          >
            <MessageSquare size={22} strokeWidth={2.5} className="group-hover:scale-105 transition-transform" />
          </button>
        ) : null}

        {/* PROFILE SECTION */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-4 border-l border-[#d1e2e8] cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black uppercase text-[#2b3a4a] tracking-tighter leading-none">
                {isAdmin ? "Maham Ahmed" : (userData?.name || 'User Profile')}
              </p>
              <p className="text-[9px] font-bold text-[#4b7291]">
                {isAdmin ? "maham26@gmail.com" : (userData?.email || 'authenticated@smartstock.com')}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#4b7291] text-white flex items-center justify-center font-black shadow-lg group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-[#d1e2e8] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#f1f5f9]">
                    <p className="text-[10px] font-black uppercase text-[#94a3b8]">Account Role</p>
                    <p className="text-xs font-bold text-[#2b3a4a]">
                      {isAdmin ? 'System Administrator' : 'Store Manager'}
                    </p>
                </div>
                <button className="w-full text-left p-3 hover:bg-[#e2eff5]/50 rounded-2xl text-xs font-bold text-[#4b7291] transition-colors">Profile Settings</button>
                <button className="w-full text-left p-3 hover:bg-red-50 rounded-2xl text-xs font-bold text-[#ff8a8a] transition-colors">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;