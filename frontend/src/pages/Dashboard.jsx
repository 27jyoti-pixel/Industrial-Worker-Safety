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
  PlusCircle,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import workerHeroBackground from '../assets/worker-dashboard-hero-background.png';

const WorkerDashboard = ({ user, kpis, recentAccidents, recentClaims, recentComplaints }) => {
  const [activityFilter, setActivityFilter] = useState('All');
  const metrics = kpis.map((metric, index) => ({
    ...metric,
    label: ['Accident reports', 'Compensation claims', 'Pending claims', 'Safety complaints'][index],
    emptyText: ['No reports yet', 'No claims submitted', 'Nothing awaiting review', 'No complaints yet'][index],
    path: ['/accidents', '/claims', '/claims', '/complaints'][index],
    action: ['Report an accident', 'Submit a claim', 'View pending', 'File a complaint'][index],
  }));

  const activityRecords = [
    ...(recentAccidents || []).map((record) => ({
      id: `accident-${record._id}`,
      type: 'Accidents',
      title: record.title || 'Accident report',
      detail: record.factory,
      date: record.date || record.createdAt || record.updatedAt,
      status: record.status || record.severity,
    })),
    ...(recentClaims || []).map((record) => ({
      id: `claim-${record._id}`,
      type: 'Claims',
      title: record.claimNumber || 'Claim request',
      detail: record.claimAmount == null ? null : `Amount: ₹${(record.claimAmount || 0).toLocaleString('en-IN')}`,
      date: record.date || record.createdAt || record.updatedAt,
      status: record.status,
    })),
    ...(recentComplaints || []).map((record) => ({
      id: `complaint-${record._id}`,
      type: 'Complaints',
      title: record.title || record.complaintType || 'Safety complaint',
      detail: record.complaintType || record.description,
      date: record.date || record.createdAt || record.updatedAt,
      status: record.status,
    })),
  ].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));

  const visibleActivity = activityFilter === 'All'
    ? activityRecords
    : activityRecords.filter((record) => record.type === activityFilter);
  const filters = ['All', 'Accidents', 'Claims', 'Complaints'];
  const emptyCopy = activityFilter === 'All'
    ? ['No recent activity', 'Your reported incidents, claims and concerns will appear here.', '/accidents', 'Take an action']
    : ({
        Accidents: ['No accident reports yet', 'Your reported incidents will appear here.', '/accidents', 'Report an accident'],
        Claims: ['No claims submitted', 'Your compensation claims will appear here.', '/claims', 'Submit a claim'],
        Complaints: ['No complaints yet', 'Your reported concerns will appear here.', '/complaints', 'File a complaint'],
      })[activityFilter];

  return (
    <div className="worker-dashboard space-y-8">
      <header
        className="relative isolate -mx-4 -mt-4 min-h-[278px] w-[calc(100%+2rem)] overflow-hidden sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]"
        style={{ backgroundColor: '#F7F8F8' }}
      >
        <style>{`
          .dashboard-hero-art {
            background-size: auto 100%;
            background-position: right center;
            background-repeat: no-repeat;
          }
          .worker-dashboard button.midc-primary-cta {
            background-color: #111111 !important;
            color: #ffffff !important;
            box-shadow: none !important;
          }
          .worker-dashboard button.midc-primary-cta:hover:not(:disabled) {
            background-color: #2b2b2b !important;
          }
          @media (max-width: 639px) {
            .dashboard-hero-art { background-position: 15% center; }
          }
        `}</style>
        <div
          aria-hidden="true"
          className="dashboard-hero-art absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${workerHeroBackground})`,
          }}
        />
          <div className="relative z-10 flex min-h-[278px] items-center px-4 py-7 sm:px-6 lg:px-8 lg:py-3">
          <div className="w-full max-w-[740px] lg:w-[52%]">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-[.12em] text-[#777]">Worker workspace</p>
              <h1 className="!mb-0 !text-[30px] !font-semibold !leading-[1.05] !tracking-[-.035em] !text-[#111] sm:!text-[42px] md:!text-[44px] lg:!text-[44px] xl:!text-[46px]">
              Welcome back, {user?.name || 'Worker'}
            </h1>
              <p className="mt-2 text-base font-medium text-[#555] sm:text-[17px] lg:text-[18px]">
              {user?.factoryName ? `${user.factoryName} · ` : ''}Your safety, our priority.
            </p>
              <p className="mt-2 max-w-[560px] text-base leading-[1.5] text-[#6b6b6b]">
              Report incidents, track your claims, raise concerns and access support — all in one place.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/accidents" className="inline-flex h-[50px] w-[228px] max-w-full items-center justify-between gap-3 rounded-md bg-[#111] px-4 text-[13px] font-semibold text-white hover:bg-[#292929]">
                <span className="inline-flex items-center gap-3"><PlusCircle className="h-[17px] w-[17px]" /> Report accident</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/claims" className="inline-flex h-[50px] w-[220px] max-w-full items-center justify-between gap-3 rounded-md border border-[#dedede] bg-white px-4 text-[13px] font-semibold text-[#222] hover:bg-[#fafafa]">
                <span className="inline-flex items-center gap-3"><FileCheck2 className="h-[17px] w-[17px]" /> Submit claim</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/complaints" className="inline-flex h-[50px] w-[230px] max-w-full items-center justify-between gap-3 rounded-md border border-[#dedede] bg-white px-4 text-[13px] font-semibold text-[#222] hover:bg-[#fafafa]">
                <span className="inline-flex items-center gap-3"><AlertOctagon className="h-[17px] w-[17px]" /> File complaint</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <p className="sr-only">A safer workplace today, a stronger tomorrow.</p>
      </header>

      <section aria-labelledby="worker-safety-overview" className="relative left-1/2 w-[calc(100vw-2rem)] -translate-x-1/2 space-y-3 sm:w-[calc(100vw-3rem)] lg:w-[calc(100vw-4rem)]">
        <div className="px-3 sm:px-5">
          <h2 id="worker-safety-overview" className="text-[18px] font-semibold tracking-[-.02em] text-[#111]">Your safety overview</h2>
          <p className="mt-1 text-xs text-[#777]">A snapshot of your reports, claims and concerns.</p>
        </div>
        <div className="grid grid-cols-1 border-y border-[#e6e6e6] bg-white sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, emptyText, path, action }) => (
            <div key={label} className="flex min-h-[126px] items-start gap-3 px-3 py-4 sm:px-5">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff4ed] text-[#E87532]">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#222]">{label}</p>
                <p className="mt-1 text-[25px] font-semibold leading-none tracking-[-.04em] text-[#111]">{value}</p>
                <p className="mt-2 text-xs text-[#777]">{Number(value) === 0 ? emptyText : (
                  label === 'Accident reports' ? `${value} report${Number(value) === 1 ? '' : 's'} on record`
                    : label === 'Compensation claims' ? `${value} claim${Number(value) === 1 ? '' : 's'} submitted`
                      : label === 'Pending claims' ? `${value} awaiting review`
                        : `${value} complaint${Number(value) === 1 ? '' : 's'} filed`
                )}</p>
                <Link to={path} className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#D9672A] hover:text-[#111]">
                  {action} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]" aria-label="Recent activity and next steps">
        <div className="min-w-0 rounded-lg border border-[#e7e7e7] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-.02em] text-[#111]">Recent activity</h2>
              <p className="mt-1 text-xs text-[#777]">Your latest reports, claims and complaints.</p>
            </div>
          </div>

          <div className="mt-4 flex gap-1 overflow-x-auto border-b border-[#e8e8e8]" role="group" aria-label="Filter recent activity">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={activityFilter === filter}
                onClick={() => setActivityFilter(filter)}
                className={`relative min-h-9 shrink-0 px-3 text-xs font-medium ${activityFilter === filter ? 'text-[#111] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#E87532]' : 'text-[#666] hover:text-[#111]'}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {visibleActivity.length ? (
            <div className="divide-y divide-[#ededed]">
              {visibleActivity.slice(0, 6).map((activity) => (
                <div key={activity.id} className="flex min-h-[62px] items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f5f5f5] text-[#666]">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#222]">{activity.title}</p>
                      <p className="mt-1 truncate text-[11px] text-[#777]">{[activity.type, activity.detail, activity.date ? new Date(activity.date).toLocaleDateString() : null].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  {activity.status && <span className="shrink-0 rounded bg-[#f5f5f5] px-2 py-1 text-[10px] text-[#555]">{activity.status}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[190px] flex-col items-center justify-center px-3 py-7 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3] text-[#777]">
                <FileText className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-[14px] font-semibold text-[#222]">{emptyCopy[0]}</h3>
              <p className="mt-1 max-w-sm text-xs leading-5 text-[#777]">{emptyCopy[1]}</p>
              <Link to={emptyCopy[2]} className="mt-3 inline-flex h-9 items-center gap-2 rounded-md border border-[#E87532] px-3 text-xs font-medium text-[#B9501D] hover:bg-[#fff7f2]">
                {emptyCopy[3]} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        <aside className="min-w-0 rounded-lg border border-[#f0e4dc] bg-[#fffaf7] p-4 sm:p-5">
          <h2 className="text-[17px] font-semibold tracking-[-.02em] text-[#111]">Need to take action?</h2>
          <p className="mt-1 text-xs text-[#777]">Choose what you want to do.</p>
          <div className="mt-3 divide-y divide-[#efe4dd]">
            {[
              { label: 'Report an accident', detail: 'Report a workplace incident.', path: '/accidents', icon: AlertTriangle },
              { label: 'Submit a claim', detail: 'Apply for compensation.', path: '/claims', icon: FileCheck2 },
              { label: 'File a complaint', detail: 'Report a safety concern or hazard.', path: '/complaints', icon: AlertOctagon },
            ].map(({ label, detail, path, icon: Icon }) => (
              <Link key={path} to={path} className="group flex min-h-[76px] items-center gap-3 py-3 no-underline">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#E87532]">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-[#222] group-hover:text-[#B9501D]">{label}</span>
                  <span className="mt-1 block text-[11px] text-[#777]">{detail}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#888]" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

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

  if (isWorker) {
    return (
      <WorkerDashboard
        user={user}
        kpis={kpis}
        recentAccidents={recentAccidents}
        recentClaims={recentClaims}
        recentComplaints={recentComplaints}
      />
    );
  }

  return (
    <div className="space-y-5 dashboard-motion">

      <style>{`
        .dashboard-motion button.midc-primary-cta {
          background-color: #111111 !important;
          color: #ffffff !important;
          box-shadow: none !important;
        }
        .dashboard-motion button.midc-primary-cta:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
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
              className="!border-[#dedede] !bg-white !text-[#111] hover:!bg-[#f8f8f8]"
            >
              Report Accident
            </Button>
          </Link>

          <Link to="/claims">
            <Button
              variant="outline"
              size="sm"
              icon={FileCheck2}
              className="!border-[#dedede] !bg-white !text-[#111] hover:!bg-[#f8f8f8]"
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
