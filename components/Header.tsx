'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

interface HeaderProps {
  isCollapsed: boolean;
}

export default function Header({ isCollapsed }: HeaderProps) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className={`h-16 bg-white/70 backdrop-blur-md border-b border-[#e5e1da] flex items-center justify-between px-8 fixed right-0 top-0 z-10 transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}>
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#e5e1da] rounded-xl text-sm bg-[#f9f6f1]/50 focus:ring-2 focus:ring-[#c5a059]/30 focus:border-[#c5a059] transition-all text-black"
            placeholder="Search employees, zones, or reports..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-slate-500 hover:bg-[#c5a059]/5 hover:text-[#c5a059] rounded-xl transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ') || 'Role'}</p>
          </div>
          <div className="h-10 w-10 bg-gradient-to-br from-[#c5a059] to-[#8d7b68] rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow-900/10">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
