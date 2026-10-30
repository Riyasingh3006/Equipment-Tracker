import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { 
  CalendarClock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  QrCode, 
  Filter, 
  Plus, 
  Check,
  X,
  Hourglass,
  ArrowRight,
  Printer
} from 'lucide-react';
import { PrintReceiptModal } from '../common/PrintReceiptModal';

export const BookingManagementView: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    approveBooking, 
    rejectBooking, 
    cancelBooking, 
    requestExtension,
    setCurrentTab,
    setIsQrScannerOpen,
    showToast
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Lab schedule conflict or maintenance underway.');
  const [extensionBookingId, setExtensionBookingId] = useState<string | null>(null);
  const [extensionHours, setExtensionHours] = useState<number>(4);
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  // Filter bookings:
  // If student: show their bookings + all public waitlists
  // If owner/admin/manager: show all relevant bookings
  const filteredBookings = bookings.filter(b => {
    const matchesRole = (
      currentUser.role === 'admin' ||
      currentUser.role === 'manager' ||
      (currentUser.role === 'owner' && b.ownerId === currentUser.id) ||
      (currentUser.role === 'student' && b.userId === currentUser.id)
    );

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Issued':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Waiting List':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Returned':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Overdue':
        return 'bg-rose-600 text-white border-rose-600 animate-pulse';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleConfirmRejection = (bookingId: string) => {
    rejectBooking(bookingId, rejectionReason);
    setRejectingBookingId(null);
  };

  const handleConfirmExtension = (bookingId: string) => {
    requestExtension(bookingId, extensionHours);
    setExtensionBookingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                <CalendarClock className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Module 4 & 7
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Booking & Allocation Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Role: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()}) • Fair-share allocation & anti-collision queue
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Reservation</span>
            </button>
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <QrCode className="w-4 h-4 text-blue-300" />
              <span>QR Check-in</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {['All', 'Pending', 'Approved', 'Issued', 'Waiting List', 'Returned', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="mt-4 space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(b => {
              const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'manager';
              const isStudentOwner = b.userId === currentUser.id;

              return (
                <div 
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: Info */}
                  <div className="flex items-start space-x-4">
                    <img 
                      src={b.resourceImageUrl} 
                      alt={b.resourceName} 
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" 
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(b.status)}`}>
                          {b.status} {b.waitingListPosition ? `(#${b.waitingListPosition} in queue)` : ''}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {b.resourceCategory}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {b.resourceName}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span><strong>Student:</strong> {b.userName}</span>
                        <span className="font-mono text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded font-bold">
                          ID: {b.studentId || 'STU-2024-819'}
                        </span>
                        <span className="font-mono text-slate-700">
                          📞 {b.userPhone || '+1 (555) 234-5678'}
                        </span>
                        <span className="text-slate-500">
                          ({b.userDepartment || 'Campus Student'})
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>Slot: {b.startDate} to {b.endDate} ({b.startTime} - {b.endTime})</span>
                        </span>
                        {b.issuedAtFormatted && (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ✓ Issued: {b.issuedAtFormatted}
                          </span>
                        )}
                        {b.returnedAtFormatted && (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            ✓ Returned: {b.returnedAtFormatted}
                          </span>
                        )}
                        {b.allocationReasonTag && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                            {b.allocationReasonTag}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 italic">
                        "{b.purpose}"
                      </p>

                      {b.rejectionReason && (
                        <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200">
                          <strong>Rejection Note:</strong> {b.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Role-Based Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Owner Approval / Rejection Actions */}
                    {isOwnerOrAdmin && b.status === 'Pending' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectingBookingId(b.id)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 text-red-600 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {/* Approved: Proceed to QR Check-in */}
                    {b.status === 'Approved' && (
                      <button
                        onClick={() => {
                          setCurrentTab('qr-tracking');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-blue-200" />
                        <span>Perform QR Check-In</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Issued: Proceed to QR Return & Print Slip */}
                    {b.status === 'Issued' && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setReceiptBooking(b)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1"
                          title="Print Official Handover Slip"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-600" />
                          <span>Slip</span>
                        </button>
                        <button
                          onClick={() => setExtensionBookingId(b.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                        >
                          Extend
                        </button>
                        <button
                          onClick={() => setCurrentTab('qr-tracking')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-200" />
                          <span>Return</span>
                        </button>
                      </div>
                    )}

                    {/* Returned: Print Archive Slip */}
                    {b.status === 'Returned' && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setReceiptBooking(b)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-600" />
                          <span>Custody Slip</span>
                        </button>
                      </div>
                    )}

                    {/* Cancel button if pending */}
                    {isStudentOwner && (b.status === 'Pending' || b.status === 'Waiting List') && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="text-xs text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg transition"
                      >
                        Cancel Request
                      </button>
                    )}

                    <span className="text-[10px] text-slate-400 block mt-1">
                      Submitted: {new Date(b.requestDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CalendarClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800">No bookings found for this filter</h3>
              <p className="text-xs text-slate-500 mt-1">
                Switch filters or explore available campus resources in the Marketplace.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Rejection Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Specify Rejection Reason</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explain why this booking cannot be accommodated (student will be notified with this message).
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              className="mt-3 w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmRejection(rejectingBookingId)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Modal */}
      {extensionBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Request Duration Extension</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select additional time required for this equipment booking:
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[2, 4, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setExtensionHours(h)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition ${
                    extensionHours === h ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  +{h} Hours
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-end space-x-2">
              <button
                onClick={() => setExtensionBookingId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmExtension(extensionBookingId)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Submit Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable University Handover Custody Slip Modal */}
      {receiptBooking && (
        <PrintReceiptModal
          booking={receiptBooking}
          onClose={() => setReceiptBooking(null)}
        />
      )}

    </div>
  );
};
