import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  CalendarClock, 
  QrCode, 
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers
} from 'lucide-react';
import { AddEditResourceModal } from '../resources/AddEditResourceModal';
import { QRCodeModal } from '../common/QRCodeModal';
import { Resource } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const { 
    currentUser, 
    resources, 
    bookings, 
    approveBooking, 
    rejectBooking, 
    setCurrentTab,
    damageReports
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQrResource, setSelectedQrResource] = useState<Resource | null>(null);

  // Filter resources owned by current user (or all if admin view)
  const myResources = resources.filter(r => r.ownerId === currentUser.id || currentUser.role === 'admin');
  const availableCount = myResources.filter(r => r.availability === 'Available').length;
  const inUseCount = myResources.filter(r => r.availability === 'In Use').length;

  // Filter bookings for this owner's equipment
  const myEquipmentBookings = bookings.filter(b => b.ownerId === currentUser.id || currentUser.role === 'admin');
  const pendingApprovals = myEquipmentBookings.filter(b => b.status === 'Pending');
  const activeIssued = myEquipmentBookings.filter(b => b.status === 'Issued');
  const myDamageReports = damageReports.filter(d => myResources.some(r => r.id === d.resourceId));

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shadow-sm" 
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                  Resource Owner Dashboard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.department} • Staff ID: <strong className="text-slate-700">{currentUser.studentOrStaffId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-600/20 transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Catalog New Equipment</span>
            </button>
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4 text-purple-300" />
              <span>Cage Scanner Hub</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">My Cataloged Assets</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{myResources.length}</div>
            <span className="text-[11px] text-purple-600 mt-1 block">Active lab inventory</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Pending Booking Requests</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingApprovals.length}</div>
            <span className="text-[11px] text-amber-700 mt-1 block">Require approval decision</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Currently Issued (In Use)</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{inUseCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Tracked via QR checkout</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Reported Incidents</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{myDamageReports.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Damage / maintenance logs</span>
          </div>
        </div>

        {/* Pending Approval Requests Queue (High Priority) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <CalendarClock className="w-5 h-5 text-amber-500" />
                <span>Action Required: Pending Reservation Requests</span>
              </h3>
              <p className="text-xs text-slate-500">
                Review student identity, purpose, and grant one-click approval for QR pickup.
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {pendingApprovals.length} Pending Decision
            </span>
          </div>

          {pendingApprovals.length > 0 ? (
            <div className="space-y-3">
              {pendingApprovals.map(b => (
                <div 
                  key={b.id}
                  className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <img 
                      src={b.resourceImageUrl} 
                      alt={b.resourceName} 
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{b.resourceName}</span>
                        <span className="text-xs font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {b.resourceId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Requested by: <strong className="text-slate-800">{b.userName}</strong> ({b.userEmail})
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dates: {b.startDate} to {b.endDate} ({b.startTime} - {b.endTime})
                      </p>
                      <p className="text-xs text-slate-600 italic mt-1 bg-white/70 p-2 rounded-lg border border-slate-200">
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
                      <span>Approve Request</span>
                    </button>
                    <button
                      onClick={() => rejectBooking(b.id, 'Schedule conflict in laboratory.')}
                      className="px-3.5 py-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p className="font-semibold text-slate-700">All caught up!</p>
              <p className="text-slate-400 mt-0.5">No pending equipment requests require approval at this time.</p>
            </div>
          )}
        </div>

        {/* Active Student Custody Register (Live Equipment Handover Tracker) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Live Equipment in Student Custody ({activeIssued.length} Active Loans)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Track which student currently holds your equipment, Student ID, Contact Phone, and exact Issued Date & Time.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Open Return Scanner Hub →
            </button>
          </div>

          {activeIssued.length > 0 ? (
            <div className="space-y-3">
              {activeIssued.map(loan => (
                <div 
                  key={loan.id}
                  className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start space-x-3.5">
                    <img 
                      src={loan.resourceImageUrl} 
                      alt={loan.resourceName} 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">{loan.resourceName}</span>
                        <span className="font-mono text-xs font-bold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {loan.resourceId}
                        </span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Currently In Use
                        </span>
                      </div>

                      {/* Borrower Student Metadata Grid */}
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Student Borrower:</span>
                          <strong className="text-slate-900">{loan.userName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Student ID (Stu ID):</span>
                          <strong className="font-mono text-blue-700">{loan.studentId || 'STU-2024-819'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Phone (Phone No):</span>
                          <strong className="font-mono">{loan.userPhone || '+1 (555) 234-5678'}</strong>
                        </div>
                        <div className="sm:col-span-2 mt-1">
                          <span className="text-slate-400 block text-[10px]">Issued Date & Exact Time:</span>
                          <strong className="text-emerald-700">{loan.issuedAtFormatted || (loan.checkInDate ? new Date(loan.checkInDate).toLocaleString() : `${loan.startDate} • ${loan.startTime}`)}</strong>
                        </div>
                        <div className="mt-1">
                          <span className="text-slate-400 block text-[10px]">Expected Return:</span>
                          <strong className="text-amber-700">{loan.expectedDueFormatted || `${loan.endDate} • ${loan.endTime}`}</strong>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 italic mt-1.5">
                        <strong>Purpose:</strong> "{loan.purpose}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setCurrentTab('qr-tracking')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Process QR Return</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No equipment currently checked out. All laboratory assets are safely in storage.
            </div>
          )}
        </div>

        {/* My Cataloged Inventory List with QR Tag Access */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>My Managed Equipment Inventory</span>
              </h3>
              <p className="text-xs text-slate-500">
                View status, print QR asset tags, and monitor loan frequencies.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-purple-600 hover:text-purple-800"
            >
              + Add Another Resource
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Equipment Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total Loans</th>
                  <th className="py-3 px-4 text-right">QR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {myResources.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-purple-900">{res.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img src={res.imageUrl} alt={res.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <strong className="text-slate-900 block">{res.name}</strong>
                          <span className="text-[10px] text-slate-400">{res.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{res.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                        {res.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        res.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        res.availability === 'In Use' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {res.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{res.totalBookingsCount}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedQrResource(res)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center space-x-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Asset QR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddEditResourceModal
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {selectedQrResource && (
        <QRCodeModal
          resource={selectedQrResource}
          onClose={() => setSelectedQrResource(null)}
        />
      )}

    </div>
  );
};
