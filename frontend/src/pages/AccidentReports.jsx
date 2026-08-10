import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import accidentService from '../services/accidentService';
import workerService from '../services/workerService';
import {
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Upload,
  Calendar,
  Clock,
  Building,
  ShieldAlert,
  CheckCircle,
  FileImage
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import StatusBadge from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';
import Breadcrumb from '../components/common/Breadcrumb';

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
      header: 'Incident Title',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 text-sm">{row.title}</p>
          <p className="text-xs text-slate-500 truncate max-w-xs">{row.description}</p>
        </div>
      )
    },
    {
      header: 'Factory & Dept',
      render: (row) => (
        <span className="text-xs font-medium text-slate-700">
          {row.factory} ({row.department})
        </span>
      )
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div className="text-xs text-slate-600">
          <p>{new Date(row.date).toLocaleDateString()}</p>
          <p className="text-slate-400">{row.time}</p>
        </div>
      )
    },
    {
      header: 'Severity',
      render: (row) => <StatusBadge status={row.severity} />
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
    },

    {
  header: 'Report Source',
  render: (row) => (
    <span className="text-xs font-medium text-slate-700">
      {row.reportSource || 'Worker Report'}
    </span>
  )
},
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">

  {/* View */}
  <button
    onClick={() => openViewModal(row)}
    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
    title="View Details"
  >
    <Eye className="w-4 h-4" />
  </button>


  {/* Upload Evidence */}
  {(user?.role === "Worker" || isFactoryAdmin || isSuperAdmin) && (
    <button
      onClick={() => openImageModal(row)}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
      title="Upload Evidence"
    >
      <Upload className="w-4 h-4" />
    </button>
  )}


  {/* Update Status */}
  {isAdminOrOfficer && (
    <button
      onClick={() => openStatusModal(row)}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-colors"
      title="Update Status"
    >
      <CheckCircle className="w-4 h-4" />
    </button>
  )}


  {/* Delete */}
  {isSuperAdmin && (
    <button
      onClick={() => openDeleteDialog(row)}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
      title="Delete Report"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )}

</div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Accident Reports' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Workplace Accident Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log, track, investigate and resolve industrial accidents
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          File Accident Report
        </Button>
      </div>

      {/* Search & Severity Filters */}
      <Card bodyClassName="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Search by accident title, factory, or department..."
          />

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={severityOptions}
              placeholder="All Severities"
              className="w-full md:w-44"
            />

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={statusOptions}
              placeholder="All Statuses"
              className="w-full md:w-44"
            />
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Table
        columns={columns}
        data={reports}
        loading={loading}
        emptyTitle="No Accident Reports Found"
        emptyDescription="There are no industrial accident reports registered matching your search."
        onEmptyAction={openCreateModal}
        emptyActionText="Create Accident Report"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal: Create Accident Report */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Log New Workplace Accident Report"
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
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
            <Select label="Incident Severity" name="severity" value={formData.severity} onChange={handleInputChange} options={severityOptions} required />
            <Select
              label="Involved Worker (Optional)"
              name="worker"
              value={formData.worker}
              onChange={handleInputChange}
              options={workersList.map((w) => ({ value: w._id, label: `${w.name} (${w.employeeId})` }))}
              placeholder="Select worker if applicable"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Witness Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input label="Witness Name" name="witnessDetails.name" value={formData.witnessDetails?.name} onChange={handleInputChange} />
              <Input label="Witness Phone" name="witnessDetails.phone" value={formData.witnessDetails?.phone} onChange={handleInputChange} />
            </div>
            <Textarea label="Witness Statement" name="witnessDetails.statement" value={formData.witnessDetails?.statement} onChange={handleInputChange} rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Submit Report</Button>
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
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Report</Button>
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
            <div className="flex items-start justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedReport.title}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedReport.factory} &bull; Department: {selectedReport.department}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={selectedReport.severity} />
                <StatusBadge status={selectedReport.status} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

           {selectedReport.images && selectedReport.images.length > 0 && (
  <div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
      Evidence Photo Attachments
    </p>

    <div className="space-y-3">
      {selectedReport.images.map((img, idx) => (
        <div
          key={idx}
          className="border border-slate-200 rounded-lg p-3"
        >

          <a
            href={img.url}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={img.url}
              alt="Evidence"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </a>


          <div className="mt-2 text-xs text-slate-600">

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
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
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
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Status</Button>
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
            <Button variant="secondary" onClick={() => setImageModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Upload Attachments</Button>
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
  );
};

export default AccidentReports;
