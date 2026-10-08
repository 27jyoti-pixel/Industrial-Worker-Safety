import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import workerService from '../services/workerService';
import {
  Plus,
  Trash2,
  Eye,
  User,
  Inbox,
  Briefcase,
  Phone,
} from 'lucide-react';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchBar from '../components/common/SearchBar';
import SearchFilterSelect from '../components/common/SearchFilterSelect';
import DataTablePagination from '../components/common/DataTablePagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import workerHeroBackground from '../assets/worker-page-hero.png';

const avatarThemes = [
  'bg-[#f0eaff] text-[#7956c7]',
  'bg-[#fff0e5] text-[#e87532]',
  'bg-[#ffebed] text-[#d84b56]',
  'bg-[#fff0e5] text-[#e87532]',
  'bg-[#f0eaff] text-[#7956c7]'
];
const profileDisplayValue = (value) => {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return 'Not provided';
  }
  return value;
};

const profileDisplayDate = (value) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString();
};

const Workers = () => {
  const { isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage, setWorkersPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewLoadError, setViewLoadError] = useState('');
  const [activeWorkerSection, setActiveWorkerSection] = useState('Personal Information');
  const workerFetchRequestId = useRef(0);
  const workerViewRequestId = useRef(0);
  const selectedWorkerUser = selectedWorker?.user && typeof selectedWorker.user === 'object'
    ? selectedWorker.user
    : {};
  const selectedWorkerAddress = selectedWorker?.address || {};
  const cityState = [
    selectedWorkerUser.city || selectedWorkerAddress.city,
    selectedWorkerUser.state || selectedWorkerAddress.state
  ].filter(Boolean).join(', ');
  const residentialAddress = selectedWorkerUser.residentialAddress || [
    selectedWorkerAddress.street,
    selectedWorkerAddress.pincode
  ].filter(Boolean).join(', ');
  const workerProfileSections = selectedWorker ? [
    {
      title: 'Personal Information',
      icon: User,
      fields: [
        { label: 'Email Address', value: selectedWorkerUser.email || selectedWorker.email },
        { label: 'Alternate Phone Number', value: selectedWorkerUser.alternatePhone || selectedWorker.alternatePhone },
        { label: 'Phone Number', value: selectedWorkerUser.phone || selectedWorker.phone },
        { label: 'Date of Birth', value: profileDisplayDate(selectedWorkerUser.dateOfBirth || selectedWorker.dateOfBirth) },
        { label: 'Blood Group', value: selectedWorkerUser.bloodGroup || selectedWorker.bloodGroup },
        { label: 'City / State', value: cityState },
        { label: 'Residential Address', value: residentialAddress }
      ]
    },
    {
      title: 'Work Details',
      icon: Briefcase,
      fields: [
        { label: 'Employee ID', value: selectedWorkerUser.employeeId || selectedWorker.employeeId },
        { label: 'Role', value: selectedWorkerUser.role || selectedWorker.role },
        { label: 'Factory Unit', value: selectedWorkerUser.factoryName || selectedWorker.factoryName },
        { label: 'Department', value: selectedWorkerUser.department || selectedWorker.department },
        { label: 'Designation / Job Title', value: selectedWorkerUser.designation || selectedWorker.designation },
        { label: 'Shift', value: selectedWorkerUser.shift || selectedWorker.shift },
        { label: 'Joining Date', value: profileDisplayDate(selectedWorkerUser.joiningDate || selectedWorker.joiningDate) },
        { label: 'Work Location', value: selectedWorkerUser.workLocation || selectedWorker.workLocation },
        { label: 'Supervisor / Reporting Manager', value: selectedWorkerUser.supervisor || selectedWorker.supervisor },
        { label: 'Employment Type', value: selectedWorkerUser.employmentType || selectedWorker.employmentType },
        { label: 'Employee Status', value: selectedWorkerUser.employeeStatus || selectedWorker.employeeStatus },
        { label: 'Insurance Provider', value: selectedWorker.insuranceDetails?.provider },
        { label: 'Insurance Policy Number', value: selectedWorker.insuranceDetails?.policyNumber },
        { label: 'Insurance Valid Through', value: profileDisplayDate(selectedWorker.insuranceDetails?.validTill) }
      ]
    },
    {
      title: 'Emergency Contact',
      icon: Phone,
      fields: [
        { label: 'Emergency Contact Name', value: selectedWorkerUser.emergencyContactName || selectedWorker.emergencyContact?.name || selectedWorker.emergencyContactName },
        { label: 'Emergency Contact Relationship', value: selectedWorkerUser.emergencyContactRelationship || selectedWorker.emergencyContact?.relation || selectedWorker.emergencyContactRelationship },
        { label: 'Emergency Contact Number', value: selectedWorkerUser.emergencyContactNumber || selectedWorker.emergencyContact?.phone || selectedWorker.emergencyContactNumber }
      ]
    }
  ] : [];

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Worker Form State
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    factoryName: '',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    emergencyContact: { name: '', relation: '', phone: '' },
    insuranceDetails: { provider: '', policyNumber: '' },
    address: { street: '', city: '', state: '', pincode: '' }
  });

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchWorkers();
  }, [currentPage, searchQuery, workersPerPage]);

  const fetchWorkers = async () => {
    const requestId = ++workerFetchRequestId.current;
    setLoading(true);
    try {
      const response = await workerService.getAllWorkers({
        search: searchQuery,
        page: currentPage,
        limit: workersPerPage
      });
      if (requestId !== workerFetchRequestId.current) return;
      const dataList = Array.isArray(response.workers)
        ? response.workers
        : Array.isArray(response.data)
          ? response.data
          : [];
      const total = Number(response.pagination?.total ?? response.total ?? dataList.length) || 0;
      const pages = Math.ceil(total / workersPerPage);
      const lastValidPage = Math.max(1, pages);

      setTotalItems(total);
      setWorkers(dataList);

      if (currentPage > lastValidPage) {
        setCurrentPage(lastValidPage);
      }
    } catch (err) {
      if (requestId === workerFetchRequestId.current) {
        setWorkers([]);
        setTotalItems(0);
        showError(err.message || 'Failed to fetch worker profiles');
      }
    } finally {
      if (requestId === workerFetchRequestId.current) setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      factoryName: '',
      phone: '',
      email: '',
      bloodGroup: 'O+',
      emergencyContact: { name: '', relation: '', phone: '' },
      insuranceDetails: { provider: '', policyNumber: '' },
      address: { street: '', city: '', state: '', pincode: '' }
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (worker) => {
    setSelectedWorker(worker);
    setFormData({
      name: worker.name || '',
      employeeId: worker.employeeId || '',
      factoryName: worker.factoryName || '',
      phone: worker.phone || '',
      email: worker.email || '',
      bloodGroup: worker.bloodGroup || 'O+',
      emergencyContact: worker.emergencyContact || { name: '', relation: '', phone: '' },
      insuranceDetails: worker.insuranceDetails || { provider: '', policyNumber: '' },
      address: worker.address || { street: '', city: '', state: '', pincode: '' }
    });
    setEditModalOpen(true);
  };

  const openViewModal = async (worker) => {
    const workerId = worker?._id || worker?.id;
    const requestId = ++workerViewRequestId.current;
    setSelectedWorker(worker);
    setActiveWorkerSection('Personal Information');
    setViewLoading(true);
    setViewLoadError('');
    setViewModalOpen(true);

    try {
      if (!workerId) throw new Error('The selected worker does not have a valid worker ID.');

      const response = await workerService.getWorkerById(workerId);
      const detailedWorker = response?.data?.data
        || response?.data
        || response?.worker
        || response;

      if (requestId !== workerViewRequestId.current) return;
      if (!detailedWorker || typeof detailedWorker !== 'object' || !(detailedWorker._id || detailedWorker.id)) {
        throw new Error('The worker details response did not contain a worker profile.');
      }
      setSelectedWorker(detailedWorker);
    } catch (err) {
      if (requestId !== workerViewRequestId.current) return;
      if (import.meta.env.DEV) {
        console.error('Failed to load Worker Details', {
          workerId,
          error: err?.raw || err
        });
      }
      setViewLoadError(err?.message || 'Failed to fetch worker details');
      showError(err.message || 'Failed to fetch worker details');
    } finally {
      if (requestId === workerViewRequestId.current) setViewLoading(false);
    }
  };

  const closeViewModal = () => {
    workerViewRequestId.current += 1;
    setViewLoading(false);
    setViewModalOpen(false);
    setActiveWorkerSection('Personal Information');
  };

  const openDeleteDialog = (worker) => {
    setSelectedWorker(worker);
    setDeleteDialogOpen(true);
  };

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await workerService.createWorker(formData);
      showSuccess('Worker profile created successfully!');
      setCreateModalOpen(false);
      await fetchWorkers();
    } catch (err) {
      showError(err.message || 'Failed to create worker profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateWorker = async (e) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setSubmitting(true);
    try {
      await workerService.updateWorker(selectedWorker._id, formData);
      showSuccess('Worker profile updated successfully!');
      setEditModalOpen(false);
      fetchWorkers();
    } catch (err) {
      showError(err.message || 'Failed to update worker profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWorker = async () => {
    if (!selectedWorker) return;
    setSubmitting(true);
    try {
      await workerService.deleteWorker(selectedWorker._id);
      showSuccess('Worker record deleted.');
      setDeleteDialogOpen(false);
      fetchWorkers();
    } catch (err) {
      showError(err.message || 'Failed to delete worker profile');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Worker Name',
      className: 'text-left !text-[14px]',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold ${avatarThemes[(row.name?.charCodeAt(0) || 0) % avatarThemes.length]}`}>
            {row.profileImage?.url ? (
              <img src={row.profileImage.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="text-sm font-normal text-[#111]">{row.name}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      className: 'text-left !text-[14px]',
      render: (row) => <span className="text-sm font-normal text-[#111]">{row.employeeId}</span>
    },
    {
      header: 'Factory',
      className: 'text-left !text-[14px]',
      accessor: 'factoryName'
    },
    {
      header: 'Phone Number',
      className: 'text-left !text-[14px]',
      accessor: 'phone'
    },
    {
      header: 'Blood Group',
      className: 'workers-blood-header text-left !text-[14px]',
      cellClassName: 'workers-blood-cell text-center align-middle',
      render: (row) => (
        <span className="workers-blood-value text-sm font-normal text-[#111]">
          {row.bloodGroup}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right !text-[14px]',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openViewModal(row)}
            className="workers-action"
            title="View Details" 
          >
            <Eye className="w-4 h-4" />
          </button>
          {(isFactoryAdmin || isSuperAdmin) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="workers-action text-[#e34b3d] hover:!bg-[#fff0ee] hover:!text-[#c83227]"
              title="Delete Worker"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  const renderWorkerProfileSection = (section) => {
    return (
      <section key={section.title} className="worker-detail-panel">
        <dl className={`worker-detail-fields grid ${section.title === 'Emergency Contact' ? 'worker-detail-fields-emergency' : 'worker-detail-fields-two-column'}`}>
          {section.fields.map(({ label, value }) => (
            <div key={label} className="min-w-0">
              <dt>{label}</dt>
              <dd>{profileDisplayValue(value)}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  };
  const activeWorkerProfileSection = workerProfileSections.find(
    (section) => section.title === activeWorkerSection
  ) || workerProfileSections[0];

  return (
    <>
      
      <style>{`
        .worker-details-dialog { display: flex !important; flex: 0 0 auto !important; flex-direction: column !important; width: 850px !important; max-width: calc(100vw - 40px) !important; height: 570px !important; min-height: 0 !important; max-height: calc(100vh - 40px) !important; border-radius: 16px !important; box-shadow: none !important; font-family: inherit !important; }
        .worker-details-dialog * { font-family: inherit !important; }
        .worker-details-dialog > div:first-child { flex: 0 0 auto !important; min-height: 70px; padding: 14px 28px !important; background: #fff !important; border-bottom-color: #e5e7eb !important; }
        .worker-details-dialog > div:first-child h3 { color: #111111 !important; font-size: 24px !important; line-height: 1.25 !important; font-weight: 500 !important; }
        .worker-details-dialog > div:first-child button { border-radius: 8px !important; color: #4b5563 !important; }
        .worker-details-dialog > div:first-child button svg { width: 20px; height: 20px; }
        .worker-details-dialog > div:first-child button:hover { background: #f3f4f6 !important; color: #111 !important; }
        .worker-details-dialog > div:nth-child(2) { display: flex !important; flex: 1 1 0% !important; min-height: 0 !important; max-height: none !important; overflow: hidden !important; padding: 0 !important; background: #fff; }
        .worker-details-dialog > div:last-child { flex: 0 0 auto !important; margin-top: auto !important; min-height: 66px; padding: 10px 28px !important; border-top-color: #e5e7eb !important; background: #fff !important; }
        .worker-details-dialog > div:last-child button { min-width: 102px; min-height: 40px; border-radius: 8px !important; font-size: 14px !important; font-weight: 500 !important; }
        .worker-details-dialog > div:first-child button { font-size: 14px !important; font-weight: 500 !important; }
        .fixed.inset-0.z-50:has(.worker-details-dialog) > .fixed.top-0.left-0.w-screen.h-screen { background: rgba(17,17,17,.52) !important; backdrop-filter: none !important; }
        .worker-details-layout { display: grid; width: 100%; height: 100%; min-height: 0; flex: 1 1 auto; grid-template-columns: 225px minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); }
        .worker-details-sidebar { display: flex; min-width: 0; flex-direction: column; align-items: center; overflow: hidden; border-right: 1px solid #e5e7eb; background: #fafbfc; padding: 10px 12px 8px; }
        .worker-details-identity { display: flex; width: 100%; flex-direction: column; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; text-align: center; }
        .worker-details-avatar { display: flex; width: 68px; height: 68px; align-items: center; justify-content: center; border-radius: 9999px; background: #fee2e2; color: #e83b2e; font-size: 16px; font-weight: 400; }
        .worker-details-identity h4 { margin: 5px 0 0; color: #111111; font-size: 18px; font-weight: 500; line-height: 1.25; overflow-wrap: anywhere; }
        .worker-details-nav { display: flex; width: 100%; flex-direction: column; gap: 3px; margin-top: 8px; }
        .worker-detail-nav-item { display: flex; min-height: 44px; width: 100%; align-items: center; gap: 9px; border: 0; border-radius: 12px; background: transparent; padding: 8px 10px; color: #111111; font-size: 15px; font-weight: 400; text-align: left; white-space: nowrap; cursor: pointer; }
        .worker-detail-nav-item svg { width: 20px; height: 20px; flex: 0 0 auto; color: #111827; }
        .worker-detail-nav-item.is-active { border: 0; background: #111111; color: #ffffff; font-weight: 500; box-shadow: none; }
        .worker-detail-nav-item.is-active svg { color: #ffffff; }
        .worker-details-main { min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; scrollbar-width: none; padding: 30px; }
        .worker-details-main::-webkit-scrollbar { display: none; }
        .worker-detail-panel { border: 0; border-radius: 0; background: transparent; padding: 0; }
        .worker-detail-fields { align-items: start; row-gap: 20px; padding: 0; }
        .worker-detail-fields-two-column { max-width: 580px; margin: 0 auto; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 56px; }
        .worker-detail-fields-emergency { grid-template-columns: minmax(0, 1fr); }
        .worker-detail-fields dt { color: #475569; font-size: 13px; font-weight: 400; line-height: 1.35; }
        .worker-detail-fields dd { margin: 5px 0 0; color: #111111; font-size: 15px; font-weight: 400; line-height: 1.4; overflow-wrap: anywhere; }
        @media (max-width: 900px) { .worker-details-dialog > div:first-child { min-height: 70px; padding: 14px 20px !important; } .worker-details-layout { grid-template-columns: 225px minmax(0,1fr); } .worker-details-sidebar { padding: 8px 10px; } .worker-details-main { padding: 28px; } }
        @media (max-width: 640px) { .worker-details-dialog > div:last-child { min-height: 66px; padding: 10px 12px !important; } .worker-details-dialog > div:last-child button { min-width: 102px; min-height: 40px; border-radius: 8px !important; font-size: 14px !important; font-weight: 500 !important; } .worker-details-layout { grid-template-columns: minmax(0,1fr); grid-template-rows: auto minmax(0,1fr); } .worker-details-sidebar { gap: 10px; overflow: hidden; border-right: 0; border-bottom: 1px solid #e5e7eb; padding: 10px 12px; } .worker-details-identity { flex-direction: row; gap: 10px; border-bottom: 0; padding: 0; text-align: left; } .worker-details-avatar { width: 68px; height: 68px; flex: 0 0 68px; font-size: 16px; } .worker-details-identity h4 { margin: 0; font-size: 18px; } .worker-details-nav { flex-direction: row; gap: 6px; overflow-x: auto; margin: 0; } .worker-detail-nav-item { min-height: 42px; width: auto; flex: 0 0 auto; gap: 6px; border-radius: 10px; padding: 8px 10px; font-size: 15px; } .worker-detail-nav-item svg { width: 20px; height: 20px; } .worker-details-main { padding: 24px; } .worker-detail-fields { row-gap: 20px; column-gap: 24px; padding: 0; } }
        .fixed.inset-0.z-50:has(.worker-create-dialog) > .fixed.top-0.left-0.w-screen.h-screen { background: rgba(17,17,17,.42) !important; backdrop-filter: none !important; }
        .worker-create-dialog > div:first-child { background: #fff !important; border-bottom-color: #e5e5e5 !important; }
        .worker-create-dialog > div:first-child h3 { color: #111 !important; }
        .worker-create-dialog > div:first-child button { color: #62666b !important; }
        .worker-create-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
        .worker-create-dialog > div:nth-child(2) { background: #fff; }
        .worker-create-dialog form { color: #17191c; }
        .worker-create-dialog form label { display: block; min-height: 18px; margin-bottom: 6px !important; color: #535860 !important; font-size: 13px !important; font-weight: 500 !important; letter-spacing: normal !important; line-height: 18px !important; text-transform: none !important; }
        .worker-create-dialog form input,
        .worker-create-dialog form select { height: 46px; min-height: 46px; border: 1px solid #dedede !important; border-radius: 8px !important; background-color: #fff !important; color: #17191c !important; box-shadow: none !important; }
        .worker-create-dialog form input { padding-top: 0 !important; padding-bottom: 0 !important; }
        .worker-create-dialog form input:focus,
        .worker-create-dialog form select:focus { border-color: #F2C7B0 !important; outline: none !important; box-shadow: none !important; }
        .worker-create-dialog .worker-create-fields-grid { align-items: start; row-gap: 16px; }
        .worker-create-dialog .worker-create-fields-grid > * { min-width: 0; }
        .worker-create-dialog .worker-create-blood-group .dialog-search-filter-label { min-height: 18px; margin-bottom: 6px; line-height: 18px; }
        .worker-create-dialog .worker-create-blood-group .dialog-search-filter-trigger { position: relative; display: flex; height: 46px; min-height: 46px; align-items: center; justify-content: center; border: 1px solid #dedede; border-radius: 8px; background: #fff; padding: 0 14px; color: #17191c; font-size: 14px; line-height: normal; box-shadow: none; }
        .worker-create-dialog .worker-create-blood-group .dialog-search-filter-trigger:hover { border-color: #cfd3d8; background: #fff; }
        .worker-create-dialog .worker-create-blood-group .dialog-search-filter-trigger:focus-visible { border-color: #F2C7B0; outline: none; box-shadow: none; }
        .worker-create-dialog .worker-create-blood-group .search-filter-selected-content { display: flex; width: 100%; align-items: center; justify-content: center; margin: 0; padding: 0; line-height: 1; text-align: center; }
        .worker-create-dialog .worker-create-blood-group .search-filter-selected-content > span { margin: 0; padding: 0; line-height: 1; }
        .worker-create-dialog .worker-create-blood-group .dialog-search-filter-trigger > svg:last-child { position: absolute; top: 0; right: 14px; bottom: 0; margin-top: auto; margin-bottom: auto; }
        .worker-blood-group-menu { z-index: 10050 !important; }
        .worker-create-dialog form .worker-create-emergency-title { color: #292929 !important; font-size: 13px !important; font-weight: 600 !important; }
        .worker-create-dialog form .worker-create-save { min-height: 40px; border: 1px solid #111 !important; border-radius: 8px !important; background: #111 !important; color: #fff !important; box-shadow: none !important; transform: none !important; font-weight: 500 !important; }
        .worker-create-dialog form .worker-create-save:hover:not(:disabled) { background: #292929 !important; color: #fff !important; }
        .worker-create-dialog form .worker-create-cancel { min-height: 40px; border: 1px solid #dedede !important; border-radius: 8px !important; background: #fff !important; color: #222 !important; box-shadow: none !important; transform: none !important; font-weight: 500 !important; }
        .worker-create-dialog form .worker-create-cancel:hover:not(:disabled) { background: #f7f7f7 !important; color: #111 !important; }
        .worker-create-dialog form .worker-create-save:focus-visible,
        .worker-create-dialog form .worker-create-cancel:focus-visible { border-color: #F2C7B0 !important; outline: none !important; box-shadow: none !important; }
        .workers-hero-art { right: -6px; background-size: cover; background-position: right center; background-repeat: no-repeat; }
        .workers-page .workers-create-cta { background-color: #111111 !important; color: #ffffff !important; box-shadow: none !important; }
        .workers-page .workers-create-cta:hover:not(:disabled) { background-color: #111111 !important; color: #ffffff !important; }
        .workers-page .workers-create-cta svg { color: #ffffff !important; }
        .workers-filter .workers-search input { height: 44px; min-height: 44px; padding-left: 40px !important; padding-right: 36px !important; border: 1px solid #e1e4e8 !important; border-radius: 8px !important; background: #fff !important; color: #111 !important; font-size: 14px !important; box-shadow: none !important; }
        .workers-filter .workers-search input::placeholder { color: #747b84 !important; opacity: 1; }
        .workers-filter .workers-search input:focus { border-color: #b8b8b8 !important; box-shadow: 0 0 0 2px rgba(232,117,50,.14) !important; outline: none; }
        .workers-filter .workers-search > div { color: #6b7280 !important; }
        .workers-table { border: 1px solid #e5e5e5; border-radius: 10px; background: #fff; }
        .workers-table .industrial-card { border: 0 !important; border-radius: 0 !important; background: #fff !important; box-shadow: none !important; }
        .workers-table table { width: 100% !important; table-layout: fixed !important; }
        .workers-table th:nth-child(1), .workers-table td:nth-child(1) { width: 18% !important; }
        .workers-table th:nth-child(2), .workers-table td:nth-child(2) { width: 16% !important; }
        .workers-table th:nth-child(3), .workers-table td:nth-child(3) { width: 22% !important; }
        .workers-table th:nth-child(4), .workers-table td:nth-child(4) { width: 19% !important; }
        .workers-table th:nth-child(5), .workers-table td:nth-child(5) { width: 17% !important; }
        .workers-table th:nth-child(6), .workers-table td:nth-child(6) { width: 8% !important; }
        .app-content .workers-table thead th { height: 52px !important; padding: 11px 14px !important; background: #f3f4f5 !important; border-bottom: 1px solid #e5e5e5 !important; color: #111111 !important; font-size: 14px !important; font-weight: 500 !important; letter-spacing: .08em !important; line-height: 1.35 !important; text-transform: none !important; }
        .workers-table tbody tr { height: 73px !important; }
        .workers-table tbody.divide-y > tr + tr { border-top: none !important; }
        .workers-table tbody tr { border-top: none !important; border-bottom: 1px solid #eeeeee !important; box-shadow: none !important; }
        .workers-table tbody tr:last-child { border-bottom: none !important; }
        .workers-table tbody td { border-top: none !important; border-bottom: none !important; box-shadow: none !important; }
        .workers-table tbody td { padding: 11px 14px !important; color: #111 !important; font-size: 15px !important; font-weight: 400 !important; line-height: 1.45 !important; }
        .workers-table .workers-empty-cell { height: 230px !important; padding: 20px 24px !important; text-align: center !important; vertical-align: middle !important; }
        .workers-table .workers-empty-content { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #737b84; }
        .workers-table .workers-empty-heading { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .workers-table .workers-empty-icon { display: flex; width: 36px; height: 36px; flex: 0 0 36px; align-items: center; justify-content: center; border-radius: 9999px; background: #f3f4f4; color: #292929; }
        .workers-table tbody td .workers-empty-title { margin: 0; color: #111 !important; font-size: 18px !important; font-weight: 600 !important; line-height: 1.4 !important; }
        .workers-table tbody td .workers-empty-description { max-width: 440px; margin: 0; color: #737b84 !important; font-size: 15px !important; font-weight: 400 !important; line-height: 1.5 !important; }
        .workers-table tbody td > span, .workers-table tbody td p { font-size: 15px !important; font-weight: 400 !important; line-height: 1.45 !important; color: #111 !important; }
        .workers-table th:nth-child(5), .workers-table td:nth-child(5) { text-align: center !important; }
        .workers-table tbody td.workers-blood-cell { position: relative !important; display: table-cell !important; vertical-align: middle !important; text-align: center !important; padding-top: 0 !important; padding-bottom: 0 !important; }
        .workers-table tbody td.workers-blood-cell .workers-blood-value { position: absolute !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; line-height: 1 !important; }
        .workers-table .workers-blood-header { text-align: center !important; }
        .workers-table tbody tr { transition: none !important; }
        .workers-table tbody tr:hover { transform: none !important; background: #fafafa !important; }
        .workers-page .workers-action { display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center; border-radius: 6px; padding: 0; color: #62666b; transition: color 140ms ease, background-color 140ms ease; }
        .workers-page .workers-action:hover { background: #f3f4f5; color: #111; }
        .workers-table td:last-child > div { gap: 4px !important; }
        .workers-table .data-table-pagination-control.is-current,
        .workers-table .data-table-pagination-control.is-current:hover { border-color: #111111 !important; background: #111111 !important; color: #FFFFFF !important; }
        @media (max-width: 767px) {
          .workers-table table { table-layout: auto !important; min-width: 760px !important; }
          .workers-table { overflow-x: auto; }
        }
        .worker-delete-confirm-dialog {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: calc(100dvh - 48px) !important;
          border-color: #e1e4e8 !important;
          border-radius: 14px !important;
          background: #fff !important;
          box-shadow: 0 12px 32px rgba(17, 17, 17, .12) !important;
        }
        .fixed.inset-0.z-50:has(.worker-delete-confirm-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .4) !important;
          backdrop-filter: none !important;
        }
        .worker-delete-confirm-dialog > div:first-child {
          flex: 0 0 auto;
          border-bottom: 1px solid #e1e4e8 !important;
          background: #fff !important;
        }
        .worker-delete-confirm-dialog > div:first-child h3 { color: #111 !important; font-weight: 600 !important; }
        .worker-delete-confirm-dialog > div:first-child button { color: #62666b !important; }
        .worker-delete-confirm-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
        .worker-delete-confirm-dialog > div:nth-child(2) {
          flex: 0 1 auto;
          min-height: 0;
          max-height: calc(100dvh - 180px) !important;
          overflow-y: auto !important;
          padding: 18px 24px !important;
          background: #fff !important;
        }
        .worker-delete-confirm-dialog > div:nth-child(2) > div:first-child { align-items: center; gap: 12px; }
        .worker-delete-confirm-dialog > div:nth-child(2) > div:first-child > div:first-child {
          border: 1px solid #fecaca;
          background: #fef2f2 !important;
          color: #dc2626 !important;
          padding: 10px !important;
        }
        .worker-delete-confirm-dialog > div:nth-child(2) > div:first-child > div:first-child svg { width: 20px; height: 20px; }
        .worker-delete-confirm-dialog > div:nth-child(2) p { color: #4b5563 !important; white-space: pre-line; }
        .worker-delete-confirm-dialog > div:last-child {
          flex: 0 0 auto;
          justify-content: flex-end;
          gap: 8px !important;
          border-top: 1px solid #e1e4e8 !important;
          padding: 12px 20px !important;
          background: #fff !important;
        }
        .worker-delete-confirm-dialog > div:last-child button {
          min-height: 40px;
          border-radius: 8px !important;
          box-shadow: none !important;
          transform: none !important;
          font-weight: 500 !important;
        }
        .worker-delete-confirm-dialog > div:last-child button:first-child {
          border: 1px solid #d1d5db !important;
          background: #fff !important;
          color: #111 !important;
        }
        .worker-delete-confirm-dialog > div:last-child button:first-child:hover { background: #f7f7f7 !important; }
        .worker-delete-confirm-dialog > div:last-child button:last-child {
          border: 1px solid #111 !important;
          background: #111 !important;
          color: #fff !important;
        }
        .worker-delete-confirm-dialog > div:last-child button:last-child:hover { background: #111 !important; color: #fff !important; }
        @media (prefers-reduced-motion: reduce) { .workers-table tbody tr, .workers-page .workers-action { transition: none; } }
      `}</style>

      <div className="workers-page space-y-6">
      <section className="workers-hero relative isolate -mx-4 -mt-4 min-h-[278px] w-[calc(100%+2rem)] overflow-hidden bg-[#F7F8F8] sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]" aria-labelledby="workers-heading">
        <div className="relative z-10 flex min-h-[278px] items-start px-4 pt-7 sm:items-center sm:py-7 sm:px-6 lg:px-8">
          <div className="w-full max-w-[740px] lg:w-[52%]">
            <h1 id="workers-heading" className="!mb-0 !text-[30px] !font-semibold !leading-tight !tracking-[-.035em] !text-[#111] sm:!text-[42px] lg:!text-[44px]">Workers</h1>
            <p className="mt-2 max-w-[470px] text-[16px] leading-[1.5] text-[#6B7280] sm:text-[17px]">Manage worker profiles, emergency contacts, and health credentials.</p>
          </div>
        </div>
        <div aria-hidden="true" className="workers-hero-art absolute inset-0 z-0 hidden xl:block" style={{ backgroundImage: `url(${workerHeroBackground})` }} />
        <div aria-hidden="true" className="workers-hero-mobile absolute inset-x-0 bottom-0 z-0 xl:hidden">
          <img src={workerHeroBackground} alt="" className="block h-auto w-full object-contain object-center" />
        </div>
      </section>

      <section className="workers-filter search-filter-controls grid grid-cols-1 items-center gap-3 bg-transparent p-0 lg:grid-cols-[minmax(0,1fr)_auto]" aria-label="Search workers">
          <SearchBar
            className="workers-search"
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
            placeholder="Search by worker name, employee ID, or factory..."
          />
          {isAdminOrOfficer && (
            <button type="button" onClick={openCreateModal} className="workers-create-cta midc-primary-cta inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[14px] font-medium text-white transition-colors">
              <Plus className="h-4 w-4" /> Add New Worker
            </button>
          )}
      </section>

      {/* Workers Table */}
      <div className="workers-table standard-data-table-shell overflow-hidden rounded-lg">
        {!loading && workers.length === 0 ? (
          <div className="industrial-card overflow-hidden platform-data-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f6f4ee] border-b border-sand-200">
                    {columns.map((column, index) => (
                      <th key={index} className={`px-4 py-3 text-sm font-extrabold text-sand-500 tracking-[.12em] ${column.className?.includes('text-right') ? '!text-right' : '!text-left'}`}>
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="workers-empty-cell" colSpan={columns.length}>
                      <div className="workers-empty-content">
                        <div className="workers-empty-heading">
                          <div className="workers-empty-icon" aria-hidden="true"><Inbox className="h-5 w-5" /></div>
                          <h3 className="workers-empty-title">No Workers Found</h3>
                        </div>
                        <p className="workers-empty-description">There are no industrial workers registered matching your search.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={workers}
            loading={loading}
            className="platform-data-table"
          />
        )}
        <DataTablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={workersPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(size) => { setWorkersPerPage(size); setCurrentPage(1); }}
          itemLabel="workers"
        />
      </div>

      {/* Modal: Create Worker */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Industrial Worker Profile"
        dialogClassName="worker-create-dialog"
      >
        <form onSubmit={handleCreateWorker} className="space-y-4">
          <div className="worker-create-fields-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <Input label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} required />
          </div>

          <div className="worker-create-fields-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Factory Name" name="factoryName" value={formData.factoryName} onChange={handleInputChange} required />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          <div className="worker-create-fields-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            <div className="worker-create-blood-group">
              <SearchFilterSelect
                label="Blood Group"
                formField
                name="bloodGroup"
                value={formData.bloodGroup}
                onValueChange={(value) => handleInputChange({ target: { name: 'bloodGroup', value } })}
                options={bloodGroupOptions}
                menuClassName="worker-blood-group-menu"
                required
                allowClear={false}
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-[#e5e5e5] pt-4">
            <p className="worker-create-emergency-title">Emergency Contact Information</p>
            <div className="worker-create-fields-grid grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input label="Contact Name" name="emergencyContact.name" value={formData.emergencyContact?.name} onChange={handleInputChange} />
              <Input label="Relation" name="emergencyContact.relation" value={formData.emergencyContact?.relation} onChange={handleInputChange} />
              <Input label="Phone" name="emergencyContact.phone" value={formData.emergencyContact?.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" className="worker-create-cancel" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" className="worker-create-save" loading={submitting}>Save Worker</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Worker */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Worker Profile"
      >
        <form onSubmit={handleUpdateWorker} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <Input label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Factory Name" name="factoryName" value={formData.factoryName} onChange={handleInputChange} required />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} options={bloodGroupOptions} required />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Profile</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Worker */}
      <Modal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title="Worker Details"
        maxWidth="max-w-[880px]"
        dialogClassName="worker-details-dialog"
        footer={(
          <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={closeViewModal}>
            Close
          </Button>
        )}
      >
        {viewLoading ? (
          <p className="m-auto py-8 text-center text-sm text-[#62666b]" role="status">Loading worker profile…</p>
        ) : viewLoadError ? (
          <p className="m-auto py-8 text-center text-sm text-[#62666b]" role="alert">Worker profile details could not be loaded.</p>
        ) : selectedWorker && (
          <div className="worker-details-layout">
            <aside className="worker-details-sidebar">
              <div className="worker-details-identity">
                <div className="worker-details-avatar" aria-hidden="true">
                  {(selectedWorkerUser.name || selectedWorker.name || '?').charAt(0).toUpperCase()}
                </div>
                <h4>{profileDisplayValue(selectedWorkerUser.name || selectedWorker.name)}</h4>
              </div>
              <nav className="worker-details-nav" aria-label="Worker detail sections">
                {workerProfileSections.map(({ title, icon: SectionIcon }) => (
                  <button
                    key={title}
                    type="button"
                    className={`worker-detail-nav-item${activeWorkerSection === title ? ' is-active' : ''}`}
                    aria-current={activeWorkerSection === title ? 'page' : undefined}
                    onClick={() => setActiveWorkerSection(title)}
                  >
                    <SectionIcon aria-hidden="true" />
                    <span>{title}</span>
                  </button>
                ))}
              </nav>
            </aside>
            <main className="worker-details-main">
              {activeWorkerProfileSection && renderWorkerProfileSection(activeWorkerProfileSection)}
            </main>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteWorker}
        title="Delete Worker Profile"
        message={`Are you sure you want to permanently remove ${selectedWorker?.name}?\nThis action cannot be undone.`}
        loading={submitting}
        dialogClassName="worker-delete-confirm-dialog"
      />
      </div>
    </>
  );
};

export default Workers;
