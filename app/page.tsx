'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Camera, 
  Smartphone, 
  Clock,
  Zap,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ZeexAI</span>
        </div>
        <div className="space-x-4">
          <Link 
            href="/login" 
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 shadow-md shadow-indigo-200 font-medium"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-32 overflow-hidden bg-slate-50">
           {/* Decorative Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
             <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-20 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-200">
                  Smart Retail Monitoring Platform
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
                  Powering Retail with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Intelligent AI</span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                  ZeexAI provides advanced surveillance and analytics solutions for modern franchises. Currently empowering <span className="font-semibold text-slate-900">Jeeja Fashion</span> with real-time store monitoring.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1"
                  >
                    <span>Launch Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link 
                    href="/signup" 
                    className="flex items-center justify-center space-x-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <span>Request Demo</span>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-3xl blur-2xl opacity-20 transform rotate-3"></div>
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" 
                  alt="Smart Showroom Dashboard" 
                  className="relative rounded-3xl shadow-2xl border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform duration-500 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid (Design 1) */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3 block">What We Offer</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">Enterprise-grade tools designed specifically for franchise management.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <DesignCard 
                icon={Camera}
                title="AI Surveillance"
                description="Integrated camera feeds with advanced threat detection and anomaly recognition algorithms."
              />
              <DesignCard 
                icon={Users}
                title="Staff Tracking"
                description="Monitor attendance, productivity, and customer interactions in real-time."
              />
              <DesignCard 
                icon={BarChart3}
                title="Smart Analytics"
                description="Deep insights into customer footfall, heatmaps, and conversion trends."
              />
            </div>
          </div>
        </section>

        {/* How It Works (Design 2) */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-indigo-50/30 relative overflow-hidden">
           {/* Connecting Line (Desktop) */}
           <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent -translate-y-12 pointer-events-none opacity-50"></div>
           
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3 block">Simple Integration</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How ZeexAI Works</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">Three simple steps to transform your retail operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <StepCard 
                number="01"
                title="Connect Infrastructure"
                description="We link your existing CCTV setup to the ZeexAI cloud engine securely."
              />
              <StepCard 
                number="02"
                title="Process & Analyze"
                description="Our AI models process video feeds 24/7 to extract actionable data."
              />
              <StepCard 
                number="03"
                title="Monitor & Optimize"
                description="Access real-time insights via the dashboard to improve efficiency."
              />
            </div>
          </div>
        </section>

        {/* Value Proposition (Design 3) */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  <div className="bg-indigo-50 p-8 rounded-3xl hover:bg-indigo-100 transition-colors">
                    <Zap className="h-10 w-10 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Lightning Fast</h3>
                    <p className="text-slate-600 mt-2">Real-time processing with minimal latency.</p>
                  </div>
                  <div className="bg-blue-50 p-8 rounded-3xl hover:bg-blue-100 transition-colors sm:mt-8">
                    <ShieldCheck className="h-10 w-10 text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Enterprise Secure</h3>
                    <p className="text-slate-600 mt-2">Bank-grade encryption for all your data.</p>
                  </div>
                  <div className="bg-teal-50 p-8 rounded-3xl hover:bg-teal-100 transition-colors">
                    <TrendingUp className="h-10 w-10 text-teal-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Scalable Architecture</h3>
                    <p className="text-slate-600 mt-2">Grow from one store to hundreds effortlessly.</p>
                  </div>
                  <div className="bg-purple-50 p-8 rounded-3xl hover:bg-purple-100 transition-colors sm:mt-8">
                    <CheckCircle className="h-10 w-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">99.9% Uptime</h3>
                    <p className="text-slate-600 mt-2">Reliable monitoring you can count on.</p>
                  </div>
               </div>
               <div className="lg:w-1/2">
                 <span className="text-indigo-600 font-semibold tracking-wide uppercase text-sm">Why Choose Us</span>
                 <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2 mb-6">Empowering Franchises like Jeeja Fashion</h2>
                 <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                   ZeexAI is designed to handle the complex needs of modern retail chains. From high-traffic showrooms to boutique stores, our platform adapts to your specific monitoring requirements.
                 </p>
                 <ul className="space-y-5">
                   <li className="flex items-start space-x-4 text-slate-700">
                     <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full"></div>
                     </div>
                     <span className="text-lg">Automated staff attendance & performance tracking</span>
                   </li>
                   <li className="flex items-start space-x-4 text-slate-700">
                     <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full"></div>
                     </div>
                     <span className="text-lg">Heatmap visualization for optimizing store layout</span>
                   </li>
                   <li className="flex items-start space-x-4 text-slate-700">
                     <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full"></div>
                     </div>
                     <span className="text-lg">Instant security alerts for theft prevention</span>
                   </li>
                 </ul>
               </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function DesignCard({ icon: Icon, title, description }: any) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
      <div className="relative w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="relative text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">{title}</h3>
      <p className="relative text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Gradient Border Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-b-3xl"></div>
      
      <div className="flex items-center justify-between mb-8">
         <div className="text-5xl font-black text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-500 transition-all duration-300">{number}</div>
         <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors duration-300">
            <div className="h-3 w-3 rounded-full bg-indigo-600 group-hover:scale-150 transition-transform duration-300"></div>
         </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-700 transition-colors">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
