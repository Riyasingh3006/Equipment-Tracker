import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  Package, 
  CalendarClock, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ShieldCheck, 
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    resources, 
    bookings, 
    damageReports, 
    auditLogs, 
    setCurrentTab,
    deleteResource,
    showToast
  } = useApp();

  const [searchUser, setSearchUser] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                          u.studentOrStaffId.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const activeIssuedBookings = bookings.filter(b => b.status === 'Issued');
  const openDamageReports = damageReports.filter(d => d.status === 'Open');

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight">University Operations Admin Console</h1>
                <span className="text-xs bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Full Authority
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Operator: <strong>{currentUser.name}</strong> • Campus-wide user verification, asset auditing & dispute control
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentTab('audit-logs')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center space-x-1.5"
            >
              <span>View System Audit Trail</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentTab('incidents')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition flex items-center space-x-1.5"
            >
              <span>Incident Center ({openDamageReports.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Registered Campus Users</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{allUsers.length}</div>
            <span className="text-[11px] text-emerald-600 mt-1 block">5 Students • 2 Owners • 2 Admins</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Cataloged Institutional Assets</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{resources.length}</div>
            <span className="text-[11px] text-blue-600 mt-1 block">Across 9 Campus Departments</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Active In-Circulation Loans</span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">{activeIssuedBookings.length}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Checked out via verified QR</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">Active Incident Reports</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{openDamageReports.length}</div>
            <span className="text-[11px] text-red-700 mt-1 block">Under physical review</span>
          </div>
        </div>

        {/* Live Campus-Wide Equipment Custody & Borrower Directory */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Live Campus-Wide Equipment Custody Register ({activeIssuedBookings.length} Active Loans)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Real-time tracking of which student is holding which equipment, Student ID, Phone Number, and exact Issue Timestamps.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('qr-tracking')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Open QR Tracking Hub →
            </button>
          </div>

          {activeIssuedBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Equipment</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Student ID (Stu ID)</th>
                    <th className="py-3 px-3">Phone No</th>
                    <th className="py-3 px-3">Issued Date & Time</th>
                    <th className="py-3 px-3">Expected Due</th>
                    <th className="py-3 px-3">Purpose</th>
                    <th className="py-3 px-3 text-right">Custody Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeIssuedBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <img src={b.resourceImageUrl} alt={b.resourceName} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <strong className="text-slate-900 block">{b.resourceName}</strong>
                            <span className="font-mono text-[10px] text-slate-400">{b.resourceId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-slate-900 block">{b.userName}</strong>
                        <span className="text-[10px] text-slate-400">{b.userDepartment || 'Campus Student'}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {b.studentId || 'STU-2024-819'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800 whitespace-nowrap">
                        📞 {b.userPhone || '+1 (555) 234-5678'}
                      </td>
                      <td className="py-3 px-3 text-emerald-700 font-semibold whitespace-nowrap">
                        {b.issuedAtFormatted || (b.checkInDate ? new Date(b.checkInDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : `${b.startDate} 10:00 AM`)}
                      </td>
                      <td className="py-3 px-3 text-amber-700 font-semibold whitespace-nowrap">
                        {b.expectedDueFormatted || `${b.endDate} ${b.endTime}`}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate" title={b.purpose}>
                        "{b.purpose}"
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          In Student Custody
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
              No equipment currently checked out across campus.
            </div>
          )}
        </div>

        {/* User Account Verification & Trust Score Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Campus User Identity & Trust Directory</span>
              </h3>
              <p className="text-xs text-slate-500">
                Verify institutional enrollment badges, check trust scores, and manage borrowing permissions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search by name, ID or email..."
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 w-48"
              />
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
              >
                <option value="All">All Roles</option>
                <option value="student">Students</option>
                <option value="owner">Owners</option>
                <option value="admin">Admins</option>
                <option value="manager">Managers</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">ID Number</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border" />
                        <div>
                          <strong className="text-slate-900 block">{user.name}</strong>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{user.studentOrStaffId}</td>
                    <td className="py-3 px-4">{user.department}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-emerald-700">{user.trustScore}%</span>
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${user.trustScore}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center w-fit">
                          <UserCheck className="w-3 h-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center w-fit">
                          Pending Docs
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => showToast(`Audit profile generated for ${user.name}`, 'info')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Resource Inventory Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>Global Campus Inventory Control (15 Items)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Full administrative authority to inspect, remove, or decommission institutional equipment.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Equipment</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Custodian</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {resources.slice(0, 8).map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{res.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{res.name}</td>
                    <td className="py-3 px-4">{res.location}</td>
                    <td className="py-3 px-4">{res.ownerName}</td>
                    <td className="py-3 px-4">{res.condition}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        res.availability === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        res.availability === 'In Use' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {res.availability}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteResource(res.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800"
                      >
                        Decommission
                      </button>
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
