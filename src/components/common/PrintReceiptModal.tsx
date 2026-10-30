import React from 'react';
import { Booking } from '../../types';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PrintReceiptModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Toolbar (hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Official University Equipment Handover Slip</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0 print:m-0 print:text-black">
          
          {/* Institution Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-700 uppercase block">
                CAMPUSSHARE • INSTITUTIONAL RESOURCE NETWORK
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Official Equipment Custody Handover Certificate
              </h1>
              <p className="text-xs text-slate-500">
                Department of Academic Technology & Laboratory Facilities
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-300 inline-block">
                {booking.id}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Generated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Equipment Details Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              1. Equipment Specifications & Asset Identification
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Equipment Name:</span>
                <strong className="text-slate-900 text-sm">{booking.resourceName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Institutional Asset Tag ID:</span>
                <strong className="text-blue-700 font-mono text-sm">{booking.resourceId}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Category:</span>
                <strong className="text-slate-800">{booking.resourceCategory}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Initial Verified Condition:</span>
                <strong className="text-emerald-700 font-bold">{booking.initialCondition || 'Good'}</strong>
              </div>
            </div>
          </div>

          {/* Student Borrower Custody Profile */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-2">
              2. Student Custody & Identity Verification
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Full Name:</span>
                <strong className="text-slate-900 font-bold">{booking.userName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Student ID (Stu ID):</span>
                <strong className="text-blue-800 font-mono font-bold">{booking.studentId || 'STU-2024-819'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Contact Phone:</span>
                <strong className="text-slate-900 font-mono">{booking.userPhone || '+1 (555) 234-5678'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Student Email:</span>
                <span className="text-slate-800 font-medium">{booking.userEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <span className="text-slate-800 font-medium">{booking.userDepartment || 'Engineering & Sciences'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Custody Status:</span>
                <span className="font-bold text-blue-700 uppercase text-[11px]">{booking.status}</span>
              </div>
            </div>
          </div>

          {/* Schedule & Handover Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Check-Out Handover</span>
              <strong className="text-slate-900 text-sm block mt-0.5">
                {booking.issuedAtFormatted || (booking.checkInDate ? new Date(booking.checkInDate).toLocaleString() : `${booking.startDate} • ${booking.startTime}`)}
              </strong>
              <span className="text-[10px] text-slate-500">Recorded via QR optical cage scanner</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mandatory Due Return Time</span>
              <strong className="text-slate-900 text-sm block mt-0.5">
                {booking.expectedDueFormatted || `${booking.endDate} • ${booking.endTime}`}
              </strong>
              <span className="text-[10px] text-slate-500">Grace period: 120 minutes</span>
            </div>
          </div>

          {/* Stamped Signatures Box */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="h-16 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-base text-blue-900">{booking.userName}</span>
              </div>
              <span className="text-[10px] text-slate-500 block text-center mt-1">
                Student Signature ({booking.studentId || 'Verified'})
              </span>
            </div>
            <div>
              <div className="h-16 border-b border-dashed border-slate-400 flex items-end justify-center pb-1">
                <span className="font-serif italic text-base text-slate-800">{booking.ownerName}</span>
              </div>
              <span className="text-[10px] text-slate-500 block text-center mt-1">
                Equipment Cage Custodian Signature
              </span>
            </div>
          </div>

          {/* Legal / Policy Footer */}
          <div className="pt-2 text-[10px] text-slate-400 text-center leading-relaxed">
            By signing and receiving this equipment, the student agrees to maintain institutional care standards, report any malfunction within 2 hours, and return the item intact by the due time. Tamper-evident QR records are maintained in the University Audit Ledger.
          </div>

        </div>

        {/* Modal Footer (hidden during print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Custody Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
