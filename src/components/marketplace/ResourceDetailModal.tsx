import React, { useState } from 'react';
import { Resource } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  Calendar, 
  Info, 
  AlertCircle, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  DollarSign,
  Phone,
  Mail,
  UserCheck,
  CalendarClock
} from 'lucide-react';
import { QRCodeModal } from '../common/QRCodeModal';
import { BookingModal } from './BookingModal';

interface ResourceDetailModalProps {
  resource: Resource | null;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resource, onClose }) => {
  const { currentUser, bookings } = useApp();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  if (!resource) return null;

  // Bookings associated with this specific resource
  const resourceBookings = bookings.filter(b => b.resourceId === resource.id);
  const currentActiveLoan = resourceBookings.find(b => b.status === 'Issued');
  const previousLoans = resourceBookings.filter(b => b.status === 'Returned');

  // Student Eligibility check
  const isEligible = currentUser.role !== 'student' || (
    currentUser.trustScore >= 80 && !resource.requiresSpecialApproval
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="relative h-64 bg-slate-900 overflow-hidden shrink-0">
            <img 
              src={resource.imageUrl} 
              alt={resource.name} 
              className="w-full h-full object-cover opacity-85" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on banner */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white shadow-xs">
                    {resource.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {resource.category}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white">
                    {resource.availability}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {resource.name}
                </h2>
                <div className="flex items-center text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{resource.location}</span>
                </div>
              </div>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition"
              >
                <QrCode className="w-4 h-4 text-blue-300" />
                <span>Asset QR Tag</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h4>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Condition</span>
                <span className="font-bold text-sm text-slate-800">{resource.condition}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Max Duration</span>
                <span className="font-bold text-sm text-slate-800">{resource.maxBookingDurationHours} Hours</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Security Deposit</span>
                <span className="font-bold text-sm text-slate-800">${resource.securityDeposit || 0}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block">Total Uses</span>
                <span className="font-bold text-sm text-slate-800">{resource.totalBookingsCount} Completed</span>
              </div>
            </div>

            {/* Specifications */}
            {resource.specifications && Object.keys(resource.specifications).length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Specifications</h4>
                <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200/70 overflow-hidden text-xs">
                  {Object.entries(resource.specifications).map(([key, val]) => (
                    <div key={key} className="flex px-4 py-2.5">
                      <span className="w-1/3 font-medium text-slate-500">{key}</span>
                      <span className="w-2/3 font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility & Access Rules */}
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">Access & Eligibility Verification</h4>
                </div>
                {isEligible ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Eligible to Book
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> Requires Special Approval
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700">{resource.eligibilityRequirements}</p>

              {resource.requiresSpecialApproval && (
                <div className="mt-2.5 flex items-start space-x-2 text-xs text-amber-800 bg-amber-100/70 p-2.5 rounded-lg border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    This high-tier resource requires Dean / Institutional Manager review prior to authorization.
                  </span>
                </div>
              )}
            </div>

            {/* Detailed Student Usage History & Custody Section */}
            <div className="border-t border-slate-200/80 pt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">Student Usage & Custody History</h4>
                    <p className="text-[11px] text-slate-500">Track which student used this equipment, Student ID, Phone Number, and exact issue/return times.</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {resourceBookings.length} Total {resourceBookings.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {/* Current Active Loan Banner if in use */}
              {currentActiveLoan ? (
                <div className="p-4 rounded-2xl bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-200/70 px-2.5 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse mr-1.5" />
                      Currently Checked Out & In Custody
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-700">{currentActiveLoan.id}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-blue-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Borrower Student</span>
                      <strong className="text-slate-900 text-sm block">{currentActiveLoan.userName}</strong>
                      <span className="text-slate-500">{currentActiveLoan.userDepartment || 'Campus Student'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Student ID (Stu ID)</span>
                      <strong className="text-blue-700 font-mono text-sm block">{currentActiveLoan.studentId || 'STU-2024-819'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" /> Phone Number (Phone No)
                      </span>
                      <strong className="text-slate-800 font-mono text-xs block mt-0.5">{currentActiveLoan.userPhone || '+1 (555) 234-5678'}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" /> Student Email
                      </span>
                      <span className="text-slate-700 text-xs block mt-0.5 truncate">{currentActiveLoan.userEmail}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-emerald-600" /> Issued Date & Time
                      </span>
                      <strong className="text-emerald-700 font-semibold block mt-0.5">
                        {currentActiveLoan.issuedAtFormatted || (currentActiveLoan.checkInDate ? new Date(currentActiveLoan.checkInDate).toLocaleString() : `${currentActiveLoan.startDate} • ${currentActiveLoan.startTime}`)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center">
                        <CalendarClock className="w-3 h-3 mr-1 text-amber-600" /> Expected Return Time
                      </span>
                      <strong className="text-amber-700 font-semibold block mt-0.5">
                        {currentActiveLoan.expectedDueFormatted || `${currentActiveLoan.endDate} • ${currentActiveLoan.endTime}`}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 italic px-1">
                    <strong>Project Purpose:</strong> "{currentActiveLoan.purpose}"
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between mb-4">
                  <span className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 shrink-0" />
                    <strong>Equipment is currently in storage cage and available for issuance.</strong>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">0 Active Checkouts</span>
                </div>
              )}

              {/* Past Student Usage History Table / Cards */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Past Student Borrower Logs ({previousLoans.length} completed loans)
                </span>

                {previousLoans.length > 0 ? (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden text-xs">
                    {previousLoans.map(loan => (
                      <div key={loan.id} className="p-3.5 hover:bg-slate-50 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <strong className="text-slate-900 text-xs sm:text-sm">{loan.userName}</strong>
                              <span className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.2 rounded border border-blue-200">
                                ID: {loan.studentId || 'STU-2024-819'}
                              </span>
                              <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                                📞 {loan.userPhone || '+1 (555) 234-5678'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {loan.userDepartment || 'Campus Student'} • {loan.userEmail}
                            </p>
                          </div>

                          <div className="text-left sm:text-right text-[11px]">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                              Returned & Verified
                            </span>
                            <span className="text-slate-400 block mt-0.5">
                              Condition: {loan.initialCondition || 'Good'} → {loan.finalCondition || 'Good'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-slate-400">Issued Date & Time:</span>{' '}
                            <strong className="text-slate-800 font-medium">{loan.issuedAtFormatted || loan.checkInDate || `${loan.startDate} 10:00 AM`}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Returned Date & Time:</span>{' '}
                            <strong className="text-slate-800 font-medium">{loan.returnedAtFormatted || loan.checkOutDate || `${loan.endDate} 05:00 PM`}</strong>
                          </div>
                          <div className="sm:col-span-2 text-slate-600 italic">
                            <span className="text-slate-400 not-italic font-medium">Purpose:</span> "{loan.purpose}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No historical returns logged yet for this asset. New bookings will automatically populate this ledger.
                  </div>
                )}
              </div>
            </div>

            {/* Owner Details */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {resource.ownerName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">{resource.ownerName}</span>
                  <span className="text-slate-500">{resource.ownerRole} • {resource.department}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white transition"
            >
              <QrCode className="w-4 h-4 text-slate-600" />
              <span>Show QR Code</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
              >
                Close
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Equipment</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Nested Modals */}
      <QRCodeModal
        resource={isQrModalOpen ? resource : null}
        onClose={() => setIsQrModalOpen(false)}
      />

      {isBookingModalOpen && (
        <BookingModal
          resource={resource}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </>
  );
};
