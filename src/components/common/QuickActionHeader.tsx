import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  FlaskConical, 
  ShieldCheck, 
  Building2, 
  Zap, 
  QrCode, 
  RotateCcw, 
  Compass, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

export const QuickActionHeader: React.FC = () => {
  const { 
    currentUser, 
    switchUser, 
    allUsers, 
    setCurrentTab, 
    resetDemoData, 
    setActiveDemoTourStep, 
    resources, 
    bookings, 
    createBooking, 
    approveBooking, 
    checkInAndIssue, 
    showToast 
  } = useApp();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Quick switch helpers
  const handleQuickRole = (role: UserRole) => {
    const user = allUsers.find(u => u.role === role);
    if (user) {
      switchUser(user.id);
      sounds.playScanBeep();
      if (role === 'student') setCurrentTab('marketplace');
      else if (role === 'owner') setCurrentTab('owner-dashboard');
      else if (role === 'admin') setCurrentTab('admin-dashboard');
      else if (role === 'manager') setCurrentTab('manager-dashboard');
    }
  };

  // 1-Click Fast End-to-End Demo Checkout
  const handleInstantDemoCheckout = () => {
    // 1. Switch to student
    const student = allUsers.find(u => u.role === 'student');
    if (student) switchUser(student.id);

    // 2. Find LAP101
    const lap101 = resources.find(r => r.id === 'LAP101');
    if (!lap101) return;

    // 3. Create, approve, and check-in
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const result = createBooking('LAP101', today, tomorrow, '09:00', '18:00', 'Fast Hackathon Demo Checkout');
    
    if (result.bookingId) {
      approveBooking(result.bookingId);
      checkInAndIssue(result.bookingId, 'Excellent', [lap101.imageUrl]);
    }

    sounds.playSuccessChime();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    showToast('⚡ Instant Checkout Completed! LAP101 is now checked out to Alex Chen (ID: STU-2024-819)', 'success');
    setCurrentTab('qr-tracking');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* Left: Role Quick Switchers */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden md:inline">
              Quick Role:
            </span>

            {/* Student */}
            <button
              onClick={() => handleQuickRole('student')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                currentUser.role === 'student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Switch to Student Alex Chen (CS Dept)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
              <span>Student</span>
              {currentUser.role === 'student' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            {/* Owner */}
            <button
              onClick={() => handleQuickRole('owner')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                currentUser.role === 'owner'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Switch to Lab Owner Dr. Robert Vance"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-300" />
              <span>Lab Owner</span>
              {currentUser.role === 'owner' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickRole('admin')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Switch to Platform Admin Marcus Sterling"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Admin</span>
              {currentUser.role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>

            {/* Manager */}
            <button
              onClick={() => handleQuickRole('manager')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition ${
                currentUser.role === 'manager'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title="Switch to Dean / Manager Dr. Reynolds"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Dean / Mgr</span>
              {currentUser.role === 'manager' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            </button>
          </div>

          {/* Right: Fast 1-Click Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* 1-Click Fast Checkout Demo */}
            <button
              onClick={handleInstantDemoCheckout}
              className="px-2.5 py-1 rounded-lg font-bold bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 flex items-center space-x-1 shadow-xs transition"
              title="1-Click Automated Demo: Reserve + Approve + Issue HP Laptop (LAP101)"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Test Checkout (LAP101)</span>
            </button>

            {/* Quick QR Scanner Jump */}
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="px-2 py-1 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1 transition"
              title="Open QR Scanner & Verification Hub"
            >
              <QrCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">QR Hub</span>
            </button>

            {/* Guided Tour */}
            <button
              onClick={() => setActiveDemoTourStep(1)}
              className="px-2 py-1 rounded-lg font-medium bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-700/60 flex items-center space-x-1 transition"
              title="Start 8-step guided demonstration"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Tour</span>
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                resetDemoData();
                sounds.playScanBeep();
              }}
              className="px-2 py-1 rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 transition"
              title="Restore initial fresh sample data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
