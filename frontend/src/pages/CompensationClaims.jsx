import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import claimService from '../services/claimService';
import accidentService from '../services/accidentService';
import workerService from '../services/workerService';
import {
  FileCheck2,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  Clock,
  IndianRupee,
  FileText,
  AlertCircle
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

const CompensationClaims = () => {
  const { user, isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Status update form state
  const [statusFormData, setStatusFormData] = useState({
    status: 'Under Review',
    approvedAmount: 0,
    remarks: ''
  });

  const [accidentsList, setAccidentsList] = useState([]);
  const [workersList, setWorkersList] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    claimAmount: '',
    medicalExpenses: '',
    disabilityType: '',
    description: '',
    worker: '',
    accidentReport: ''
  });

  const claimStatusOptions = ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'];

  useEffect(() => {
    fetchClaims();
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const accRes = await accidentService.getAllReports({ limit: 100 });
        setAccidentsList(accRes.accidents || accRes.data || []);
        const wrkRes = await workerService.getAllWorkers({ limit: 100 });
        setWorkersList(wrkRes.workers || wrkRes.data || []);
      } catch (err) {
        console.error('Failed to load dropdown lists', err);
      }
    };
    loadDropdowns();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await claimService.getAllClaims({
        search: searchQuery,
        status: statusFilter,
        page: currentPage,
        limit: 10
      });
      const dataList = response.claims || response.data || [];
      setClaims(dataList);
      setTotalPages(response.pages || response.totalPages || 1);
      setTotalItems(response.total || dataList.length);
    } catch (err) {
      showError(err.message || 'Failed to load compensation claims');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setFormData({
      claimAmount: '',
      medicalExpenses: '',
      disabilityType: '',
      description: '',
      worker: '',
      accidentReport: ''
    });
    setCreateModalOpen(true);
  };

  const openEditModal = (claim) => {
    setSelectedClaim(claim);
    setFormData({
      claimAmount: claim.claimAmount || '',
      medicalExpenses: claim.medicalExpenses || '',
      disabilityType: claim.disabilityType || '',
      description: claim.description || '',
      worker: claim.worker?._id || claim.worker || '',
      accidentReport: claim.accidentReport?._id || claim.accidentReport || ''
    });
    setEditModalOpen(true);
  };

  const openViewModal = (claim) => {
    setSelectedClaim(claim);
    setViewModalOpen(true);
  };

  const openStatusModal = (claim) => {
    setSelectedClaim(claim);
    setStatusFormData({
      status: claim.status || 'Under Review',
      approvedAmount: claim.approvedAmount || claim.claimAmount || 0,
      remarks: claim.remarks || ''
    });
    setStatusModalOpen(true);
  };

  const openDocModal = (claim) => {
    setSelectedClaim(claim);
    setSelectedDocuments([]);
    setDocModalOpen(true);
  };

  const openDeleteDialog = (claim) => {
    setSelectedClaim(claim);
    setDeleteDialogOpen(true);
  };

  const handleCreateClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await claimService.submitClaim({
        ...formData,
        claimAmount: Number(formData.claimAmount),
        medicalExpenses: Number(formData.medicalExpenses || 0)
      });
      showSuccess('Compensation claim submitted successfully!');
      setCreateModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to submit compensation claim');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClaim = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    setSubmitting(true);
    try {
      await claimService.updateClaim(selectedClaim._id, {
        ...formData,
        claimAmount: Number(formData.claimAmount),
        medicalExpenses: Number(formData.medicalExpenses || 0)
      });
      showSuccess('Compensation claim updated!');
      setEditModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to update claim details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    setSubmitting(true);
    try {
      await claimService.updateClaimStatus(selectedClaim._id, {
        status: statusFormData.status,
        approvedAmount: Number(statusFormData.approvedAmount),
        remarks: statusFormData.remarks
      });
      showSuccess(`Claim updated to status: ${statusFormData.status}`);
      setStatusModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to update claim status');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadDocuments = async (e) => {
    e.preventDefault();
    if (!selectedClaim || !selectedDocuments.length) {
      showError('Please select supporting document files.');
      return;
    }
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      const filesArray = Array.isArray(selectedDocuments) ? selectedDocuments : [selectedDocuments];
      filesArray.forEach((file) => formDataToSend.append('images', file));

      await claimService.uploadDocuments(selectedClaim._id, formDataToSend);
      showSuccess('Supporting claim documents uploaded!');
      setDocModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to upload claim documents');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClaim = async () => {
    if (!selectedClaim) return;
    setSubmitting(true);
    try {
      await claimService.deleteClaim(selectedClaim._id);
      showSuccess('Compensation claim deleted.');
      setDeleteDialogOpen(false);
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to delete claim');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Claim Number',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            {row.claimNumber || 'CLM-PENDING'}
          </span>
          <p className="text-xs text-slate-500 mt-1 truncate max-w-xs">{row.description}</p>
        </div>
      )
    },
    {
      header: 'Claim Amount',
      render: (row) => (
        <span className="font-semibold text-slate-800 text-sm">
          ₹{(row.claimAmount || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Approved Amount',
      render: (row) => (
        <span className={`font-semibold text-sm ${row.approvedAmount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
          ₹{(row.approvedAmount || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Medical Expenses',
      render: (row) => <span className="text-xs font-medium text-slate-600">₹{(row.medicalExpenses || 0).toLocaleString('en-IN')}</span>
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
          {!isAdminOrOfficer && (
  <>
    <button
      onClick={() => openDocModal(row)}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
      title="Upload Documents"
    >
      <Upload className="w-4 h-4" />
    </button>

    <button
      onClick={() => openEditModal(row)}
      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors"
      title="Edit Claim"
    >
      <Edit className="w-4 h-4" />
    </button>
  </>
)}
          {isAdminOrOfficer && (
            <button
              onClick={() => openStatusModal(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              title="Approve / Review Status"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {(!isAdminOrOfficer) && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete Claim"
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
      <Breadcrumb items={[{ label: 'Compensation Claims' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Compensation Claims</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Submit, track, and audit worker disability and medical compensation requests
          </p>
        </div>

        {!isAdminOrOfficer && (
  <Button variant="primary" icon={Plus} onClick={openCreateModal}>
    Submit New Claim
  </Button>
)}
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
            placeholder="Search by claim number, disability type, or description..."
          />

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={claimStatusOptions}
            placeholder="Filter by Status"
            className="w-full sm:w-48"
          />
        </div>
      </Card>

      {/* Claims Table */}
      <Table
        columns={columns}
        data={claims}
        loading={loading}
        emptyTitle="No Compensation Claims Found"
        emptyDescription="There are no compensation claim records matching your query."
        onEmptyAction={!isAdminOrOfficer ? openCreateModal : undefined}
emptyActionText={!isAdminOrOfficer ? "Submit Claim" : undefined}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal: Submit Claim */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Submit Compensation Claim"
      >
        <form onSubmit={handleCreateClaim} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Claim Amount (₹)" type="number" name="claimAmount" value={formData.claimAmount} onChange={handleInputChange} placeholder="50000" required />
            <Input label="Medical Expenses (₹)" type="number" name="medicalExpenses" value={formData.medicalExpenses} onChange={handleInputChange} placeholder="12000" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Disability / Injury Type" name="disabilityType" value={formData.disabilityType} onChange={handleInputChange} placeholder="e.g. Partial Limb Fracture" />
            <Select
              label="Associated Worker"
              name="worker"
              value={formData.worker}
              onChange={handleInputChange}
              options={workersList.map((w) => ({ value: w._id, label: `${w.name} (${w.employeeId})` }))}
              placeholder="Select worker profile"
            />
          </div>

          <Select
            label="Linked Accident Incident (Optional)"
            name="accidentReport"
            value={formData.accidentReport}
            onChange={handleInputChange}
            options={accidentsList.map((a) => ({ value: a._id, label: `${a.title} (${new Date(a.date).toLocaleDateString()})` }))}
            placeholder="Select accident report"
          />

          <Textarea label="Claim Description & Justification" name="description" value={formData.description} onChange={handleInputChange} placeholder="Detail medical treatment and compensation details..." required />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Submit Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Claim */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Compensation Claim"
      >
        <form onSubmit={handleUpdateClaim} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Claim Amount (₹)" type="number" name="claimAmount" value={formData.claimAmount} onChange={handleInputChange} required />
            <Input label="Medical Expenses (₹)" type="number" name="medicalExpenses" value={formData.medicalExpenses} onChange={handleInputChange} />
          </div>
          <Input label="Disability Type" name="disabilityType" value={formData.disabilityType} onChange={handleInputChange} />
          <Textarea label="Claim Description" name="description" value={formData.description} onChange={handleInputChange} required />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Update Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Compensation Claim Details"
      >
        {selectedClaim && (
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  {selectedClaim.claimNumber}
                </span>
                <p className="text-xs text-slate-500 mt-2">Submitted: {new Date(selectedClaim.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Claim Amount</span>
                <p className="text-base font-bold text-slate-800 mt-0.5">₹{(selectedClaim.claimAmount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">Medical Expenses</span>
                <p className="text-base font-bold text-slate-700 mt-0.5">₹{(selectedClaim.medicalExpenses || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-emerald-700 font-medium">Approved Amount</span>
                <p className="text-base font-bold text-emerald-700 mt-0.5">₹{(selectedClaim.approvedAmount || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Claim Description</p>
              <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">{selectedClaim.description}</p>
            </div>

            {selectedClaim.remarks && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Officer Remarks</p>
                <p className="text-sm text-slate-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200">{selectedClaim.remarks}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Status & Approval Update */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Review & Approve Compensation Claim"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <Select
            label="Claim Status"
            value={statusFormData.status}
            onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
            options={claimStatusOptions}
            required
          />

          <Input
            label="Approved Compensation Amount (₹)"
            type="number"
            value={statusFormData.approvedAmount}
            onChange={(e) => setStatusFormData({ ...statusFormData, approvedAmount: e.target.value })}
            required
          />

          <Textarea
            label="Officer Audit Remarks"
            value={statusFormData.remarks}
            onChange={(e) => setStatusFormData({ ...statusFormData, remarks: e.target.value })}
            placeholder="Add verification notes or approval rationale..."
          />

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Save Review Decision</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Upload Documents */}
      <Modal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Upload Supporting Medical & Claim Evidence"
      >
        <form onSubmit={handleUploadDocuments} className="space-y-4">
          <FileUpload
            label="Attach Medical Bills / Hospital Reports"
            multiple
            onChange={(files) => setSelectedDocuments(files)}
            accept="image/*,application/pdf"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDocModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={submitting}>Upload Documents</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteClaim}
        title="Delete Compensation Claim"
        message="Are you sure you want to permanently delete this compensation claim?"
        loading={submitting}
      />
    </div>
  );
};

export default CompensationClaims;
