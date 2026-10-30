import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Resource, 
  Booking, 
  DamageReport, 
  NotificationItem, 
  AuditLog, 
  ResourceCondition,
  UserRole
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_RESOURCES, 
  INITIAL_BOOKINGS, 
  INITIAL_DAMAGE_REPORTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  resources: Resource[];
  bookings: Booking[];
  damageReports: DamageReport[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  currentTab: string;
  searchFilter: string;
  selectedCategoryFilter: string;
  selectedResourceForModal: Resource | null;
  isQrScannerOpen: boolean;
  activeDemoTourStep: number | null; // 1 to 10 for interactive hackathon guide
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  
  // Actions
  setCurrentTab: (tab: string) => void;
  setSearchFilter: (query: string) => void;
  setSelectedCategoryFilter: (category: string) => void;
  setSelectedResourceForModal: (res: Resource | null) => void;
  setIsQrScannerOpen: (open: boolean) => void;
  setActiveDemoTourStep: (step: number | null) => void;
  switchUser: (userId: string) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
  
  // Business logic
  createBooking: (
    resourceId: string, 
    startDate: string, 
    endDate: string, 
    startTime: string, 
    endTime: string, 
    purpose: string
  ) => { success: boolean; message: string; bookingId?: string };
  
  approveBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string, reason?: string) => void;
  checkInAndIssue: (
    bookingId: string, 
    initialCondition: ResourceCondition, 
    initialPhotos?: string[]
  ) => boolean;
  returnAndComplete: (
    bookingId: string, 
    finalCondition: ResourceCondition, 
    finalPhotos?: string[], 
    incidentDescription?: string
  ) => boolean;
  cancelBooking: (bookingId: string) => void;
  requestExtension: (bookingId: string, hours: number) => void;
  createResource: (newRes: Partial<Resource>) => Resource;
  updateResource: (id: string, updated: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  fileDamageReport: (report: Omit<DamageReport, 'id' | 'reportedDate' | 'status'>) => void;
  resolveDamageReport: (id: string, notes: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  addAuditRecord: (
    action: string, 
    details: string, 
    category: AuditLog['category'], 
    resourceId?: string, 
    resourceName?: string
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`campusshare_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUserId = localStorage.getItem('campusshare_current_user_id');
    const found = INITIAL_USERS.find(u => u.id === savedUserId);
    return found || INITIAL_USERS[0]; // Alex Chen by default
  });

  const [resources, setResources] = useState<Resource[]>(() => 
    loadStored<Resource[]>('resources', INITIAL_RESOURCES)
  );

  const [bookings, setBookings] = useState<Booking[]>(() => 
    loadStored<Booking[]>('bookings', INITIAL_BOOKINGS)
  );

  const [damageReports, setDamageReports] = useState<DamageReport[]>(() => 
    loadStored<DamageReport[]>('damageReports', INITIAL_DAMAGE_REPORTS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    loadStored<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS)
  );

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => 
    loadStored<AuditLog[]>('auditLogs', INITIAL_AUDIT_LOGS)
  );

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedResourceForModal, setSelectedResourceForModal] = useState<Resource | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [activeDemoTourStep, setActiveDemoTourStep] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('campusshare_resources', JSON.stringify(resources));
    } catch {}
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem('campusshare_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('campusshare_damageReports', JSON.stringify(damageReports));
    } catch {}
  }, [damageReports]);

  useEffect(() => {
    try {
      localStorage.setItem('campusshare_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('campusshare_auditLogs', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('campusshare_current_user_id', currentUser.id);
    } catch {}
  }, [currentUser]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToastMessage(null);

  const addAuditRecord = (
    action: string, 
    details: string, 
    category: AuditLog['category'], 
    resourceId?: string, 
    resourceName?: string
  ) => {
    const newRecord: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      action,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      resourceId,
      resourceName,
      timestamp: new Date().toISOString(),
      details,
      category
    };
    setAuditLogs(prev => [newRecord, ...prev]);
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched view to ${user.name} (${user.role.toUpperCase()})`, 'info');
      addAuditRecord('AUTH_USER_SWITCH', `Switched active role session to ${user.name} (${user.role})`, 'AUTH');
    }
  };

  const createBooking = (
    resourceId: string, 
    startDate: string, 
    endDate: string, 
    startTime: string, 
    endTime: string, 
    purpose: string
  ) => {
    const res = resources.find(r => r.id === resourceId);
    if (!res) {
      return { success: false, message: 'Resource not found' };
    }

    // Double booking check: Check if there's an overlapping active/issued booking
    const hasOverlap = bookings.some(b => 
      b.resourceId === resourceId &&
      (b.status === 'Approved' || b.status === 'Issued') &&
      b.startDate <= endDate && 
      b.endDate >= startDate
    );

    const bookingId = `BKG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const isWaitlist = hasOverlap;

    const newBooking: Booking = {
      id: bookingId,
      resourceId: res.id,
      resourceName: res.name,
      resourceCategory: res.category,
      resourceImageUrl: res.imageUrl,
      userId: currentUser.id,
      userName: currentUser.name,
      studentId: currentUser.studentOrStaffId,
      userPhone: currentUser.phone || '+1 (555) 234-5678',
      userEmail: currentUser.email,
      userDepartment: currentUser.department,
      userRole: currentUser.role,
      ownerId: res.ownerId,
      ownerName: res.ownerName,
      startDate,
      endDate,
      startTime,
      endTime,
      purpose,
      status: isWaitlist ? 'Waiting List' : 'Pending',
      requestDate: new Date().toISOString(),
      expectedDueFormatted: `${endDate} • ${endTime}`,
      waitingListPosition: isWaitlist ? 1 : undefined,
      allocationReasonTag: `Verified Student Request • Trust Score: ${currentUser.trustScore}/100`
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send notification to Owner
    const ownerNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: res.ownerId,
      title: isWaitlist ? `New Waiting List Request: ${res.name}` : `New Booking Request: ${res.name}`,
      message: `${currentUser.name} requested ${res.name} for ${startDate}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'booking',
      linkTab: 'bookings'
    };
    setNotifications(prev => [ownerNotif, ...prev]);

    // Send confirmation to Student
    const studentNotif: NotificationItem = {
      id: `notif_${Date.now() + 1}`,
      userId: currentUser.id,
      title: isWaitlist ? 'Added to Waiting List' : 'Booking Request Submitted',
      message: isWaitlist 
        ? `Resource ${res.name} has overlapping usage. You are #1 on the waiting list.`
        : `Your reservation request for ${res.name} is now pending approval from ${res.ownerName}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system',
      linkTab: 'bookings'
    };
    setNotifications(prev => [studentNotif, ...prev]);

    addAuditRecord(
      isWaitlist ? 'BOOKING_WAITLISTED' : 'BOOKING_REQUESTED',
      `Booking request ${bookingId} created by ${currentUser.name} for ${res.name} (${startDate} to ${endDate}).`,
      'BOOKING',
      res.id,
      res.name
    );

    if (!isWaitlist) {
      showToast(`Booking request submitted for ${res.name}! Pending owner review.`, 'success');
    } else {
      showToast(`Selected slot has overlapping usage. Placed on Waiting List (#1).`, 'info');
    }

    return { success: true, message: 'Booking placed', bookingId };
  };

  const approveBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Approved',
          approvalDate: new Date().toISOString()
        };
      }
      return b;
    }));

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      // Notify student
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: targetBooking.userId,
        title: 'Booking Approved! 🎉',
        message: `Your booking for ${targetBooking.resourceName} was approved. You can now perform QR Check-in.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'approval',
        linkTab: 'bookings'
      };
      setNotifications(prev => [notif, ...prev]);

      addAuditRecord(
        'BOOKING_APPROVED',
        `Approved booking ${bookingId} for student ${targetBooking.userName}.`,
        'BOOKING',
        targetBooking.resourceId,
        targetBooking.resourceName
      );

      showToast(`Booking ${bookingId} approved successfully!`, 'success');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const rejectBooking = (bookingId: string, reason: string = 'Schedule conflict or maintenance.') => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Rejected',
          rejectionReason: reason
        };
      }
      return b;
    }));

    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: target.userId,
        title: 'Booking Not Approved',
        message: `Request for ${target.resourceName} could not be approved. Reason: ${reason}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'rejection',
        linkTab: 'bookings'
      };
      setNotifications(prev => [notif, ...prev]);

      addAuditRecord(
        'BOOKING_REJECTED',
        `Rejected booking ${bookingId}. Reason: ${reason}`,
        'BOOKING',
        target.resourceId,
        target.resourceName
      );
      showToast(`Booking rejected.`, 'info');
    }
  };

  const checkInAndIssue = (
    bookingId: string, 
    initialCondition: ResourceCondition, 
    initialPhotos: string[] = []
  ) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    const nowFormatted = new Date().toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Update booking
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Issued',
          checkInDate: new Date().toISOString(),
          issuedAtFormatted: nowFormatted,
          expectedDueFormatted: `${b.endDate} • ${b.endTime}`,
          initialCondition,
          initialPhotos: initialPhotos.length > 0 ? initialPhotos : [booking.resourceImageUrl]
        };
      }
      return b;
    }));

    // Update resource state to In Use
    setResources(prev => prev.map(r => {
      if (r.id === booking.resourceId) {
        return {
          ...r,
          availability: 'In Use',
          totalBookingsCount: r.totalBookingsCount + 1
        };
      }
      return r;
    }));

    addAuditRecord(
      'EQUIPMENT_ISSUED_QR',
      `Verified QR Check-in for ${booking.resourceName}. Issued to student: ${booking.userName} (Stu ID: ${booking.studentId || 'STU-2024-819'}, Phone: ${booking.userPhone || '+1 (555) 234-5678'}). Issued At: ${nowFormatted}. Due: ${booking.expectedDueFormatted || booking.endDate}. Condition: ${initialCondition}.`,
      'CHECKIN',
      booking.resourceId,
      booking.resourceName
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Equipment Issued & In Use 🚀',
      message: `${booking.resourceName} is successfully checked out. Please handle with care and return by ${booking.endDate} ${booking.endTime}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'system',
      linkTab: 'bookings'
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    } catch {}

    showToast(`QR Check-in verified! ${booking.resourceName} successfully issued.`, 'success');
    return true;
  };

  const returnAndComplete = (
    bookingId: string, 
    finalCondition: ResourceCondition, 
    finalPhotos: string[] = [], 
    incidentDescription?: string
  ) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return false;

    const returnedFormatted = new Date().toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const isDamaged = finalCondition === 'Damaged' || finalCondition === 'Missing';

    // Update booking
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'Returned',
          checkOutDate: new Date().toISOString(),
          returnedAtFormatted: returnedFormatted,
          finalCondition,
          finalPhotos: finalPhotos.length > 0 ? finalPhotos : [booking.resourceImageUrl]
        };
      }
      return b;
    }));

    // Update resource state
    setResources(prev => prev.map(r => {
      if (r.id === booking.resourceId) {
        return {
          ...r,
          availability: isDamaged ? 'Maintenance' : 'Available',
          condition: finalCondition
        };
      }
      return r;
    }));

    // If damaged or incident reported
    if (isDamaged || incidentDescription) {
      const newDmg: DamageReport = {
        id: `DMG-${Date.now().toString().slice(-4)}`,
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
        reportedByUserId: currentUser.id,
        reportedByUserName: currentUser.name,
        reportedRole: currentUser.role,
        reportedDate: new Date().toISOString(),
        conditionSeverity: finalCondition === 'Missing' ? 'Missing Equipment' : 'Moderate',
        description: incidentDescription || `Condition changed from ${booking.initialCondition || 'Good'} to ${finalCondition} upon return.`,
        photoUrls: finalPhotos.length > 0 ? finalPhotos : [booking.resourceImageUrl],
        status: 'Open',
        aiSummary: `Return inspection detected condition change to ${finalCondition}. Requires owner evaluation.`
      };
      setDamageReports(prev => [newDmg, ...prev]);
    }

    addAuditRecord(
      'EQUIPMENT_RETURNED_QR',
      `Verified QR Return for ${booking.resourceName}. Final Condition: ${finalCondition}. Returned by student: ${booking.userName} (Stu ID: ${booking.studentId || 'STU-2024-819'}, Phone: ${booking.userPhone || '+1 (555) 234-5678'}). Returned At: ${returnedFormatted}.`,
      'CHECKOUT',
      booking.resourceId,
      booking.resourceName
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Equipment Returned Successfully ✅',
      message: `Thank you for returning ${booking.resourceName}. Your account trust score has been updated.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'return',
      linkTab: 'bookings'
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}

    showToast(`Return complete! ${booking.resourceName} is now marked Available.`, 'success');
    return true;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    }));

    const b = bookings.find(item => item.id === bookingId);
    if (b) {
      addAuditRecord('BOOKING_CANCELLED', `Booking ${bookingId} cancelled by ${currentUser.name}.`, 'BOOKING', b.resourceId, b.resourceName);
      showToast('Booking cancelled.', 'info');
    }
  };

  const requestExtension = (bookingId: string, hours: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          extensionRequestedHours: hours,
          extensionStatus: 'Pending'
        };
      }
      return b;
    }));
    showToast(`Extension request for +${hours} hours submitted for review.`, 'info');
    addAuditRecord('BOOKING_EXTENSION_REQUEST', `Requested ${hours}h extension on booking ${bookingId}`, 'BOOKING');
  };

  const createResource = (newRes: Partial<Resource>): Resource => {
    const generatedId = newRes.id?.trim() || `RES-${Math.floor(100 + Math.random() * 900)}`;
    const resource: Resource = {
      id: generatedId,
      name: newRes.name || 'New Resource',
      category: newRes.category || 'Laptops & Computers',
      description: newRes.description || '',
      imageUrl: newRes.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      location: newRes.location || 'Campus Facilities',
      department: newRes.department || currentUser.department,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerRole: currentUser.role === 'owner' ? 'Resource Director' : 'Campus Administrator',
      condition: newRes.condition || 'Good',
      availability: newRes.availability || 'Available',
      usageInstructions: newRes.usageInstructions || 'Follow standard campus equipment usage guidelines.',
      eligibilityRequirements: newRes.eligibilityRequirements || 'Enrolled campus students and staff.',
      requiresSpecialApproval: newRes.requiresSpecialApproval || false,
      securityDeposit: newRes.securityDeposit || 0,
      maxBookingDurationHours: newRes.maxBookingDurationHours || 24,
      specifications: newRes.specifications || {},
      bookingRules: newRes.bookingRules || ['Mandatory QR scan before checkout'],
      createdAt: new Date().toISOString(),
      totalBookingsCount: 0,
      qrCodeData: `CAMPUSSHARE:RESOURCE:${generatedId}:${(newRes.name || 'RESOURCE').replace(/\s+/g, '_').toUpperCase()}`
    };

    setResources(prev => [resource, ...prev]);
    addAuditRecord(
      'RESOURCE_CREATED',
      `Registered resource ${resource.name} (${resource.id}) with QR data ${resource.qrCodeData}`,
      'RESOURCE',
      resource.id,
      resource.name
    );
    showToast(`Resource ${resource.name} (${resource.id}) registered successfully!`, 'success');
    return resource;
  };

  const updateResource = (id: string, updated: Partial<Resource>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    addAuditRecord('RESOURCE_UPDATED', `Updated resource properties for ID ${id}`, 'RESOURCE', id);
    showToast(`Resource updated.`, 'info');
  };

  const deleteResource = (id: string) => {
    const res = resources.find(r => r.id === id);
    setResources(prev => prev.filter(r => r.id !== id));
    addAuditRecord('RESOURCE_DELETED', `Deleted resource ${res?.name || id}`, 'RESOURCE', id, res?.name);
    showToast(`Resource removed from inventory.`, 'info');
  };

  const fileDamageReport = (reportData: Omit<DamageReport, 'id' | 'reportedDate' | 'status'>) => {
    const id = `DMG-${Date.now().toString().slice(-4)}`;
    const newReport: DamageReport = {
      ...reportData,
      id,
      reportedDate: new Date().toISOString(),
      status: 'Open'
    };
    setDamageReports(prev => [newReport, ...prev]);
    
    // Also notify admins & owner
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'usr_adm_1',
      title: '⚠️ Incident / Damage Reported',
      message: `${reportData.reportedByUserName} reported condition issue on ${reportData.resourceName}: ${reportData.description.slice(0, 60)}...`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'damage',
      linkTab: 'incidents'
    };
    setNotifications(prev => [notif, ...prev]);

    addAuditRecord(
      'DAMAGE_REPORTED',
      `Damage report ${id} logged for ${reportData.resourceName} (${reportData.conditionSeverity})`,
      'INCIDENT',
      reportData.resourceId,
      reportData.resourceName
    );
    showToast('Damage report filed successfully. Lab operations team notified.', 'info');
  };

  const resolveDamageReport = (id: string, notes: string) => {
    setDamageReports(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: 'Resolved',
          actionTaken: notes
        };
      }
      return d;
    }));
    addAuditRecord('DAMAGE_RESOLVED', `Resolved incident ${id}. Notes: ${notes}`, 'INCIDENT');
    showToast(`Incident marked as resolved.`, 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetDemoData = () => {
    localStorage.removeItem('campusshare_resources');
    localStorage.removeItem('campusshare_bookings');
    localStorage.removeItem('campusshare_damageReports');
    localStorage.removeItem('campusshare_notifications');
    localStorage.removeItem('campusshare_auditLogs');
    setResources(INITIAL_RESOURCES);
    setBookings(INITIAL_BOOKINGS);
    setDamageReports(INITIAL_DAMAGE_REPORTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    showToast('Demo data reset to original state!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        resources,
        bookings,
        damageReports,
        notifications,
        auditLogs,
        currentTab,
        searchFilter,
        selectedCategoryFilter,
        selectedResourceForModal,
        isQrScannerOpen,
        activeDemoTourStep,
        toastMessage,
        setCurrentTab,
        setSearchFilter,
        setSelectedCategoryFilter,
        setSelectedResourceForModal,
        setIsQrScannerOpen,
        setActiveDemoTourStep,
        switchUser,
        showToast,
        dismissToast,
        createBooking,
        approveBooking,
        rejectBooking,
        checkInAndIssue,
        returnAndComplete,
        cancelBooking,
        requestExtension,
        createResource,
        updateResource,
        deleteResource,
        fileDamageReport,
        resolveDamageReport,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        addAuditRecord
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
