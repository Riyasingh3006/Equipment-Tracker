import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HelpCircle, 
  X, 
  Search, 
  QrCode, 
  CheckCircle2, 
  Printer, 
  Users, 
  Zap, 
  Phone, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass,
  Sparkles
} from 'lucide-react';
import { PrintReceiptModal } from './PrintReceiptModal';
import { Booking } from '../../types';

export const EasyAssistantWidget: React.FC = () => {
  const { 
    currentUser, 
    setCurrentTab, 
    switchUser, 
    allUsers, 
    bookings, 
    resources, 
    setActiveDemoTourStep,
    showToast 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [sampleReceiptBooking, setSampleReceiptBooking] = useState<Booking | null>(null);

  const activeIssuedBooking = bookings.find(b => b.status === 'Issued') || bookings[0];

  return (
    <>
      {/* Floating Action Button (Always in bottom right) */}
      <aside 
        aria-label="CampusShare Quick Assistant & Help"
        className="fixed bottom-5 right-5 z-40"
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 font-semibold text-xs transition transform hover:scale-105 active:scale-95 border border-blue-400/40"
            title="Open Quick Assistant & Help Guide"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-100"></span>
            </span>
            <HelpCircle className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Quick Help & Shortcuts</span>
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Header */}
            <div className="bg-linear-to-r from-blue-700 to-indigo-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">CampusShare Assistant</h4>
                  <p className="text-[11px] text-blue-200">Easy shortcuts & user instructions</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active Persona Banner */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Active Role:</span>
                <span className="font-bold text-slate-900">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 ml-1">({currentUser.role.toUpperCase()})</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                Active
              </span>
            </div>

            {/* Quick 1-Click Action Paths */}
            <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                What would you like to do?
              </span>

              {/* 1. Borrow Equipment */}
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block group-hover:text-blue-700">Find & Borrow Equipment</strong>
                    <span className="text-[11px] text-slate-500">Browse 9+ campus devices & labs</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition transform group-hover:translate-x-0.5" />
              </button>

              {/* 2. QR Tracking & Inspection */}
              <button
                onClick={() => {
                  setCurrentTab('qr-tracking');
                  setIsOpen(false);
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block group-hover:text-indigo-700">Scan QR Tag / Check-In</strong>
                    <span className="text-[11px] text-slate-500">Camera scan, file upload & signature</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition transform group-hover:translate-x-0.5" />
              </button>

              {/* 3. See who has what equipment */}
              <button
                onClick={() => {
                  setCurrentTab('qr-tracking');
                  setIsOpen(false);
                  showToast('Showing Live Custody Ledger: Track all active Student IDs & Phone numbers.', 'info');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block group-hover:text-emerald-700">Who Has What? (Custody Ledger)</strong>
                    <span className="text-[11px] text-slate-500">View Student ID, Phone, and Due Time</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition transform group-hover:translate-x-0.5" />
              </button>

              {/* 4. Switch to Owner & Approve */}
              <button
                onClick={() => {
                  const owner = allUsers.find(u => u.role === 'owner');
                  if (owner) switchUser(owner.id);
                  setCurrentTab('bookings');
                  setIsOpen(false);
                  showToast('Switched to Dr. Vance (Owner). View and approve pending requests here.', 'info');
                }}
                className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 border border-slate-100 hover:border-purple-200 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block group-hover:text-purple-700">Approve Pending Requests</strong>
                    <span className="text-[11px] text-slate-500">Switch to Dr. Vance & approve</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition transform group-hover:translate-x-0.5" />
              </button>

              {/* 5. Print Handover Slip */}
              {activeIssuedBooking && (
                <button
                  onClick={() => {
                    setSampleReceiptBooking(activeIssuedBooking);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block group-hover:text-amber-700">Print Sample Custody Slip</strong>
                      <span className="text-[11px] text-slate-500">Official university receipt with signatures</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>

            {/* Bottom Quick Help Contact */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>Cage Desk: <strong>+1 (555) 019-2834</strong></span>
              </span>
              <button
                onClick={() => {
                  setActiveDemoTourStep(1);
                  setIsOpen(false);
                }}
                className="text-blue-700 hover:underline font-semibold flex items-center space-x-0.5"
              >
                <span>Guided Tour</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

          </div>
        )}
      </aside>

      {/* Render Sample Receipt Modal if opened from Assistant */}
      {sampleReceiptBooking && (
        <PrintReceiptModal
          booking={sampleReceiptBooking}
          onClose={() => setSampleReceiptBooking(null)}
        />
      )}
    </>
  );
};
