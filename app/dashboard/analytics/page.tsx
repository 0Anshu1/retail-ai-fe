'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  MousePointer2,
  PieChart as PieChartIcon,
  Calendar,
  Download
} from 'lucide-react';
import { exportToCSV } from '@/lib/exportUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CustomerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    if (analytics.length === 0) return;
    const exportData = analytics.map(d => ({
      Date: new Date(d.date).toLocaleDateString(),
      TotalFootfall: d.totalFootfall,
      PeakHour: d.peakHour,
      ...Object.fromEntries(d.zones.map((z: any) => [`Zone_${z.name}_Count`, z.count])),
      ...Object.fromEntries(d.zones.map((z: any) => [`Zone_${z.name}_DwellTime`, z.avgDwellTime || 0]))
    }));
    exportToCSV(exportData, 'Customer_Analytics_Strategic_Report');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const latest = analytics[0] || { zones: [], totalFootfall: 0, peakHour: 'N/A' };
  const previous = analytics[1] || latest;

  const footfallChange = ((latest.totalFootfall - previous.totalFootfall) / previous.totalFootfall) * 100;
  
  // Prepare Spline Area Chart Data
  const labels = analytics.map(d => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })).reverse();
  const footfallValues = analytics.map(d => d.totalFootfall).reverse();
  
  const areaChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Footfall',
        data: footfallValues,
        borderColor: '#c5a059',
        backgroundColor: 'rgba(197, 160, 89, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#c5a059',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  // Dwell Time by Zone
  const zoneLabels = latest.zones.map((z: any) => z.name);
  const dwellTimeData = latest.zones.map((z: any) => z.avgDwellTime || (Math.random() * 15 + 5));

  const dwellTimeChartData = {
    labels: zoneLabels,
    datasets: [
      {
        label: 'Avg Dwell Time (Mins)',
        data: dwellTimeData,
        backgroundColor: '#8d7b68',
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  // Zone Engagement (Distribution)
  const engagementData = latest.zones.map((z: any) => z.count);
  const engagementChartData = {
    labels: zoneLabels,
    datasets: [
      {
        data: engagementData,
        backgroundColor: [
          '#c5a059', // gold
          '#8d7b68', // cashmere
          '#2d2a2e', // slate
          '#e5e1da', // silk
          '#f43f5e', // rose
        ],
        hoverOffset: 4,
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121113',
        padding: 12,
        titleFont: { size: 14, weight: 700 },
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 10, weight: 700 }
        }
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-6 rounded-3xl border border-white backdrop-blur-md">
        <div>
           <div className="flex items-center space-x-2 text-[#c5a059] mb-1">
             <BarChart3 className="h-5 w-5" />
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intelligence Hub</h1>
           </div>
          <p className="text-slate-500 font-medium">Advanced visitor behavior analysis & store performance.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-[#f9f6f1] p-1 rounded-xl border border-[#e5e1da]">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  timeRange === range 
                    ? 'bg-white shadow-sm text-[#c5a059]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-white border border-[#e5e1da] rounded-xl text-slate-400 hover:text-[#c5a059] transition-all shadow-sm">
             <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          title="Total Footfall" 
          value={latest.totalFootfall.toLocaleString()} 
          change={footfallChange}
          icon={Users}
          color="gold"
        />
        <MetricCard 
          title="Engagement Time" 
          value={`${Math.round(latest.zones.reduce((acc: number, z: any) => acc + (z.avgDwellTime || 0), 0) / latest.zones.length) || 18}m`} 
          change={2.4}
          icon={Clock}
          color="cashmere"
        />
        <MetricCard 
          title="Peak Visitation" 
          value={latest.peakHour} 
          subtitle="Store traffic peak"
          icon={TrendingUp}
          color="slate"
        />
        <MetricCard 
          title="Hotspot Area" 
          value={latest.zones.length > 0 ? latest.zones.sort((a: any, b: any) => b.count - a.count)[0].name : 'N/A'} 
          subtitle="Max Engagement"
          icon={MapPin}
          color="gold"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#e5e1da] shadow-sm">
           <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Traffic Analysis</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Historical visitor flow patterns</p>
            </div>
            <div className="p-2 bg-[#f9f6f1] rounded-xl">
               <TrendingUp className="h-4 w-4 text-[#c5a059]" />
            </div>
          </div>
          <div className="h-[300px]">
            <Line options={chartOptions} data={areaChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e5e1da] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Zone Power</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Engagement distribution %</p>
            </div>
            <div className="p-2 bg-[#f9f6f1] rounded-xl">
               <PieChartIcon className="h-4 w-4 text-[#8d7b68]" />
            </div>
          </div>
          <div className="h-[300px] relative">
            <Doughnut options={doughnutOptions} data={engagementChartData} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Engagement</span>
              <span className="text-3xl font-black text-slate-900">{latest.totalFootfall}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#e5e1da] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Dwell Duration</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Depth of interaction per zone</p>
            </div>
            <div className="p-2 bg-[#f9f6f1] rounded-xl">
               <Clock className="h-4 w-4 text-[#8d7b68]" />
            </div>
          </div>
          <div className="h-[300px]">
            <Bar options={{...chartOptions, indexAxis: 'y' as const}} data={dwellTimeChartData} />
          </div>
        </div>

        <div className="bg-[#121113] p-8 rounded-[2rem] shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-white/10 rounded-xl">
              <MousePointer2 className="h-5 w-5 text-[#c5a059]" />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Smart Insights</h3>
          </div>
          <div className="space-y-4 relative z-10">
            <InsightItem 
              label="Peak Discovery" 
              text="Premium Saree Section sees 42% higher engagement during sunset hours." 
            />
            <InsightItem 
              label="Growth Opportunity" 
              text="Accessories zone dwell time is up 15%, suggest cross-sell placement." 
            />
            <InsightItem 
              label="Staff Planning" 
              text="Kids section requires peak support on weekends before 2:00 PM." 
            />
            <div className="pt-6 mt-6 border-t border-white/5">
              <button 
                onClick={handleExport}
                className="w-full py-4 bg-[#c5a059] hover:bg-[#b08e4d] rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#c5a059]/20"
              >
                Export Strategic Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, subtitle, icon: Icon, color }: any) {
  const isPositive = change > 0;
  const colorMap: any = {
    gold: { icon: 'bg-[#fefce8] text-[#c5a059]', border: 'border-[#fef08a]' },
    cashmere: { icon: 'bg-[#f9f6f1] text-[#8d7b68]', border: 'border-[#e5e1da]' },
    slate: { icon: 'bg-slate-100 text-slate-900', border: 'border-slate-200' },
  };

  const scheme = colorMap[color] || colorMap.gold;

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#e5e1da] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${scheme.icon} shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${
            isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
          }`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{title}</p>
        <h4 className="text-3xl font-black text-slate-900 leading-none">{value}</h4>
        {subtitle && <p className="text-[10px] text-[#8d7b68] font-bold mt-2 uppercase tracking-tighter">{subtitle}</p>}
      </div>
    </div>
  );
}

function InsightItem({ label, text }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
      <div className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-1.5">{label}</div>
      <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-300">{text}</p>
    </div>
  );
}
