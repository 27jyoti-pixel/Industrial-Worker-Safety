import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import {
  Users,
  AlertTriangle,
  FileCheck2,
  AlertOctagon,
  Building2,
  PlusCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user, isWorker, isAdminOrOfficer } = useAuth();
  const [stats, setStats] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch platform high-level stats
      const sysStats = await dashboardService.getSystemStats();
      setStats(sysStats.data || sysStats);

      // Fetch role specific metrics
      if (isWorker) {
        const workerDash = await dashboardService.getWorkerDashboard();
        setDashboardData(workerDash.data || workerDash);
      } else {
        const adminDash = await dashboardService.getAdminDashboard();
        setDashboardData(adminDash.data || adminDash);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullPage text="Loading dashboard metrics and activity..." />;
  }

  const recentAccidents = isWorker
  ? dashboardData?.recentReports
  : dashboardData?.recentAccidentReports;

  const recentClaims = isWorker
  ? dashboardData?.recentClaims
  : dashboardData?.recentClaimsList;

  const kpis = isWorker
? [
    {
      title: 'My Accident Reports',
      value: dashboardData?.summary?.totalAccidentsReported ?? 0,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'My Compensation Claims',
      value: dashboardData?.summary?.totalClaimsSubmitted ?? 0,
      icon: FileCheck2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Pending Claims',
      value: dashboardData?.summary?.pendingClaims ?? 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: 'My Safety Complaints',
      value: dashboardData?.summary?.totalComplaintsFiled ?? 0,
      icon: AlertOctagon,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    }
  ]
: [
    {
      title: 'Total Active Workers',
      value: stats?.workers ?? 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: 'Accident Reports',
      value: stats?.accidents ?? 0,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      title: 'Compensation Claims',
      value: stats?.claims ?? 0,
      icon: FileCheck2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: 'Safety Complaints',
      value: stats?.complaints ?? 0,
      icon: AlertOctagon,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    }
];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            {user?.role} Access Mode
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {user?.factoryName ? `Factory: ${user.factoryName}` : 'Industrial Safety Monitoring Dashboard'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/accidents">
            <Button variant="outline" size="sm" icon={PlusCircle}>
              Report Accident
            </Button>
          </Link>
          <Link to="/claims">
            <Button variant="outline" size="sm" icon={FileCheck2}>
              Submit Claim
            </Button>
          </Link>
          <Link to="/complaints">
            <Button variant="primary" size="sm" icon={AlertOctagon}>
              File Complaint
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-xl border ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Accident Reports Card */}
        <Card
          title="Recent Workplace Accidents"
          subtitle="Latest safety incident logs"
          action={
            <Link to="/accidents" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {recentAccidents && recentAccidents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentAccidents.slice(0, 4).map((acc) => (
                <div key={acc._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{acc.title}</p>
                    <p className="text-xs text-slate-500">
                      {acc.factory} &bull; {new Date(acc.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={acc.severity} />
                    <StatusBadge status={acc.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Recent Accidents"
              description="No workplace accident reports registered recently."
            />
          )}
        </Card>

        {/* Recent Claims Card */}
        <Card
          title="Compensation Claims"
          subtitle="Submitted and under-review claims"
          action={
            <Link to="/claims" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {recentClaims && recentClaims.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentClaims.slice(0, 4).map((claim) => (
                <div key={claim._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{claim.claimNumber || 'Claim Request'}</p>
                    <p className="text-xs text-slate-500">
                      Amount: ₹{(claim.claimAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <StatusBadge status={claim.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Compensation Claims"
              description="No compensation claims logged yet."
            />
          )}
        </Card>
      </div>

      {/* Safety Complaints Overview */}
      <Card
        title="Safety Hazards & Complaints"
        subtitle="Reported machine faults, gas leaks, and electrical risks"
        action={
          <Link to="/complaints" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {dashboardData?.recentComplaintsList && dashboardData.recentComplaintsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.recentComplaintsList.slice(0, 3).map((comp) => (
              <div key={comp._id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {comp.complaintType}
                  </span>
                  <StatusBadge status={comp.status} />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{comp.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Active Complaints"
            description="All safety complaints resolved or none submitted."
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
