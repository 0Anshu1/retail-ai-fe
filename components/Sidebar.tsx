'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Camera, 
  Settings, 
  LogOut,
  ShoppingBag,
  ChevronLeft,
  Menu
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Employees', href: '/dashboard/employees' },
  { icon: BarChart3, label: 'Customer Analytics', href: '/dashboard/analytics' },
  { icon: Camera, label: 'Live Cameras', href: '/dashboard/cameras' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setRole(JSON.parse(user).role);
    }
  }, []);

  const filteredItems = menuItems.filter(item => {
    if (role === 'security') {
      return ['Dashboard', 'Live Cameras', 'Settings'].includes(item.label);
    }
    if (role === 'supervisor') {
       return ['Dashboard', 'Customer Analytics', 'Live Cameras', 'Settings'].includes(item.label);
    }
    return true; 
  });

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-[#121113] text-white flex flex-col h-screen fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out border-r border-white/5`}>
      <div className={`p-6 border-b border-white/5 flex items-center justify-between overflow-hidden whitespace-nowrap h-16`}>
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'} transition-all duration-300`}>
          <div className="bg-[#c5a059] p-2 rounded-lg shadow-lg shadow-yellow-900/20">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Jeeja Fashion</h1>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : ''}
              className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/10' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? 'w-full justify-center' : 'space-x-4'}`}>
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                {!isCollapsed && <span className="font-semibold text-sm">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => {
            localStorage.removeItem('user');
            document.cookie = 'token=; Max-Age=0; path=/;';
            window.location.href = '/login';
          }}
          className={`flex items-center rounded-xl transition-all duration-200 group ${
            isCollapsed ? 'justify-center p-3 w-full' : 'px-4 py-3 space-x-4 w-full'
          } text-slate-400 hover:text-red-400 hover:bg-red-500/10`}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-semibold text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
