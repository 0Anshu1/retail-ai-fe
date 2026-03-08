'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Download,
  Calendar,
  LayoutDashboard
} from 'lucide-react';
import { exportToCSV } from '@/lib/exportUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardData {
  stats: {
    totalEmployees: number;
    presentToday: number;
    totalFootfall: number;
    activeAlerts: number;
  };
  alerts: any[];
  chartData?: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeed = async () => {
    await fetch('/api/seed', { method: 'POST' });
    fetchData();
  };

  const handleDownloadReport = () => {
    if (!data) return;
    const reportData = [
      { Category: 'Total Employees', Value: data.stats.totalEmployees },
      { Category: 'Present Today', Value: data.stats.presentToday },
      { Category: 'Total Footfall', Value: data.stats.totalFootfall },
      { Category: 'Active Alerts', Value: data.stats.activeAlerts },
      ...data.alerts.map(a => ({
        Category: `Alert: ${a.type}`,
        Value: a.message,
        Time: new Date(a.timestamp).toLocaleString()
      }))
    ];
    exportToCSV(reportData, 'Showroom_Overview_Report');
  };

  // Prepare chart data
  const chartLabels = data?.chartData?.map((d: any) => new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })) || [];
  const chartValues = data?.chartData?.map((d: any) => d.totalFootfall) || [];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Customer Footfall',
        data: chartValues,
        fill: true,
        borderColor: '#c5a059',
        backgroundColor: 'rgba(197, 160, 89, 0.08)',
        tension: 0.4,
        pointBackgroundColor: '#c5a059',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#121113',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: '#f1f5f9' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 p-6 rounded-3xl border border-white backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2 mb-1">
             <LayoutDashboard className="h-5 w-5 text-[#c5a059]" />
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Showroom Overview</h1>
          </div>
          <p className="text-slate-500 font-medium">Welcome back, Rajesh. Insights for Mumbai Showroom.</p>
        </div>
        <div className="flex items-center space-x-3">
           <button 
            onClick={handleSeed}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-[#e5e1da] text-[#8d7b68] rounded-xl hover:bg-[#f9f6f1] transition-all text-sm font-bold shadow-sm"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Sync Records</span>
          </button>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 px-5 py-2.5 bg-[#121113] text-white rounded-xl hover:bg-black transition-all text-sm font-bold shadow-lg shadow-black/10"
          >
            <Download className="h-4 w-4 text-[#c5a059]" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Staff" 
          value={data?.stats.totalEmployees || 0} 
          icon={Users} 
          trend="+4.2%" 
          trendUp={true}
          color="cashmere"
          description="Active personnel"
        />
        <StatCard 
          title="Today's Attendance" 
          value={data?.stats.presentToday || 0} 
          subValue={`/ ${data?.stats.totalEmployees}`}
          icon={Clock} 
          trend="94%" 
          trendUp={true}
          color="gold"
          description="Store occupancy"
        />
        <StatCard 
          title="Daily Footfall" 
          value={data?.stats.totalFootfall || 0} 
          icon={ShoppingBag} 
          trend="+15%" 
          trendUp={true}
          color="slate"
          description="Visitors today"
        />
        <StatCard 
          title="Active Alerts" 
          value={data?.stats.activeAlerts || 0} 
          icon={AlertTriangle} 
          trend="Critical" 
          trendUp={false}
          color="rose"
          description="Safety protocols"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-[#e5e1da]">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900">Weekly Traffic</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Customer Engagement Trends</p>
            </div>
            <div className="flex items-center bg-[#f9f6f1] p-1 rounded-xl border border-[#e5e1da]">
               <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white rounded-lg shadow-sm text-[#c5a059]">Week</button>
               <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#8d7b68] hover:text-slate-900 transition-colors">Month</button>
            </div>
          </div>
          <div className="h-80 w-full px-2">
            {data?.chartData && data.chartData.length > 0 ? (
               <Line options={chartOptions} data={chartData} />
            ) : (
                <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                    No traffic data records found for this period
                </div>
            )}
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#e5e1da]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900">Security Feed</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Critical System Notifications</p>
            </div>
            <button className="p-2 text-slate-300 hover:text-[#c5a059] transition-colors"><Calendar className="h-4 w-4"/></button>
          </div>
          <div className="space-y-4">
            {data?.alerts.map((alert: any, i: number) => (
              <div key={i} className="group flex items-start space-x-4 p-4 bg-[#f9f6f1] hover:bg-white border border-[#e5e1da] rounded-2xl transition-all hover:shadow-lg hover:shadow-[#c5a059]/5 hover:-translate-y-0.5">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full flex-shrink-0 shadow-sm ${
                  alert.severity === 'high' ? 'bg-rose-500 animate-pulse' : 
                  alert.severity === 'medium' ? 'bg-[#c5a059]' : 'bg-slate-400'
                }`} />
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-snug group-hover:text-black">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{alert.type}</span>
                     <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">{new Date(alert.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!data?.alerts || data.alerts.length === 0) && (
              <div className="py-12 flex flex-col items-center justify-center text-slate-300">
                <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest">No active alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon: Icon, trend, trendUp, color, description }: any) {
  const colorMap: any = {
    cashmere: { icon: 'bg-[#f9f6f1] text-[#8d7b68]', border: 'border-[#e5e1da]' },
    gold: { icon: 'bg-[#fefce8] text-[#c5a059]', border: 'border-[#fef08a]' },
    slate: { icon: 'bg-slate-100 text-slate-900', border: 'border-slate-200' },
    rose: { icon: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
  };

  const scheme = colorMap[color] || colorMap.slate;

  return (
    <div className={`bg-white p-6 rounded-3xl border ${scheme.border} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-2xl ${scheme.icon} shadow-sm flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {trend}
          {trendUp ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
        </div>
      </div>
      <div>
        <h4 className="text-[#8d7b68] text-xs font-bold uppercase tracking-widest">{title}</h4>
        <div className="flex items-baseline space-x-2 mt-2">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          {subValue && <span className="text-sm font-bold text-slate-400">{subValue}</span>}
        </div>
        {description && <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{description}</p>}
      </div>
    </div>
  );
}
