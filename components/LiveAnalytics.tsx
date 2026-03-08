'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Square, Download, Settings, Activity, Shield, Users, Clock } from 'lucide-react';
import RTSPPlayer from './RTSPPlayer';

interface LiveAnalyticsProps {
  camera: any;
  modelType: string;
  modelVersion?: string;
  onBack: () => void;
}

interface Detection {
  id: string;
  timestamp: Date;
  confidence: number;
  boundingBox: { x: number; y: number; width: number; height: number };
  label: string;
  metadata?: any;
}

export default function LiveAnalytics({ camera, modelType, modelVersion, onBack }: LiveAnalyticsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [sessionStats, setSessionStats] = useState({
    totalDetections: 0,
    averageConfidence: 0,
    sessionDuration: 0,
    uniquePersons: 0
  });
  const [sessionId, setSessionId] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modelNames = {
    face_recognition: 'Customer Recognition',
    person_detection: 'Visitor Traffic',
    object_detection: 'Product Engagement',
    crowd_analysis: 'Showroom Density',
    behavior_analysis: 'Safety & Security'
  };

  useEffect(() => {
    // Start analytics session
    startAnalyticsSession();
    
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        generateMockDetection();
      }, 2000);
    }

    const durationInterval = setInterval(() => {
      if (isRecording) {
        setSessionStats(prev => ({ ...prev, sessionDuration: prev.sessionDuration + 1 }));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(durationInterval);
      if (sessionId) {
        endAnalyticsSession();
      }
    };
  }, [isRecording]);

  const startAnalyticsSession = async () => {
    try {
      const response = await fetch('/api/analytics-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cameraId: camera.id,
          modelType: modelType
        })
      });
      const session = await response.json();
      setSessionId(session.sessionId);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const endAnalyticsSession = async () => {
    if (!sessionId) return;
    
    try {
      await fetch('/api/analytics-session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          isActive: false,
          statistics: sessionStats
        })
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const generateMockDetection = () => {
    const labels = {
      face_recognition: ['John Doe', 'Jane Smith', 'Unknown Person', 'Employee #123'],
      person_detection: ['Person', 'Customer', 'Staff'],
      object_detection: ['Handbag', 'Shopping Cart', 'Product', 'Mobile Phone'],
      crowd_analysis: ['Dense Area', 'Moderate Crowd', 'Light Traffic'],
      behavior_analysis: ['Normal Behavior', 'Loitering', 'Fast Movement']
    };

    const detection: Detection = {
      id: `det_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      confidence: Math.random() * 0.4 + 0.6, // 60-100%
      boundingBox: {
        x: Math.random() * 400,
        y: Math.random() * 300,
        width: 80 + Math.random() * 120,
        height: 100 + Math.random() * 150
      },
      label: labels[modelType as keyof typeof labels][Math.floor(Math.random() * labels[modelType as keyof typeof labels].length)]
    };

    setDetections(prev => [detection, ...prev.slice(0, 49)]); // Keep last 50
    
    // Update stats
    setSessionStats(prev => ({
      ...prev,
      totalDetections: prev.totalDetections + 1,
      averageConfidence: ((prev.averageConfidence * prev.totalDetections) + detection.confidence) / (prev.totalDetections + 1),
    }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleExportSession = () => {
    if (detections.length === 0) return;
    const exportData = detections.map(d => ({
      Time: d.timestamp.toLocaleTimeString(),
      Label: d.label,
      Confidence: `${Math.round(d.confidence * 100)}%`,
      Camera: camera.name,
      Model: modelType
    }));
    import('@/lib/exportUtils').then(m => {
      m.exportToCSV(exportData, `Live_Session_Report_${camera.name.replace(/\s+/g, '_')}`);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Overlay */}
      <div className="bg-white/70 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-5">
          <button
            onClick={onBack}
            className="p-3 bg-[#f9f6f1] hover:bg-[#e5e1da] rounded-2xl transition-all group"
          >
            <ArrowLeft className="h-5 w-5 text-[#c5a059] group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
               <Shield className="h-4 w-4 text-[#c5a059]" />
               <h1 className="text-2xl font-black text-slate-900 leading-none">
                {modelNames[modelType as keyof typeof modelNames]}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1.5 flex items-center">
               <span className="text-[#c5a059] mr-2">LIVE SESSION</span> • {camera.name} • {camera.zone}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-xl flex items-center space-x-3 border transition-all ${
            isRecording 
              ? 'bg-rose-50 border-rose-100 text-rose-700' 
              : 'bg-[#f9f6f1] border-[#e5e1da] text-[#8d7b68]'
          }`}>
            <span className="relative flex h-2 w-2">
              {isRecording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRecording ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest">{isRecording ? 'Analyzing' : 'Ready'}</span>
          </div>
          <button
            onClick={handleExportSession}
            className="p-2.5 bg-white border border-[#e5e1da] rounded-xl text-slate-400 hover:text-[#c5a059] transition-all shadow-sm"
            title="Download Session Report"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={toggleRecording}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
              isRecording 
                ? 'bg-[#121113] text-white hover:bg-black' 
                : 'bg-[#c5a059] text-white hover:bg-[#b08e4d] shadow-[#c5a059]/30'
            }`}
          >
            {isRecording ? (
              <Pause className="h-4 w-4 text-[#c5a059]" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span>{isRecording ? 'Stop' : 'Start'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Viewport */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#121113] rounded-[2rem] overflow-hidden relative shadow-2xl border-4 border-white aspect-video group">
            <RTSPPlayer
              cameraId={camera.id}
              rtspUrl={camera.rtspUrl}
              onDetection={(detection) => {
                setDetections(prev => [detection, ...prev.slice(0, 49)]);
                setSessionStats(prev => ({
                  ...prev,
                  totalDetections: prev.totalDetections + 1,
                  averageConfidence: ((prev.averageConfidence * prev.totalDetections) + detection.confidence) / (prev.totalDetections + 1)
                }));
              }}
              className="w-full h-full object-cover opacity-80"
            />
            
            {/* HUD Overlay */}
            <div className="absolute inset-x-8 top-8 flex justify-between items-start pointer-events-none">
               <div className="flex flex-col space-y-2">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                     <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mr-2">Status</span>
                     <span className="text-xs font-bold text-white uppercase">Encrypted Feed</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                     <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mr-2">Camera</span>
                     <span className="text-xs font-bold text-white uppercase">{camera.id.toString().padStart(2, '0')}-Mumbai</span>
                  </div>
               </div>
               <div className="flex flex-col items-end space-y-2">
                  <div className="bg-[#c5a059] text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-lg">
                    Real-Time
                  </div>
                  <div className="text-white font-mono text-sm bg-black/40 px-3 py-1 rounded border border-white/10 uppercase">
                    {new Date().toLocaleTimeString()}
                  </div>
               </div>
            </div>

            {/* Scanning Line Animation */}
            {isRecording && <div className="absolute inset-x-0 h-[2px] bg-[#c5a059]/40 shadow-[0_0_15px_rgba(197,160,89,0.8)] top-0 animate-[scan_3s_linear_infinite]"></div>}
          </div>

          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <SessionStat label="Detections" value={sessionStats.totalDetections} icon={Activity} color="slate" />
             <SessionStat label="Confidence" value={`${Math.round(sessionStats.averageConfidence * 100)}%`} icon={Shield} color="gold" />
             <SessionStat label="Session" value={`${Math.floor(sessionStats.sessionDuration / 60)}:${(sessionStats.sessionDuration % 60).toString().padStart(2, '0')}`} icon={Clock} color="slate" />
             <SessionStat label="Unique" value={sessionStats.uniquePersons} icon={Users} color="gold" />
          </div>
        </div>

        {/* Sidebar Log */}
        <div className="bg-white rounded-[2rem] border border-[#e5e1da] shadow-sm flex flex-col h-[calc(100vh-200px)] lg:h-auto">
          <div className="p-6 border-b border-[#f9f6f1] flex items-center justify-between">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm italic">Vision Log</h3>
            <span className="text-[10px] font-bold text-[#c5a059] bg-[#f9f6f1] px-2 py-0.5 rounded uppercase">Live</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-fashion">
            {detections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12 text-center">
                <Shield className="h-10 w-10 mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting AI Input</p>
                <p className="text-[10px] mt-1 italic">Configure stream to begin</p>
              </div>
            ) : (
              detections.map((detection) => (
                <div key={detection.id} className="group flex items-center space-x-3 p-3 bg-[#f9f6f1] hover:bg-white border border-[#e5e1da] rounded-2xl transition-all shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#e5e1da] flex items-center justify-center flex-shrink-0 group-hover:bg-[#c5a059]/10 transition-colors">
                    <Activity className="h-4 w-4 text-[#c5a059]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate uppercase tracking-tight">{detection.label}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase">{Math.round(detection.confidence * 100)}%</span>
                    </div>
                    <div className="text-[9px] text-[#8d7b68] font-bold mt-0.5 tracking-widest">
                      {detection.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function SessionStat({ label, value, icon: Icon, color }: any) {
  const isGold = color === 'gold';
  return (
    <div className={`p-4 rounded-2xl border border-[#e5e1da] shadow-sm transition-all bg-white`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl transition-colors ${isGold ? 'bg-[#fefce8] text-[#c5a059]' : 'bg-[#f9f6f1] text-[#8d7b68]'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
           <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}