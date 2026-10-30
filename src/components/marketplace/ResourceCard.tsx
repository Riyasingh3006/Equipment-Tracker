import React from 'react';
import { Resource } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Clock, 
  QrCode, 
  ShieldCheck, 
  ArrowRight,
  Lock
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onSelect: (resource: Resource) => void;
  onOpenQR: (resource: Resource) => void;
  onQuickBook?: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  resource, 
  onSelect, 
  onOpenQR, 
  onQuickBook 
}) => {
  const { bookings } = useApp();
  const activeLoan = bookings.find(b => b.resourceId === resource.id && b.status === 'Issued');

  const getAvailabilityBadge = () => {
    switch (resource.availability) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Use':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reserved':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Restricted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Maintenance':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getConditionColor = () => {
    switch (resource.condition) {
      case 'Excellent': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Fair': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Banner */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={resource.imageUrl}
          alt={resource.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-mono font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md shadow-xs">
            {resource.id}
          </span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs ${getAvailabilityBadge()}`}>
            {resource.availability}
          </span>
        </div>

        {/* Bottom condition badge overlay */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border backdrop-blur-xs ${getConditionColor()}`}>
            Condition: {resource.condition}
          </span>
          {resource.requiresSpecialApproval && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-amber-500/90 text-white flex items-center shadow-xs">
              <Lock className="w-2.5 h-2.5 mr-1" /> Restricted
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
          {resource.category}
        </div>
        <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition">
          {resource.name}
        </h3>
        
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Specs & Location Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center text-slate-500">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center text-slate-500">
              <Clock className="w-3 h-3 mr-1 text-slate-400" />
              <span>Max: {resource.maxBookingDurationHours}h</span>
            </span>
            <span className="font-medium text-slate-700">
              Owner: {resource.ownerName.split(' ')[1] || resource.ownerName}
            </span>
          </div>

          {/* Active Custody Snippet if In Use */}
          {activeLoan && (
            <div className="mt-2 p-2 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-950">
              <div className="flex items-center justify-between font-bold">
                <span className="truncate">👤 {activeLoan.userName}</span>
                <span className="font-mono text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded shrink-0">
                  {activeLoan.studentId || 'STU-2024-819'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span className="font-mono">📞 {activeLoan.userPhone || '+1 (555) 234-5678'}</span>
                <span className="text-emerald-700 font-semibold">Issued: {activeLoan.issuedAtFormatted?.split('•')[0] || activeLoan.startDate}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenQR(resource)}
            className="p-2 rounded-xl text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition"
            title="View Verifiable QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelect(resource)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <span>Details & Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
