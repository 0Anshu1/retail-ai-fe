'use client';

import { useEffect, useState } from 'react';
import { Camera, Maximize2, AlertCircle, Play, Wifi, WifiOff, LayoutGrid, List } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
import LiveAnalytics from '@/components/LiveAnalytics';

export default function CamerasPage() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch('/api/cameras');
        const data = await res.json();
        setCameras(data);
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  const handleCameraClick = (camera: any) => {
    setSelectedCamera(camera);
    setShowModelSelector(true);
  };

  const handleModelSelect = (modelType: string, version?: string) => {
    setSelectedModel(modelType);
    setSelectedVersion(version || '');
    setShowAnalytics(true);
  };

  const handleBackFromAnalytics = () => {
    setShowAnalytics(false);
    setShowModelSelector(false);
    setSelectedCamera(null);
    setSelectedModel('');
    setSelectedVersion('');
  };

  if (showAnalytics && selectedCamera) {
    return (
      <LiveAnalytics
        camera={selectedCamera}
        modelType={selectedModel}
        modelVersion={selectedVersion}
        onBack={handleBackFromAnalytics}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-6 rounded-3xl border border-white backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Live Camera System</h1>
          <p className="text-slate-500 mt-1">47 High-definition RTSP streams with AI processing.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-[#f9f6f1] p-1 rounded-xl border border-[#e5e1da]">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#c5a059]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#c5a059]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <span className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Network Secure</span>
          </span>
        </div>
      </div>

      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-5`}>
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-video bg-white/50 rounded-2xl animate-pulse border border-[#e5e1da]"></div>
          ))
        ) : cameras.map((cam) => (
          <div 
            key={cam.id} 
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#e5e1da] transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleCameraClick(cam)}
          >
            {/* Camera Feed Container */}
            <div className={`relative ${viewMode === 'grid' ? 'aspect-video' : 'h-32 md:h-24'} bg-slate-900 group-hover:bg-black transition-colors`}>
              {/* RTSP Placeholder with pattern */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c5a059 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/40 group-hover:text-[#c5a059]/60 transition-colors">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-[10px] font-bold uppercase tracking-widest">{cam.rtspUrl.split('/').pop()}</div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#c5a059] text-white text-[9px] font-black uppercase tracking-tighter rounded-md shadow-lg shadow-yellow-950/20">
                  LIVE
                </span>
                <span className="text-[10px] text-white font-bold tracking-tight bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">{cam.name}</span>
              </div>

               {/* Quick Action buttons */}
              <div className="absolute top-3 right-3 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-[#c5a059] backdrop-blur-sm transition-all shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCameraClick(cam);
                  }}
                >
                  <Play className="h-3.5 w-3.5" />
                </button>
                <button className="p-1.5 bg-white/10 text-white rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all shadow-lg">
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Status indicator icon */}
              <div className="absolute bottom-3 right-3">
                {cam.status === 'online' ? (
                  <Wifi className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                ) : (
                  <WifiOff className="h-4 w-4 text-rose-400" />
                )}
              </div>
            </div>

            <div className="p-4 bg-white flex items-center justify-between border-t border-[#f9f6f1]">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-[#f9f6f1] rounded-lg">
                  <Camera className="h-3.5 w-3.5 text-[#8d7b68]" />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{cam.zone}</span>
              </div>
              <div>
                {cam.status === 'online' ? (
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Secure</span>
                ) : (
                  <span className="text-[10px] font-black text-amber-500 flex items-center uppercase">
                    Offline
                  </span>
                )}
              </div>
            </div>

            {/* Premium Hover overlay */}
            <div className="absolute inset-0 bg-[#c5a059]/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-2xl scale-90 group-hover:scale-100 transition-transform border border-[#c5a059]/30">
                <div className="text-xs font-black text-[#c5a059] uppercase tracking-widest text-center">Initialize Vision</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5 text-center">Click to configure AI Model</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Selection Modal */}
      <ModelSelector
        isOpen={showModelSelector}
        onClose={() => {
          setShowModelSelector(false);
          setSelectedCamera(null);
        }}
        onSelectModel={handleModelSelect}
        cameraName={selectedCamera?.name || ''}
      />
    </div>
  );
}
