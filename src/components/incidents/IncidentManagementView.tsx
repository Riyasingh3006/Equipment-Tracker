import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DamageReport } from '../../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  Filter, 
  Check, 
  X,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

export const IncidentManagementView: React.FC = () => {
  const { 
    currentUser, 
    damageReports, 
    resolveDamageReport, 
    resources, 
    fileDamageReport, 
    showToast 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('LAP101');
  const [severity, setSeverity] = useState<DamageReport['conditionSeverity']>('Minor');
  const [description, setDescription] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const filteredReports = damageReports.filter(d => 
    filterStatus === 'All' || d.status === filterStatus
  );

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    const res = resources.find(r => r.id === selectedResourceId);
    if (!res || !description.trim()) return;

    fileDamageReport({
      resourceId: res.id,
      resourceName: res.name,
      reportedByUserId: currentUser.id,
      reportedByUserName: currentUser.name,
      reportedRole: currentUser.role,
      conditionSeverity: severity,
      description,
      photoUrls: [res.imageUrl],
      aiSummary: `AI Triage: ${severity} issue reported on ${res.name}. Needs inspection.`
    });

    setDescription('');
    setIsReportModalOpen(false);
  };

  const handleConfirmResolution = (id: string) => {
    resolveDamageReport(id, resolutionNotes || 'Repaired and recalibrated by laboratory technician.');
    setResolvingId(null);
    setResolutionNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                Module 6 • Accountability & Condition Tracking
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Condition & Damage Incident Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Before/after photographic records, automated degradation detection, and physical inspection sign-offs.
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>File New Damage Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mb-4">
          {['All', 'Open', 'Under Review', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === st 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <div 
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start space-x-4">
                  <img 
                    src={report.photoUrls[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=400&q=80'} 
                    alt="Damage snapshot" 
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" 
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {report.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{report.resourceName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.conditionSeverity === 'Severe' || report.conditionSeverity === 'Missing Equipment'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.conditionSeverity}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                      {report.description}
                    </p>

                    {report.aiSummary && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-xs flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                        <span><strong>AI Diagnostic Summary:</strong> {report.aiSummary}</span>
                      </div>
                    )}

                    <div className="mt-2 text-[11px] text-slate-400">
                      Reported by {report.reportedByUserName} ({report.reportedRole}) on {new Date(report.reportedDate).toLocaleString()}
                    </div>

                    {report.actionTaken && (
                      <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <strong>Resolution Notes:</strong> {report.actionTaken}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center space-x-2">
                  {report.status !== 'Resolved' && (currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'manager') && (
                    <button
                      onClick={() => setResolvingId(report.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No damage or incident reports match this filter. All equipment is in good standing!
            </div>
          )}
        </div>

      </div>

      {/* File Damage Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">File Equipment Damage / Missing Report</h3>
            <p className="text-xs text-slate-500 mt-1">
              Submit condition discrepancy notes for laboratory technician and owner evaluation.
            </p>

            <form onSubmit={handleSubmitNewReport} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Impacted Equipment</label>
                <select
                  value={selectedResourceId}
                  onChange={e => setSelectedResourceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  {resources.map(r => (
                    <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity Rating</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                >
                  <option value="Minor">Minor (Cosmetic scuff, cleanable dirt)</option>
                  <option value="Moderate">Moderate (Intermittent button, scratch, missing cable)</option>
                  <option value="Severe">Severe (Component failure, cracked screen, burnt out)</option>
                  <option value="Missing Equipment">Missing Equipment (Item not returned to cage)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail exact nature of damage, error code, or missing parts..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Resolve Equipment Incident</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter technician sign-off or repair details to restore item availability:
            </p>
            <input
              type="text"
              placeholder="e.g. Replaced battery, cleaned optical lens, cleared for use."
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              className="mt-3 w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setResolvingId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmResolution(resolvingId)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
              >
                Mark Resolved & Recalibrated
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
