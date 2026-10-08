import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import workerService from '../services/workerService';
import {
  Plus,
  Trash2,
  Eye,
  User,
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
import ProfileAvatar from '../components/profile/ProfileAvatar';
import workerHeroBackground from '../assets/worker-page-hero.png';

const avatarThemes = [
  'bg-[#fff0e5] text-[#e87532]',
  'bg-[#e8f1ff] text-[#3574c8]',
  'bg-[#e6f5ee] text-[#29966b]',
  'bg-[#f0eaff] text-[#7956c7]',
  'bg-[#ffebed] text-[#d84b56]'
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
      fields: [
        { label: 'Full Name', value: selectedWorkerUser.name || selectedWorker.name },
        { label: 'Email Address', value: selectedWorkerUser.email || selectedWorker.email },
        { label: 'Phone Number', value: selectedWorkerUser.phone || selectedWorker.phone },
        { label: 'Alternate Phone Number', value: selectedWorkerUser.alternatePhone || selectedWorker.alternatePhone },
        { label: 'Blood Group', value: selectedWorkerUser.bloodGroup || selectedWorker.bloodGroup },
        { label: 'Date of Birth', value: profileDisplayDate(selectedWorkerUser.dateOfBirth || selectedWorker.dateOfBirth) },
        { label: 'Residential Address', value: residentialAddress },
        { label: 'City / State', value: cityState }
      ]
    },
    {
      title: 'Emergency Contact',
      fields: [
        { label: 'Emergency Contact Name', value: selectedWorkerUser.emergencyContactName || selectedWorker.emergencyContact?.name || selectedWorker.emergencyContactName },
        { label: 'Emergency Contact Relationship', value: selectedWorkerUser.emergencyContactRelationship || selectedWorker.emergencyContact?.relation || selectedWorker.emergencyContactRelationship },
        { label: 'Emergency Contact Number', value: selectedWorkerUser.emergencyContactNumber || selectedWorker.emergencyContact?.phone || selectedWorker.emergencyContactNumber }
      ]
    },
    {
      title: 'Work Information',
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
        { label: 'Employee Status', value: selectedWorkerUser.employeeStatus || selectedWorker.employeeStatus }
      ]
    },
    {
      title: 'Insurance Details',
      fields: [
        { label: 'Provider', value: selectedWorker.insuranceDetails?.provider },
        { label: 'Policy Number', value: selectedWorker.insuranceDetails?.policyNumber },
        { label: 'Valid Through', value: profileDisplayDate(selectedWorker.insuranceDetails?.validTill) }
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
      fetchWorkers();
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
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-semibold ${avatarThemes[(row.name?.charCodeAt(0) || 0) % avatarThemes.length]}`}>
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

  return (
    <>
      
      <style>{`
        .worker-details-dialog { display: flex; flex-direction: column; min-height: min(70vh, calc(100vh - 2rem)); max-height: calc(100vh - 2rem); }
        .worker-details-dialog > div:first-child { flex: 0 0 auto; background: #fff !important; border-bottom-color: #e5e5e5 !important; }
        .worker-details-dialog > div:first-child h3 { color: #111 !important; }
        .worker-details-dialog > div:first-child button { color: #62666b !important; }
        .worker-details-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
        .worker-details-dialog > div:nth-child(2) { flex: 1 1 auto; min-height: 0; max-height: none !important; overflow-y: auto; background: #fff; }
        .worker-details-dialog > div:last-child { flex: 0 0 auto; border-top-color: #e5e5e5 !important; background: #fff !important; }
        .fixed.inset-0.z-50:has(.worker-details-dialog) > .fixed,
        .fixed.inset-0.z-50:has(.worker-create-dialog) > .fixed { background: rgba(17,17,17,.42) !important; backdrop-filter: none !important; }
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
        .workers-filter .workers-search input { height: 48px; min-height: 48px; padding-left: 40px !important; padding-right: 36px !important; border: 1px solid #e1e4e8 !important; border-radius: 8px !important; background: #fff !important; color: #111 !important; font-size: 14px !important; box-shadow: none !important; }
        .workers-filter .workers-search input::placeholder { color: #747b84 !important; opacity: 1; }
        .workers-filter .workers-search input:focus { border-color: #b8b8b8 !important; box-shadow: 0 0 0 2px rgba(232,117,50,.14) !important; outline: none; }
        .workers-filter .workers-search > div { color: #6b7280 !important; }
        .workers-table { border: 1px solid #e5e5e5; border-radius: 10px; background: #fff; }
        .workers-table .industrial-card { border: 0 !important; border-radius: 0 !important; background: #fff !important; box-shadow: none !important; }
        .app-content .workers-table thead th { height: 42px !important; padding: 11px 14px !important; background: #f3f4f5 !important; border-bottom: 1px solid #e5e5e5 !important; color: #111111 !important; font-size: 14px !important; font-weight: 500 !important; letter-spacing: .08em !important; line-height: 1.35 !important; text-transform: none !important; }
        .workers-table tbody tr { height: auto !important; }
        .workers-table tbody.divide-y > tr + tr { border-top: none !important; }
        .workers-table tbody tr,
        .workers-table tbody td { border-top: none !important; border-bottom: none !important; box-shadow: none !important; }
        .workers-table tbody td { padding: 11px 14px !important; color: #111 !important; font-size: 15px !important; font-weight: 400 !important; line-height: 1.45 !important; }
        .workers-table tbody td > span, .workers-table tbody td p { font-size: 15px !important; font-weight: 400 !important; line-height: 1.45 !important; color: #111 !important; }
        .workers-table th:nth-child(5), .workers-table td:nth-child(5) { text-align: center !important; }
        .workers-table tbody td.workers-blood-cell { position: relative !important; display: table-cell !important; vertical-align: middle !important; text-align: center !important; padding-top: 0 !important; padding-bottom: 0 !important; }
        .workers-table tbody td.workers-blood-cell .workers-blood-value { position: absolute !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; line-height: 1 !important; }
        .workers-table .workers-blood-header { text-align: center !important; }
        .workers-table tbody tr { transition: background-color 160ms ease; }
        .workers-table tbody tr:hover { transform: none !important; }
        .workers-page .workers-action { display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center; border-radius: 6px; padding: 0; color: #62666b; transition: color 140ms ease, background-color 140ms ease; }
        .workers-page .workers-action:hover { background: #f3f4f5; color: #111; }
        .workers-table td:last-child > div { gap: 4px !important; }
        .workers-table .data-table-pagination-control.is-current,
        .workers-table .data-table-pagination-control.is-current:hover { border-color: #111111 !important; background: #111111 !important; color: #FFFFFF !important; }
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
            <button type="button" onClick={openCreateModal} className="workers-create-cta midc-primary-cta inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[13px] font-medium text-white transition-colors">
              <Plus className="h-4 w-4" /> Add New Worker
            </button>
          )}
      </section>

      {/* Workers Table */}
      <div className="workers-table standard-data-table-shell overflow-hidden rounded-lg">
        <Table
          columns={columns}
          data={workers}
          loading={loading}
          className="platform-data-table"
          emptyTitle="No Workers Found"
          emptyDescription="No industrial workers match your current search query or criteria."
          onEmptyAction={isAdminOrOfficer ? openCreateModal : null}
          emptyActionText="Create Worker Profile"
        />
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
        title="Worker Details Profile"
        dialogClassName="worker-details-dialog"
        footer={(
          <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={closeViewModal}>
            Close
          </Button>
        )}
      >
        {viewLoading ? (
          <p className="py-8 text-center text-sm text-[#62666b]" role="status">Loading worker profile…</p>
        ) : viewLoadError ? (
          <p className="py-8 text-center text-sm text-[#62666b]" role="alert">Worker profile details could not be loaded.</p>
        ) : selectedWorker && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-[#e5e5e5] pb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f1f2f3] text-base font-semibold text-[#41464d]">
                {selectedWorker.profileImage?.url ? (
                  <img src={selectedWorker.profileImage.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ProfileAvatar
                    avatarId={selectedWorkerUser.avatarId}
                    role={selectedWorkerUser.role}
                    initials={(selectedWorkerUser.name || selectedWorker.name || '?').charAt(0).toUpperCase()}
                  />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[#17191c]">{profileDisplayValue(selectedWorkerUser.name || selectedWorker.name)}</h3>
                <p className="mt-1 text-sm text-[#62666b]">
                  {profileDisplayValue(selectedWorkerUser.factoryName || selectedWorker.factoryName)}
                  {' '}· Employee ID: {profileDisplayValue(selectedWorkerUser.employeeId || selectedWorker.employeeId)}
                </p>
              </div>
            </div>

            {workerProfileSections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h4 className="border-b border-[#e5e5e5] pb-2 text-xs font-semibold uppercase tracking-[.08em] text-[#62666b]">{section.title}</h4>
                <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {section.fields.map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                      <dt className="text-[13px] text-[#62666b]">{label}</dt>
                      <dd className="mt-1 break-words text-[15px] leading-relaxed text-[#17191c]">{profileDisplayValue(value)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
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
