import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Lock, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart2, 
  Scale, 
  Layers, 
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const { 
    currentUser, 
    resources, 
    bookings, 
    approveBooking, 
    rejectBooking, 
    damageReports,
    showToast 
  } = useApp();

  // Find bookings on restricted items or specifically flagged for high institutional impact
  const restrictedBookings = bookings.filter(b => {
    const res = resources.find(r => r.id === b.resourceId);
    return (res?.requiresSpecialApproval || b.status === 'Pending') && b.status === 'Pending';
  });

  const restrictedResources = resources.filter(r => r.requiresSpecialApproval);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-linear-to-r from-amber-950 via-slate-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-8 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight">Institutional Dean & Resource Council</h1>
                <span className="text-xs bg-amber-500/30 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Governance Level
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Executive Officer: <strong>{currentUser.name}</strong> • High-tier equipment authorization, allocation quotas & institutional policy
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Restricted Assets</span>
              <strong className="text-sm font-bold text-amber-300">{restrictedResources.length} High-Value Units</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Restricted Equipment Authorizations</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{restrictedBookings.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting Dean review</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Average Asset Utilization</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">82.3%</div>
            <span className="text-[11px] text-emerald-600 mt-1 block">+19% after CampusShare rollout</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Fair-Share Quota Compliance</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">99.4%</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Zero monopolization violations</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Equipment Return Punctuality</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">98.7%</div>
            <span className="text-[11px] text-emerald-700 mt-1 block">QR-verified accountability</span>
          </div>
        </div>

        {/* High-Value Restricted Resource Authorization Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <span>Restricted-Access Authorization Queue</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tier-1 high-value assets requiring Institutional Dean approval (e.g. Electron Microscope, Turing Seminar Hall).
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {restrictedBookings.length} Awaiting Authorization
            </span>
          </div>

          {restrictedBookings.length > 0 ? (
            <div className="space-y-3">
              {restrictedBookings.map(b => (
                <div 
                  key={b.id}
                  className="p-4 rounded-xl border border-amber-300 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <img src={b.resourceImageUrl} alt={b.resourceName} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{b.resourceName}</span>
                        <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {b.resourceId}
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Restricted Tier
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Applicant: <strong>{b.userName}</strong> ({b.userEmail}) • Department Sponsor: {b.ownerName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dates: {b.startDate} to {b.endDate} ({b.startTime} - {b.endTime})
                      </p>
                      <p className="text-xs text-slate-700 italic mt-1 bg-white p-2 rounded-lg border border-slate-200">
                        "{b.purpose}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => approveBooking(b.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Grant Dean Approval</span>
                    </button>
                    <button
                      onClick={() => rejectBooking(b.id, 'Resource prioritized for scheduled accreditation audit.')}
                      className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline Request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="font-semibold text-slate-700">No restricted approvals currently pending</p>
              <p className="text-slate-400 mt-0.5">All restricted faculty requests have been adjudicated.</p>
            </div>
          )}
        </div>

        {/* Institutional Resource Allocation & Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2 mb-3">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>Campus Fair-Share Allocation Policies</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Maximum Active Loans per Student:</span>
                <strong className="text-slate-900 font-bold">2 Items</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Maximum Continuous Laptop Duration:</span>
                <strong className="text-slate-900 font-bold">48 Hours</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Late Return Grace Window:</span>
                <strong className="text-slate-900 font-bold">120 Minutes</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Security Deposit Refund Automation:</span>
                <strong className="text-emerald-700 font-bold">Instant on QR Return</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2 mb-3">
              <BarChart2 className="w-4 h-4 text-blue-600" />
              <span>Inter-Departmental Sharing Efficiency</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Engineering & Computer Science Labs</span>
                  <span className="text-slate-900 font-bold">92% Utilization</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Digital Media & AV Studios</span>
                  <span className="text-slate-900 font-bold">84% Utilization</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 font-semibold mb-1">
                  <span>Biotechnology & Chemistry Lab Equipment</span>
                  <span className="text-slate-900 font-bold">76% Utilization</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
