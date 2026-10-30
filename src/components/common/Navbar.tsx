import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { 
  Building, 
  Search, 
  QrCode, 
  CalendarClock, 
  Sparkles, 
  ShieldAlert, 
  Bell, 
  ChevronDown, 
  RotateCcw, 
  Layers, 
  Compass, 
  CheckCheck,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    currentTab, 
    setCurrentTab, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    resetDemoData,
    setActiveDemoTourStep
  } = useApp();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleDashboardTab = () => {
    switch (currentUser.role) {
      case 'student': return 'student-dashboard';
      case 'owner': return 'owner-dashboard';
      case 'admin': return 'admin-dashboard';
      case 'manager': return 'manager-dashboard';
      default: return 'student-dashboard';
    }
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'student':
        return { label: 'Student', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'owner':
        return { label: 'Resource Owner', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'admin':
        return { label: 'Administrator', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'manager':
        return { label: 'Dean / Manager', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'User', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center space-x-6">
              <div 
                onClick={() => setCurrentTab('landing')}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 via-indigo-700 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition transform">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                      CampusShare
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                      Smart Hub
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Resource Sharing & Tracking</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
                <button
                  onClick={() => setCurrentTab('marketplace')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab === 'marketplace'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>Marketplace</span>
                </button>

                <button
                  onClick={() => setCurrentTab(getRoleDashboardTab())}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab.includes('dashboard')
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentTab('qr-tracking')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab === 'qr-tracking'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>QR Tracking</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded-full">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => setCurrentTab('bookings')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab === 'bookings'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Bookings</span>
                </button>

                <button
                  onClick={() => setCurrentTab('ai-center')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab === 'ai-center'
                      ? 'text-purple-700 bg-purple-50 font-semibold'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI Engine</span>
                </button>

                <button
                  onClick={() => setCurrentTab('audit-logs')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
                    currentTab === 'audit-logs'
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Audit Logs</span>
                </button>
              </nav>
            </div>

            {/* Right: Actions, Notifications, Role Switcher, Profile */}
            <div className="flex items-center space-x-3">

              {/* Hackathon Tour Walkthrough CTA */}
              <button
                onClick={() => setActiveDemoTourStep(1)}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold hover:from-indigo-700 hover:to-blue-700 transition shadow-xs"
                title="Launch guided LAP101 HP Laptop end-to-end journey"
              >
                <Compass className="w-3.5 h-3.5 text-blue-200" />
                <span>Demo Tour (LAP101)</span>
              </button>

              {/* Role Switcher Pill */}
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border transition shadow-2xs hover:shadow-xs ${roleBadge.bg}`}
              >
                <span className="text-xs font-bold">{roleBadge.label}</span>
                <span className="text-[10px] text-slate-500 hidden md:inline">({currentUser.name.split(' ')[0]})</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                          {notifications.length}
                        </span>
                      </div>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.slice(0, 6).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.linkTab) setCurrentTab(n.linkTab);
                              setIsNotifDropdownOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer transition hover:bg-slate-50 ${
                              !n.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className={`font-semibold ${!n.read ? 'text-blue-900' : 'text-slate-800'}`}>
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                      <button
                        onClick={() => {
                          setCurrentTab('bookings');
                          setIsNotifDropdownOpen(false);
                        }}
                        className="text-xs text-slate-600 hover:text-blue-600 font-medium"
                      >
                        View all activity & bookings
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full border border-slate-200 hover:ring-2 hover:ring-blue-300 transition"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-sm text-slate-900">{currentUser.name}</p>
                        {currentUser.isVerified && (
                          <span title="Verified Campus Identity">
                            <UserCheck className="w-4 h-4 text-blue-600 inline" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-md text-slate-600">
                        <span>Trust Score:</span>
                        <strong className="text-emerald-700">{currentUser.trustScore}/100</strong>
                      </div>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setIsRoleModalOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                      >
                        <span>Switch Role / Persona</span>
                        <span className="text-[10px] text-blue-600 font-bold">4 Available</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab(getRoleDashboardTab());
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        My Role Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab('incidents');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        Incident & Damage Reports
                      </button>
                      <button
                        onClick={() => {
                          resetDemoData();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2 border-t border-slate-100 mt-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset All Demo Data</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/90 px-4 py-2 flex items-center justify-around text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'marketplace' ? 'text-blue-700 font-bold' : ''}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setCurrentTab(getRoleDashboardTab())}
            className={`px-2.5 py-1 rounded-lg ${currentTab.includes('dashboard') ? 'text-blue-700 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('qr-tracking')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 ${currentTab === 'qr-tracking' ? 'text-indigo-700 font-bold' : ''}`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR</span>
          </button>
          <button
            onClick={() => setCurrentTab('bookings')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'bookings' ? 'text-blue-700 font-bold' : ''}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setCurrentTab('ai-center')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'ai-center' ? 'text-purple-700 font-bold' : ''}`}
          >
            AI Engine
          </button>
          <button
            onClick={() => setCurrentTab('audit-logs')}
            className={`px-2.5 py-1 rounded-lg ${currentTab === 'audit-logs' ? 'text-blue-700 font-bold' : ''}`}
          >
            Audit
          </button>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </>
  );
};
