import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  QrCode, 
  CalendarClock, 
  Layers, 
  UserCircle2 
} from 'lucide-react';
import { RoleSwitcherModal } from './RoleSwitcherModal';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser } = useApp();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const getRoleDashboardTab = () => {
    switch (currentUser.role) {
      case 'student': return 'student-dashboard';
      case 'owner': return 'owner-dashboard';
      case 'admin': return 'admin-dashboard';
      case 'manager': return 'manager-dashboard';
      default: return 'student-dashboard';
    }
  };

  return (
    <>
      <nav 
        aria-label="Mobile Navigation" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5"
      >
        <div className="flex items-center justify-around">
          
          {/* Marketplace */}
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              currentTab === 'marketplace'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          {/* QR Hub */}
          <button
            onClick={() => setCurrentTab('qr-tracking')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              currentTab === 'qr-tracking'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className="relative">
              <QrCode className="w-5 h-5 text-indigo-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-[10px] mt-0.5">QR Scan</span>
          </button>

          {/* Bookings */}
          <button
            onClick={() => setCurrentTab('bookings')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              currentTab === 'bookings'
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CalendarClock className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Bookings</span>
          </button>

          {/* Role Dashboard */}
          <button
            onClick={() => setCurrentTab(getRoleDashboardTab())}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              currentTab.includes('dashboard')
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>

          {/* Switch Role */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex flex-col items-center py-1 px-2 rounded-xl text-slate-500 hover:text-blue-600 transition"
          >
            <UserCircle2 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{currentUser.role.toUpperCase()}</span>
          </button>

        </div>
      </nav>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
