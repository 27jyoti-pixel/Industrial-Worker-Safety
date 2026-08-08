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
import Breadcrumb from '../components/common/Breadcrumb';

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
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-blue-200">
            {row.profileImage?.url ? (
              <img src={row.profileImage.url} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.employeeId}</span>
    },
    {
      header: 'Factory',
      accessor: 'factoryName'
    },
    {
      header: 'Phone Number',
      accessor: 'phone'
    },
    {
      header: 'Blood Group',
      render: (row) => (
        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          {row.bloodGroup}
        </span>
      )
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
          {isAdminOrOfficer && (
            <>
              <button
                onClick={() => openImageModal(row)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={() => openEditModal(row)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors"
                title="Edit Worker"
              >
                <Edit className="w-4 h-4" />
              </button>
            </>
          )}
          {(isFactoryAdmin || isSuperAdmin) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
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
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Worker Roster' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Industrial Workers Roster</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage worker profiles, emergency contacts, and health credentials
          </p>
        </div>

        {isAdminOrOfficer && (
          <Button variant="primary" icon={Plus} onClick={openCreateModal}>
            Add New Worker
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card bodyClassName="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
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
      </Card>

      {/* Workers Table */}
      <Table
        columns={columns}
        data={workers}
        loading={loading}
        emptyTitle="No Workers Found"
        emptyDescription="No industrial workers match your current search query or criteria."
        onEmptyAction={isAdminOrOfficer ? openCreateModal : null}
        emptyActionText="Create Worker Profile"
      />

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

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <p className="text-xs font-semibold text-slate-700">Emergency Contact Information</p>
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
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl overflow-hidden shrink-0">
                {selectedWorker.profileImage?.url ? (
                  <img src={selectedWorker.profileImage.url} alt={selectedWorker.name} className="w-full h-full object-cover" />
                ) : (
                  selectedWorker.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedWorker.name}</h3>
                <p className="text-xs font-semibold text-blue-700">ID: {selectedWorker.employeeId}</p>
                <p className="text-xs text-slate-600 mt-0.5">{selectedWorker.factoryName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium">Email:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedWorker.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium">Phone:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedWorker.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium">Blood Group:</span>
                <p className="font-semibold text-red-600 mt-0.5">{selectedWorker.bloodGroup}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium">Emergency Contact:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
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
  );
};

export default Workers;
