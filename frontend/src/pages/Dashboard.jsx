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
  Siren,
  Zap,
  UsersRound,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import workerHeroBackground from '../assets/worker-dashboard-hero-background.png';
import actionWorkerBackground from '../assets/dashboard-action-worker.png';
import EmergencyAlerts from '../components/EmergencyAlerts';

const activityStatusColors = {
  open: '#6B9B73',
  approved: '#2F5D50',
  resolved: '#2F5D50',
  completed: '#2F5D50',
  paid: '#2F5D50',
  active: '#2F5D50',
  submitted: '#E87532',
  reported: '#E87532',
  pending: '#C89A3C',
  minor: '#6B9B73',
  low: '#6B9B73',
  moderate: '#C89A3C',
  medium: '#C89A3C',
  high: '#A63D45',
  'in progress': '#C89A3C',
  in_progress: '#C89A3C',
  under_review: '#718096',
  'under review': '#718096',
  'under investigation': '#718096',
  under_investigation: '#718096',
  rejected: '#A63D45',
  critical: '#A63D45',
  severe: '#A63D45',
  fatal: '#A63D45',
  closed: '#5C6670',
  inactive: '#5C6670',
};

const buildTrendPath = (records, totalCount) => {
  const total = Number(totalCount);
  if (!Array.isArray(records) || records.length < 2 || records.length !== total) return null;

  const timestamps = [];
  for (const record of records) {
    const timestamp = [record.date, record.createdAt, record.updatedAt]
      .map((value) => Date.parse(value))
      .find(Number.isFinite);
    if (timestamp == null) return null;
    timestamps.push(timestamp);
  }

  const firstDate = new Date(Math.min(...timestamps));
  const lastDate = new Date(Math.max(...timestamps));
  const monthSpan = (lastDate.getFullYear() - firstDate.getFullYear()) * 12
    + lastDate.getMonth() - firstDate.getMonth() + 1;
  if (monthSpan < 2) return null;

  const bucketCount = Math.min(6, monthSpan);
  const bucketCounts = Array(bucketCount).fill(0);
  timestamps.forEach((timestamp) => {
    const date = new Date(timestamp);
    const monthIndex = (date.getFullYear() - firstDate.getFullYear()) * 12
      + date.getMonth() - firstDate.getMonth();
    const bucketIndex = Math.min(bucketCount - 1, Math.floor((monthIndex * bucketCount) / monthSpan));
    bucketCounts[bucketIndex] += 1;
  });

  const maximum = Math.max(...bucketCounts);
  const minimum = Math.min(...bucketCounts);
  const points = bucketCounts.map((count, index) => {
    const x = 2 + (index * 96) / (bucketCounts.length - 1);
    const y = maximum === minimum ? 22 : 38 - ((count - minimum) / (maximum - minimum)) * 30;
    return `${x},${y}`;
  });
  return `M ${points.join(' L ')}`;
};

const WorkerDashboard = ({ user, kpis, recentAccidents, recentClaims, recentComplaints, isWorker = true }) => {
  const [activityFilter, setActivityFilter] = useState('All');
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const metricPresentation = isWorker
    ? [
        { label: 'Accident reports', emptyText: 'No reports yet', path: '/accidents', action: 'Report an accident', iconColor: '#E87532' },
        { label: 'Compensation claims', emptyText: 'No claims submitted', path: '/claims', action: 'Submit a claim', iconColor: '#587A96' },
        { label: 'Pending claims', emptyText: 'Nothing awaiting review', path: '/claims', action: 'View pending', iconColor: '#C89A3C' },
        { label: 'Safety complaints', emptyText: 'No complaints yet', path: '/complaints', action: 'File a complaint', iconColor: '#C94A4A' },
      ]
    : [
        { label: kpis[0]?.title || 'Total Active Workers', emptyText: 'No workers yet', path: '/workers', action: 'View workers', iconColor: '#5B5260' },
        { label: kpis[1]?.title || 'Accident Reports', emptyText: 'No reports yet', path: '/accidents', action: 'View reports', iconColor: '#E87532' },
        { label: kpis[2]?.title || 'Compensation Claims', emptyText: 'No claims yet', path: '/claims', action: 'View claims', iconColor: '#587A96' },
        { label: kpis[3]?.title || 'Safety Complaints', emptyText: 'No complaints yet', path: '/complaints', action: 'View complaints', iconColor: '#C94A4A' },
      ];
  const metrics = kpis.map((metric, index) => ({
    ...metric,
    ...metricPresentation[index],
    trendPath: buildTrendPath(
      isWorker
        ? [recentAccidents, recentClaims, null, recentComplaints][index]
        : [null, recentAccidents, recentClaims, recentComplaints][index],
      metric.value,
    ),
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
  const emptyActivityMessage = ({
    All: 'No recent activity to display',
    Accidents: 'No accident reports to display',
    Claims: 'No claims to display',
    Complaints: 'No complaints to display',
  })[activityFilter];

  return (
    <div className="worker-dashboard space-y-6">
      <style>{`
        .worker-dashboard .dashboard-trend { width: 90px; height: 42px; }
        .worker-dashboard .dashboard-trend path { fill: none; stroke: #ff9b4a; stroke-width: 1.35; }
        .worker-dashboard .dashboard-hero-art { background-size: auto 100%; background-position: right center; background-repeat: no-repeat; }
        .worker-dashboard .dashboard-action-panel {
          background-image: linear-gradient(90deg, rgba(255,246,237,.96) 0%, rgba(255,235,216,.76) 49%, rgba(255,235,216,.02) 75%), url(${actionWorkerBackground});
          background-color: #fff0e6; background-size: 100% 100%, auto 100%; background-position: center, right center;
        }
        .worker-dashboard .dashboard-activity-records { scrollbar-width: none; -ms-overflow-style: none; }
        .worker-dashboard .dashboard-activity-records::-webkit-scrollbar { display: none; }
        @media (max-width: 639px) {
          .worker-dashboard .dashboard-hero-art { background-position: 15% center; }
          .worker-dashboard .dashboard-action-panel { background-image: linear-gradient(90deg, rgba(255,246,237,.96), rgba(255,239,225,.78)), url(${actionWorkerBackground}); background-size: 100% 100%, auto 100%; background-position: center, 72% center; }
        }
      `}</style>
      <header
        className="relative isolate -mx-4 -mt-4 min-h-[300px] w-[calc(100%+2rem)] overflow-hidden sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]"
        style={{ backgroundColor: '#F7F8F8' }}
      >
        <div
          aria-hidden="true"
          className="dashboard-hero-art absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${workerHeroBackground})`,
          }}
        />
          <div className="relative z-10 flex min-h-[300px] items-center px-4 py-7 sm:px-6 lg:px-8 lg:py-3">
          <div className="w-full max-w-[740px] lg:w-[52%]">
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-[.12em] text-[#777]">{isWorker ? 'Worker workspace' : `${user?.role || 'Safety'} workspace`}</p>
              <h1 className="!mb-0 !text-[30px] !font-semibold !leading-[1.08] !tracking-[-.035em] !text-[#111] sm:!text-[40px] md:!text-[42px] lg:!text-[42px] xl:!text-[42px]">
              Welcome back, {user?.name || 'Worker'}
            </h1>
              <p className="mt-2 text-base font-medium text-[#555] sm:text-[17px] lg:text-[18px]">
              {user?.factoryName ? `${user.factoryName} · ` : ''}{isWorker ? 'Your safety, our priority.' : 'Workplace safety, continuously monitored.'}
            </p>
              <p className="mt-2 max-w-[560px] text-[14px] leading-[1.5] text-[#6b6b6b] sm:text-[15px]">
              {isWorker
                ? 'Report incidents, track your claims, raise concerns and access support — all in one place.'
                : 'Monitor workers, review incidents, track claims and resolve safety concerns — all in one place.'}
            </p>
            <div className="mt-5">
              <button type="button" onClick={() => setEmergencyDialogOpen(true)} title="Send a critical emergency alert to your factory" className="group inline-flex h-[60px] w-[260px] max-w-full items-stretch overflow-hidden rounded-[9px] border border-[#ffb18d] bg-[#fff7f2] p-0 text-left text-[#171717] shadow-[0_2px_6px_rgba(159,55,25,.12)] transition-colors hover:bg-[#fff0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d83a16]">
                <span className="flex w-[60px] shrink-0 items-center justify-center bg-[#ef3b12] text-white transition-colors group-hover:bg-[#dc310e]">
                  <Siren className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4">
                  <span className="text-[16px] font-semibold">Emergency alert</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[#e63a13]" aria-hidden="true" />
                </span>
              </button>
              <p className="mt-2 text-xs text-[#6b6b6b]">For major safety threats requiring immediate emergency response.</p>
            </div>
          </div>
        </div>
      </header>

      <section aria-label="Emergency Alert System" className="grid overflow-hidden rounded-[11px] border border-[#ffb18d] bg-[#fff0e6] shadow-sm md:min-h-[136px] md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex items-center gap-4 px-5 py-4 sm:px-7 md:py-3">
          <span className="hidden h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full bg-[#ffded0] text-[#c82a10] sm:flex"><Siren className="h-9 w-9" /></span>
          <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9d2816]">Be prepared. Stay safe.</p><h2 className="mt-1 text-[22px] font-semibold leading-tight tracking-[-.03em] text-[#a72514]">Emergency Alert System</h2><p className="mt-1 max-w-[560px] text-[13px] leading-5 text-[#8b2d20]">Report any critical situation immediately to alert all workers and ensure a quick response.</p></div>
        </div>
        <div className="grid grid-cols-1 border-t border-[#ffc3a6] px-5 py-3 sm:grid-cols-3 sm:items-center md:border-l md:border-t-0">
          {[[Zap, 'Instant alerts', 'Notify everyone in real time'], [UsersRound, 'Quick evacuation', 'Ensure worker safety'], [ShieldCheck, 'Coordinated response', 'Get help immediately']].map(([Icon, title, detail]) => <div key={title} className="flex items-center gap-3 py-2 sm:py-0"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe0d1] text-[#bd2c17]"><Icon className="h-5 w-5" /></span><div><p className="text-[12px] font-semibold text-[#28201d]">{title}</p><p className="text-[11px] leading-4 text-[#777]">{detail}</p></div></div>)}
        </div>
      </section>

      <section aria-labelledby="worker-safety-overview" className="space-y-3">
        <div className="px-1">
          <h2 id="worker-safety-overview" className="text-[21px] font-semibold tracking-[-.02em] text-[#111]">{isWorker ? 'Your safety overview' : 'Platform safety overview'}</h2>
          <p className="mt-1 text-sm text-[#777]">{isWorker ? 'A snapshot of your reports, claims and concerns.' : 'A snapshot of workforce and safety activity across the platform.'}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, iconColor, emptyText, path, trendPath }, index) => (
            <div key={label} className="relative flex min-h-[144px] items-start gap-3 overflow-hidden rounded-[10px] border border-[#e6e6e6] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,.04)] sm:px-5">
              <span className="mt-0.5 flex h-[50px] w-[50px] shrink-0 items-center justify-center" style={{ color: iconColor }}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              {trendPath && <svg className="dashboard-trend absolute right-3 top-8" viewBox="0 0 100 44" aria-hidden="true"><path d={trendPath} /></svg>}
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[#222]">{isWorker ? ['Accident reports', 'Compensation claims', 'Pending claims', 'Safety complaints'][index] : label}</p>
                <p className="mt-2 text-[30px] font-semibold leading-none tracking-[-.04em] text-[#111]">{value}</p>
                <p className="mt-2 text-[13px] text-[#777]">{Number(value) === 0 ? emptyText : (
                  label === 'Accident reports' ? `${value} report${Number(value) === 1 ? '' : 's'} on record`
                    : label === 'Compensation claims' ? `${value} claim${Number(value) === 1 ? '' : 's'} submitted`
                      : label === 'Pending claims' ? `${value} awaiting review`
                        : label === 'Total Active Workers' ? `${value} active worker${Number(value) === 1 ? '' : 's'}`
                          : label === 'Accident Reports' ? `${value} accident report${Number(value) === 1 ? '' : 's'}`
                            : label === 'Compensation Claims' ? `${value} claim${Number(value) === 1 ? '' : 's'}`
                              : `${value} complaint${Number(value) === 1 ? '' : 's'}`
                )}</p>
                <Link to={path} className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-[#D33B12] hover:text-[#111]">
                  View details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" aria-label="Recent activity and next steps">
        <div className="flex h-[298px] min-h-0 min-w-0 flex-col rounded-[10px] border border-[#e7e7e7] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-.02em] text-[#111]">Recent activity</h2>
              <p className="mt-1 text-xs text-[#777]">{isWorker ? 'Your latest reports, claims and complaints.' : 'Latest reports, claims and complaints across the platform.'}</p>
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

          <div className="dashboard-activity-records mt-1 max-h-[153px] min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {visibleActivity.length ? (
              <div className="divide-y divide-[#ededed]">
                {visibleActivity.map((activity) => (
                  <div key={activity.id} className="flex h-[76px] shrink-0 items-center justify-between gap-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${activity.type === 'Accidents' ? 'text-[#E87532]' : activity.type === 'Claims' ? 'text-[#C94A4A]' : 'text-[#587A96]'}`}>
                        {activity.type === 'Accidents' ? <AlertTriangle className="h-5 w-5" aria-hidden="true" /> : activity.type === 'Claims' ? <FileCheck2 className="h-5 w-5" aria-hidden="true" /> : <AlertOctagon className="h-5 w-5" aria-hidden="true" />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-[#222]">{activity.title}</p>
                        <p className="mt-1 truncate text-[12px] text-[#777]">{[activity.detail || activity.type, activity.date ? `${Math.max(0, Math.floor((Date.now() - new Date(activity.date).getTime()) / 86400000))} days ago` : null].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                    {activity.status && <span className="shrink-0 text-[12px] font-medium" style={{ color: activityStatusColors[String(activity.status).toLowerCase().trim()] || '#6B7280' }}>{activity.status}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-activity-empty flex h-full min-h-0 items-center justify-center px-3 text-center">
                <p className="text-[13px] font-normal text-[#777]">{emptyActivityMessage}</p>
              </div>
            )}
          </div>
        </div>

        <aside className="dashboard-action-panel relative h-[298px] overflow-hidden rounded-[10px] border border-[#f0e4dc] p-5 sm:p-6">
          <div className="relative z-10 max-w-[390px]"><p className="text-[10px] font-bold uppercase tracking-[.17em] text-[#68635e]">Safety first</p><h2 className="mt-1 text-[23px] font-semibold tracking-[-.03em] text-[#111]">Need to take action?</h2><p className="mt-1 text-[14px] leading-[1.5] text-[#57534f]">Choose what you want to do. In case of an emergency, alert everyone immediately.</p></div>
        </aside>
      </section>
      <EmergencyAlerts user={user} dialogOpen={emergencyDialogOpen} onDialogClose={() => setEmergencyDialogOpen(false)} />
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

  return (
    <WorkerDashboard
      user={user}
      isWorker={isWorker}
      kpis={kpis}
      recentAccidents={recentAccidents}
      recentClaims={recentClaims}
      recentComplaints={recentComplaints}
    />
  );
};

export default Dashboard;
