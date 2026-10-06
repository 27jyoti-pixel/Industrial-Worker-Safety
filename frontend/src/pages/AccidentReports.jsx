import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchFilterSelect from '../components/common/SearchFilterSelect';
import Textarea from '../components/common/Textarea';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';
import accidentHeroWide from '../assets/accident-reports-hero-wide.png';

const AccidentReports = () => {
  const { user, isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

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
  }, [currentPage, searchQuery, severityFilter, statusFilter]);

  useEffect(() => {
    // Load workers list for dropdown assignment
    const loadWorkers = async () => {
      try {
        const res = await workerService.getAllWorkers({ limit: 100 });
        setWorkersList(res.workers || res.data || []);
      } catch (err) {
        console.error('Failed to fetch workers dropdown', err);
      }
    };
    loadWorkers();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await accidentService.getAllReports({
        search: searchQuery,
        severity: severityFilter,
        status: statusFilter,
        page: currentPage,
        limit: 10
      });
      const dataList = response.accidents || response.data || [];
      setReports(dataList);
      setTotalPages(response.pages || response.totalPages || 1);
      setTotalItems(response.total || dataList.length);
    } catch (err) {
      showError(err.message || 'Failed to load accident reports');
    } finally {
      setLoading(false);
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
      header: 'Factory / Location',
      render: (row) => <span className="text-sm text-[#333]">{row.factory || '—'}</span>
    },
    {
      header: 'Injury Type',
      render: (row) => <span className="text-sm text-[#333]">{row.injuryType || '—'}</span>
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
      render: (row) => <span className="whitespace-nowrap text-sm text-[#444]">{row.date ? new Date(row.date).toLocaleDateString() : '—'}</span>
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
          {(user?.role === 'Worker' || isFactoryAdmin || isSuperAdmin) && (
            <button type="button" onClick={() => openImageModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Upload Evidence" aria-label="Upload evidence">
              <Upload className="h-4 w-4" />
            </button>
          )}
          {isSuperAdmin && (
            <button type="button" onClick={() => openEditModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Edit Report" aria-label="Edit report">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {isAdminOrOfficer && (
            <button type="button" onClick={() => openStatusModal(row)} className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]" title="Update Status" aria-label="Update status">
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          {isSuperAdmin && (
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
        .accidents-table .industrial-card {
          border: 1px solid #e5e5e5 !important;
          border-radius: 10px !important;
          background: #fff !important;
          box-shadow: none !important;
        }
        .accidents-pagination > div {
          border-color: #e5e5e5 !important;
          border-radius: 10px !important;
          box-shadow: none !important;
        }
        .accidents-pagination button {
          border-color: #e5e5e5 !important;
          border-radius: 8px !important;
          color: #333 !important;
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
            onClear={() => setSearchQuery('')}
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

        {loading || reports.length > 0 ? (
          <div className="accidents-table overflow-hidden rounded-lg">
            <Table columns={columns} data={reports} loading={loading} className="platform-data-table" />
          </div>
        ) : (
          <section className="flex min-h-[160px] flex-col items-center justify-center rounded-lg border border-[#e5e5e5] bg-white px-5 py-6 text-center" aria-live="polite">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f2f2] text-[#59616a]">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-[16px] font-semibold text-[#111]">No Accident Reports Found</h2>
            <p className="mt-1 max-w-md text-[13px] leading-5 text-[#6B7280]">
              There are no industrial accident reports registered matching your search.
            </p>
          </section>
        )}

        <div className="accidents-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
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
        title="Edit Accident Report"
      >
        <form onSubmit={handleUpdateReport} className="space-y-4">
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
        </form>
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Accident Incident Detail View"
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 p-4 bg-[#FFF8E8] rounded-2xl border border-[#E0E0E0]">
              <div>
                <h3 className="text-base font-bold text-[#1E1E1E]">{selectedReport.title}</h3>
                <p className="text-xs text-[#6C757D] mt-1">
                  {selectedReport.factory} &bull; Department: {selectedReport.department}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={selectedReport.severity} />
                <StatusBadge status={selectedReport.status} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-[#111] bg-white p-3 rounded-xl border border-[#E0E0E0] leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

           {selectedReport.images && selectedReport.images.length > 0 && (
  <div>
    <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-2">
      Evidence Photo Attachments
    </p>

    <div className="space-y-3">
      {selectedReport.images.map((img, idx) => (
        <div
          key={idx}
          className="border border-[#E0E0E0] rounded-xl p-3"
        >

          <a
            href={img.url}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={img.url}
              alt="Evidence"
              className="w-32 h-32 object-cover rounded-xl"
            />
          </a>


          <div className="mt-2 text-xs text-[#6C757D]">

            <p>
              Uploaded By:
              {" "}
              <span className="font-semibold">
                {img.uploadedBy?.name || "Unknown User"}
              </span>
            </p>

            <p>
              Role:
              {" "}
              <span className="font-semibold">
                {img.uploadedBy?.role || img.uploadedByRole || "Unknown"}
              </span>
            </p>


            <p>
              Uploaded At:
              {" "}
              {img.uploadedAt
                ? new Date(img.uploadedAt).toLocaleString()
                : "Unknown"}
            </p>

          </div>

        </div>
      ))}
    </div>

  </div>
)}

            <div className="flex justify-end">
              <Button variant="secondary" className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Status Update */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Incident Status"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <Select
            label="Select New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={statusOptions}
            required
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
      />
      </div>
    </>
  );
};

export default AccidentReports;
