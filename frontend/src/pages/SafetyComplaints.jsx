import React, { useState, useEffect } from 'react';
import SearchFilterSelect from '../components/common/SearchFilterSelect';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import complaintService from '../services/complaintService';
import complaintsHero from '../assets/wide_panoramic_industrial_scene_at_sunset_shallow.png';

import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  FileText
} from 'lucide-react';

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
          <p className="text-[15px] font-medium text-[#1E1E1E]">
            {row.title}
          </p>
        </div>
      )
    },

    {
      header: 'Hazard Type',
      render: (row) => (
        <span className="text-[15px] font-medium text-[#1E1E1E]">
          {row.complaintType}
        </span>
      )
    },

    {
      header: 'Factory',
      render: (row) => (
        <div className="min-w-[200px]">
          <p className="text-[15px] font-medium text-[#1E1E1E]">
            {row.factoryName}
          </p>
        </div>
      )
    },

    {
      header: 'Severity',
      render: (row) => (
        <StatusBadge status={row.severity} variant="dot" className="!text-[15px] !font-medium" />
      )
    },

    {
      header: 'Status',
      render: (row) => (
        <StatusBadge status={row.status} variant="dot" className="!text-[15px] !font-medium" />
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
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Upload Evidence */}
          {isOwner(row) && (
            <button
              onClick={() => openImageModal(row)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
              title="Upload Photo Evidence"
            >
              <Upload className="w-4 h-4" />
            </button>
          )}

          {/* Edit */}
          {isOwner(row) && (
            <button
              onClick={() => openEditModal(row)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
              title="Edit Complaint"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}

          {/* Update Status */}
          {isAdminOrOfficer && (
            <button
              onClick={() => openStatusModal(row)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
              title="Update Status / Resolution"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {/* Delete */}
          {isOwner(row) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
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
        .complaint-create-dialog {
          border-color: #e1e4e8 !important;
          background: #fff !important;
          box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .fixed.inset-0.z-50:has(.complaint-create-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
          background: rgba(17, 17, 17, .32) !important;
          backdrop-filter: none !important;
        }
        .complaint-create-dialog > div:first-child {
          border-bottom-color: #e1e4e8 !important;
          background: #fff !important;
          flex: 0 0 auto;
        }
        .complaint-create-dialog > div:nth-child(2) {
          flex: 1 1 auto;
          min-height: 0;
          max-height: none !important;
          overflow-y: auto !important;
        }
        .complaint-create-dialog > div:last-child {
          flex: 0 0 auto;
          border-top: 1px solid #e1e4e8 !important;
          background: #fff !important;
          padding-bottom: 16px !important;
        }
        .complaint-create-dialog > div:first-child h3 {
          color: #111 !important;
          font-weight: 600;
        }
        .complaint-create-dialog > div:first-child button {
          color: #62666b !important;
        }
        .complaint-create-dialog > div:first-child button:hover {
          background: #f3f4f5 !important;
          color: #111 !important;
        }
        .complaint-create-dialog label {
          margin-bottom: 6px !important;
          color: #292929 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          text-transform: none !important;
          letter-spacing: normal !important;
        }
        .complaint-create-dialog label span {
          color: #E87532 !important;
        }
        .complaint-create-dialog input,
        .complaint-create-dialog select {
          height: 46px !important;
          min-height: 46px !important;
          padding: 0 14px !important;
          border: 1px solid #dedede !important;
          border-radius: 8px !important;
          background-color: #fff !important;
          color: #111 !important;
          font-size: 14px !important;
          box-shadow: none !important;
        }
        .complaint-create-dialog input[type="date"]::-webkit-calendar-picker-indicator,
        .complaint-create-dialog input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
        }
        .complaint-create-dialog select {
          padding-right: 36px !important;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
          background-position: right 12px center !important;
          background-repeat: no-repeat !important;
          background-size: 16px !important;
        }
        .complaint-create-dialog select::-ms-expand {
          display: none;
        }
        .complaint-create-dialog textarea {
          min-height: 120px !important;
          padding: 11px 14px !important;
          border: 1px solid #dedede !important;
          border-radius: 8px !important;
          background: #fff !important;
          color: #111 !important;
          font-size: 14px !important;
          line-height: 1.5;
          box-shadow: none !important;
        }
        .complaint-create-dialog input::placeholder,
        .complaint-create-dialog textarea::placeholder {
          color: #858b92 !important;
          opacity: 1;
        }
        .complaint-create-dialog input:focus,
        .complaint-create-dialog select:focus,
        .complaint-create-dialog textarea:focus {
          border-color: #d1a184 !important;
          box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
          outline: none;
        }
        .complaint-create-dialog > div:last-child button {
          min-height: 40px;
          border-radius: 8px !important;
          font-size: 13px;
          font-weight: 500;
        }
        .complaint-create-dialog button:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(232, 117, 50, .14) !important;
        }
        #complaints-page .complaints-hero-art {
          background-size: cover;
          background-position: right center;
          background-repeat: no-repeat;
        }
        #complaints-page .complaints-filter input,
        #complaints-page .complaints-filter select {
          height: 48px;
          min-height: 48px;
          border-color: #e1e4e8 !important;
          border-radius: 8px !important;
          background-color: #fff !important;
          color: #111 !important;
          font-size: 16px !important;
          font-weight: 500 !important;
        }
        #complaints-page .complaints-filter .search-filter-field input,
        #complaints-page .complaints-filter .search-filter-field input::placeholder {
          font-weight: 400 !important;
        }
        #complaints-page .complaints-filter select {
          padding-left: 14px !important;
          padding-right: 36px !important;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
          background-position: right 12px center !important;
          background-repeat: no-repeat !important;
          background-size: 16px !important;
        }
        #complaints-page .complaints-filter select option { background: #fff; color: #222; }
        #complaints-page .complaints-filter select option:checked { background: #f3f4f5; color: #111; }
        #complaints-page .complaints-filter input:focus,
        #complaints-page .complaints-filter select:focus {
          border-color: #9ca3af !important;
          box-shadow: 0 0 0 2px rgba(107, 114, 128, .1) !important;
          outline: none;
        }
        #complaints-page .complaints-table .industrial-card {
          border: 1px solid #e5e5e5 !important;
          border-radius: 10px !important;
          background: #fff !important;
          box-shadow: none !important;
        }
        #complaints-page .complaints-table th {
          color: #62666b !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          letter-spacing: .08em !important;
        }
        #complaints-page .complaints-table td {
          font-size: 15px;
        }
        #complaints-page .complaints-table > .flex.flex-col.items-center {
          min-height: 220px;
          border: 1px solid #e5e5e5;
          border-radius: 10px;
          background: #fff;
          padding: 32px 20px;
        }
        #complaints-page .complaints-table > .flex.flex-col.items-center > div:first-child {
          width: 44px;
          height: 44px;
          margin-bottom: 12px;
          border-radius: 9999px;
          background: #f2f2f2;
          color: #59616a;
        }
        #complaints-page .complaints-table > .flex.flex-col.items-center > div:first-child svg {
          width: 20px;
          height: 20px;
        }
        #complaints-page button.midc-primary-cta {
          min-height: 40px;
          border-radius: 7px !important;
          background-color: #111111 !important;
          box-shadow: none !important;
          transform: none !important;
          color: #fff !important;
          font-size: 15px !important;
          font-weight: 600 !important;
        }
        #complaints-page button.midc-primary-cta:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
      `}</style>

      <div id="complaints-page" className="complaints-page space-y-6">
        <section className="complaints-hero relative isolate -mx-4 -mt-4 h-[278px] w-[calc(100%+2rem)] overflow-hidden bg-[#F7F8F8] sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]" aria-labelledby="complaints-title">
          <div className="relative z-10 flex min-h-[278px] items-start px-4 pt-7 sm:items-center sm:py-7 sm:px-6 lg:px-8">
            <div className="w-full max-w-[740px] lg:w-[52%]">
              <h1 id="complaints-title" className="!mb-0 !text-[30px] !font-semibold !leading-[1.1] !tracking-[-.035em] !text-[#111] sm:!text-[42px] lg:!text-[44px]">
                Complaints
              </h1>
              <p className="mt-2 max-w-[470px] text-[16px] font-normal leading-[1.5] text-[#6B7280] sm:text-[17px]">
                File and track industrial safety, environmental, or operational complaints.
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="complaints-hero-art absolute inset-0 z-0 hidden xl:block"
            style={{ backgroundImage: `url(${complaintsHero})` }}
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-0 xl:hidden">
            <img src={complaintsHero} alt="" className="block h-auto w-full object-contain object-center" />
          </div>
        </section>

        <section className="complaints-filter search-filter-controls grid grid-cols-1 items-center gap-3 bg-transparent p-0 lg:grid-cols-[minmax(0,1fr)_210px_auto]" aria-label="Search and filter safety complaints">
          <SearchBar
            className="search-filter-field"
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            onClear={() => setSearchQuery('')}
            placeholder="Search by complaint title, factory, or department..."
          />

          <SearchFilterSelect
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
            options={typeOptions}
            label="All Complaint Types"
            iconType="complaint"
          />

          <button type="button" onClick={openCreateModal} className="midc-primary-cta inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[15px] font-semibold text-white transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            File Safety Complaint
          </button>
        </section>

        <div className="complaints-table overflow-hidden rounded-lg">
          {loading || complaints.length > 0 ? (
            <Table columns={columns} data={complaints} loading={loading} className="platform-data-table" />
          ) : (
            <section className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-[#e5e5e5] bg-white px-5 py-8 text-center" aria-live="polite">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f2f2] text-[#59616a]">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 text-[16px] font-semibold text-[#111]">No Safety Complaints Found</h2>
              <p className="mt-1 max-w-md text-[13px] leading-5 text-[#6B7280]">
                There are no safety hazard complaints matching your criteria.
              </p>
            </section>
          )}
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
  dialogClassName="h-[70vh] complaint-create-dialog"
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
        form="complaint-create-form"
        variant="primary"
        loading={submitting}
        className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
      >
        Submit Complaint
      </Button>
    </>
  }
>

          {/* ONLY CHANGE: scrollable container for this form */}
          <div className="h-auto overflow-visible pr-2">

            <form
              id="complaint-create-form"
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

                <SearchFilterSelect
                  label="Hazard Type"
                  formField
                  name="complaintType"
                  value={formData.complaintType}
                  onValueChange={(value) => handleInputChange({ target: { name: 'complaintType', value } })}
                  options={typeOptions}
                  required
                  allowClear={false}
                />

                <SearchFilterSelect
                  label="Severity Level"
                  formField
                  name="severity"
                  value={formData.severity}
                  onValueChange={(value) => handleInputChange({ target: { name: 'severity', value } })}
                  options={severityOptions}
                  required
                  allowClear={false}
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
                className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
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

                  <span className="inline-flex font-mono text-xs font-semibold text-[#111] bg-[#f5f5f5] px-2.5 py-1 rounded-md">
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

                  <p className="text-xs font-semibold text-[#111] uppercase tracking-wider mb-2">
                    Resolution Details
                  </p>

                  <p className="text-sm leading-6 text-[#1E1E1E] bg-[#fafafa] p-4 rounded-xl border border-[#e1e4e8]">
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
                  className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
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
                className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
                onClick={() => setStatusModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
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
                className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
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
