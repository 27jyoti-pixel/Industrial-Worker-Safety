import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import workerService from '../services/workerService';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Camera,
  User,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  Award
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';

const Workers = () => {
  const { isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
  }, [currentPage, searchQuery]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await workerService.getAllWorkers({
        search: searchQuery,
        page: currentPage,
        limit: 10
      });
      const dataList = response.workers || response.data || [];
      setWorkers(dataList);
      setTotalPages(response.pages || response.totalPages || 1);
      setTotalItems(response.total || dataList.length);
    } catch (err) {
      showError(err.message || 'Failed to fetch worker profiles');
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

  const openViewModal = (worker) => {
    setSelectedWorker(worker);
    setViewModalOpen(true);
  };

  const openDeleteDialog = (worker) => {
    setSelectedWorker(worker);
    setDeleteDialogOpen(true);
  };

  const openImageModal = (worker) => {
    setSelectedWorker(worker);
    setSelectedImage(null);
    setImageModalOpen(true);
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

  const handleUploadImage = async (e) => {
    e.preventDefault();
    if (!selectedWorker || !selectedImage) {
      showError('Please select an image file first.');
      return;
    }
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('image', selectedImage);
      await workerService.uploadProfileImage(selectedWorker._id, formDataToSend);
      showSuccess('Profile photo updated successfully!');
      setImageModalOpen(false);
      fetchWorkers();
    } catch (err) {
      showError(err.message || 'Failed to upload profile photo');
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
          <div className="w-9 h-9 rounded-full bg-[#EEF2F0] text-[#3E5C54] flex items-center justify-center font-bold text-lg overflow-hidden shrink-0 border border-[#B9C9C3]">
            {row.profileImage?.url ? (
              <img src={row.profileImage.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-[#1E1E1E] text-base">{row.name}</p>
            <p className="text-sm text-[#6C757D]">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      className: 'text-left !text-[14px]',
      render: (row) => <span className="font-mono text-sm font-semibold text-[#3E5C54]">{row.employeeId}</span>
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
      className: 'text-left !text-[14px]',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 rounded text-sm font-bold bg-[#FDEEEF] text-[#E63946] border border-[#F3B8BD]">
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
            className="p-1.5 rounded-xl text-[#6C757D] hover:bg-[#F4F4F4] hover:text-[#3E5C54] transition-colors"
            title="View Details" 
          >
            <Eye className="w-4 h-4" />
          </button>
          {isAdminOrOfficer && (
            <>
              <button
                onClick={() => openImageModal(row)}
                className="p-1.5 rounded-xl text-[#6C757D] hover:bg-[#F4F4F4] hover:text-[#3E5C54] transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEditModal(row)}
                className="p-1.5 rounded-xl text-[#6C757D] hover:bg-[#EEF2F0] hover:text-[#3E5C54] transition-colors"
                title="Edit Worker"
              >
                <Edit className="w-4 h-4" />
              </button>
            </>
          )}
          {(isFactoryAdmin || isSuperAdmin) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="p-1.5 rounded-xl text-[#6C757D] hover:bg-[#FDEEEF] hover:text-[#E63946] transition-colors"
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
  .workers-page-enter {
    animation: workersPageEnter 0.5s ease-out both;
  }

  .workers-breadcrumb {
    animation: workersFadeUp 0.45s ease-out both;
  }

  .workers-header {
    animation: workersHeaderEnter 0.58s cubic-bezier(.22,1,.36,1) 0.04s both;
  }

  .workers-filter {
    animation: workersFadeUp 0.55s ease-out 0.1s both;
  }

  .workers-table {
    animation: workersFadeUp 0.6s ease-out 0.16s both;
    transition: box-shadow 220ms ease, transform 220ms ease;
  }

  .workers-table:hover {
    box-shadow: 0 14px 34px rgba(62, 92, 84, 0.07);
  }

  .workers-page-enter button,
  .workers-page-enter input,
  .workers-page-enter select {
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .workers-page-enter button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .workers-page-enter button:active:not(:disabled) {
    transform: translateY(0);
  }

  .workers-page-enter tbody tr {
    transition: background-color 180ms ease, box-shadow 180ms ease;
  }

  .workers-page-enter tbody tr:hover {
    background-color: #f8faf9;
  }

  .workers-page-enter [role="dialog"] {
    animation: workersModalEnter 220ms cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes workersPageEnter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes workersFadeUp {
    from { opacity: 0; transform: translateY(7px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes workersHeaderEnter {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(.99);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes workersModalEnter {
    from {
      opacity: 0;
      transform: translateY(8px) scale(.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .workers-page-enter,
    .workers-breadcrumb,
    .workers-header,
    .workers-filter,
    .workers-table,
    .workers-page-enter [role="dialog"] {
      animation: none !important;
    }

    .workers-page-enter button,
    .workers-page-enter input,
    .workers-page-enter select,
    .workers-table,
    .workers-page-enter tbody tr {
      transition: none !important;
    }

    .workers-page-enter button:hover:not(:disabled) {
      transform: none !important;
    }
  }
`}</style>

      <div className="space-y-6 workers-page-enter">
      {/* Refined Breadcrumb */}
      <div className="workers-breadcrumb flex items-center gap-2 text-sm">
        <span className="text-[#6C757D]">Dashboard</span>
        <span className="text-[#E0E0E0]">/</span>
        <span className="font-medium text-[#3E5C54]">Workers</span>
      </div>

      {/* Page Header */}
      <div className="workers-header flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-4 bg-white border border-[#E0E0E0] rounded-[20px] shadow-[0_8px_24px_rgba(82,44,80,.035)] transition-all duration-300 ease-out hover:shadow-[0_12px_28px_rgba(82,44,80,.055)]">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-[15px] border border-[#B9C9C3] bg-[#EEF2F0] flex items-center justify-center text-[#3E5C54] shrink-0 transition-transform duration-300">
            <Users className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-[26px] font-semibold text-[#1E1E1E] tracking-tight leading-tight">
              Worker Directory
            </h1>
            <p className="text-sm text-[#6C757D] mt-1">
              Manage worker profiles, emergency contacts, and health credentials
            </p>
          </div>
        </div>

        {isAdminOrOfficer && (
          <Button variant="primary" icon={Plus} onClick={openCreateModal} className="shrink-0">
            Add New Worker
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="workers-filter"><Card bodyClassName="p-4 sm:p-4.5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Search className="w-4 h-4 text-[#6C757D]" />
            <span className="text-sm font-medium text-[#3E5C54]">Find a worker</span>
          </div>

          <div className="flex-1 w-full">
            <SearchBar
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setCurrentPage(1);
              }}
              onClear={() => setSearchQuery('')}
              placeholder="Search by worker name, employee ID, or factory..."
            />
          </div>
        </div>
      </Card></div>

      {/* Workers Table */}
      <div className="workers-table overflow-hidden rounded-2xl">
      <Table
        columns={columns}
        data={workers}
        loading={loading}
        emptyTitle="No Workers Found"
        emptyDescription="No industrial workers match your current search query or criteria."
        onEmptyAction={isAdminOrOfficer ? openCreateModal : null}
        emptyActionText="Create Worker Profile"
      />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal: Create Worker */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add Industrial Worker Profile"
      >
        <form onSubmit={handleCreateWorker} className="space-y-4">
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

          <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E0E0E0] space-y-3">
            <p className="text-sm font-semibold text-[#3E5C54]">Emergency Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input label="Contact Name" name="emergencyContact.name" value={formData.emergencyContact?.name} onChange={handleInputChange} />
              <Input label="Relation" name="emergencyContact.relation" value={formData.emergencyContact?.relation} onChange={handleInputChange} />
              <Input label="Phone" name="emergencyContact.phone" value={formData.emergencyContact?.phone} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Worker</Button>
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
        onClose={() => setViewModalOpen(false)}
        title="Worker Details Profile"
      >
        {selectedWorker && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#EEF2F0] rounded-2xl border border-[#B9C9C3]">
              <div className="w-16 h-16 rounded-full bg-[#3E5C54] text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                {selectedWorker.profileImage?.url ? (
                  <img src={selectedWorker.profileImage.url} alt={selectedWorker.name} className="w-full h-full object-cover" />
                ) : (
                  selectedWorker.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E1E1E]">{selectedWorker.name}</h3>
                <p className="text-sm font-semibold text-[#3E5C54]">ID: {selectedWorker.employeeId}</p>
                <p className="text-sm text-[#6C757D] mt-0.5">{selectedWorker.factoryName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E0E0E0]">
                <span className="text-[#6C757D] font-medium">Email:</span>
                <p className="font-semibold text-[#1E1E1E] mt-0.5">{selectedWorker.email}</p>
              </div>
              <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E0E0E0]">
                <span className="text-[#6C757D] font-medium">Phone:</span>
                <p className="font-semibold text-[#1E1E1E] mt-0.5">{selectedWorker.phone}</p>
              </div>
              <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E0E0E0]">
                <span className="text-[#6C757D] font-medium">Blood Group:</span>
                <p className="font-semibold text-[#E63946] mt-0.5">{selectedWorker.bloodGroup}</p>
              </div>
              <div className="p-3 bg-[#FBF7EF] rounded-xl border border-[#E0E0E0]">
                <span className="text-[#6C757D] font-medium">Emergency Contact:</span>
                <p className="font-semibold text-[#1E1E1E] mt-0.5">
                  {selectedWorker.emergencyContact?.name || 'N/A'}{' '}
                  {selectedWorker.emergencyContact?.phone && `(${selectedWorker.emergencyContact.phone})`}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Upload Profile Image */}
      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Upload Worker Profile Photo"
      >
        <form onSubmit={handleUploadImage} className="space-y-4">
          <FileUpload
            label="Select Profile Photo"
            onChange={(file) => setSelectedImage(file)}
            accept="image/*"
            maxSizeMB={5}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setImageModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Upload Image</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteWorker}
        title="Delete Worker Profile"
        message={`Are you sure you want to permanently remove ${selectedWorker?.name}? This action cannot be undone.`}
        loading={submitting}
      />
      </div>
    </>
  );
};

export default Workers;