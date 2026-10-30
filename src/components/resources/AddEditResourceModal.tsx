import React, { useState } from 'react';
import { Resource, ResourceCategory, ResourceCondition } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  X, 
  Upload,
  Lock,
  Layers
} from 'lucide-react';

interface AddEditResourceModalProps {
  resourceToEdit?: Resource | null;
  onClose: () => void;
}

const CATEGORIES: ResourceCategory[] = [
  'Laptops & Computers',
  'Cameras & AV Equipment',
  'Projectors & Displays',
  'Laboratory Equipment',
  '3D Printers & Fabrication',
  'Classrooms & Lecture Halls',
  'Seminar Halls & Auditoriums',
  'Meeting & Study Rooms',
  'Workshop Tools'
];

export const AddEditResourceModal: React.FC<AddEditResourceModalProps> = ({ 
  resourceToEdit, 
  onClose 
}) => {
  const { createResource, updateResource, currentUser } = useApp();

  const [id, setId] = useState(resourceToEdit?.id || `LAP${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState(resourceToEdit?.name || '');
  const [category, setCategory] = useState<ResourceCategory>(resourceToEdit?.category || 'Laptops & Computers');
  const [description, setDescription] = useState(resourceToEdit?.description || '');
  const [imageUrl, setImageUrl] = useState(
    resourceToEdit?.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
  );
  const [location, setLocation] = useState(resourceToEdit?.location || 'Computer Laboratory, Hall B');
  const [department, setDepartment] = useState(resourceToEdit?.department || currentUser.department);
  const [condition, setCondition] = useState<ResourceCondition>(resourceToEdit?.condition || 'Good');
  const [maxDuration, setMaxDuration] = useState(resourceToEdit?.maxBookingDurationHours || 24);
  const [securityDeposit, setSecurityDeposit] = useState(resourceToEdit?.securityDeposit || 0);
  const [requiresApproval, setRequiresApproval] = useState(resourceToEdit?.requiresSpecialApproval || false);
  const [usageInstructions, setUsageInstructions] = useState(
    resourceToEdit?.usageInstructions || 'Keep in protective padded case. Report any abnormal heat or physical damage promptly.'
  );
  const [eligibility, setEligibility] = useState(
    resourceToEdit?.eligibilityRequirements || 'Enrolled campus students and faculty members.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !id.trim()) return;

    if (resourceToEdit) {
      updateResource(resourceToEdit.id, {
        name,
        category,
        description,
        imageUrl,
        location,
        department,
        condition,
        maxBookingDurationHours: Number(maxDuration),
        securityDeposit: Number(securityDeposit),
        requiresSpecialApproval: requiresApproval,
        usageInstructions,
        eligibilityRequirements: eligibility
      });
    } else {
      createResource({
        id,
        name,
        category,
        description,
        imageUrl,
        location,
        department,
        condition,
        maxBookingDurationHours: Number(maxDuration),
        securityDeposit: Number(securityDeposit),
        requiresSpecialApproval: requiresApproval,
        usageInstructions,
        eligibilityRequirements: eligibility
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-linear-to-r from-purple-900 via-slate-900 to-blue-900 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {resourceToEdit ? 'Edit Campus Equipment' : 'Catalog New Campus Resource'}
              </h3>
              <p className="text-xs text-purple-200">
                Automatic cryptographic QR tag generation & fair-share tracking
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Unique Resource ID (Asset Tag) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value.toUpperCase())}
                placeholder="e.g. LAP101, CAM201, PRT501"
                disabled={!!resourceToEdit}
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-[10px] text-slate-400">Used for QR identification tag</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. HP Laptop, Sony Alpha 7 IV, 3D Printer"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ResourceCategory)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Initial Condition Rating
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ResourceCondition)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
              >
                <option value="Excellent">Excellent (Like new)</option>
                <option value="Good">Good (Minor cosmetic wear)</option>
                <option value="Fair">Fair (Operational, needs care)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Description & Specifications
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed hardware specs, processor, accessories included..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Location & Storage Cage
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Computer Laboratory Room 204"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Max Duration (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={168}
                value={maxDuration}
                onChange={e => setMaxDuration(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Deposit ($ USD)
              </label>
              <input
                type="number"
                min={0}
                value={securityDeposit}
                onChange={e => setSecurityDeposit(Number(e.target.value))}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold"
              />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center space-x-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={requiresApproval}
                  onChange={e => setRequiresApproval(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="font-semibold text-slate-800">Requires Dean Sign-off</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Usage Instructions & Return Protocol
            </label>
            <input
              type="text"
              value={usageInstructions}
              onChange={e => setUsageInstructions(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Eligibility Requirements
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={e => setEligibility(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md shadow-purple-600/20 transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{resourceToEdit ? 'Save Changes' : 'Catalog Resource & Generate QR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
