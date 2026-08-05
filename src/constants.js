/**
 * Global Constants for Industrial Worker Safety & Compensation Platform
 */

const ROLES = {
  WORKER: 'Worker',
  FACTORY_ADMIN: 'Factory Admin',
  GOVERNMENT_OFFICER: 'Government Officer',
  SUPER_ADMIN: 'Super Admin'
};

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
  ACCIDENT_SEVERITY,
  CLAIM_STATUS,
  COMPLAINT_TYPE,
  COMPLAINT_STATUS
};
