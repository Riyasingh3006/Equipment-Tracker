import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  CalendarClock, 
  QrCode, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    resources, 
    notifications, 
    setCurrentTab, 
    setSelectedResourceForModal 
  } = useApp();

  const myBookings = bookings.filter(b => b.userId === currentUser.id);
  const activeBookings = myBookings.filter(b => b.status === 'Issued');
  const pendingBookings = myBookings.filter(b => b.status === 'Pending' || b.status === 'Waiting List');
  const approvedBookings = myBookings.filter(b => b.status === 'Approved');
  const returnedBookings = myBookings.filter(b => b.status === 'Returned');

  // AI recommendations snippet
  const recommendedResources = resources.filter(r => r.availability === 'Available').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Student Welcome Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30 shadow-sm" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome, {currentUser.name}
                </h1>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.department} • Student ID: <strong className="text-slate-700">{currentUser.studentOrStaffId}</strong>
              </p>
            </div>
          </div>

          {/* Trust Score & Verification Card */}
          <div className="flex items-center space-x-3 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/80 px-4 py-3 rounded-2xl">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-slate-600 font-medium">Verified Trust Score:</span>
                <span className="font-extrabold text-blue-700 text-sm">{currentUser.trustScore}/100</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block">
                ✓ Priority Fair-Share Allocation Tier
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Total Reservations</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{myBookings.length}</div>
            <span className="text-[11px] text-blue-600 mt-1 block">Lifetime campus loans</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Currently In Use</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{activeBookings.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active equipment in hand</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Approved (Ready for Pickup)</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedBookings.length}</div>
            <span className="text-[11px] text-emerald-700 mt-1 block">Unlocked for QR check-in</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Pending Approvals</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingBookings.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting owner review</span>
          </div>
        </div>

        {/* Quick Action Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="p-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-700 transition flex items-center space-x-3 shadow-sm"
          >
            <Search className="w-5 h-5 text-blue-300" />
            <div className="text-left">
              <span className="font-bold text-xs sm:text-sm block">Explore Gear</span>
              <span className="text-[10px] text-slate-300">Browse all 15 resources</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('qr-tracking')}
            className="p-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center space-x-3 shadow-sm"
          >
            <QrCode className="w-5 h-5 text-indigo-200" />
            <div className="text-left">
              <span className="font-bold text-xs sm:text-sm block">Scan QR Code</span>
              <span className="text-[10px] text-indigo-200">Pickup or return scan</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('bookings')}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/50 transition flex items-center space-x-3 shadow-2xs"
          >
            <CalendarClock className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <span className="font-bold text-xs sm:text-sm block">My Bookings</span>
              <span className="text-[10px] text-slate-400">Track approvals</span>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('incidents')}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-red-300 hover:bg-red-50/50 transition flex items-center space-x-3 shadow-2xs"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div className="text-left">
              <span className="font-bold text-xs sm:text-sm block">Report Incident</span>
              <span className="text-[10px] text-slate-400">Condition & damage</span>
            </div>
          </button>
        </div>

        {/* Actionable Banner: If any booking approved, guide student to QR pickup */}
        {approvedBookings.length > 0 && (
          <div className="bg-linear-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  Ready for Pickup: {approvedBookings[0].resourceName}
                </h4>
                <p className="text-xs text-emerald-100">
                  Approved by {approvedBookings[0].ownerName}. Proceed to equipment cage with your device to scan QR code.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 shrink-0"
            >
              <span>Scan Pickup QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Current Active Reservations & AI Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active / Recent Bookings (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span>My Active & Upcoming Reservations</span>
              </h3>
              <button
                onClick={() => setCurrentTab('bookings')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myBookings.length > 0 ? (
              <div className="space-y-3">
                {myBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={b.resourceImageUrl} alt={b.resourceName} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs text-slate-900">{b.resourceName}</h4>
                          <span className="text-[10px] font-mono text-slate-400">({b.resourceId})</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-600">
                          <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                            ID: {b.studentId || currentUser.studentOrStaffId}
                          </span>
                          <span className="font-mono text-slate-600">
                            📞 {b.userPhone || currentUser.phone || '+1 (555) 234-5678'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {b.issuedAtFormatted ? `Issued: ${b.issuedAtFormatted}` : `Reserved: ${b.startDate} (${b.startTime} - ${b.endTime})`}
                        </p>
                        {b.expectedDueFormatted && (
                          <p className="text-[10px] text-amber-700 font-semibold">
                            Due: {b.expectedDueFormatted}
                          </p>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-block mt-1 ${
                          b.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                          b.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>

                    {b.status === 'Approved' && (
                      <button
                        onClick={() => setCurrentTab('qr-tracking')}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                      >
                        Check In
                      </button>
                    )}

                    {b.status === 'Issued' && (
                      <button
                        onClick={() => setCurrentTab('qr-tracking')}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        Return
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                You have no active bookings right now. Explore the marketplace to reserve gear!
              </div>
            )}
          </div>

          {/* AI Recommendations for Student (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Recommended for Your Department</span>
              </h3>
              <button
                onClick={() => setCurrentTab('ai-center')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center"
              >
                <span>AI Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recommendedResources.map(res => (
                <div 
                  key={res.id}
                  onClick={() => setSelectedResourceForModal(res)}
                  className="cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img src={res.imageUrl} alt={res.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{res.name}</h4>
                      <p className="text-[11px] text-slate-500">{res.category}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    95% Match
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
