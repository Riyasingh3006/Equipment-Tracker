import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLog } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  Package, 
  FileText,
  RotateCcw
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.resourceName && log.resourceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (log.resourceId && log.resourceId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'User', 'Role', 'Resource ID', 'Resource Name', 'Category', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.action,
      `"${l.userName}"`,
      l.userRole,
      l.resourceId || '',
      `"${l.resourceName || ''}"`,
      l.category,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CampusShare-AuditLog-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryBadge = (cat: AuditLog['category']) => {
    switch (cat) {
      case 'BOOKING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CHECKIN': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CHECKOUT': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RESOURCE': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'INCIDENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'AUTH': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-400/30">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Module 10 • Cryptographic Compliance & Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Institutional Audit Trail & Event Logs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Append-only immutable record of all check-in scans, condition ratings, reservations, and administrative sign-offs.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit Ledger</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Controls Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2 w-full md:w-auto flex-1">
            <Search className="w-4 h-4 text-slate-400 ml-1" />
            <input
              type="text"
              placeholder="Search by action, student name, asset ID, or keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs sm:text-sm px-2 py-1.5 w-full focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-xs text-slate-400 hover:text-slate-600 px-2">
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Categories ({auditLogs.length})</option>
              <option value="BOOKING">Booking Events</option>
              <option value="CHECKIN">QR Check-In Events</option>
              <option value="CHECKOUT">QR Return Events</option>
              <option value="RESOURCE">Resource Cataloging</option>
              <option value="INCIDENT">Damage & Incident Reports</option>
              <option value="AUTH">Authentication / Session</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Asset Involved</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {log.id}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{log.userName}</span>
                        <span className="text-[10px] text-slate-400">({log.userRole})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.resourceId ? (
                        <div className="flex items-center space-x-1.5">
                          <Package className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-mono font-bold text-slate-800">{log.resourceId}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
