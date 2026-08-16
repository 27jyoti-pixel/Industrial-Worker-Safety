import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import {
  Users,
  AlertTriangle,
  FileCheck2,
  AlertOctagon,
  Clock,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user, isWorker } = useAuth();
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
        console.log("WORKER DASHBOARD DATA:", workerDash);
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

  const recentComplaints = isWorker
    ? dashboardData?.recentComplaints
    : dashboardData?.recentComplaintsList;

  const kpis = isWorker
    ? [
        {
          title: 'My Accident Reports',
          value: dashboardData?.summary?.totalAccidentsReported ?? 0,
          icon: AlertTriangle,
          color: 'bg-[#FDEEEF] text-[#E63946] border-[#F3B8BD]'
        },
        {
          title: 'My Compensation Claims',
          value: dashboardData?.summary?.totalClaimsSubmitted ?? 0,
          icon: FileCheck2,
          color: 'bg-[#E8F5F2] text-[#2A9D8F] border-[#B9E1D9]'
        },
        {
          title: 'Pending Claims',
          value: dashboardData?.summary?.pendingClaims ?? 0,
          icon: Clock,
          color: 'bg-[#FAF3DE] text-[#9A7A28] border-[#E9C46A]'
        },
        {
          title: 'My Safety Complaints',
          value: dashboardData?.summary?.totalComplaintsFiled ?? 0,
          icon: AlertOctagon,
          color: 'bg-[#EEF2F0] text-[#3E5C54] border-[#D6E2DD]'
        }
      ]
    : [
        {
          title: 'Total Active Workers',
          value: stats?.workers ?? 0,
          icon: Users,
          color: 'bg-[#E8E5EF] text-[#5B5260] border-[#E0E0E0]'
        },
        {
          title: 'Accident Reports',
          value: stats?.accidents ?? 0,
          icon: AlertTriangle,
          color: 'bg-[#FDEEEF] text-[#E63946] border-[#F3B8BD]'
        },
        {
          title: 'Compensation Claims',
          value: stats?.claims ?? 0,
          icon: FileCheck2,
          color: 'bg-[#E8F5F2] text-[#2A9D8F] border-[#B9E1D9]'
        },
        {
          title: 'Safety Complaints',
          value: stats?.complaints ?? 0,
          icon: AlertOctagon,
          color: 'bg-[#FAF3DE] text-[#9A7A28] border-[#E9C46A]'
        }
      ];

  return (
    <div className="space-y-5 dashboard-motion">

      <style>{`
        .dashboard-motion .dashboard-welcome,
        .dashboard-motion .dashboard-kpi,
        .dashboard-motion .dashboard-panel,
        .dashboard-motion .dashboard-complaint {
          animation: dashboardFadeUp .55s ease both;
        }

        .dashboard-motion .dashboard-kpi:nth-child(1) { animation-delay: 80ms; }
        .dashboard-motion .dashboard-kpi:nth-child(2) { animation-delay: 150ms; }
        .dashboard-motion .dashboard-kpi:nth-child(3) { animation-delay: 220ms; }
        .dashboard-motion .dashboard-kpi:nth-child(4) { animation-delay: 290ms; }

        .dashboard-motion .dashboard-panel:nth-child(2) { animation-delay: 140ms; }
        .dashboard-motion .dashboard-complaint { animation-delay: 220ms; }

        .dashboard-motion .dashboard-kpi {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }

        .dashboard-motion .dashboard-kpi:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 30px rgba(30, 30, 30, .08);
          border-color: rgba(62, 92, 84, .24);
        }

        .dashboard-motion .dashboard-kpi > div:last-child {
          transition: transform .28s ease;
        }

        .dashboard-motion .dashboard-kpi:hover > div:last-child {
          transform: scale(1.08) rotate(-3deg);
        }

        .dashboard-motion .dashboard-welcome {
          transition: box-shadow .3s ease, border-color .3s ease;
        }

        .dashboard-motion .dashboard-welcome:hover {
          box-shadow: 0 12px 28px rgba(30, 30, 30, .07);
          border-color: rgba(62, 92, 84, .22);
        }

        .dashboard-motion .dashboard-panel,
        .dashboard-motion .dashboard-complaint {
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .dashboard-motion .dashboard-panel:hover,
        .dashboard-motion .dashboard-complaint:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(30, 30, 30, .07);
        }

        .dashboard-motion .dashboard-list-item {
          transition: transform .22s ease, background-color .22s ease;
        }

        .dashboard-motion .dashboard-list-item:hover {
          transform: translateX(4px);
          background-color: #F7F9F8;
        }

        .dashboard-motion .dashboard-complaint-item {
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .dashboard-motion .dashboard-complaint-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(30, 30, 30, .07);
          border-color: rgba(62, 92, 84, .22);
        }

        .dashboard-motion a {
          transition: color .2s ease, transform .2s ease;
        }

        .dashboard-motion a:hover svg {
          transform: translateX(3px);
        }

        .dashboard-motion a svg {
          transition: transform .2s ease;
        }

        @keyframes dashboardFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-motion *,
          .dashboard-motion *::before,
          .dashboard-motion *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
`}</style>

      {/* Welcome Banner */}
      <section className="dashboard-welcome bg-white rounded-2xl border border-[#E0E0E0] p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-sm">

        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EEF2F0] border border-[#D6E2DD] text-[#3E5C54] text-[11px] font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EEF2F0]0"></span>
            {user?.role} Access
          </div>

          <h1 className="text-[30px] sm:text-[32px] font-semibold text-[#1E1E1E]" style={{ letterSpacing: '0em' }}>
            Welcome back , {user?.name}
          </h1>

          <p className="text-sm text-[#6C757D] mt-1.5">
            {user?.factoryName
              ? `Factory: ${user.factoryName}`
              : 'Industrial Safety Monitoring Dashboard'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/accidents">
            <Button
              variant="outline"
              size="sm"
              icon={PlusCircle}
            >
              Report Accident
            </Button>
          </Link>

          <Link to="/claims">
            <Button
              variant="outline"
              size="sm"
              icon={FileCheck2}
            >
              Submit Claim
            </Button>
          </Link>

          <Link to="/complaints">
            <Button
              variant="primary"
              size="sm"
              icon={AlertOctagon}
            >
              File Complaint
            </Button>
          </Link>
        </div>
      </section>


      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;

          return (
            <div
              key={index}
              className="dashboard-kpi bg-white p-5 rounded-2xl border border-[#E0E0E0] shadow-sm flex items-center justify-between"
            >
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#6C757D] uppercase tracking-[0.08em]">
                  {kpi.title}
                </p>

                <h3 className="text-2xl font-semibold text-[#1E1E1E] mt-1">
                  {kpi.value}
                </h3>
              </div>

              <div className={`p-3 rounded-xl border ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </section>


      {/* Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Accident Reports */}
        <Card
          className="dashboard-panel"
          title="Recent Workplace Accidents"
          subtitle="Latest safety incident logs"
          action={
            <Link
              to="/accidents"
              className="text-xs font-medium text-[#3E5C54] hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {recentAccidents && recentAccidents.length > 0 ? (
            <div className="divide-y divide-[#E0E0E0]">
              {recentAccidents.slice(0, 4).map((acc) => (
                <div
                  key={acc._id}
                  className="dashboard-list-item py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2F2F2F] truncate">
                      {acc.title}
                    </p>

                    <p className="text-xs text-[#6C757D] mt-0.5">
                      {acc.factory} &bull;{' '}
                      {new Date(acc.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
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


        {/* Recent Claims */}
        <Card
          className="dashboard-panel"
          title="Compensation Claims"
          subtitle="Submitted and under-review claims"
          action={
            <Link
              to="/claims"
              className="text-xs font-medium text-[#3E5C54] hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {recentClaims && recentClaims.length > 0 ? (
            <div className="divide-y divide-[#E0E0E0]">
              {recentClaims.slice(0, 4).map((claim) => (
                <div
                  key={claim._id}
                  className="dashboard-list-item py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2F2F2F] truncate">
                      {claim.claimNumber || 'Claim Request'}
                    </p>

                    <p className="text-xs text-[#6C757D] mt-0.5">
                      Amount: ₹
                      {(claim.claimAmount || 0).toLocaleString('en-IN')}
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
      </section>


      {/* Safety Complaints */}
      <Card
        className="dashboard-complaint"
        title="Safety Hazards & Complaints"
        subtitle="Reported machine faults, gas leaks, and electrical risks"
        action={
          <Link
            to="/complaints"
            className="text-xs font-medium text-[#3E5C54] hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {recentComplaints && recentComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentComplaints.slice(0, 3).map((comp) => (
              <div
                key={comp._id}
                className="dashboard-complaint-item p-4 rounded-xl border border-[#E0E0E0] bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-[#3E5C54] bg-[#EEF2F0] px-2 py-1 rounded border border-[#D6E2DD]">
                    {comp.complaintType}
                  </span>

                  <StatusBadge status={comp.status} />
                </div>

                <h4 className="text-sm font-medium text-[#2F2F2F] line-clamp-1">
                  {comp.title}
                </h4>

                <p className="text-xs text-[#6C757D] line-clamp-2">
                  {comp.description}
                </p>
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