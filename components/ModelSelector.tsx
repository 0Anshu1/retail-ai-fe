'use client';

import { useState } from 'react';
import { Brain, Users, Eye, Activity, ShieldCheck, X, Sparkles, Zap, Search } from 'lucide-react';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel: (modelType: string, version?: string) => void;
  cameraName: string;
}

const analyticalSuites = [
  {
    id: 'face_recognition',
    name: 'Customer Recognition',
    description: 'Recognize repeat visitors and loyal customers instantly.',
    icon: Eye,
    color: 'bg-[#c5a059]', // gold
    features: ['Loyalty Matching', 'Demographics', 'Emotion Analysis', 'VIP Tracking'],
    versions: ['Standard View', 'Precision Mode']
  },
  {
    id: 'person_detection',
    name: 'Visitor Footfall',
    description: 'Track store traffic flow and visitor movement patterns.',
    icon: Users,
    color: 'bg-[#8d7b68]', // cashmere
    features: ['Traffic Counting', 'Path Analysis', 'Dwell Duration', 'Wait Detection'],
    versions: ['Balanced', 'High Velocity']
  },
  {
    id: 'object_detection',
    name: 'Product Engagement',
    description: 'Monitor interaction with specific merchandise and bags.',
    icon: Brain,
    color: 'bg-[#2d2a2e]', // slate
    features: ['Merchandise Touch', 'Bag Detection', 'Shelf Monitoring', 'Pick-up Alerts'],
    versions: ['Product Focus', 'Wide View']
  },
  {
    id: 'crowd_analysis',
    name: 'Showroom Density',
    description: 'Real-time monitoring of store occupancy and hotspots.',
    icon: Activity,
    color: 'bg-[#c5a059]',
    features: ['Heatmap Generation', 'Flow Density', 'Congestion Watch', 'Peak Analysis'],
    versions: ['Grid Matrix', 'Fluid Flow']
  },
  {
    id: 'behavior_analysis',
    name: 'Safety & Security',
    description: 'Automated monitoring for safety and showroom security.',
    icon: ShieldCheck,
    color: 'bg-[#2d2a2e]',
    features: ['Loitering Watch', 'Unusual Movement', 'Safety Alerts', 'After-hours Monitor'],
    versions: ['Essential Security', 'Maximum Insight']
  }
];

export default function ModelSelector({ isOpen, onClose, onSelectModel, cameraName }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  if (!isOpen) return null;

  const handleStartAnalytics = () => {
    if (selectedModel) {
      onSelectModel(selectedModel, selectedVersion);
      onClose();
    }
  };

  const selectedSuite = analyticalSuites.find(s => s.id === selectedModel);

  return (
    <div className="fixed inset-0 bg-[#121113]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-[#f9f6f1] rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] max-w-5xl w-full max-h-[90vh] border border-white relative overflow-hidden flex flex-col">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8d7b68]/5 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none"></div>

        {/* Fixed Header */}
        <div className="p-8 md:px-10 border-b border-[#e5e1da]/50 flex items-center justify-between relative z-10 bg-white/40 backdrop-blur-sm">
          <div>
            <div className="flex items-center space-x-2 text-[#c5a059] mb-1">
               <Sparkles className="h-4 w-4" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Intelligence Platform</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Analytical Hub</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Configuring visual insights for <span className="text-[#8d7b68] font-bold italic">{cameraName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white hover:bg-slate-100 rounded-2xl transition-all shadow-sm group border border-[#e5e1da]"
          >
            <X className="h-5 w-5 text-slate-400 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Model Grid */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 scrollbar-fashion relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {analyticalSuites.map((suite) => {
              const IconComponent = suite.icon;
              const isSelected = selectedModel === suite.id;
              
              return (
                <div
                  key={suite.id}
                  onClick={() => {
                    setSelectedModel(suite.id);
                    setSelectedVersion(suite.versions[0]);
                  }}
                  className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 relative group overflow-hidden flex flex-col ${
                    isSelected 
                      ? 'border-[#c5a059] bg-white shadow-2xl shadow-[#c5a059]/10' 
                      : 'border-transparent bg-white/60 hover:bg-white hover:border-[#e5e1da]'
                  }`}
                >
                  <div className="flex items-start space-x-6 relative z-10">
                    <div className={`p-4 rounded-2xl ${suite.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 flex-shrink-0`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-black tracking-tight mb-2 text-xl ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{suite.name}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{suite.description}</p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {suite.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 opacity-70">
                            <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#c5a059]' : 'bg-slate-400'}`}></div>
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider whitespace-nowrap">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                      <div className="bg-[#c5a059] text-white p-1 rounded-full">
                        <Zap className="h-3 w-3 fill-current" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-8 md:px-10 border-t border-[#e5e1da]/50 bg-white/60 backdrop-blur-md relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 min-w-0">
              {selectedSuite ? (
                <div className="flex flex-col animate-in slide-in-from-left-4 duration-500">
                  <span className="text-[10px] font-black text-[#8d7b68] uppercase tracking-widest mb-3">Refine View Mode</span>
                  <div className="flex bg-[#f9f6f1] p-1.5 rounded-2xl border border-[#e5e1da] shadow-inner w-fit">
                    {selectedSuite.versions.map((version) => (
                      <button
                        key={version}
                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          selectedVersion === version
                            ? 'bg-white text-[#c5a059] shadow-md border-[#e5e1da]'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                        onClick={() => setSelectedVersion(version)}
                      >
                        {version}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4 text-slate-400 animate-pulse">
                   <div className="p-2 bg-slate-100 rounded-full">
                     <Search className="h-4 w-4" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-widest italic">Select an analytical tool above to initialize the hub</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 w-full md:w-auto">
              <button
                onClick={onClose}
                className="px-8 py-4 text-slate-400 hover:text-[#8d7b68] font-black uppercase tracking-widest text-xs transition-colors"
              >
                Close Window
              </button>
              <button
                onClick={handleStartAnalytics}
                disabled={!selectedModel}
                className={`flex-1 md:flex-none flex items-center justify-center space-x-4 px-12 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl ${
                  selectedModel
                    ? 'bg-[#121113] text-white hover:bg-black shadow-black/30 hover:-translate-y-1'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50 shadow-none'
                }`}
              >
                <Zap className={`h-5 w-5 ${selectedModel ? 'text-[#c5a059] fill-[#c5a059]' : ''}`} />
                <span>Initialize Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}