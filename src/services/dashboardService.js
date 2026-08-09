const Worker = require('../models/workerModel');
const Accident = require('../models/accidentModel');
const Claim = require('../models/claimModel');
const Complaint = require('../models/complaintModel');
const Hospital = require('../models/hospitalModel');
const { CLAIM_STATUS, COMPLAINT_STATUS } = require('../constants');

class DashboardService {
  /**
   * Get personalized dashboard data for Worker
   * @param {Object} user - Authenticated worker user
   */
  async getWorkerDashboard(user) {
    const userId = user._id;

    // Get linked worker profile if available
    const workerProfile = await Worker.findOne({
      $or: [{ email: user.email }, { user: userId }]
    });

    // Recent accident reports filed by worker
    const recentReports = await Accident.find({ reportedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent claims submitted by worker
    const recentClaims = await Claim.find({ submittedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent safety complaints filed by worker
    const recentComplaints = await Complaint.find({ reportedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Summary counts for worker
    const totalAccidentsReported = await Accident.countDocuments({ reportedBy: userId });
    const totalClaimsSubmitted = await Claim.countDocuments({ submittedBy: userId });
    
    const pendingClaims = await Claim.countDocuments({
  submittedBy: userId,
  status: {
    $in: [
      CLAIM_STATUS.SUBMITTED,
      CLAIM_STATUS.UNDER_REVIEW
    ]
  }
});

    const totalComplaintsFiled = await Complaint.countDocuments({ reportedBy: userId });
    const resolvedComplaints = await Complaint.countDocuments({
      reportedBy: userId,
      status: COMPLAINT_STATUS.RESOLVED
    });

    return {
      profile: workerProfile || {
        name: user.name,
        email: user.email,
        role: user.role
      },
      summary: {
        totalAccidentsReported,
        totalClaimsSubmitted,
        pendingClaims,
        totalComplaintsFiled,
        resolvedComplaints
      },
      recentReports,
      recentClaims,
      recentComplaints
    };
  }

  /**
   * Get comprehensive dashboard metrics for Factory Admin, Govt Officer, and Super Admin
   */
  async getAdminDashboard() {
    // 1. Total counts
    const totalWorkers = await Worker.countDocuments();
    const totalHospitals = await Hospital.countDocuments({ isActive: true });

    // 2. Accident Report Statistics
    const totalAccidents = await Accident.countDocuments();
    const accidentsBySeverity = await Accident.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    const accidentsByStatus = await Accident.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 3. Compensation Claim Statistics
    const totalClaims = await Claim.countDocuments();
    const claimsByStatus = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const claimFinancials = await Claim.aggregate([
      {
        $group: {
          _id: null,
          totalClaimed: { $sum: '$claimAmount' },
          totalApproved: { $sum: '$approvedAmount' }
        }
      }
    ]);

    // 4. Safety Complaint Statistics
    const totalComplaints = await Complaint.countDocuments();
    const complaintsByType = await Complaint.aggregate([
      { $group: { _id: '$complaintType', count: { $sum: 1 } } }
    ]);
    const complaintsByStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 5. Actionable Lists
    const recentAccidentReports = await Accident.find()
      .populate('reportedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentClaimsList = await Claim.find()
    .populate('submittedBy', 'name email phone')
    .populate('worker', 'name employeeId factoryName')
    .sort({ createdAt: -1 })
    .limit(5);

    const recentComplaintsList = await Complaint.find()
  .populate('reportedBy', 'name email')
  .populate('assignedTo', 'name email')
  .sort({ createdAt: -1 })
  .limit(5);

    return {
  overview: {
    totalWorkers,
    totalHospitals,
    totalAccidents,
    totalClaims,
    totalComplaints
  },

  accidentStats: {
    total: totalAccidents,
    bySeverity: accidentsBySeverity,
    byStatus: accidentsByStatus
  },

  claimStats: {
    total: totalClaims,
    byStatus: claimsByStatus,
    financials: claimFinancials[0] || { totalClaimed: 0, totalApproved: 0 }
  },

  complaintStats: {
    total: totalComplaints,
    byType: complaintsByType,
    byStatus: complaintsByStatus
  },

  recentAccidentReports,
  recentClaimsList,
  recentComplaintsList
};
  }

  /**
   * Get high-level summary statistics
   */
  async getSystemStats() {
    const [workers, accidents, claims, complaints, hospitals] = await Promise.all([
      Worker.countDocuments(),
      Accident.countDocuments(),
      Claim.countDocuments(),
      Complaint.countDocuments(),
      Hospital.countDocuments({ isActive: true })
    ]);

    return {
      workers,
      accidents,
      claims,
      complaints,
      hospitals
    };
  }
}

module.exports = new DashboardService();
