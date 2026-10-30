import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, AIMatchResult } from '../../types';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  TrendingUp,
  Cpu,
  Layers,
  Search
} from 'lucide-react';

export const AICenterView: React.FC = () => {
  const { resources, bookings, damageReports, setSelectedResourceForModal, setCurrentTab } = useApp();

  const [activeAITab, setActiveAITab] = useState<'reco' | 'conflict' | 'analytics' | 'summarizer'>('reco');
  
  // 1. AI Recommendation State
  const [promptQuery, setPromptQuery] = useState('I need a high-performance computer for programming, compiling C++ code and running Docker containers.');
  const [isSearchingReco, setIsSearchingReco] = useState(false);
  const [recommendationResults, setRecommendationResults] = useState<AIMatchResult[]>([
    {
      resource: resources.find(r => r.id === 'LAP101') || resources[0],
      matchScore: 98,
      reasoning: 'HP EliteBook 840 G9 features an Intel i7-1260P 12-core CPU, 32GB DDR5 RAM, and pre-installed Docker and Ubuntu/Windows dual boot, exactly meeting your containerization and programming requirements.',
      recommendedSlot: 'Available today 09:00 - 18:00',
      isImmediatelyAvailable: true
    },
    {
      resource: resources.find(r => r.id === 'LAP102') || resources[1],
      matchScore: 92,
      reasoning: 'Apple MacBook Pro M2 Max with 64GB RAM excels at parallel software builds and high-load computation, but is currently in use until tomorrow.',
      recommendedSlot: 'Next opening: Nov 1, 10:00',
      isImmediatelyAvailable: false
    }
  ]);

  // 2. Conflict Detector State
  const [conflictResourceId, setConflictResourceId] = useState<string>('LAP101');
  const [conflictDate, setConflictDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [conflictDetected, setConflictDetected] = useState<{ hasConflict: boolean; message: string; suggestions: string[] } | null>(null);

  // 3. Incident Summarizer State
  const [rawIncidentText, setRawIncidentText] = useState('The laptop screen started flickering during use, and two keyboard keys stopped working after mild keyboard heat in the computer lab.');
  const [aiSummaryResult, setAiSummaryResult] = useState<{
    summary: string;
    severity: string;
    impactedComponents: string[];
    actionRecommended: string;
  } | null>(null);

  // Run Recommendation
  const handleRunRecommendation = () => {
    setIsSearchingReco(true);
    setTimeout(() => {
      const q = promptQuery.toLowerCase();
      const scored: AIMatchResult[] = resources.map(res => {
        let score = 50;
        let reasons: string[] = [];

        if (q.includes('laptop') || q.includes('code') || q.includes('programming') || q.includes('docker') || q.includes('software')) {
          if (res.category === 'Laptops & Computers') {
            score += 40;
            reasons.push('Category matches computing hardware');
          }
        }
        if (q.includes('video') || q.includes('photo') || q.includes('camera') || q.includes('film') || q.includes('cinema')) {
          if (res.category === 'Cameras & AV Equipment') {
            score += 45;
            reasons.push('High-definition imaging hardware');
          }
        }
        if (q.includes('biology') || q.includes('microscope') || q.includes('cell') || q.includes('chemical') || q.includes('lab')) {
          if (res.category === 'Laboratory Equipment') {
            score += 45;
            reasons.push('Certified scientific laboratory instrumentation');
          }
        }
        if (q.includes('3d') || q.includes('print') || q.includes('prototype') || q.includes('cad')) {
          if (res.category === '3D Printers & Fabrication') {
            score += 45;
            reasons.push('High-precision additive manufacturing capability');
          }
        }
        if (q.includes('hall') || q.includes('seminar') || q.includes('meeting') || q.includes('presentation')) {
          if (res.category.includes('Halls') || res.category.includes('Rooms')) {
            score += 40;
            reasons.push('Acoustic space and audiovisual presentation support');
          }
        }

        if (res.availability === 'Available') {
          score += 10;
        }

        score = Math.min(score, 99);

        return {
          resource: res,
          matchScore: score,
          reasoning: reasons.length > 0 
            ? `${res.name} provides ${reasons.join(', ')}. Spec profile: ${Object.values(res.specifications).slice(0, 2).join(' • ')}.`
            : `${res.name} has high reliability (${res.totalBookingsCount} bookings) and is ready for reservation.`,
          recommendedSlot: res.availability === 'Available' ? 'Immediate pickup at ' + res.location : 'Next slot in 24h',
          isImmediatelyAvailable: res.availability === 'Available'
        };
      }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

      setRecommendationResults(scored);
      setIsSearchingReco(false);
    }, 600);
  };

  // Run Conflict Detector
  const handleDetectConflict = () => {
    const overlapping = bookings.filter(b => 
      b.resourceId === conflictResourceId && 
      (b.status === 'Approved' || b.status === 'Issued') &&
      b.startDate <= conflictDate && b.endDate >= conflictDate
    );

    const targetRes = resources.find(r => r.id === conflictResourceId);
    const altResources = resources.filter(r => r.category === targetRes?.category && r.id !== conflictResourceId && r.availability === 'Available');

    if (overlapping.length > 0) {
      setConflictDetected({
        hasConflict: true,
        message: `Conflict detected on ${conflictDate}: ${overlapping[0].userName} currently holds an active booking (${overlapping[0].id}) for ${targetRes?.name}.`,
        suggestions: [
          `Alternative Resource: Book ${altResources[0]?.name || 'equivalent gear in category'} (Available immediately)`,
          `Alternative Time: Select slot after ${overlapping[0].endDate} 18:00`,
          `Join Fair-Share Waiting List to get auto-allocated if released early`
        ]
      });
    } else {
      setConflictDetected({
        hasConflict: false,
        message: `Clear schedule! No overlapping bookings detected for ${targetRes?.name} on ${conflictDate}.`,
        suggestions: [
          `Recommended reservation slot: 09:00 - 17:00 (Full-day)`,
          `Estimated approval turnaround: < 2 hours`
        ]
      });
    }
  };

  // Run Incident Summarizer
  const handleSummarizeIncident = () => {
    const text = rawIncidentText.toLowerCase();
    let severity = 'Moderate';
    const components: string[] = [];

    if (text.includes('screen') || text.includes('display') || text.includes('flicker')) {
      components.push('LCD Panel & Ribbon Cable');
    }
    if (text.includes('keyboard') || text.includes('key')) {
      components.push('Mechanical Key Switch Array');
    }
    if (text.includes('heat') || text.includes('fan') || text.includes('thermal')) {
      components.push('Thermal Dissipation / Cooling Fan');
    }
    if (text.includes('broken') || text.includes('scratch') || text.includes('dent')) {
      components.push('Chassis Shell');
    }

    if (components.length > 2 || text.includes('smoke') || text.includes('water')) {
      severity = 'Severe';
    } else if (components.length <= 1) {
      severity = 'Minor';
    }

    setAiSummaryResult({
      summary: `AI Diagnostic Summary: Potential display flickering and intermittent key switch failure reported. Machine operability degraded; owner physical bench test recommended.`,
      severity,
      impactedComponents: components.length > 0 ? components : ['Peripheral Input / Hardware Assembly'],
      actionRecommended: 'Route to Lab Director Dr. Robert Vance for multimeter & thermal sensor inspection prior to next issue.'
    });
  };

  // Compute analytics
  const mostBookedCategory = 'Laptops & Computers';
  const underutilizedResources = resources.filter(r => r.totalBookingsCount < 15);
  const topBookedResources = [...resources].sort((a, b) => b.totalBookingsCount - a.totalBookingsCount).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-linear-to-b from-purple-950 via-slate-900 to-slate-900 text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Module 9 • Gemini & Heuristic Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            CampusShare Intelligence & Optimization Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Autonomous resource matching, proactive conflict resolution, predictive utilization insights, and diagnostic damage summarization.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/80 flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveAITab('reco')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeAITab === 'reco'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>1. Smart Resource Recommendation</span>
          </button>

          <button
            onClick={() => setActiveAITab('conflict')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeAITab === 'conflict'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>2. Schedule Conflict Detector</span>
          </button>

          <button
            onClick={() => setActiveAITab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeAITab === 'analytics'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>3. Utilization Analytics</span>
          </button>

          <button
            onClick={() => setActiveAITab('summarizer')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
              activeAITab === 'summarizer'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Incident Diagnostic Summarizer</span>
          </button>
        </div>

        {/* ===================== TAB 1: RECOMMENDATIONS ===================== */}
        {activeAITab === 'reco' && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900">
                Natural Language Resource Discovery
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Describe your project, coursework requirements, or hardware needs in plain language.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promptQuery}
                  onChange={e => setPromptQuery(e.target.value)}
                  placeholder="e.g. Need a 4K camera for outdoor documentary shoot with high battery life..."
                  className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleRunRecommendation}
                  disabled={isSearchingReco}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/20 transition flex items-center justify-center space-x-2 shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSearchingReco ? 'Analyzing Campus Catalog...' : 'Match Best Resources'}</span>
                </button>
              </div>

              {/* Sample Prompts */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Quick Prompts:</span>
                <button
                  onClick={() => setPromptQuery('I need a high-power laptop for machine learning model training and programming.')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
                >
                  💻 Programming Laptop
                </button>
                <button
                  onClick={() => setPromptQuery('Need a 4K mirrorless camera and gimbal for student documentary production.')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
                >
                  🎥 Cinema AV Kit
                </button>
                <button
                  onClick={() => setPromptQuery('Fast 3D printer for mechanical robotics enclosure prototyping.')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
                >
                  🖨️ Rapid 3D Printer
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-purple-600" />
                <span>AI Recommended Options ({recommendationResults.length} matches found)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recommendationResults.map((result, idx) => (
                  <div
                    key={result.resource.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                          {result.resource.id}
                        </span>
                        <div className="flex items-center space-x-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          <Sparkles className="w-3 h-3" />
                          <span>{result.matchScore}% Match</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <img 
                          src={result.resource.imageUrl} 
                          alt={result.resource.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                        />
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{result.resource.name}</h5>
                          <p className="text-xs text-slate-500">{result.resource.category}</p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                            result.isImmediatelyAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {result.resource.availability}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                        <strong className="text-purple-900 block mb-1">AI Recommendation Reasoning:</strong>
                        {result.reasoning}
                      </div>

                      <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{result.recommendedSlot}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedResourceForModal(result.resource)}
                      className="mt-5 w-full py-2 bg-slate-900 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                    >
                      <span>View Specs & Reserve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: CONFLICT DETECTOR ===================== */}
        {activeAITab === 'conflict' && (
          <div className="mt-6 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Proactive Scheduling Conflict Detection</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Simulate reservation slots to test real-time double-booking prevention, overlap mitigation, and automated alternative slot suggestions.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Equipment to Test
                </label>
                <select
                  value={conflictResourceId}
                  onChange={e => setConflictResourceId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                >
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.id} - {r.name} ({r.availability})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={conflictDate}
                  onChange={e => setConflictDate(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleDetectConflict}
              className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition"
            >
              Run Conflict & Overlap Analysis
            </button>

            {conflictDetected && (
              <div className={`mt-6 p-5 rounded-2xl border ${
                conflictDetected.hasConflict 
                  ? 'bg-amber-50 border-amber-300 text-amber-900' 
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <div className="flex items-center space-x-2 font-bold text-sm">
                  {conflictDetected.hasConflict ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <span>{conflictDetected.hasConflict ? 'Overlapping Reservation Detected' : 'Slot Available & Ready'}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed">
                  {conflictDetected.message}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider block mb-1.5 opacity-80">
                    AI Suggested Resolution Actions:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {conflictDetected.suggestions.map((s, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: USAGE ANALYTICS ===================== */}
        {activeAITab === 'analytics' && (
          <div className="mt-6 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Platform Utilization Rate</span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">78.4%</span>
                  <span className="text-xs font-semibold text-emerald-600">+14% vs last month</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Highest Demand Category</span>
                <div className="mt-1">
                  <span className="text-lg font-extrabold text-blue-700">{mostBookedCategory}</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">67% of all active campus loans</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Average Return Turnaround</span>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">18.2 Hours</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-2">99.1% on-time return rate</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">Underutilized Assets Alert</span>
                <div className="mt-1">
                  <span className="text-2xl font-extrabold text-amber-600">{underutilizedResources.length} Items</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-2">Recommended for departmental re-sharing</span>
              </div>
            </div>

            {/* Top Utilized Assets Table & Underutilized Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Most Utilized Campus Equipment</span>
                </h4>
                <div className="space-y-3">
                  {topBookedResources.map((res, i) => (
                    <div key={res.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                          #{i+1}
                        </span>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{res.name}</p>
                          <p className="text-[11px] text-slate-500">{res.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">{res.totalBookingsCount} Loans</span>
                        <span className="text-[10px] text-slate-400 block">{res.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-2 mb-4">
                  <Cpu className="w-4 h-4 text-purple-600" />
                  <span>AI Underutilization Optimization Insights</span>
                </h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                    <strong className="text-purple-900 block font-bold">1. Cross-Faculty Promotion Opportunity</strong>
                    <p className="mt-1 text-slate-700">
                      Creality Ender-3 3D Printer (PRT502) and Rigol Oscilloscope (LAB402) have &lt;10 reservations this month. Cross-listing to the Architecture & Robotics Society can lift utilization by 34%.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                    <strong className="text-blue-900 block font-bold">2. Peak Utilization Window</strong>
                    <p className="mt-1 text-slate-700">
                      Peak reservation requests occur Tuesdays and Thursdays between 10:00 AM - 3:00 PM. Deploying automated locker pickup can remove cage congestion.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===================== TAB 4: INCIDENT SUMMARIZER ===================== */}
        {activeAITab === 'summarizer' && (
          <div className="mt-6 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Incident & Damage Report AI Summarizer</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Transforms verbose, unstructured student equipment incident reports into clear, structured damage triage classifications with component breakdown.
            </p>

            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Input Verbose Student Report
              </label>
              <textarea
                rows={3}
                value={rawIncidentText}
                onChange={e => setRawIncidentText(e.target.value)}
                className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSummarizeIncident}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Structured Diagnostic Summary</span>
            </button>

            {aiSummaryResult && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Diagnostic Classification
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    aiSummaryResult.severity === 'Severe' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Severity: {aiSummaryResult.severity}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                  {aiSummaryResult.summary}
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Impacted Subcomponents:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiSummaryResult.impactedComponents.map((c, i) => (
                      <span key={i} className="text-xs bg-slate-200 text-slate-800 font-semibold px-2.5 py-1 rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900">Action Recommended:</strong> {aiSummaryResult.actionRecommended}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
