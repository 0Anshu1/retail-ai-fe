'use client';

import { useState, useEffect } from 'react';
import { Save, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your profile and system preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" /> Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={user?.name || ''} 
                readOnly
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                readOnly
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <input 
                type="text" 
                value={user?.role || ''} 
                readOnly
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 capitalize"
              />
            </div>
          </div>
        </div>
      </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-amber-600" /> Notification Preferences
          </h2>
        </div>
        <div className="p-6 space-y-4">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-800">Email Alerts</p>
               <p className="text-xs text-slate-500">Receive daily summaries and critical alerts via email.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
           </div>
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-slate-800">SMS / WhatsApp Alerts</p>
               <p className="text-xs text-slate-500">Get real-time security alerts on your phone.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
           </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-blue-700 text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20">
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
