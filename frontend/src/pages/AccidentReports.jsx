import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import accidentService from '../services/accidentService';
import workerService from '../services/workerService';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Upload,
  CheckCircle,
  FileText,
  AlertTriangle,
  UserRound,
} from 'lucide-react';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchFilterSelect from '../components/common/SearchFilterSelect';
import Textarea from '../components/common/Textarea';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import DataTablePagination from '../components/common/DataTablePagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';
import accidentHeroWide from '../assets/accident-reports-hero-wide.png';

const accidentTableValue = (value) => (
  value === null || value === undefined || (typeof value === 'string' && !value.trim())
    ? 'N/A'
    : value
);

const accidentTableDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

const accidentDetailValue = (value) => (
  value === null || value === undefined || (typeof value === 'string' && !value.trim())
    ? 'Not provided'
    : value
);

const accidentDetailDate = (value, includeTime = false) => {
  if (!value) return 'Not provided';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not provided'
    : date.toLocaleString(undefined, includeTime ? undefined : { dateStyle: 'medium' });
};

const canUploadEvidenceForReport = (report, user) => {
  const restrictedUploaderRoles = ['Worker', 'Factory Admin', 'Government Officer', 'Super Admin'];
  const reporterId = typeof report?.reportedBy === 'object'
    ? report.reportedBy?._id || report.reportedBy?.id
    : report?.reportedBy;
  const currentUserId = user?._id || user?.id;

  return restrictedUploaderRoles.includes(user?.role)
    && Boolean(reporterId && currentUserId)
    && String(reporterId) === String(currentUserId);
};

const isOwnedByUser = (report, user) => {
  const reporterId = typeof report?.reportedBy === 'object'
    ? report.reportedBy?._id || report.reportedBy?.id
    : report?.reportedBy;
  const currentUserId = user?._id || user?.id;

  return Boolean(reporterId && currentUserId)
    && String(reporterId) === String(currentUserId);
};

const AccidentReports = () => {
  const { user, isWorker, isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const fetchRequestId = useRef(0);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newStatus, setNewStatus] = useState('Reported');

  const [workersList, setWorkersList] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    time: '10:30',
    factory: '',
    department: '',
    severity: 'Moderate',
    witnessDetails: { name: '', phone: '', statement: '' },
    worker: ''
  });

  const severityOptions = ['Minor', 'Moderate', 'Severe', 'Critical', 'Fatal'];
  const statusOptions = ['Reported', 'Under Investigation', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchReports();
  }, [currentPage, searchQuery, severityFilter, statusFilter, itemsPerPage]);

  useEffect(() => {
    // The worker directory is restricted to administrative roles.
    const loadWorkers = async () => {
      if (!isAdminOrOfficer) return;
      try {
        const res = await workerService.getAllWorkers({ limit: 100 });
        setWorkersList(res.workers || res.data || []);
      } catch (err) {
        console.error('Failed to fetch workers dropdown', err);
      }
    };
    loadWorkers();
  }, [isAdminOrOfficer]);

  const fetchReports = async () => {
    const requestId = ++fetchRequestId.current;
    setLoading(true);
    try {
      const response = await accidentService.getAllReports({
        search: searchQuery,
        severity: severityFilter,
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage
      });
      if (requestId !== fetchRequestId.current) return;
      const dataList = Array.isArray(response.accidents)
        ? response.accidents
        : Array.isArray(response.data)
          ? response.data
          : [];
      const total = Number(response.pagination?.total ?? response.total ?? dataList.length) || 0;
      const pages = Math.ceil(total / itemsPerPage);
      setReports(dataList);
      setTotalItems(total);
      if (currentPage > Math.max(1, pages)) setCurrentPage(Math.max(1, pages));
    } catch (err) {
      if (requestId === fetchRequestId.current) showError(err.message || 'Failed to load accident reports');
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
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
      title: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      time: '10:30',
      factory: user?.factoryName || '',
      department: '',
      severity: 'Moderate',
      witnessDetails: { name: '', phone: '', statement: '' },
      worker: ''
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title || '',
      description: report.description || '',
      date: report.date ? new Date(report.date).toISOString().slice(0, 10) : '',
      time: report.time || '10:00',
      factory: report.factory || '',
      department: report.department || '',
      severity: report.severity || 'Moderate',
      witnessDetails: report.witnessDetails || { name: '', phone: '', statement: '' },
      worker: report.worker?._id || report.worker || ''
    });
    setEditModalOpen(true);
  };

 const openViewModal = async (report) => {
  try {

    const response = await accidentService.getReportById(report._id);

    setSelectedReport(response.data);

    setViewModalOpen(true);

  } catch (error) {

    console.error(error);

  }
};

  const openStatusModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status || 'Reported');
    setStatusModalOpen(true);
  };

  const openImageModal = (report) => {
    if (!canUploadEvidenceForReport(report, user)) return;
    setSelectedReport(report);
    setSelectedImages([]);
    setImageModalOpen(true);
  };

  const openDeleteDialog = (report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await accidentService.createReport(formData);
      showSuccess('Accident report logged successfully!');
      setCreateModalOpen(false);
      fetchReports();
    } catch (err) {
      showError(err.message || 'Failed to create accident report');
    } finally {
      setSubmitting(false);
    }
  };

  // const handleUpdateReport = async (e) => {
  //   e.preventDefault();
  //   if (!selectedReport) return;
  //   setSubmitting(true);
  //   try {
  //     await accidentService.updateReport(selectedReport._id, formData);
  //     showSuccess('Accident report updated!');
  //     setEditModalOpen(false);
  //     fetchReports();
  //   } catch (err) {
  //     showError(err.message || 'Failed to update report');
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleUpdateReport = async (e) => {
  e.preventDefault();

  if (!selectedReport) return;

  setSubmitting(true);

  try {
    const payload = { ...formData };

    if (!payload.worker) {
      delete payload.worker;
    }

    await accidentService.updateReport(
      selectedReport._id,
      payload
    );

    showSuccess('Accident report updated!');
    setEditModalOpen(false);
    fetchReports();

  } catch (err) {
    showError(err.message || 'Failed to update report');
  } finally {
    setSubmitting(false);
  }
};

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      await accidentService.updateReportStatus(selectedReport._id, { status: newStatus });
      showSuccess(`Accident report status changed to ${newStatus}`);
      setStatusModalOpen(false);
      fetchReports();
    } catch (err) {
      showError(err.message || 'Failed to update report status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();
    if (!selectedReport || !canUploadEvidenceForReport(selectedReport, user)) {
      showError('You can only upload evidence to accident reports you reported.');
      setImageModalOpen(false);
      return;
    }
    if (!selectedReport || !selectedImages.length) {
      showError('Please select at least one evidence image to upload.');
      return;
    }
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      const filesArray = Array.isArray(selectedImages) ? selectedImages : [selectedImages];
      filesArray.forEach((file) => formDataToSend.append('images', file));

      await accidentService.uploadImages(selectedReport._id, formDataToSend);
      showSuccess('Accident evidence photos uploaded successfully!');
      setImageModalOpen(false);
      fetchReports();
    } catch (err) {
      showError(err.message || 'Failed to upload image attachments');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) return;
    setSubmitting(true);
    try {
      await accidentService.deleteReport(selectedReport._id);
      showSuccess('Accident report deleted.');
      setDeleteDialogOpen(false);
      fetchReports();
    } catch (err) {
      showError(err.message || 'Failed to delete accident report');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Accident Title',
      render: (row) => <p className="text-sm font-semibold text-[#1E1E1E]">{row.title}</p>
    },
    {
      header: 'Factory',
      render: (row) => <span className="text-sm text-[#333]">{accidentTableValue(row.factory)}</span>
    },
    {
      header: 'Injury Type',
      render: (row) => <span className="text-sm text-[#333]">{accidentTableValue(row.injuryType)}</span>
    },
    {
      header: 'Severity',
      render: (row) => <StatusBadge status={row.severity} variant="dot" />
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} variant="dot" />
    },
    {
      header: 'Reported Date',
      render: (row) => <span className="whitespace-nowrap text-sm text-[#444]">{accidentTableDate(row.date)}</span>
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => openViewModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="View Details" aria-label="View details">
            <Eye className="h-4 w-4" />
          </button>
          {canUploadEvidenceForReport(row, user) && (
            <button type="button" onClick={() => openImageModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Upload Evidence" aria-label="Upload evidence">
              <Upload className="h-4 w-4" />
            </button>
          )}
          {(isSuperAdmin || (isWorker && isOwnedByUser(row, user) && row.status === 'Reported')) && (
            <button type="button" onClick={() => openEditModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Edit Report" aria-label="Edit report">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {isAdminOrOfficer && (
            <button type="button" onClick={() => openStatusModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Update Status" aria-label="Update status">
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {(isSuperAdmin || (isWorker && isOwnedByUser(row, user))) && (
            <button type="button" onClick={() => openDeleteDialog(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Delete Report" aria-label="Delete report">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <style>{`
        .accident-create-dialog {
          border-color: #e1e4e8 !important;
          background: #fff !important;
          box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
          display: flex !important;
          flex-direction: column !important;
          height: min(70vh, calc(100dvh - 32px));
          min-height: 0 !important;
        }
        .fixed.inset-0.z-50:has(.accident-create-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .32) !important;
          backdrop-filter: none !important;
        }
        .accident-create-dialog > div:first-child {
          border-bottom-color: #e1e4e8 !important;
          background: #fff !important;
          flex: 0 0 auto;
        }
        .accident-create-dialog > div:nth-child(2) {
          flex: 1 1 auto;
          min-height: 0;
          max-height: none !important;
          overflow-y: auto !important;
        }
        .accident-create-dialog > div:last-child {
          flex: 0 0 auto;
          border-top: 1px solid #e1e4e8 !important;
          background: #fff !important;
          padding-bottom: 16px !important;
        }
        .accident-create-dialog > div:first-child h3 {
          color: #111 !important;
          font-weight: 600;
        }
        .accident-create-dialog > div:first-child button {
          color: #62666b !important;
        }
        .accident-create-dialog > div:first-child button:hover {
          background: #f3f4f5 !important;
          color: #111 !important;
        }
        .accident-create-dialog label {
          color: #292929 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .accident-create-dialog label span {
          color: #E87532 !important;
        }
        .accident-create-dialog input,
        .accident-create-dialog select,
        .accident-create-dialog textarea {
          border: 1px solid #dedede !important;
          border-radius: 8px !important;
          background-color: #fff !important;
          color: #111 !important;
          font-size: 14px !important;
          box-shadow: none !important;
        }
        .accident-create-dialog input[type="date"]::-webkit-calendar-picker-indicator,
        .accident-create-dialog input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
        }
        .accident-create-dialog select {
          padding-right: 36px !important;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
          background-position: right 12px center !important;
          background-repeat: no-repeat !important;
          background-size: 16px !important;
        }
        .accident-create-dialog select::-ms-expand {
          display: none;
        }
        .accident-create-dialog input::placeholder,
        .accident-create-dialog textarea::placeholder {
          color: #858b92 !important;
          opacity: 1;
        }
        .accident-create-dialog input:focus,
        .accident-create-dialog select:focus,
        .accident-create-dialog textarea:focus {
          border-color: #d1a184 !important;
          box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
          outline: none;
        }
        .accident-create-dialog form > div:has(> p:first-child) {
          border: 0 !important;
          border-top: 1px solid #e5e5e5 !important;
          border-radius: 0 !important;
          background: #fff !important;
          padding: 14px 0 0 !important;
        }
        .accident-create-dialog form > div > p:first-child {
          color: #292929 !important;
          font-size: 13px !important;
        }
        .accident-create-dialog > div:last-child button {
          min-height: 40px;
          border-radius: 8px !important;
          font-weight: 500;
        }
        .accident-status-dialog,
        .accident-evidence-dialog {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: calc(100dvh - 48px) !important;
          border-color: #e1e4e8 !important;
          border-radius: 14px !important;
          background: #fff !important;
          box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
        }
        .fixed.inset-0.z-50:has(.accident-status-dialog) > .fixed.top-0.left-0.w-screen.h-screen,
        .fixed.inset-0.z-50:has(.accident-evidence-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .42) !important;
          backdrop-filter: none !important;
        }
        .accident-status-dialog > div:first-child,
        .accident-evidence-dialog > div:first-child {
          flex: 0 0 auto;
          border-bottom-color: #e1e4e8 !important;
          background: #fff !important;
        }
        .accident-status-dialog > div:first-child h3,
        .accident-evidence-dialog > div:first-child h3 { color: #111 !important; font-weight: 600 !important; }
        .accident-status-dialog > div:first-child button,
        .accident-evidence-dialog > div:first-child button { color: #62666b !important; }
        .accident-status-dialog > div:first-child button:hover,
        .accident-evidence-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
        .accident-status-dialog > div:nth-child(2),
        .accident-evidence-dialog > div:nth-child(2) {
          flex: 0 1 auto;
          min-height: 0;
          max-height: min(65vh, calc(100dvh - 150px)) !important;
          overflow-y: auto !important;
          background: #fff !important;
          padding: 18px 24px !important;
        }
        .accident-status-dialog form,
        .accident-evidence-dialog form { display: flex; flex-direction: column; gap: 12px; }
        .accident-status-dialog form > :not([hidden]) ~ :not([hidden]),
        .accident-evidence-dialog form > :not([hidden]) ~ :not([hidden]) { margin-top: 0 !important; }
        .accident-status-dialog form > div:last-child,
        .accident-evidence-dialog form > div:last-child { display: flex; justify-content: flex-end; gap: 10px; padding-top: 2px; }
        .accident-status-dialog form button,
        .accident-evidence-dialog form button { min-height: 40px; border-radius: 8px !important; box-shadow: none !important; transform: none !important; }
        .accident-status-dialog form button:focus,
        .accident-evidence-dialog form button:focus { outline: none !important; box-shadow: none !important; }
        .accident-evidence-dialog label { color: #292929 !important; font-size: 13px !important; font-weight: 500 !important; text-transform: none !important; letter-spacing: normal !important; }
        .accident-evidence-dialog .border-dashed {
          border: 1px dashed #cfd3d8 !important;
          border-radius: 10px !important;
          background: #fff !important;
          padding: 22px !important;
        }
        .accident-evidence-dialog .border-dashed:hover { border-color: #e87532 !important; background: #fff !important; }
        .accident-evidence-dialog .border-dashed svg { color: #e87532 !important; }
        .accident-evidence-dialog .border-dashed .text-sand-700 { color: #111 !important; }
        .accident-evidence-dialog .border-dashed .text-sand-500 { color: #6b7280 !important; }
        .accident-evidence-dialog .bg-sand-50 { border-color: #e1e4e8 !important; background: #f8f9fa !important; }
        .accident-evidence-dialog .text-sand-700 { color: #292929 !important; }
        .accident-evidence-dialog .text-sand-400 { color: #6b7280 !important; }
        .accident-status-menu .search-filter-option { min-height: 36px !important; padding: 7px 9px !important; }
        .accident-status-menu .search-filter-option-content {
          display: inline-flex !important;
          min-width: 0;
          align-items: center !important;
          gap: 10px !important;
        }
        .accident-status-menu .search-filter-option-icon {
          width: 16px !important;
          height: 16px !important;
          flex: 0 0 16px !important;
        }
        .accident-status-menu .search-filter-option-content > span { min-width: 0; }
        .accident-status-dialog .dialog-search-filter-trigger[data-icon-type="status"] {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        .accident-status-dialog .dialog-search-filter-trigger[data-icon-type="status"] .search-filter-selected-content {
          display: inline-flex !important;
          flex: 1 1 auto;
          min-width: 0;
          flex-direction: row !important;
          align-items: center !important;
          gap: 8px !important;
        }
        .accident-status-dialog .dialog-search-filter-trigger[data-icon-type="status"] .search-filter-selected-icon {
          width: 16px !important;
          height: 16px !important;
          flex: 0 0 16px !important;
        }
        .accident-status-dialog .dialog-search-filter-trigger[data-icon-type="status"] .search-filter-selected-content > span {
          min-width: 0;
          line-height: 1.3;
        }
        .accident-status-dialog .dialog-search-filter-trigger[data-icon-type="status"] > svg:last-child {
          flex: 0 0 16px;
          align-self: center;
        }
        .accident-view-dialog {
          display: flex !important;
          height: auto;
          min-height: 0 !important;
          max-height: calc(100dvh - 32px);
          flex-direction: column !important;
          border-color: #e1e4e8 !important;
          background: #fff !important;
          box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
        }
        .fixed.inset-0.z-50:has(.accident-view-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .32) !important;
          backdrop-filter: none !important;
        }
        .accident-view-dialog > div:first-child {
          flex: 0 0 auto;
          border-bottom-color: #e5e5e5 !important;
          background: #fff !important;
        }
        .accident-view-dialog > div:first-child h3 { color: #111 !important; font-weight: 600; }
        .accident-view-dialog > div:first-child button { color: #62666b !important; }
        .accident-view-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
        .accident-view-dialog > div:nth-child(2) {
          flex: 1 1 auto;
          min-height: 0;
          max-height: none !important;
          overflow-y: auto !important;
          background: #fff;
        }
        .accident-view-dialog > div:last-child {
          flex: 0 0 auto;
          border-top: 1px solid #e5e5e5 !important;
          background: #fff !important;
        }
        .accidents-table .data-table-pagination-control.is-current,
        .accidents-table .data-table-pagination-control.is-current:hover {
          border-color: #111111 !important;
          background: #111111 !important;
          color: #ffffff !important;
        }
        .accidents-hero-art {
          right: -6px;
          background-size: auto calc(100% + 2px);
          background-position: right center;
          background-repeat: no-repeat;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, .2) 38%, #000 76%, #000 100%);
          mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, .2) 38%, #000 76%, #000 100%);
        }
        .accidents-page .accidents-create-cta {
          background-color: #111111 !important;
          color: #ffffff !important;
          box-shadow: none !important;
        }
        .accidents-page .accidents-create-cta:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
        .accidents-page button.midc-primary-cta {
          background-color: #111111 !important;
          color: #ffffff !important;
          box-shadow: none !important;
        }
        .accidents-page button.midc-primary-cta:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
        .accidents-filter .accidents-search-field input {
          height: 48px;
          min-height: 48px;
          border-color: #e1e4e8 !important;
          border-radius: 8px !important;
          background-color: #fff !important;
          color: #111 !important;
          font-size: 14px !important;
          box-shadow: none;
          transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
        }
        .accidents-filter .accidents-search-field input {
          padding-left: 40px !important;
          padding-right: 36px !important;
          color: #111 !important;
        }
        .accidents-filter .accidents-search-field input::placeholder {
          color: #747b84 !important;
          opacity: 1;
        }
        .accidents-filter .accidents-search-field > div {
          color: #6b7280 !important;
        }
        .accidents-filter .accidents-search-field input:hover {
          border-color: #cfd3d8 !important;
          background: #fefefe !important;
        }
        .accidents-filter .accidents-search-field input:focus {
          border-color: #b8b8b8 !important;
          box-shadow: 0 0 0 2px rgba(232, 117, 50, .14) !important;
          outline: none;
        }
        .worker-accident-delete-dialog {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: calc(100dvh - 48px) !important;
          border-color: #e1e4e8 !important;
          border-radius: 14px !important;
          background: #ffffff !important;
          box-shadow: 0 12px 32px rgba(17, 17, 17, .12) !important;
        }
        .fixed.inset-0.z-50:has(.worker-accident-delete-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .42) !important;
          backdrop-filter: none !important;
        }
        .worker-accident-delete-dialog > div:first-child {
          flex: 0 0 auto;
          border-bottom: 1px solid #e1e4e8 !important;
          background: #ffffff !important;
        }
        .worker-accident-delete-dialog > div:first-child h3 {
          color: #111111 !important;
          font-weight: 600 !important;
        }
        .worker-accident-delete-dialog > div:first-child button {
          color: #64748b !important;
        }
        .worker-accident-delete-dialog > div:first-child button:hover {
          background: #f1f5f9 !important;
          color: #111111 !important;
        }
        .worker-accident-delete-dialog > div:nth-child(2) {
          flex: 0 1 auto;
          min-height: 0;
          max-height: calc(100dvh - 180px) !important;
          overflow-y: auto !important;
          padding: 18px 24px !important;
          background: #ffffff !important;
        }
        .worker-accident-delete-dialog > div:nth-child(2) > div:first-child {
          align-items: center;
          gap: 12px;
        }
        .worker-accident-delete-dialog > div:nth-child(2) > div:first-child > div:first-child {
          background: #f1f5f9 !important;
          color: #e87532 !important;
          padding: 10px !important;
          box-shadow: none !important;
        }
        .worker-accident-delete-dialog > div:nth-child(2) > div:first-child > div:first-child svg {
          width: 20px;
          height: 20px;
        }
        .worker-accident-delete-dialog > div:nth-child(2) p {
          color: #1f2937 !important;
          font-size: 15px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
        }
        .worker-accident-delete-dialog > div:last-child {
          flex: 0 0 auto;
          justify-content: flex-end;
          gap: 8px !important;
          border-top: 1px solid #e1e4e8 !important;
          padding: 12px 20px !important;
          background: #ffffff !important;
        }
        .worker-accident-delete-dialog > div:last-child button {
          min-height: 40px;
          border-radius: 8px !important;
          font-weight: 500 !important;
          box-shadow: none !important;
          transform: none !important;
        }
        .worker-accident-delete-dialog > div:last-child button:first-child {
          border: 1px solid #cbd5e1 !important;
          background: #ffffff !important;
          color: #111111 !important;
        }
        .worker-accident-delete-dialog > div:last-child button:first-child:hover:not(:disabled) {
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
        }
        .worker-accident-delete-dialog > div:last-child button:last-child {
          border: 1px solid #111111 !important;
          background: #111111 !important;
          color: #ffffff !important;
        }
        .worker-accident-delete-dialog > div:last-child button:last-child:hover:not(:disabled) {
          background: #292929 !important;
          border-color: #292929 !important;
        }
        .worker-accident-delete-dialog > div:last-child button:focus-visible {
          outline: 2px solid #94a3b8 !important;
          outline-offset: 2px;
          box-shadow: none !important;
        }
        .worker-accident-edit-dialog {
          display: flex !important;
          flex-direction: column !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: calc(100dvh - 48px) !important;
          border-color: #e1e4e8 !important;
          background: #ffffff !important;
          box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
        }
        .fixed.inset-0.z-50:has(.worker-accident-edit-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .32) !important;
          backdrop-filter: none !important;
        }
        .worker-accident-edit-dialog > div:first-child {
          flex: 0 0 auto;
          border-bottom-color: #e1e4e8 !important;
          background: #ffffff !important;
        }
        .worker-accident-edit-dialog > div:nth-child(2) {
          flex: 0 1 auto;
          min-height: 0;
          max-height: calc(100dvh - 180px) !important;
          overflow-y: auto !important;
          background: #ffffff !important;
        }
        .worker-accident-edit-dialog > div:last-child {
          flex: 0 0 auto;
          border-top: 1px solid #e1e4e8 !important;
          background: #ffffff !important;
          padding-bottom: 16px !important;
        }
        .worker-accident-edit-dialog > div:first-child h3 { color: #111111 !important; font-weight: 600 !important; }
        .worker-accident-edit-dialog > div:first-child button { color: #62666b !important; }
        .worker-accident-edit-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111111 !important; }
        .worker-accident-edit-dialog label {
          margin-bottom: 6px !important;
          color: #292929 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .worker-accident-edit-dialog label span { color: #e87532 !important; }
        .worker-accident-edit-dialog input,
        .worker-accident-edit-dialog select {
          height: 46px !important;
          min-height: 46px !important;
          padding: 0 14px !important;
          border: 1px solid #dedede !important;
          border-radius: 8px !important;
          background-color: #ffffff !important;
          color: #111111 !important;
          font-size: 14px !important;
          box-shadow: none !important;
        }
        .worker-accident-edit-dialog textarea {
          min-height: 120px !important;
          padding: 11px 14px !important;
          border: 1px solid #dedede !important;
          border-radius: 8px !important;
          background: #ffffff !important;
          color: #111111 !important;
          font-size: 14px !important;
          line-height: 1.5;
          resize: none !important;
          box-shadow: none !important;
        }
        .worker-accident-edit-dialog input:focus,
        .worker-accident-edit-dialog select:focus,
        .worker-accident-edit-dialog textarea:focus {
          border-color: #d1a184 !important;
          box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
          outline: none;
        }
        .worker-accident-edit-dialog > div:last-child button {
          min-height: 40px;
          border-radius: 8px !important;
          font-size: 13px;
          font-weight: 500;
        }
        .worker-accident-edit-dialog button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(232, 117, 50, .14) !important; }
        @media (max-width: 640px) {
          .worker-accident-edit-dialog > div:nth-child(2) { max-height: calc(100dvh - 160px) !important; }
        }
      `}</style>

      <div className="accidents-page space-y-6">
        <section className="accidents-hero relative isolate -mx-4 -mt-4 min-h-[278px] w-[calc(100%+2rem)] overflow-hidden bg-[#F7F8F8] sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]" aria-labelledby="accident-reports-title">
          <div className="accidents-hero-copy relative z-10 flex min-h-[278px] items-start px-4 pt-7 sm:items-center sm:py-7 sm:px-6 lg:px-8">
            <div className="w-full max-w-[740px] lg:w-[52%]">
              <h1 id="accident-reports-title" className="!mb-0 !text-[30px] !font-semibold !leading-tight !tracking-[-.035em] !text-[#111] sm:!text-[42px] lg:!text-[44px]">
                Accident Reports
              </h1>
              <p className="mt-2 max-w-[470px] text-[16px] leading-[1.5] text-[#6B7280] sm:text-[17px]">
                Log, track, investigate and resolve industrial accidents.
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="accidents-hero-art absolute inset-0 z-0 hidden xl:block"
            style={{ backgroundImage: `url(${accidentHeroWide})` }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-0 xl:hidden">
            <img src={accidentHeroWide} alt="" className="block h-auto w-full object-contain object-center" />
          </div>
        </section>

        <section className="accidents-filter search-filter-controls grid grid-cols-1 items-center gap-3 bg-transparent p-0 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]" aria-label="Search and filter accident reports">
          <SearchBar
            className="accidents-search-field"
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
            placeholder="Search by accident title, factory, or department..."
          />

          <SearchFilterSelect
            value={severityFilter}
            onValueChange={(value) => {
              setSeverityFilter(value);
              setCurrentPage(1);
            }}
            options={severityOptions}
            label="All Severities"
            iconType="severity"
          />

          <SearchFilterSelect
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            options={statusOptions}
            label="All Statuses"
            iconType="status"
          />
          <button type="button" onClick={openCreateModal} className="midc-primary-cta accidents-create-cta inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-white transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Accident Report
          </button>
        </section>

        <div className="accidents-table standard-data-table-shell">
          {loading || reports.length > 0 ? (
            <Table columns={columns} data={reports} loading={loading} className="platform-data-table" />
          ) : (
          <section className="standard-data-table-empty flex min-h-[160px] flex-col items-center justify-center px-5 py-6 text-center" aria-live="polite">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f2f2] text-[#59616a]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-[16px] font-semibold text-[#111]">No Accident Reports Found</h2>
            <p className="mt-1 max-w-md text-[13px] leading-5 text-[#6B7280]">
              There are no industrial accident reports registered matching your search.
            </p>
          </section>
          )}
          <DataTablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
            itemLabel="accident reports"
          />
        </div>

      {/* Modal: Create Accident Report */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Log New Workplace Accident Report"
        dialogClassName="accident-create-dialog"
        footer={
          <>
            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="accident-create-form"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Submit Report
            </Button>
          </>
        }
      >
        <form id="accident-create-form" onSubmit={handleCreateReport} className="space-y-4">
          <Input label="Accident Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Mechanical Press Pinch Injury" required />
          <Textarea label="Accident Description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Provide detailed explanation of the incident..." required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Date of Incident" type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            <Input label="Time of Incident" type="time" name="time" value={formData.time} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Factory Name" name="factory" value={formData.factory} onChange={handleInputChange} required />
            <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SearchFilterSelect
              label="Incident Severity"
              formField
              name="severity"
              value={formData.severity}
              onValueChange={(value) => handleInputChange({ target: { name: 'severity', value } })}
              options={severityOptions}
              required
              allowClear={false}
            />
            <Input
              label="Involved Worker (Optional)"
              name="worker"
              value={formData.worker}
              onChange={handleInputChange}
              placeholder="Select worker if applicable"
            />
          </div>

          <div className="space-y-3 border-t border-[#e5e5e5] pt-4">
            <p className="text-xs font-semibold text-[#111]">Witness Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input label="Witness Name" name="witnessDetails.name" value={formData.witnessDetails?.name} onChange={handleInputChange} />
              <Input label="Witness Phone" name="witnessDetails.phone" value={formData.witnessDetails?.phone} onChange={handleInputChange} />
            </div>
            <Textarea label="Witness Statement" name="witnessDetails.statement" value={formData.witnessDetails?.statement} onChange={handleInputChange} rows={2} />
          </div>

        </form>
      </Modal>

      {/* Modal: Edit Report */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={isWorker ? 'Update Accident Report' : 'Edit Accident Report'}
        dialogClassName={isWorker ? 'worker-accident-edit-dialog' : ''}
        footer={isWorker ? (
          <>
            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="worker-accident-edit-form"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Update Report
            </Button>
          </>
        ) : undefined}
      >
        <form
          id={isWorker ? 'worker-accident-edit-form' : undefined}
          onSubmit={handleUpdateReport}
          className="space-y-4"
        >
          {isWorker ? (
            <>
              <Input label="Accident Title" name="title" value={formData.title} onChange={handleInputChange} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Factory Name" name="factory" value={formData.factory} onChange={handleInputChange} required />
                <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} required />
              </div>
              <Select label="Incident Severity" name="severity" value={formData.severity} onChange={handleInputChange} options={severityOptions} required />
              <Textarea label="Accident Description" name="description" value={formData.description} onChange={handleInputChange} required />
            </>
          ) : (
            <>
              <Input label="Accident Title" name="title" value={formData.title} onChange={handleInputChange} required />
              <Textarea label="Accident Description" name="description" value={formData.description} onChange={handleInputChange} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Factory Name" name="factory" value={formData.factory} onChange={handleInputChange} required />
                <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} required />
              </div>
              <Select label="Incident Severity" name="severity" value={formData.severity} onChange={handleInputChange} options={severityOptions} required />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={submitting} className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]">Update Report</Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Accident Incident Detail View"
        maxWidth="max-w-[820px]"
        dialogClassName="accident-view-dialog"
        footer={(
          <Button
            variant="secondary"
            className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </Button>
        )}
      >
        <style>{`
          .accident-view-dialog { display: flex !important; flex-direction: column !important; height: 78vh !important; min-height: 0 !important; max-height: min(80vh, calc(100dvh - 80px)) !important; border-radius: 14px !important; box-shadow: 0 18px 50px rgba(0,0,0,.18) !important; }
          .accident-view-dialog > div:first-child { padding: 16px 20px !important; background: #fff !important; }
          .accident-view-dialog > div:first-child h3 { color: #111 !important; font-size: 20px !important; line-height: 1.3 !important; font-weight: 700 !important; }
          .accident-view-dialog > div:first-child button { border-radius: 8px !important; color: #626b78 !important; }
          .accident-view-dialog > div:first-child button:hover { background: #f3f4f6 !important; color: #111 !important; }
          .fixed.inset-0.z-50:has(.accident-view-dialog) > .fixed.top-0.left-0.w-screen.h-screen { background: rgba(17,17,17,.52) !important; backdrop-filter: none !important; }
          .accident-view-dialog > div:nth-child(2) { flex: 1 1 auto !important; min-height: 0 !important; max-height: none !important; overflow-y: auto !important; overscroll-behavior: contain; padding: 12px 16px !important; }
          .accident-view-dialog > div:last-child { flex: 0 0 auto !important; margin-top: auto !important; padding: 10px 24px !important; background: #fff !important; }
          @media (max-width: 640px) { .accident-view-dialog { height: min(78vh, calc(100dvh - 80px)) !important; } }
        `}</style>
        {selectedReport && (
          <div className="space-y-2.5 text-[#111]">
            {(() => {
              const severity = String(selectedReport.severity || 'Not provided');
              const status = String(selectedReport.status || 'Not provided');
              const severityColor = /fatal|critical|severe/i.test(severity) ? '#dc2626' : '#f59e0b';
              const statusColor = /resolved|closed/i.test(status) ? '#16a34a' : /investigat/i.test(status) ? '#f59e0b' : '#64748b';
              const DetailField = ({ label, value, className = '' }) => (
                <div className={`min-w-0 ${className}`}>
                  <dt className="text-[13px] leading-5 text-[#596579]">{label}</dt>
                  <dd className="mt-0.5 break-words text-[15px] leading-5 text-[#111]">{accidentDetailValue(value)}</dd>
                </div>
              );
              const DetailCard = ({ title, icon: Icon, children, className = '' }) => (
                <section className={`rounded-xl border border-[#e6e9ee] bg-white p-3 ${className}`}>
                  <h4 className="mb-3 flex items-center gap-2.5 text-[16px] font-semibold leading-5 text-[#111]">
                    <Icon className="h-5 w-5 shrink-0 text-[#111]" aria-hidden="true" />
                    {title}
                  </h4>
                  {children}
                </section>
              );
              const factory = selectedReport.factory || selectedReport.factoryName;
              const location = selectedReport.location || factory;
              const description = accidentDetailValue(selectedReport.description);
              const evidence = Array.isArray(selectedReport.images) ? selectedReport.images : [];
              return (
                <>
                  <section className="grid grid-cols-1 items-center gap-3 rounded-xl border border-[#e2e6eb] bg-[#fbfcfd] p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl bg-[#fff0e5] text-[#f26722]">
                        <AlertTriangle className="h-8 w-8" strokeWidth={2.2} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="break-words text-[18px] font-semibold leading-6 text-black">{accidentDetailValue(selectedReport.title)}</h4>
                        <p className="mt-1 break-words text-[14px] leading-5 text-[#596579]">
                          {accidentDetailValue(factory)} <span className="mx-1">•</span> Department: {accidentDetailValue(selectedReport.department)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 pl-[74px] sm:pl-0">
                      <div className="min-w-[88px]">
                        <p className="text-[13px] leading-5 text-[#596579]">Severity</p>
                        <p className="mt-0.5 flex items-center gap-2 text-[15px] leading-5 text-[#111]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: severityColor }} />{accidentDetailValue(selectedReport.severity)}</p>
                      </div>
                      <div className="min-w-[88px]">
                        <p className="text-[13px] leading-5 text-[#596579]">Status</p>
                        <p className="mt-0.5 flex items-center gap-2 text-[15px] leading-5 text-[#111]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColor }} />{accidentDetailValue(selectedReport.status)}</p>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 gap-2.5 md:grid-cols-[1.05fr_1fr]">
                    <DetailCard title="Incident Information" icon={FileText} className="md:row-span-2">
                      <dl className="grid grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] gap-x-3 gap-y-3">
                        <DetailField label="Accident Title" value={selectedReport.title} />
                        <div />
                        <DetailField label="Accident Date" value={accidentDetailDate(selectedReport.date)} />
                        <DetailField label="Time" value={selectedReport.time} />
                        <DetailField label="Factory / Location" value={location} className="col-span-2" />
                        <DetailField label="Department" value={selectedReport.department} className="col-span-2" />
                        <DetailField label="Report Source" value={selectedReport.reportSource} className="col-span-2" />
                      </dl>
                    </DetailCard>

                    <DetailCard title="Involved Worker" icon={UserRound}>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <DetailField label="Worker Name" value={selectedReport.worker?.name} />
                        <DetailField label="Employee ID" value={selectedReport.worker?.employeeId} />
                        <DetailField label="Phone Number" value={selectedReport.worker?.phone} className="col-span-2" />
                      </dl>
                    </DetailCard>

                    <DetailCard title="Witness Details" icon={Eye}>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <DetailField label="Witness Name" value={selectedReport.witnessDetails?.name} />
                        <DetailField label="Witness Phone" value={selectedReport.witnessDetails?.phone} />
                        <DetailField label="Witness Statement" value={selectedReport.witnessDetails?.statement} className="col-span-2" />
                      </dl>
                    </DetailCard>
                  </div>

                  <DetailCard title="Description" icon={FileText}>
                    <p className="rounded-lg bg-[#f3f4f6] px-3.5 py-2.5 text-[15px] leading-5 text-[#111] whitespace-pre-wrap break-words">{description}</p>
                  </DetailCard>

                  {evidence.length > 0 && (
                    <DetailCard title="Evidence Photos" icon={FileText}>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {evidence.map((image, index) => (
                          <a key={image._id || image.publicId || image.url || index} href={image.url} target="_blank" rel="noreferrer" className="block">
                            <img src={image.url} alt="Accident evidence" className="h-28 w-full rounded-lg border border-[#e5e5e5] object-cover" />
                          </a>
                        ))}
                      </div>
                    </DetailCard>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      {/* Modal: Status Update */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Incident Status"
        maxWidth="max-w-md"
        dialogClassName="accident-status-dialog"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <SearchFilterSelect
            label="Select New Status"
            formField
            value={newStatus}
            onValueChange={setNewStatus}
            options={statusOptions}
            required
            allowClear={false}
            iconType="status"
            menuClassName="accident-status-menu"
            matchSelectedOptionColor
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting} className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]">Update Status</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Upload Evidence Images */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Attach Evidence Photos"
        maxWidth="max-w-md"
        dialogClassName="accident-evidence-dialog"
      >
        <form onSubmit={handleUploadImages} className="space-y-4">
          <FileUpload
            label="Select Evidence Images"
            multiple
            onChange={(files) => setSelectedImages(files)}
            accept="image/*"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={() => setImageModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting} className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]">Upload Attachments</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteReport}
        title="Delete Accident Report"
        message="Are you sure you want to permanently delete this accident report?"
        loading={submitting}
        dialogClassName={isWorker ? 'worker-accident-delete-dialog' : ''}
      />
      </div>
    </>
  );
};

export default AccidentReports;
