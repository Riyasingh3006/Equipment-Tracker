import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { QuickActionHeader } from './components/common/QuickActionHeader';
import { EasyAssistantWidget } from './components/common/EasyAssistantWidget';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Toast } from './components/common/Toast';
import { DemoWalkthroughGuide } from './components/demo/DemoWalkthroughGuide';
import { LandingPage } from './components/landing/LandingPage';
import { ResourceMarketplace } from './components/marketplace/ResourceMarketplace';
import { QRTrackingHub } from './components/qr/QRTrackingHub';
import { BookingManagementView } from './components/bookings/BookingManagementView';
import { AICenterView } from './components/ai/AICenterView';
import { IncidentManagementView } from './components/incidents/IncidentManagementView';
import { AuditLogView } from './components/audit/AuditLogView';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { OwnerDashboard } from './components/dashboards/OwnerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { ManagerDashboard } from './components/dashboards/ManagerDashboard';

const MainLayout: React.FC = () => {
  const { currentTab, currentUser } = useApp();

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage />;
      case 'marketplace':
        return <ResourceMarketplace />;
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'manager-dashboard':
        return <ManagerDashboard />;
      case 'qr-tracking':
        return <QRTrackingHub />;
      case 'bookings':
        return <BookingManagementView />;
      case 'ai-center':
        return <AICenterView />;
      case 'incidents':
        return <IncidentManagementView />;
      case 'audit-logs':
        return <AuditLogView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16 lg:pb-0">
      <Navbar />
      <QuickActionHeader />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <EasyAssistantWidget />
      <MobileBottomNav />
      <DemoWalkthroughGuide />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
