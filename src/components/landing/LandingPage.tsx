import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  ArrowRight, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  BarChart3, 
  Layers, 
  Users, 
  Play, 
  Clock, 
  AlertCircle, 
  Laptop, 
  Camera, 
  Microscope, 
  Box, 
  Compass, 
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Lock
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentTab, setActiveDemoTourStep, resources, bookings } = useApp();

  const categories = [
    { name: 'Laptops & Computers', count: 'High-Performance', icon: <Laptop className="w-5 h-5 text-blue-500" /> },
    { name: 'Cameras & AV Equipment', count: '4K Cinema Kits', icon: <Camera className="w-5 h-5 text-purple-500" /> },
    { name: 'Laboratory Equipment', count: 'Microscopes & Scopes', icon: <Microscope className="w-5 h-5 text-emerald-500" /> },
    { name: '3D Printers & Fabrication', count: 'CoreXY & Large FDM', icon: <Box className="w-5 h-5 text-amber-500" /> },
    { name: 'Classrooms & Lecture Halls', count: 'Interactive Touch', icon: <Building className="w-5 h-5 text-indigo-500" /> },
    { name: 'Meeting & Study Pods', count: 'Soundproof Pods', icon: <Users className="w-5 h-5 text-teal-500" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
        
        {/* Glow ambient effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>National Hackathon Prototype • Connected 10-Module Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Share Smarter. <br className="hidden sm:inline" />
              Access Better. <span className="bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Waste Less.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              One intelligent platform connecting students, resource owners, and educational institutions to discover, share, book, and track campus equipment with verifiable QR check-ins.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => setCurrentTab('marketplace')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveDemoTourStep(1)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4 text-blue-300" />
                <span>Launch Interactive Demo Tour (LAP101)</span>
              </button>
            </div>

            {/* Live Metrics Ticker */}
            <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">15+</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Cataloged Assets</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">0</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Double Bookings</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">100%</span>
                <span className="text-xs text-slate-400 mt-0.5 block">QR Verification</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 block">4 Roles</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Role-Based Access</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs CampusShare Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Institutional Challenge</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
            Why Traditional Campus Sharing Breaks Down
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Colleges purchase millions in specialized hardware, yet utilization remains fragmented, unfair, and unaccountable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-8 relative">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full inline-block mb-4">
              Traditional Manual Management
            </span>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Severe Resource Underutilization:</strong> Expensive 3D printers and oscilloscopes sit locked behind departmental silos.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Scheduling Conflicts & Double Bookings:</strong> Paper sign-up sheets result in chaotic room collisions.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>No Accountability for Damage:</strong> Missing cables and cracked screens go unreported with no baseline photos.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span><strong>Delayed Returns:</strong> Equipment hoarded by students with zero automated notifications or check-in logs.</span>
              </li>
            </ul>
          </div>

          {/* CampusShare Way */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-3xl p-8 relative">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block mb-4">
              CampusShare Platform Innovation
            </span>
            <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Universal Centralized Marketplace:</strong> Real-time discovery across 9 departments with transparent eligibility.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Anti-Collision AI Conflict Engine:</strong> Guaranteed zero double-bookings with smart fair-share waiting lists.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Verifiable QR Equipment Check-in:</strong> Mandatory before/after photo audits protect both student and lab owner.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Institutional Governance & Auditing:</strong> Dean-level approvals for restricted research equipment.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Lifecycle) */}
      <section className="py-16 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">End-to-End Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              How CampusShare Works
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              From initial discovery to photo-verified return in 4 seamless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900">Discover & Check Eligibility</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Browse catalog of laptops, microscopes, and facilities. AI matches resources and verifies student department credentials.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900">Request & Owner Approval</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Submit time slot with project purpose. Resource owner Dr. Vance reviews and grants 1-click approval with zero schedule overlap.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900">QR Cage Check-In</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Scan asset tag (e.g. LAP101) at the equipment cage. Upload baseline before-use photos and owner issues hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900">Condition Return & Release</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Return item, scan QR, upload final inspection photos. System auto-restores "Available" status and updates trust score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resource Categories Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Catalog Breadth</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Explore 9 Resource Categories
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              From mobile computing to specialized cleanroom electron microscopes.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="mt-4 md:mt-0 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View All 15 Items in Marketplace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <div 
              key={i}
              onClick={() => {
                setCurrentTab('marketplace');
              }}
              className="cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition flex items-center space-x-3.5"
            >
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                {c.icon}
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">{c.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{c.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Hackathon Tour Callout Card */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 inline-block mb-3">
              Judges Evaluation Journey
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Experience the Full HP Laptop (LAP101) Workflow
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Step through all roles in seconds: Dr. Vance catalogs LAP101 → Alex Chen discovers and reserves → Dr. Vance approves → QR code scan check-in with photos → Return & condition audit.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveDemoTourStep(1)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Guided Demo Tour Now</span>
              </button>
              <button
                onClick={() => setCurrentTab('marketplace')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition"
              >
                Explore Freely
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">CampusShare</span>
              <p className="text-[11px] text-slate-400">Smart Campus Resource Sharing & Equipment Tracking</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-slate-600">
            <button onClick={() => setCurrentTab('marketplace')} className="hover:text-blue-600">Marketplace</button>
            <button onClick={() => setCurrentTab('qr-tracking')} className="hover:text-blue-600">QR Scanner</button>
            <button onClick={() => setCurrentTab('ai-center')} className="hover:text-blue-600">AI Engine</button>
            <button onClick={() => setCurrentTab('audit-logs')} className="hover:text-blue-600">Audit Logs</button>
          </div>

          <p className="text-slate-400 text-[11px]">
            © 2026 CampusShare Platform • National Hackathon Prototype v2.4
          </p>
        </div>
      </footer>

    </div>
  );
};
