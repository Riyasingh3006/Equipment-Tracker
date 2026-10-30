export type UserRole = 'student' | 'owner' | 'admin' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  studentOrStaffId: string;
  isVerified: boolean;
  trustScore: number; // 0 - 100
  phone?: string;
  reputationBadge?: 'Gold Member' | 'Verified Researcher' | 'Faculty Head' | 'Senior Tech';
}

export type ResourceCategory = 
  | 'Laptops & Computers'
  | 'Cameras & AV Equipment'
  | 'Projectors & Displays'
  | 'Laboratory Equipment'
  | '3D Printers & Fabrication'
  | 'Classrooms & Lecture Halls'
  | 'Seminar Halls & Auditoriums'
  | 'Meeting & Study Rooms'
  | 'Workshop Tools';

export type ResourceCondition = 'Excellent' | 'Good' | 'Fair' | 'Damaged' | 'Missing';

export type ResourceAvailability = 'Available' | 'In Use' | 'Reserved' | 'Maintenance' | 'Restricted';

export interface Resource {
  id: string; // e.g. "LAP101"
  name: string;
  category: ResourceCategory;
  description: string;
  imageUrl: string;
  galleryUrls?: string[];
  location: string;
  department: string;
  ownerId: string;
  ownerName: string;
  ownerRole: string;
  condition: ResourceCondition;
  availability: ResourceAvailability;
  usageInstructions: string;
  eligibilityRequirements: string;
  requiresSpecialApproval?: boolean;
  securityDeposit?: number; // In dollars/currency or 0
  maxBookingDurationHours: number;
  specifications: Record<string, string>;
  bookingRules: string[];
  createdAt: string;
  totalBookingsCount: number;
  qrCodeData?: string;
}

export type BookingStatus = 
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Waiting List'
  | 'Issued'
  | 'Returned'
  | 'Cancelled'
  | 'Overdue';

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  resourceImageUrl: string;
  userId: string;
  userName: string;
  studentId: string; // e.g. STU-2024-819
  userPhone?: string; // Student Contact Phone e.g. +1 (555) 234-5678
  userEmail: string;
  userDepartment?: string; // e.g. Computer Science & Engineering
  userRole: UserRole;
  ownerId: string;
  ownerName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  purpose: string;
  status: BookingStatus;
  requestDate: string;
  approvalDate?: string;
  checkInDate?: string; // ISO string when equipment was issued
  checkOutDate?: string; // ISO string when equipment was returned
  issuedAtFormatted?: string; // Human readable e.g. "Oct 29, 2026, 10:05 AM"
  returnedAtFormatted?: string; // Human readable e.g. "Oct 30, 2026, 04:30 PM"
  expectedDueFormatted?: string; // Human readable due time
  initialCondition?: ResourceCondition;
  finalCondition?: ResourceCondition;
  initialPhotos?: string[];
  finalPhotos?: string[];
  rejectionReason?: string;
  extensionRequestedHours?: number;
  extensionStatus?: 'None' | 'Pending' | 'Approved' | 'Rejected';
  waitingListPosition?: number;
  notes?: string;
  allocationReasonTag?: string;
}

export interface DamageReport {
  id: string;
  resourceId: string;
  resourceName: string;
  bookingId?: string;
  reportedByUserId: string;
  reportedByUserName: string;
  reportedRole: UserRole;
  reportedDate: string;
  conditionSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Missing Equipment';
  description: string;
  photoUrls: string[];
  status: 'Open' | 'Under Review' | 'Resolved' | 'Action Required';
  aiSummary?: string;
  actionTaken?: string;
  ownerInspectionNotes?: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // or 'all' or role
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'approval' | 'rejection' | 'return' | 'damage' | 'reminder' | 'system';
  linkTab?: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  resourceId?: string;
  resourceName?: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
  category: 'AUTH' | 'RESOURCE' | 'BOOKING' | 'CHECKIN' | 'CHECKOUT' | 'INCIDENT' | 'POLICY';
}

export interface AIRecommendationRequest {
  query: string;
  category?: string;
  durationHours?: number;
  urgency?: 'Low' | 'Medium' | 'High';
}

export interface AIMatchResult {
  resource: Resource;
  matchScore: number; // 0 - 100
  reasoning: string;
  recommendedSlot?: string;
  isImmediatelyAvailable: boolean;
}
