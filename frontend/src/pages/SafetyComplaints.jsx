import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import complaintService from '../services/complaintService';

import {
  AlertOctagon,
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  Home
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

  const statusOptions = [
    'Open',
    'In Progress',
    'Resolved',
    'Rejected'
  ];

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      showSuccess(
        'Safety hazard complaint submitted successfully!'
      );

      setCreateModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(
        err.message || 'Failed to submit safety complaint'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();

    if (!selectedComplaint) return;

    setSubmitting(true);

    try {
      await complaintService.updateComplaint(
        selectedComplaint._id,
        formData
      );

      showSuccess('Safety complaint details updated!');

      setEditModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(
        err.message || 'Failed to update complaint'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!selectedComplaint) return;

    setSubmitting(true);

    try {
      await complaintService.updateComplaintStatus(
        selectedComplaint._id,
        statusFormData
      );

      showSuccess(
        `Safety complaint updated to: ${statusFormData.status}`
      );

      setStatusModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(
        err.message || 'Failed to update complaint status'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImages = async (e) => {
    e.preventDefault();

    if (!selectedComplaint || !selectedImages.length) {
      showError(
        'Please select evidence photos to upload.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      const filesArray = Array.isArray(selectedImages)
        ? selectedImages
        : [selectedImages];

      filesArray.forEach((file) => {
        formDataToSend.append('images', file);
      });

      await complaintService.uploadImages(
        selectedComplaint._id,
        formDataToSend
      );

      showSuccess(
        'Hazard evidence photos uploaded!'
      );

      setImageModalOpen(false);
      fetchComplaints();
    } catch (err) {
      showError(
        err.message || 'Failed to upload photo evidence'
      );
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

      showSuccess(
        'Evidence image deleted successfully'
      );

      fetchComplaints();

      setSelectedComplaint({
        ...selectedComplaint,
        images: selectedComplaint.images.filter(
          (img) => img._id !== imageId
        )
      });
    } catch (err) {
      showError(
        err.message || 'Failed to delete image'
      );
    }
  };

  const handleDeleteComplaint = async () => {
    if (!selectedComplaint) return;

    setSubmitting(true);

    try {
      await complaintService.deleteComplaint(
        selectedComplaint._id
      );

      showSuccess(
        'Safety complaint deleted successfully'
      );

      setDeleteDialogOpen(false);
      setSelectedComplaint(null);

      fetchComplaints();
    } catch (err) {
      showError(
        err.message || 'Failed to delete complaint'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // TABLE
  // --------------------------------------------------

  const columns = [
    {
      header: 'Complaint',
      render: (row) => (
        <div className="py-0.5">
          <p className="text-sm font-medium text-[#1E1E1E]">
            {row.title}
          </p>
        </div>
      )
    },

    {
      header: 'Hazard Type',
      render: (row) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#EEF2F0] border border-[#B9C9C3] text-[#3E5C54] text-xs font-medium whitespace-nowrap">
          {row.complaintType}
        </span>
      )
    },

    {
      header: 'Factory / Location',
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="text-sm font-medium text-[#1E1E1E]">
            {row.factoryName}
          </p>

          <p className="text-xs text-[#6C757D] mt-1">
            {row.department}

            {row.locationDetails
              ? ` · ${row.locationDetails}`
              : ''}
          </p>
        </div>
      )
    },

    {
      header: 'Severity',
      render: (row) => (
        <StatusBadge status={row.severity} />
      )
    },

    {
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.status} />
      )
    },

    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',

      render: (row) => (
        <div className="flex items-center justify-end gap-1">

          {/* View */}
          <button
            onClick={() => openViewModal(row)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D] hover:bg-[#EEF2F0] hover:text-[#3E5C54] transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Upload Evidence */}
          {isOwner(row) && (
            <button
              onClick={() => openImageModal(row)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D] hover:bg-[#EEF2F0] hover:text-[#3E5C54] transition-colors"
              title="Upload Photo Evidence"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}

          {/* Edit */}
          {isOwner(row) && (
            <button
              onClick={() => openEditModal(row)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D] hover:bg-[#FFF8E8] hover:text-[#C9A66B] transition-colors"
              title="Edit Complaint"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Update Status */}
          {isAdminOrOfficer && (
            <button
              onClick={() => openStatusModal(row)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D] hover:bg-[#EEF2F0] hover:text-[#3E5C54] transition-colors"
              title="Update Status / Resolution"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {/* Delete */}
          {isOwner(row) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6C757D] hover:bg-[#FDEEEF] hover:text-[#E63946] transition-colors"
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
    <>
      <style>{`
        .complaints-page-enter { animation: complaintsPageEnter 520ms cubic-bezier(.22,1,.36,1) both; }
        .complaints-breadcrumb { animation: complaintsFadeUp 420ms ease-out 40ms both; }
        .complaints-header { animation: complaintsFadeUp 520ms cubic-bezier(.22,1,.36,1) 90ms both; }
        .complaints-filter { animation: complaintsFadeUp 520ms cubic-bezier(.22,1,.36,1) 150ms both; }
        .complaints-table { animation: complaintsFadeUp 560ms cubic-bezier(.22,1,.36,1) 210ms both; }
        .complaints-header:hover { transform: translateY(-1px); }
        .complaints-table tbody tr { transition: background-color 180ms ease, transform 180ms ease; }
        .complaints-table tbody tr:hover { background-color: rgba(62, 92, 84, 0.035); }
        @keyframes complaintsPageEnter { from { opacity: 0; } to { opacity: 1; } }
        @keyframes complaintsFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .complaints-page-enter, .complaints-breadcrumb, .complaints-header, .complaints-filter, .complaints-table { animation: none !important; } }
      `}</style>

      <div className="space-y-4 complaints-page-enter">

        {/* --------------------------------------------------
            BREADCRUMB
        -------------------------------------------------- */}

        <div className="flex items-center gap-2 text-sm complaints-breadcrumb">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-[#6C757D] hover:text-[#3E5C54] transition-colors"
          >
            {/* <Home className="w-4 h-4" /> */}
            <span>Dashboard</span>
          </Link>

          <span className="text-[#E0E0E0] text-lg">
            /
          </span>

          <span className="text-[#3E5C54] font-medium">
            Safety Complaints
          </span>
        </div>

        {/* --------------------------------------------------
            PAGE HEADER
        -------------------------------------------------- */}

        <div className="bg-white rounded-[24px] border border-[#E0E0E0] px-5 sm:px-6 py-4 shadow-sm transition-all duration-300 ease-out hover:shadow-md complaints-header">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-4 min-w-0">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#EEF2F0] border border-[#B9C9C3] flex items-center justify-center text-[#3E5C54]">
                <AlertOctagon className="w-6 h-6" />
              </div>

              <div className="min-w-0">

                <h1
                  className="text-xl sm:text-[32px] font-medium text-[#1E1E1E] leading-tight"
                  style={{ letterSpacing: '0em' }}
                >
                  Safety Hazards & Complaints
                </h1>

                <div className="w-14 h-1 bg-[#3E5C54] rounded-full mt-2" />

                <p className="text-sm text-[#6C757D] mt-1">
                  File and audit industrial machinery, chemical, or environmental safety complaints
                </p>

              </div>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              onClick={openCreateModal}
              className="shrink-0"
            >
              File Safety Complaint
            </Button>

          </div>

        </div>

        {/* --------------------------------------------------
            SEARCH + FILTER
        -------------------------------------------------- */}

        <div className="complaints-filter">
          <Card bodyClassName="p-4 sm:p-5">

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

              <div className="flex-1 min-w-0">

                <SearchBar
                  value={searchQuery}
                  onChange={(val) => {
                    setSearchQuery(val);
                    setCurrentPage(1);
                  }}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search by complaint title, factory, or department..."
                />

              </div>

              <Select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                options={typeOptions}
                placeholder="All Complaint Types"
                className="w-full lg:w-56"
              />

            </div>

          </Card>
        </div>

        {/* --------------------------------------------------
            COMPLAINTS TABLE
        -------------------------------------------------- */}

        <div className="rounded-[24px] overflow-hidden complaints-table">

          <Table
            columns={columns}
            data={complaints}
            loading={loading}
            emptyTitle="No Safety Complaints Found"
            emptyDescription="There are no safety hazard complaints matching your criteria."
            onEmptyAction={openCreateModal}
            emptyActionText="File Safety Complaint"
          />

        </div>

        {/* --------------------------------------------------
            PAGINATION
        -------------------------------------------------- */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={(page) => setCurrentPage(page)}
        />

        {/* --------------------------------------------------
            MODAL: CREATE COMPLAINT
        -------------------------------------------------- */}

        <Modal
  isOpen={createModalOpen}
  onClose={() => setCreateModalOpen(false)}
  title="File Industrial Safety Hazard Complaint"
  dialogClassName="h-[70vh]"
>

          {/* ONLY CHANGE: scrollable container for this form */}
          <div className="h-[85vh] overflow-y-auto pr-2">

            <form
              onSubmit={handleCreateComplaint}
              className="space-y-4"
            >

              <Input
                label="Complaint Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Unshielded High Voltage Line in Bay 3"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Select
                  label="Hazard Type"
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleInputChange}
                  options={typeOptions}
                  required
                />

                <Select
                  label="Severity Level"
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  options={severityOptions}
                  required
                />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Input
                  label="Factory Name"
                  name="factoryName"
                  value={formData.factoryName}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Department Name"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />

              </div>

              <Input
                label="Specific Location Details"
                name="locationDetails"
                value={formData.locationDetails}
                onChange={handleInputChange}
                placeholder="e.g. Near Boiler 4 Assembly Area"
              />

              <Textarea
                label="Detailed Description of Safety Hazard"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the hazard and potential risk to workers..."
                required
              />

              <div className="flex justify-end gap-3 pt-2">

                <Button
                  variant="secondary"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                >
                  Submit Complaint
                </Button>

              </div>

            </form>

          </div>
        </Modal>

        {/* --------------------------------------------------
            MODAL: EDIT COMPLAINT
        -------------------------------------------------- */}

        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Update Safety Complaint"
        >

          <form
            onSubmit={handleUpdateComplaint}
            className="space-y-4"
          >

            <Input
              label="Complaint Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Select
                label="Hazard Type"
                name="complaintType"
                value={formData.complaintType}
                onChange={handleInputChange}
                options={typeOptions}
                required
              />

              <Select
                label="Severity Level"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                options={severityOptions}
                required
              />

            </div>

            <Textarea
              label="Hazard Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

            <div className="flex justify-end gap-3 pt-2">

              <Button
                variant="secondary"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Update Complaint
              </Button>

            </div>

          </form>

        </Modal>

        {/* --------------------------------------------------
            MODAL: VIEW DETAILS
        -------------------------------------------------- */}

        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Safety Complaint Information View"
        >

          {selectedComplaint && (

            <div className="space-y-5">

              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 p-5 bg-[#F4F4F4] rounded-2xl border border-[#E0E0E0]">

                <div>

                  <span className="inline-flex font-mono text-xs font-semibold text-[#3E5C54] bg-[#EEF2F0] px-2.5 py-1 rounded-md">
                    {selectedComplaint.complaintNumber}
                  </span>

                  <h3 className="text-lg font-semibold text-[#1E1E1E] mt-2">
                    {selectedComplaint.title}
                  </h3>

                  <p className="text-xs text-[#6C757D] mt-1">
                    {selectedComplaint.factoryName} •{' '}
                    {selectedComplaint.department}
                  </p>

                  <div className="mt-4 text-xs text-[#6C757D] space-y-1.5">

                    <p>
                      <span className="font-semibold">
                        Reported By:
                      </span>{' '}
                      {selectedComplaint.reportedBy?.name || 'Unknown'}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Role:
                      </span>{' '}
                      {selectedComplaint.reportedBy?.role || 'Unknown'}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Reported Date:
                      </span>{' '}
                      {new Date(
                        selectedComplaint.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                </div>

                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">

                  <StatusBadge
                    status={selectedComplaint.severity}
                  />

                  <StatusBadge
                    status={selectedComplaint.status}
                  />

                </div>

              </div>

              <div>

                <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-2">
                  Hazard Description
                </p>

                <p className="text-sm leading-6 text-[#1E1E1E] bg-white p-4 rounded-xl border border-[#E0E0E0]">
                  {selectedComplaint.description}
                </p>

              </div>

              {selectedComplaint.resolutionDetails && (

                <div>

                  <p className="text-xs font-semibold text-[#2A9D8F] uppercase tracking-wider mb-2">
                    Resolution Details
                  </p>

                  <p className="text-sm leading-6 text-[#1E1E1E] bg-[#F1FAF8] p-4 rounded-xl border border-[#B9DED7]">
                    {selectedComplaint.resolutionDetails}
                  </p>

                </div>

              )}

              {selectedComplaint.images?.length > 0 && (

                <div>

                  <p className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-2">
                    Evidence Images
                  </p>

                  <div className="flex flex-wrap gap-3">

                    {selectedComplaint.images.map((img) => (

                      <div
                        key={img._id}
                        className="relative"
                      >

                        <img
                          src={img.url}
                          alt="Complaint Evidence"
                          onClick={() =>
                            window.open(img.url, '_blank')
                          }
                          className="w-64 h-48 object-cover rounded-xl border border-[#E0E0E0] cursor-pointer"
                        />

                        {isOwner(selectedComplaint) && (

                          <button
                            onClick={() =>
                              handleDeleteImage(img._id)
                            }
                            className="absolute top-2 right-2 bg-[#E63946] text-white rounded-full p-2 hover:bg-[#C51F2F]"
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

              <div className="flex justify-end">

                <Button
                  variant="secondary"
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </Button>

              </div>

            </div>

          )}

        </Modal>

        {/* --------------------------------------------------
            MODAL: STATUS UPDATE
        -------------------------------------------------- */}

        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title="Update Resolution Status"
        >

          <form
            onSubmit={handleUpdateStatus}
            className="space-y-4"
          >

            <Select
              label="Complaint Status"
              value={statusFormData.status}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  status: e.target.value
                })
              }
              options={statusOptions}
              required
            />

            <Textarea
              label="Resolution & Corrective Actions Taken"
              value={statusFormData.resolutionDetails}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  resolutionDetails: e.target.value
                })
              }
              placeholder="Describe maintenance or safety inspection actions taken..."
              required
            />

            <div className="flex justify-end gap-3">

              <Button
                variant="secondary"
                onClick={() => setStatusModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Update Complaint Status
              </Button>

            </div>

          </form>

        </Modal>

        {/* --------------------------------------------------
            MODAL: UPLOAD EVIDENCE
        -------------------------------------------------- */}

        <Modal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          title="Upload Photo Evidence of Safety Hazard"
        >

          <form
            onSubmit={handleUploadImages}
            className="space-y-4"
          >

            <FileUpload
              label="Select Evidence Images"
              multiple
              onChange={(files) =>
                setSelectedImages(files)
              }
              accept="image/*"
            />

            <div className="flex justify-end gap-3">

              <Button
                variant="secondary"
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                Upload Images
              </Button>

            </div>

          </form>

        </Modal>

        {/* --------------------------------------------------
            DELETE DIALOG
        -------------------------------------------------- */}

        <ConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteComplaint}
          title="Delete Safety Complaint"
          message="Are you sure you want to delete this safety complaint log?"
          loading={submitting}
        />

      </div>
    </>
  );
};

export default SafetyComplaints;