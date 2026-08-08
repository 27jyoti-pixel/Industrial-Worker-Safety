import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import complaintService from '../services/complaintService';
import {
  AlertOctagon,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  Shield,
  MapPin,
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

const SafetyComplaints = () => {
  const { user, isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Status update form
  const [statusFormData, setStatusFormData] = useState({
    status: 'In Progress',
    resolutionDetails: ''
  });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    complaintType: 'Gas Leak',
    description: '',
    factoryName: '',
    department: '',
    locationDetails: '',
    severity: 'Medium'
  });

  const typeOptions = [
    'Gas Leak',
    'Broken Equipment',
    'Unsafe Machinery',
    'Electrical Hazard',
    'Fire Hazard',
    'Other'
  ];

  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Rejected'];

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, searchQuery, typeFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await complaintService.getAllComplaints({
        search: searchQuery,
        complaintType: typeFilter,
        page: currentPage,
        limit: 10
      });
      const dataList = response.complaints || response.data || [];
      setComplaints(dataList);
      setTotalPages(response.pages || response.totalPages || 1);
      setTotalItems(response.total || dataList.length);
    } catch (err) {
      showError(err.message || 'Failed to fetch safety complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      complaintType: 'Gas Leak',
      description: '',
      factoryName: user?.factoryName || '',
      department: '',
      locationDetails: '',
      severity: 'Medium'
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      title: complaint.title || '',
      complaintType: complaint.complaintType || 'Gas Leak',
      description: complaint.description || '',
      factoryName: complaint.factoryName || '',
      department: complaint.department || '',
      locationDetails: complaint.locationDetails || '',
      severity: complaint.severity || 'Medium'
    });
    setEditModalOpen(true);
  };

  const openViewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setViewModalOpen(true);
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusFormData({
      status: complaint.status || 'In Progress',
      resolutionDetails: complaint.resolutionDetails || ''
    });
    setStatusModalOpen(true);
  };

  const openImageModal = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedImages([]);
    setImageModalOpen(true);
  };

  const openDeleteDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setDeleteDialogOpen(true);
  };

  const isOwner = (complaint) => {
  return (
    complaint.reportedBy?._id === user?._id ||
    complaint.reportedBy === user?._id
  );
};

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await complaintService.createComplaint(formData);
      showSuccess('Safety hazard complaint submitted successfully!');
      setCreateModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(err.message || 'Failed to submit safety complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmitting(true);
    try {
      await complaintService.updateComplaint(selectedComplaint._id, formData);
      showSuccess('Safety complaint details updated!');
      setEditModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(err.message || 'Failed to update complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setSubmitting(true);
    try {
      await complaintService.updateComplaintStatus(selectedComplaint._id, statusFormData);
      showSuccess(`Safety complaint updated to: ${statusFormData.status}`);
      setStatusModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(err.message || 'Failed to update complaint status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedImages.length) {
      showError('Please select evidence photos to upload.');
      return;
    }
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      const filesArray = Array.isArray(selectedImages) ? selectedImages : [selectedImages];
      filesArray.forEach((file) => formDataToSend.append('images', file));

      await complaintService.uploadImages(selectedComplaint._id, formDataToSend);
      showSuccess('Hazard evidence photos uploaded!');
      setImageModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(err.message || 'Failed to upload photo evidence');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
  if (!selectedComplaint) return;

  try {
    await complaintService.deleteComplaintImage(
      selectedComplaint._id,
      imageId
    );

    showSuccess('Evidence image deleted successfully');

    // refresh complaint list
    fetchComplaints();

    // update modal images immediately
    setSelectedComplaint({
      ...selectedComplaint,
      images: selectedComplaint.images.filter(
        (img) => img._id !== imageId
      )
    });

  } catch (err) {
    showError(err.message || 'Failed to delete image');
  }
};

const handleDeleteComplaint = async () => {
  if (!selectedComplaint) return;

  setSubmitting(true);

  try {
    await complaintService.deleteComplaint(selectedComplaint._id);

    showSuccess('Safety complaint deleted successfully');

    setDeleteDialogOpen(false);
    setSelectedComplaint(null);

    fetchComplaints();

  } catch (err) {
    showError(err.message || 'Failed to delete complaint');
  } finally {
    setSubmitting(false);
  }
};
  const columns = [
    {
      header: 'Complaint Reference',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            {row.complaintNumber || 'CMP-PENDING'}
          </span>
          <p className="font-semibold text-slate-800 text-sm mt-1">{row.title}</p>
        </div>
      )
    },
    {
      header: 'Hazard Type',
      render: (row) => (
        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-100">
          {row.complaintType}
        </span>
      )
    },
    {
      header: 'Factory / Location',
      render: (row) => (
        <div className="text-xs text-slate-600">
          <p className="font-medium text-slate-800">{row.factoryName}</p>
          <p className="text-slate-400">{row.department} {row.locationDetails ? `(${row.locationDetails})` : ''}</p>
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
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openViewModal(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {isOwner(row) && (
  <button
    onClick={() => openImageModal(row)}
    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
    title="Upload Photo Evidence"
  >
    <Upload className="w-4 h-4" />
  </button>
)}

          {isOwner(row) && (
  <button
    onClick={() => openEditModal(row)}
    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors"
    title="Edit Complaint"
  >
    <Edit className="w-4 h-4" />
  </button>
)}
          {isAdminOrOfficer && (
            <button
              onClick={() => openStatusModal(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              title="Update Status / Resolution"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          

          {( isOwner(row)) && (
  <button
    onClick={() => openDeleteDialog(row)}
    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 transition-colors"
    title="Delete Complaint"
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
      <Breadcrumb items={[{ label: 'Safety Complaints' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Safety Hazards & Complaints</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            File and audit industrial machinery, chemical, or environmental safety complaints
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openCreateModal}>
          File Hazard Complaint
        </Button>
      </div>

      {/* Search & Filter */}
      <Card bodyClassName="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Search complaints by title, factory, or department..."
          />

          <Select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={typeOptions}
            placeholder="All Complaint Types"
            className="w-full sm:w-48"
          />
        </div>
      </Card>

      {/* Complaints Table */}
      <Table
        columns={columns}
        data={complaints}
        loading={loading}
        emptyTitle="No Safety Complaints Found"
        emptyDescription="There are no safety hazard complaints matching your criteria."
        onEmptyAction={openCreateModal}
        emptyActionText="File Safety Complaint"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal: File Complaint */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="File Industrial Safety Hazard Complaint"
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <Input label="Complaint Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Unshielded High Voltage Line in Bay 3" required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Hazard Type" name="complaintType" value={formData.complaintType} onChange={handleInputChange} options={typeOptions} required />
            <Select label="Severity Level" name="severity" value={formData.severity} onChange={handleInputChange} options={severityOptions} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Factory Name" name="factoryName" value={formData.factoryName} onChange={handleInputChange} required />
            <Input label="Department Name" name="department" value={formData.department} onChange={handleInputChange} required />
          </div>

          <Input label="Specific Location Details" name="locationDetails" value={formData.locationDetails} onChange={handleInputChange} placeholder="e.g. Near Boiler 4 Assembly Area" />

          <Textarea label="Detailed Description of Safety Hazard" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the hazard and potential risk to workers..." required />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Submit Complaint</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Complaint */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Safety Complaint"
      >
        <form onSubmit={handleUpdateComplaint} className="space-y-4">
          <Input label="Complaint Title" name="title" value={formData.title} onChange={handleInputChange} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Hazard Type" name="complaintType" value={formData.complaintType} onChange={handleInputChange} options={typeOptions} required />
            <Select label="Severity Level" name="severity" value={formData.severity} onChange={handleInputChange} options={severityOptions} required />
          </div>
          <Textarea label="Hazard Description" name="description" value={formData.description} onChange={handleInputChange} required />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Complaint</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Safety Complaint Information View"
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {selectedComplaint.complaintNumber}
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-1">{selectedComplaint.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
  {selectedComplaint.factoryName} • {selectedComplaint.department}
</p>

<div className="mt-3 text-xs text-slate-600 space-y-1">

  <p>
    <span className="font-semibold">
      Reported By:
    </span>{" "}
    {selectedComplaint.reportedBy?.name || "Unknown"}
  </p>

  <p>
    <span className="font-semibold">
      Role:
    </span>{" "}
    {selectedComplaint.reportedBy?.role || "Unknown"}
  </p>

  <p>
    <span className="font-semibold">
      Reported Date:
    </span>{" "}
    {new Date(selectedComplaint.createdAt).toLocaleDateString()}
  </p>

</div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={selectedComplaint.severity} />
                <StatusBadge status={selectedComplaint.status} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hazard Description</p>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">{selectedComplaint.description}</p>
            </div>

            {selectedComplaint.resolutionDetails && (
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Resolution Details</p>
                <p className="text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">{selectedComplaint.resolutionDetails}</p>
              </div>
            )}

            {selectedComplaint.images?.length > 0 && (
  <div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
      Evidence Images
    </p>

    <div className="flex flex-wrap gap-3">
      {selectedComplaint.images?.length > 0 && (
  <div>

    <div className="flex flex-wrap gap-3">
      {selectedComplaint.images.map((img) => (
        <div key={img._id} className="relative">

          <img
            src={img.url}
            alt="Complaint Evidence"
            onClick={() => window.open(img.url, "_blank")}
            className="w-64 h-48 object-cover rounded-lg border border-slate-200 cursor-pointer"
          />

          {isOwner(selectedComplaint) && (
            <button
              onClick={() => handleDeleteImage(img._id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              title="Delete Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>
      ))}
    </div>
  </div>
)}
    </div>
  </div>
)}

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Status & Resolution Update */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Resolution Status"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <Select
            label="Complaint Status"
            value={statusFormData.status}
            onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
            options={statusOptions}
            required
          />

          <Textarea
            label="Resolution & Corrective Actions Taken"
            value={statusFormData.resolutionDetails}
            onChange={(e) => setStatusFormData({ ...statusFormData, resolutionDetails: e.target.value })}
            placeholder="Describe maintenance or safety inspection actions taken..."
            required
          />

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Complaint Status</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Upload Evidence */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Upload Photo Evidence of Safety Hazard"
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
            <Button type="submit" variant="primary" loading={submitting}>Upload Images</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteComplaint}
        title="Delete Safety Complaint"
        message="Are you sure you want to delete this safety complaint log?"
        loading={submitting}
      />
    </div>
  );
};

export default SafetyComplaints;
