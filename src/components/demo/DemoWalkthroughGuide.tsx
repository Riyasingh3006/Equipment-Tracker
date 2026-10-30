import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  X, 
  Sparkles, 
  Play, 
  ArrowRight
} from 'lucide-react';

export const DemoWalkthroughGuide: React.FC = () => {
  const { 
    activeDemoTourStep, 
    setActiveDemoTourStep, 
    switchUser, 
    setCurrentTab, 
    resources, 
    setSelectedResourceForModal,
    bookings,
    createBooking,
    approveBooking,
    setIsQrScannerOpen
  } = useApp();

  if (activeDemoTourStep === null) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: Owner Perspective (Dr. Vance)',
      actor: 'Resource Owner: Dr. Robert Vance',
      description: 'Log in as Resource Owner Dr. Robert Vance. View the HP Laptop (LAP101) in the laboratory inventory and examine its verifiable QR Asset Tag.',
      actionLabel: 'Switch to Dr. Vance & Open Inventory',
      execute: () => {
        switchUser('usr_own_1');
        setCurrentTab('owner-dashboard');
      }
    },
    {
      step: 2,
      title: 'Step 2: Inspect HP Laptop (LAP101) & QR Code',
      actor: 'Resource Owner: Dr. Robert Vance',
      description: 'Open the HP Laptop (LAP101) details modal to inspect specs, condition, and view the generated QR code ready for physical cage tagging.',
      actionLabel: 'Open LAP101 Details & QR Tag',
      execute: () => {
        const lap101 = resources.find(r => r.id === 'LAP101');
        if (lap101) setSelectedResourceForModal(lap101);
      }
    },
    {
      step: 3,
      title: 'Step 3: Student Discovery (Alex Chen)',
      actor: 'Student: Alex Chen (CS Dept)',
      description: 'Switch to student Alex Chen. Browse the Marketplace, search for "HP Laptop", check eligibility (Trust Score 98/100, verified), and prepare booking.',
      actionLabel: 'Switch to Alex Chen & Search Marketplace',
      execute: () => {
        switchUser('usr_stu_1');
        setCurrentTab('marketplace');
      }
    },
    {
      step: 4,
      title: 'Step 4: Submit Booking Request for LAP101',
      actor: 'Student: Alex Chen',
      description: 'Submit an automated booking request for the HP Laptop for coursework & programming. Real-time conflict checks and fair-share allocation verify request.',
      actionLabel: 'Submit Demo Booking Request',
      execute: () => {
        const today = new Date().toISOString().split('T')[0];
        const nextDay = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        createBooking('LAP101', today, nextDay, '09:00', '17:00', 'Machine Learning thesis benchmark & coding assignment.');
        setCurrentTab('bookings');
      }
    },
    {
      step: 5,
      title: 'Step 5: Owner Approval Flow',
      actor: 'Resource Owner: Dr. Robert Vance',
      description: 'Switch back to Dr. Robert Vance. Review Alex Chen\'s incoming booking request in the pending queue and grant one-click approval.',
      actionLabel: 'Switch to Dr. Vance & Approve Booking',
      execute: () => {
        switchUser('usr_own_1');
        setCurrentTab('bookings');
        const pending = bookings.find(b => b.resourceId === 'LAP101' && b.status === 'Pending');
        if (pending) {
          approveBooking(pending.id);
        }
      }
    },
    {
      step: 6,
      title: 'Step 6: QR Code Check-in & Equipment Issue',
      actor: 'Equipment Cage Check-In',
      description: 'Alex Chen arrives at the Computer Lab cage. Scan LAP101 QR code, perform initial condition check (photos + inspection), and confirm issuance.',
      actionLabel: 'Open QR Tracking Hub for Check-in',
      execute: () => {
        switchUser('usr_stu_1');
        setCurrentTab('qr-tracking');
        setIsQrScannerOpen(false);
      }
    },
    {
      step: 7,
      title: 'Step 7: Return Flow & Condition Verification',
      actor: 'Student & Lab Staff Return Verification',
      description: 'After usage, initiate the QR Return. Upload final photos, verify condition integrity, and owner confirms successful return back to inventory.',
      actionLabel: 'Proceed to QR Return Section',
      execute: () => {
        setCurrentTab('qr-tracking');
      }
    },
    {
      step: 8,
      title: 'Step 8: AI Analytics & Administrator Audit Trail',
      actor: 'Administrator: Marcus Sterling',
      description: 'Switch to Administrator Marcus Sterling. Review the complete audit logs, tamper-evident timestamps, and AI-driven utilization metrics.',
      actionLabel: 'Switch to Admin & View Full Audit Trail',
      execute: () => {
        switchUser('usr_adm_1');
        setCurrentTab('audit-logs');
      }
    }
  ];

  const currentStepData = steps[activeDemoTourStep - 1] || steps[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 sm:p-5 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-400/30">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Hackathon Guided Tour
          </span>
          <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
            Step {activeDemoTourStep} of {steps.length}
          </span>
        </div>
        <button
          onClick={() => setActiveDemoTourStep(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2.5">
        <div className="flex items-center space-x-2">
          <h4 className="font-bold text-sm sm:text-base text-slate-100">
            {currentStepData.title}
          </h4>
        </div>
        <div className="mt-1 flex items-center space-x-1.5 text-xs text-blue-300 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Role: {currentStepData.actor}</span>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentStepData.description}
        </p>
      </div>

      {/* Action CTA & Navigation */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={currentStepData.execute}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-blue-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{currentStepData.actionLabel}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            disabled={activeDemoTourStep <= 1}
            onClick={() => setActiveDemoTourStep(activeDemoTourStep - 1)}
            className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {activeDemoTourStep < steps.length ? (
            <button
              onClick={() => {
                currentStepData.execute();
                setActiveDemoTourStep(activeDemoTourStep + 1);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-medium transition"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveDemoTourStep(null)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Tour Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
