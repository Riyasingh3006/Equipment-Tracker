import React, { useState } from 'react';
import { Resource } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ShieldCheck, 
  Users,
  Send
} from 'lucide-react';

interface BookingModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ resource, onClose }) => {
  const { currentUser, createBooking, bookings, setCurrentTab } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!resource) return null;

  // Real-time conflict preview
  const hasConflict = bookings.some(b => 
    b.resourceId === resource.id &&
    (b.status === 'Approved' || b.status === 'Issued') &&
    b.startDate <= endDate && 
    b.endDate >= startDate
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createBooking(resource.id, startDate, endDate, startTime, endTime, purpose);
      setIsSubmitting(false);
      onClose();
      setCurrentTab('bookings');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Reserve Campus Resource</h3>
              <p className="text-xs text-blue-200 font-mono">Asset ID: {resource.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Resource Snapshot */}
          <div className="flex items-center space-x-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <img 
              src={resource.imageUrl} 
              alt={resource.name} 
              className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200" 
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{resource.category}</span>
              <h4 className="font-bold text-sm text-slate-900 truncate">{resource.name}</h4>
              <p className="text-xs text-slate-500 truncate">{resource.location}</p>
              <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-600">
                <span>Max duration: <strong>{resource.maxBookingDurationHours}h</strong></span>
                <span>•</span>
                <span>Deposit: <strong>${resource.securityDeposit || 0}</strong></span>
              </div>
            </div>
          </div>

          {/* Student Eligibility & Trust Badge */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Reserving as: <strong>{currentUser.name}</strong> ({currentUser.studentOrStaffId})</span>
            </div>
            <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
              Trust Score: {currentUser.trustScore}/100
            </span>
          </div>

          {/* Conflict Notice if any */}
          {hasConflict && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Scheduling Overlap Detected</strong>
                Another user holds an active reservation during this slot. Submitting this request will automatically place you at position #1 on the <strong>Fair-Share Waiting List</strong>.
              </div>
            </div>
          )}

          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Start Date
              </label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> End Date
              </label>
              <input
                type="date"
                min={startDate}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Booking Purpose */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Purpose & Project Description <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Programming assignment, machine learning model training, capstone video production..."
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              required
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Resource owner Dr. Robert Vance reviews justification before granting QR check-in approval.
            </p>
          </div>

          {/* Rules Checkbox */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">
              I agree to perform the mandatory QR check-in photo inspection, follow safety rules, and return the item on or before the agreed end time.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !purpose.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : hasConflict ? 'Join Waiting List' : 'Submit Reservation Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
