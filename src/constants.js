/**
 * Global Constants for Industrial Worker Safety & Compensation Platform
 */

const ROLES = {
  WORKER: 'Worker',
  FACTORY_ADMIN: 'Factory Admin',
  GOVERNMENT_OFFICER: 'Government Officer',
  SUPER_ADMIN: 'Super Admin'
};

const PROFILE_AVATAR_IDS = [
  'worker-01',
  'worker-02',
  'worker-03',
  'worker-04',
  'worker-05',
  'worker-06',
  'worker-07',
  'worker-08',
  'field-worker-male',
  'field-worker-female',
  'plant-operator-male',
  'plant-operator-female',
  'safety-inspector-male',
  'safety-inspector-female',
  'safety-officer-male',
  'safety-officer-female',
  'maintenance-technician-male',
  'maintenance-technician-female',
  'plant-technician-male',
  'plant-technician-female',
  'engineer-male',
  'engineer-female',
  'process-engineer-male',
  'process-engineer-female',
  'supervisor-male',
  'supervisor-female',
  'manager-male',
  'manager-female',
  'office-staff-male',
  'office-staff-female',
  'logistics-worker-male',
  'logistics-worker-female'
];

const ACCIDENT_SEVERITY = {
  MINOR: 'Minor',
  MODERATE: 'Moderate',
  SEVERE: 'Severe',
  CRITICAL: 'Critical',
  FATAL: 'Fatal'
};

const CLAIM_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed'
};

const COMPLAINT_TYPE = {
  GAS_LEAK: 'Gas Leak',
  BROKEN_EQUIPMENT: 'Broken Equipment',
  UNSAFE_MACHINERY: 'Unsafe Machinery',
  ELECTRICAL_HAZARD: 'Electrical Hazard',
  FIRE_HAZARD: 'Fire Hazard',
  OTHER: 'Other'
};

const COMPLAINT_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected'
};

module.exports = {
  ROLES,
  PROFILE_AVATAR_IDS,
  ACCIDENT_SEVERITY,
  CLAIM_STATUS,
  COMPLAINT_TYPE,
  COMPLAINT_STATUS
};
