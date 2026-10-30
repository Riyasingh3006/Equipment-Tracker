import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Package, 
  ShieldAlert, 
  Building2, 
  Check, 
  X, 
  Sparkles,
  KeyRound
} from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, currentUser, switchUser, setCurrentTab } = useApp();

  if (!isOpen) return null;

  const rolesConfig: Record<UserRole, { title: string; color: string; badgeBg: string; icon: React.ReactNode; desc: string; defaultTab: string }> = {
    student: {
      title: 'Student Role',
      color: 'border-blue-500 text-blue-700',
      badgeBg: 'bg-blue-100 text-blue-800',
      icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
      desc: 'Browse inventory, request bookings, submit before/after photos, scan QR tags, report incidents.',
      defaultTab: 'marketplace'
    },
    owner: {
      title: 'Resource Owner',
      color: 'border-purple-500 text-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800',
      icon: <Package className="w-5 h-5 text-purple-600" />,
      desc: 'Add equipment, approve/reject requests, issue equipment via QR, confirm returns, track utilization.',
      defaultTab: 'owner-dashboard'
    },
    admin: {
      title: 'Platform Administrator',
      color: 'border-emerald-500 text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
      desc: 'Manage all campus users and assets, monitor disputes, view real-time platform analytics and audit logs.',
      defaultTab: 'admin-dashboard'
    },
    manager: {
      title: 'Institution Manager / Dean',
      color: 'border-amber-500 text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800',
      icon: <Building2 className="w-5 h-5 text-amber-600" />,
      desc: 'Institutional compliance, approve restricted lab equipment (e.g. Electron Microscope), policy oversight.',
      defaultTab: 'manager-dashboard'
    }
  };

  const handleSelectUser = (userId: string, targetTab: string) => {
    switchUser(userId);
    setCurrentTab(targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" /> Hackathon Evaluation Mode
              </span>
            </div>
            <h2 className="text-xl font-bold mt-2">Switch User Role & Persona</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Instantly experience CampusShare from all 4 perspective dashboards.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of personas grouped by role */}
        <div className="p-6 overflow-y-auto space-y-6">
          {(['student', 'owner', 'admin', 'manager'] as UserRole[]).map(roleKey => {
            const config = rolesConfig[roleKey];
            const usersInRole = allUsers.filter(u => u.role === roleKey);

            return (
              <div key={roleKey} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 bg-white rounded-lg shadow-xs border border-slate-200">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">{config.title}</h3>
                      <p className="text-xs text-slate-500">{config.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.badgeBg}`}>
                    {usersInRole.length} Demo {usersInRole.length === 1 ? 'Account' : 'Accounts'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {usersInRole.map(user => {
                    const isCurrent = currentUser.id === user.id;

                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelectUser(user.id, config.defaultTab)}
                        className={`cursor-pointer rounded-xl p-3 border transition flex items-center justify-between ${
                          isCurrent 
                            ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300/50' 
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="truncate">
                            <div className="flex items-center space-x-1.5">
                              <span className="font-semibold text-xs text-slate-900 truncate">{user.name}</span>
                              {user.reputationBadge && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                                  {user.reputationBadge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{user.department}</p>
                            <p className="text-[10px] font-mono text-slate-400">ID: {user.studentOrStaffId} • Trust: {user.trustScore}%</p>
                          </div>
                        </div>

                        {isCurrent ? (
                          <div className="ml-2 flex items-center text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full shrink-0">
                            <Check className="w-3.5 h-3.5 mr-1" /> Active
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="ml-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-blue-600 hover:text-white px-2.5 py-1 rounded-lg transition shrink-0 flex items-center"
                          >
                            <KeyRound className="w-3 h-3 mr-1" /> Switch
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>Currently acting as: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
