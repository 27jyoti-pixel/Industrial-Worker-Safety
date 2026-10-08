import React, { useState, useEffect, useRef } from 'react';
import SearchFilterSelect from '../components/common/SearchFilterSelect';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import claimService from '../services/claimService';
import accidentService from '../services/accidentService';
import workerService from '../services/workerService';
import claimsHero from '../assets/compensation-claims-hero.png';

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
import DataTablePagination from '../components/common/DataTablePagination';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import FileUpload from '../components/common/FileUpload';


const CompensationClaims = () => {
  const { user, isAdminOrOfficer, isSuperAdmin, isFactoryAdmin } = useAuth();
  const { showSuccess, showError } = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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

  const claimStatusOptions = [
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected',
    'Completed'
  ];


  useEffect(() => {
    fetchClaims();
  }, [currentPage, searchQuery, statusFilter, itemsPerPage]);


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
    const requestId = ++fetchRequestId.current;
    setLoading(true);

    try {
      const response = await claimService.getAllClaims({
        search: searchQuery,
        status: statusFilter,
        page: currentPage,
        limit: itemsPerPage
      });

      if (requestId !== fetchRequestId.current) return;
      const dataList = Array.isArray(response.claims)
        ? response.claims
        : Array.isArray(response.data)
          ? response.data
          : [];
      const total = Number(response.pagination?.total ?? response.total ?? dataList.length) || 0;
      const pages = Math.ceil(total / itemsPerPage);

      setClaims(dataList);
      setTotalItems(total);
      if (currentPage > Math.max(1, pages)) setCurrentPage(Math.max(1, pages));
    } catch (err) {
      if (requestId === fetchRequestId.current) showError(err.message || 'Failed to load compensation claims');
    } finally {
      if (requestId === fetchRequestId.current) setLoading(false);
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
      accidentReport:
        claim.accidentReport?._id ||
        claim.accidentReport ||
        ''
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
      approvedAmount:
        claim.approvedAmount ||
        claim.claimAmount ||
        0,
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

      showSuccess(
        'Compensation claim submitted successfully!'
      );

      setCreateModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(
        err.message ||
        'Failed to submit compensation claim'
      );
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
      showError(
        err.message ||
        'Failed to update claim details'
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!selectedClaim) return;

    setSubmitting(true);

    try {
      await claimService.updateClaimStatus(
        selectedClaim._id,
        {
          status: statusFormData.status,
          approvedAmount: Number(
            statusFormData.approvedAmount
          ),
          remarks: statusFormData.remarks
        }
      );

      showSuccess(
        `Claim updated to status: ${statusFormData.status}`
      );

      setStatusModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(
        err.message ||
        'Failed to update claim status'
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleUploadDocuments = async (e) => {
    e.preventDefault();

    if (
      !selectedClaim ||
      !selectedDocuments.length
    ) {
      showError(
        'Please select supporting document files.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      const filesArray = Array.isArray(
        selectedDocuments
      )
        ? selectedDocuments
        : [selectedDocuments];

      filesArray.forEach((file) => {
        formDataToSend.append('images', file);
      });

      await claimService.uploadDocuments(
        selectedClaim._id,
        formDataToSend
      );

      showSuccess(
        'Supporting claim documents uploaded!'
      );

      setDocModalOpen(false);
      fetchClaims();
    } catch (err) {
      showError(
        err.message ||
        'Failed to upload claim documents'
      );
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteClaim = async () => {
    if (!selectedClaim) return;

    setSubmitting(true);

    try {
      await claimService.deleteClaim(
        selectedClaim._id
      );

      showSuccess(
        'Compensation claim deleted.'
      );

      setDeleteDialogOpen(false);
      fetchClaims();
    } catch (err) {
      showError(
        err.message ||
        'Failed to delete claim'
      );
    } finally {
      setSubmitting(false);
    }
  };


  /*
   * Claims table
   *
   * UI refinement:
   * - Removed description below claim number
   * - Keeps only the essential claim identifier
   * - Keeps all existing actions and permissions
   */
  const columns = [
    {
      header: 'Claim Number',

      render: (row) => (
        <span className="font-mono text-xs font-semibold text-[#111]">
          {row.claimNumber || 'CLM-PENDING'}
        </span>
      )
    },

    {
      header: 'Claim Amount',

      render: (row) => (
        <span className="font-medium text-[#1E1E1E] text-sm">
          ₹{(row.claimAmount || 0).toLocaleString('en-IN')}
        </span>
      )
    },

    {
      header: 'Approved Amount',

      render: (row) => (
        <span
          className={`font-medium text-sm ${
            row.approvedAmount > 0
              ? 'text-[#111]'
              : 'text-[#6C757D]'
          }`}
        >
          ₹{(row.approvedAmount || 0).toLocaleString('en-IN')}
        </span>
      )
    },

    {
      header: 'Medical Expenses',

      render: (row) => (
        <span className="text-sm font-medium text-[#6C757D]">
          ₹{(row.medicalExpenses || 0).toLocaleString('en-IN')}
        </span>
      )
    },

    {
      header: 'Status',

      render: (row) => (
        <StatusBadge status={row.status} variant="dot" />
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
            className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>


          {/* Worker actions */}
          {!isAdminOrOfficer && (
            <>
              <button
                onClick={() => openDocModal(row)}
                className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
                title="Upload Documents"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                onClick={() => openEditModal(row)}
                className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
                title="Edit Claim"
              >
                <Edit className="w-4 h-4" />
              </button>
            </>
          )}


          {/* Admin / Officer */}
          {isAdminOrOfficer && (
            <button
              onClick={() => openStatusModal(row)}
              className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
              title="Approve / Review Status"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}


          {/* Delete */}
          {!isAdminOrOfficer && (
            <button
              onClick={() => openDeleteDialog(row)}
              className="rounded-md p-1.5 text-[#62666b] transition-colors hover:bg-[#f3f4f5] hover:text-[#111]"
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
    <>
      
<style>{`
  .claims-create-dialog {
    border-color: #e1e4e8 !important;
    background: #fff !important;
    box-shadow: 0 16px 40px rgba(17, 17, 17, .12) !important;
  }
  .fixed.inset-0.z-50:has(.claims-create-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
    background: rgba(17, 17, 17, .32) !important;
    backdrop-filter: none !important;
  }
  .claims-create-dialog > div:first-child {
    border-bottom-color: #e1e4e8 !important;
    background: #fff !important;
  }
  .claims-create-dialog > div:first-child h3 {
    color: #111 !important;
    font-weight: 600;
  }
  .claims-create-dialog > div:first-child button {
    color: #62666b !important;
  }
  .claims-create-dialog > div:first-child button:hover {
    background: #f3f4f5 !important;
    color: #111 !important;
  }
  .claims-create-dialog label {
    margin-bottom: 6px !important;
    color: #292929 !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    text-transform: none !important;
    letter-spacing: normal !important;
  }
  .claims-create-dialog label span {
    color: #E87532 !important;
  }
  .claims-create-dialog input,
  .claims-create-dialog select {
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
  .claims-create-dialog select {
    padding-right: 36px !important;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
    background-position: right 12px center !important;
    background-repeat: no-repeat !important;
    background-size: 16px !important;
  }
  .claims-create-dialog select::-ms-expand {
    display: none;
  }
  .claims-create-dialog textarea {
    min-height: 104px !important;
    padding: 11px 14px !important;
    border: 1px solid #dedede !important;
    border-radius: 8px !important;
    background: #fff !important;
    color: #111 !important;
    font-size: 14px !important;
    line-height: 1.5;
    box-shadow: none !important;
  }
  .claims-create-dialog input[type="date"]::-webkit-calendar-picker-indicator,
  .claims-create-dialog input[type="time"]::-webkit-calendar-picker-indicator {
    opacity: 0;
  }
  .claims-create-dialog input::placeholder,
  .claims-create-dialog textarea::placeholder {
    color: #858b92 !important;
    opacity: 1;
  }
  .claims-create-dialog input:focus,
  .claims-create-dialog select:focus,
  .claims-create-dialog textarea:focus {
    border-color: #d1a184 !important;
    box-shadow: 0 0 0 2px rgba(232, 117, 50, .12) !important;
    outline: none;
  }
  .claims-create-dialog form > div:last-child button {
    min-height: 40px;
    border-radius: 8px !important;
    font-size: 13px;
    font-weight: 500;
  }
  .claim-review-dialog,
  .claim-detail-dialog {
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
  .fixed.inset-0.z-50:has(.claim-review-dialog) > .fixed.top-0.left-0.w-screen.h-screen,
  .fixed.inset-0.z-50:has(.claim-detail-dialog) > .fixed.top-0.left-0.w-screen.h-screen {
    background: rgba(17, 17, 17, .42) !important;
    backdrop-filter: none !important;
  }
  .claim-review-dialog > div:first-child,
  .claim-detail-dialog > div:first-child {
    flex: 0 0 auto;
    border-bottom-color: #e1e4e8 !important;
    background: #fff !important;
  }
  .claim-review-dialog > div:first-child h3,
  .claim-detail-dialog > div:first-child h3 { color: #111 !important; font-weight: 600 !important; }
  .claim-review-dialog > div:first-child button,
  .claim-detail-dialog > div:first-child button { color: #62666b !important; }
  .claim-review-dialog > div:first-child button:hover,
  .claim-detail-dialog > div:first-child button:hover { background: #f3f4f5 !important; color: #111 !important; }
  .claim-review-dialog > div:nth-child(2),
  .claim-detail-dialog > div:nth-child(2) {
    flex: 0 1 auto;
    min-height: 0;
    max-height: min(68vh, calc(100dvh - 150px)) !important;
    overflow-y: auto !important;
    background: #fff !important;
    padding: 18px 24px !important;
  }
  .claim-review-dialog > div:nth-child(2) { padding: 14px 24px !important; }
  .claim-detail-dialog > div:nth-child(2) { padding: 14px 20px !important; }
  .claim-review-dialog form { display: flex; flex-direction: column; gap: 10px; }
  .claim-review-dialog form > :not([hidden]) ~ :not([hidden]) { margin-top: 0 !important; }
  .claim-review-dialog label {
    margin-bottom: 6px !important;
    color: #59616a !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    text-transform: none !important;
    letter-spacing: normal !important;
  }
  .claim-review-dialog label span { color: #e87532 !important; }
  .claim-review-dialog input:not(.dialog-select-native),
  .claim-review-dialog textarea {
    border: 1px solid #d1d5db !important;
    border-radius: 8px !important;
    background: #fff !important;
    color: #111 !important;
    box-shadow: none !important;
    font-size: 14px !important;
  }
  .claim-review-dialog input:not(.dialog-select-native) { height: 54px !important; min-height: 54px !important; }
  .claim-review-dialog input:not(.dialog-select-native)::placeholder,
  .claim-review-dialog textarea::placeholder { font-weight: 400 !important; }
  .claim-review-dialog textarea { height: 106px !important; min-height: 106px !important; resize: none !important; }
  .claim-review-dialog input:focus,
  .claim-review-dialog textarea:focus {
    border-color: #f2c7b0 !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .claim-review-dialog .dialog-search-filter-label { color: #59616a !important; }
  .claim-review-dialog .dialog-search-filter-trigger[data-icon-type="status"] {
    display: flex !important;
    height: 54px !important;
    min-height: 54px !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
  .claim-review-dialog .dialog-search-filter-trigger[data-icon-type="status"] .search-filter-selected-content {
    display: inline-flex !important;
    min-width: 0;
    flex: 1 1 auto;
    flex-direction: row !important;
    align-items: center !important;
    gap: 8px !important;
  }
  .claim-review-dialog .dialog-search-filter-trigger[data-icon-type="status"] .search-filter-selected-icon {
    width: 16px !important;
    height: 16px !important;
    flex: 0 0 16px !important;
  }
  .claim-review-dialog .dialog-search-filter-trigger[data-icon-type="status"] > svg:last-child {
    flex: 0 0 16px;
    align-self: center;
  }
  .claim-review-dialog .dialog-search-filter-trigger[data-icon-type="status"]:focus-visible {
    border-color: #f2c7b0 !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .claim-review-status-menu .search-filter-option {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 10px !important;
  }
  .claim-review-status-menu .search-filter-option-content {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 10px !important;
  }
  .claim-review-status-menu .search-filter-option-icon {
    width: 16px !important;
    height: 16px !important;
    flex: 0 0 16px !important;
  }
  .claim-review-dialog form > div:last-child { display: flex; justify-content: flex-end; gap: 10px; padding-top: 2px; }
  .claim-review-dialog form > div:last-child button,
  .claim-detail-dialog > div:last-child button {
    min-height: 40px;
    border-radius: 8px !important;
    box-shadow: none !important;
    transform: none !important;
    font-weight: 500 !important;
  }
  .claim-review-dialog form > div:last-child button:first-child,
  .claim-detail-dialog > div:last-child button {
    border: 1px solid #d1d5db !important;
    background: #fff !important;
    color: #111 !important;
  }
  .claim-review-dialog form > div:last-child button:first-child:hover,
  .claim-detail-dialog > div:last-child button:hover { background: #f7f7f7 !important; }
  .claim-review-dialog form > div:last-child button:last-child {
    border: 1px solid #111 !important;
    background: #111 !important;
    color: #fff !important;
  }
  .claim-review-dialog form > div:last-child button:last-child:hover { background: #111 !important; color: #fff !important; }
  .claim-detail-dialog > div:last-child {
    flex: 0 0 auto;
    justify-content: flex-end;
    border-top: 1px solid #e1e4e8 !important;
    background: #fff !important;
    padding: 12px 24px !important;
  }
  #compensation-claims-page .claims-hero-art {
    right: -6px;
    background-size: cover;
    background-position: right center;
    background-repeat: no-repeat;
  }

  #compensation-claims-page .claims-submit-cta {
    background-color: #111111 !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }

  #compensation-claims-page .claims-submit-cta:hover:not(:disabled) {
    background-color: #2b2b2b !important;
  }

  #compensation-claims-page button.midc-primary-cta {
    background-color: #111111 !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }

  #compensation-claims-page button.midc-primary-cta:hover:not(:disabled) {
    background-color: #2b2b2b !important;
  }

  .claims-page-enter {
    animation: claimsPageEnter 0.5s ease-out both;
  }

  .claims-page-header {
    animation: claimsHeaderEnter 0.6s cubic-bezier(.22,1,.36,1) both;
  }

  .claims-search-card {
    animation: claimsContentEnter 0.55s ease-out 0.08s both;
  }

  .claims-table-wrap {
    animation: claimsContentEnter 0.6s ease-out 0.14s both;
    transition: none;
  }

  .claims-table-wrap .data-table-pagination-control.is-current,
  .claims-table-wrap .data-table-pagination-control.is-current:hover {
    border-color: #111111 !important;
    background: #111111 !important;
    color: #ffffff !important;
  }

  #compensation-claims-page .claims-search-card:has(.claims-status-menu) {
    position: relative;
    z-index: 20;
    overflow: visible;
  }

  #compensation-claims-page .claims-table-wrap {
    position: relative;
    z-index: 0;
  }

  #compensation-claims-page .claims-search-card input,
  #compensation-claims-page .claims-search-card select {
    height: 48px;
    min-height: 48px;
    border-radius: 8px !important;
    border-color: #e1e4e8 !important;
    background-color: #fff !important;
    box-shadow: none !important;
    color: #111 !important;
    font-size: 14px !important;
  }

  #compensation-claims-page .claims-search-card input:focus,
  #compensation-claims-page .claims-search-card select:focus {
    border-color: #9ca3af !important;
    box-shadow: 0 0 0 2px rgba(107, 114, 128, .1) !important;
  }

  #compensation-claims-page .claims-search-card .search-filter-trigger:hover {
    border-color: #cfd3d8 !important;
    background-color: #fefefe !important;
  }

  #compensation-claims-page .claims-search-card .search-filter-trigger,
  #compensation-claims-page .claims-search-card .search-filter-trigger:hover {
    transform: none !important;
    box-shadow: none !important;
    transition: border-color 160ms ease, background-color 160ms ease !important;
  }

  #compensation-claims-page .claims-search-card .search-filter-trigger:focus-visible {
    border-color: #b8b8b8 !important;
    box-shadow: 0 0 0 2px rgba(232, 117, 50, .14) !important;
    outline: none;
  }

  #compensation-claims-page .claims-search-card select {
    padding-left: 2.5rem !important;
    padding-right: 36px !important;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
    background-position: right 12px center !important;
    background-repeat: no-repeat !important;
    background-size: 16px !important;
  }
  #compensation-claims-page .claims-search-card select option { background: #fff; color: #222; }
  #compensation-claims-page .claims-search-card select option:checked { background: #f3f4f5; color: #111; }

  #compensation-claims-page .claims-empty-state {
    min-height: 160px;
    border: 0;
    border-radius: 0;
    background: #fff;
    padding: 24px 20px;
  }

  #compensation-claims-page .claims-empty-icon {
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background: #f0f1f2;
    color: #59636f;
  }

  #compensation-claims-page .claims-empty-state .midc-primary-cta {
    border-radius: 8px !important;
    box-shadow: none !important;
  }

  .claims-page-enter button,
  .claims-page-enter input,
  .claims-page-enter select,
  .claims-page-enter textarea {
    transition:
      background-color 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .claims-page-enter button:hover:not(:disabled):not(.midc-primary-cta) {
    transform: translateY(-1px);
  }

  .claims-page-enter button:active:not(:disabled) {
    transform: translateY(0);
  }

  .claims-page-enter [role="dialog"] {
    animation: claimsModalEnter 220ms cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes claimsPageEnter {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes claimsHeaderEnter {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes claimsContentEnter {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes claimsModalEnter {
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
    .claims-page-enter,
    .claims-page-header,
    .claims-search-card,
    .claims-table-wrap,
    .claims-page-enter [role="dialog"] {
      animation: none !important;
    }

    .claims-page-enter button,
    .claims-page-enter input,
    .claims-page-enter select,
    .claims-page-enter textarea,
    .claims-table-wrap,
    .claims-page-enter tbody tr {
      transition: none !important;
    }

    .claims-page-enter button:hover:not(:disabled):not(.midc-primary-cta) {
      transform: none !important;
    }
  }
`}</style>

      <div id="compensation-claims-page" className="claims-page space-y-6 claims-page-enter">

      {/* Compensation hero */}
      <section className="claims-page-header claims-hero relative isolate -mx-4 -mt-4 min-h-[278px] w-[calc(100%+2rem)] overflow-hidden bg-[#F7F8F8] sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]" aria-labelledby="claims-page-title">
        <div className="relative z-10 flex min-h-[278px] items-start px-4 pt-7 sm:items-center sm:py-7 sm:px-6 lg:px-8">
          <div className="w-full max-w-[740px] lg:w-[52%]">
            <h1 id="claims-page-title" className="!mb-0 !text-[30px] !font-semibold !leading-tight !tracking-[-.035em] !text-[#111] sm:!text-[42px] lg:!text-[44px]">
              Compensation Claims
            </h1>
            <p className="mt-2 max-w-[470px] text-[16px] leading-[1.5] text-[#6B7280] sm:text-[17px]">
              Track worker compensation requests and approval progress.
            </p>
          </div>
        </div>

        <div aria-hidden="true" className="claims-hero-art absolute inset-0 z-0 hidden xl:block" style={{ backgroundImage: `url(${claimsHero})` }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-0 xl:hidden">
          <img src={claimsHero} alt="" className="block h-auto w-full object-contain object-center" />
        </div>
      </section>


      {/* =====================================================
          SEARCH & FILTER
          ===================================================== */}

      <section className="claims-search-card search-filter-controls grid grid-cols-1 items-center gap-3 bg-transparent p-0 lg:grid-cols-[minmax(0,1fr)_190px_auto]" aria-label="Search and filter compensation claims">
        <SearchBar
          className="search-filter-field"
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
          placeholder="Search by claim number, worker, or description..."
        />

        <SearchFilterSelect
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
          options={claimStatusOptions}
          label="All Statuses"
          iconType="status"
          menuClassName="claims-status-menu"
        />
        {!isAdminOrOfficer && (
          <button type="button" onClick={openCreateModal} className="midc-primary-cta claims-submit-cta inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium text-white transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Submit Claim
          </button>
        )}
      </section>


      {/* =====================================================
          CLAIMS TABLE
          ===================================================== */}

      <div className="claims-table-wrap standard-data-table-shell">
      {loading || claims.length > 0 ? (
        <Table columns={columns} data={claims} loading={loading} className="platform-data-table" />
      ) : (
        <section className="claims-empty-state standard-data-table-empty flex flex-col items-center justify-center text-center" aria-live="polite">
          <span className="claims-empty-icon flex items-center justify-center rounded-full">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-[16px] font-semibold text-[#111]">No Compensation Claims Found</h2>
          <p className="mt-1 max-w-md text-[13px] leading-5 text-[#6B7280]">
            There are no compensation claim records matching your query.
          </p>
        </section>
      )}
        <DataTablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
          itemLabel="claims"
        />
      </div>


      {/* =====================================================
          CREATE CLAIM MODAL
          ===================================================== */}

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Submit Compensation Claim"
        dialogClassName="claims-create-dialog"
      >

        <form
          onSubmit={handleCreateClaim}
          className="space-y-4"
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input
              label="Claim Amount (₹)"
              type="number"
              name="claimAmount"
              value={formData.claimAmount}
              onChange={handleInputChange}
              placeholder="50000"
              required
            />

            <Input
              label="Medical Expenses (₹)"
              type="number"
              name="medicalExpenses"
              value={formData.medicalExpenses}
              onChange={handleInputChange}
              placeholder="12000"
            />

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input
              label="Disability / Injury Type"
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleInputChange}
              placeholder="e.g. Partial Limb Fracture"
            />

            <SearchFilterSelect
              label="Associated Worker"
              formField
              name="worker"
              value={formData.worker}
              onValueChange={(value) => handleInputChange({ target: { name: 'worker', value } })}
              options={workersList.map((w) => ({
                value: w._id,
                label: `${w.name} (${w.employeeId})`
              }))}
              placeholder="Select worker profile"
              allowClear
            />

          </div>


          <SearchFilterSelect
            label="Linked Accident Incident (Optional)"
            formField
            name="accidentReport"
            value={formData.accidentReport}
            onValueChange={(value) => handleInputChange({ target: { name: 'accidentReport', value } })}
            options={accidentsList.map((a) => ({
              value: a._id,
              label: `${a.title} (${new Date(
                a.date
              ).toLocaleDateString()})`
            }))}
            placeholder="Select accident report"
            allowClear
          />


          <Textarea
            label="Claim Description & Justification"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detail medical treatment and compensation details..."
            required
          />


          <div className="flex justify-end gap-3 pt-2">

            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() =>
                setCreateModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Submit Claim
            </Button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          EDIT CLAIM MODAL
          ===================================================== */}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Compensation Claim"
      >

        <form
          onSubmit={handleUpdateClaim}
          className="space-y-4"
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input
              label="Claim Amount (₹)"
              type="number"
              name="claimAmount"
              value={formData.claimAmount}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Medical Expenses (₹)"
              type="number"
              name="medicalExpenses"
              value={formData.medicalExpenses}
              onChange={handleInputChange}
            />

          </div>


          <Input
            label="Disability Type"
            name="disabilityType"
            value={formData.disabilityType}
            onChange={handleInputChange}
          />


          <Textarea
            label="Claim Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />


          <div className="flex justify-end gap-3 pt-2">

            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() =>
                setEditModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Update Claim
            </Button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          VIEW CLAIM MODAL
          ===================================================== */}

      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Compensation Claim Details"
        maxWidth="max-w-[680px]"
        dialogClassName="claim-detail-dialog"
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

        {selectedClaim && (
          <div className="space-y-4 text-[#111]">
            <section className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] pb-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-[#626b78]">Claim Number</p>
                <p className="mt-0.5 break-all font-mono text-[15px] font-semibold text-[#111]">{selectedClaim.claimNumber || 'Not provided'}</p>
                <p className="mt-1.5 text-[13px] text-[#626b78]">
                  Submitted: {selectedClaim.createdAt && !Number.isNaN(new Date(selectedClaim.createdAt).getTime())
                    ? new Date(selectedClaim.createdAt).toLocaleDateString()
                    : 'Not provided'}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.08em] text-[#626b78]">Status</p>
                <StatusBadge status={selectedClaim.status} variant="dot" />
              </div>
            </section>

            <section className="grid grid-cols-3">
              <div className="min-w-0 py-1 pr-3 sm:pr-5">
                <p className="text-[11px] font-medium text-[#626b78] sm:text-[12px]">Claim Amount</p>
                <p className="mt-1 whitespace-nowrap text-[14px] font-semibold text-[#111] sm:text-[16px]">₹{(selectedClaim.claimAmount || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="min-w-0 border-l border-[#e1e4e8] px-3 py-1 sm:px-5">
                <p className="text-[11px] font-medium text-[#626b78] sm:text-[12px]">Medical Expenses</p>
                <p className="mt-1 whitespace-nowrap text-[14px] font-semibold text-[#111] sm:text-[16px]">₹{(selectedClaim.medicalExpenses || 0).toLocaleString('en-IN')}</p>
              </div>
              <div className="min-w-0 border-l border-[#e1e4e8] pl-3 py-1 sm:pl-5">
                <p className="text-[11px] font-medium text-[#626b78] sm:text-[12px]">Approved Amount</p>
                <p className="mt-1 whitespace-nowrap text-[14px] font-semibold text-[#111] sm:text-[16px]">₹{(selectedClaim.approvedAmount || 0).toLocaleString('en-IN')}</p>
              </div>
            </section>

            <section>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[.08em] text-[#626b78]">Claim Description</h4>
              <p className="whitespace-pre-wrap break-words rounded-md bg-[#f5f6f7] px-3.5 py-3 text-[14px] leading-5 text-[#111]">
                {selectedClaim.description || 'Not provided'}
              </p>
            </section>

            {selectedClaim.remarks && (
              <section>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[.08em] text-[#626b78]">Officer Remarks</h4>
                <p className="whitespace-pre-wrap break-words rounded-md bg-[#f5f6f7] px-3.5 py-3 text-[14px] leading-5 text-[#111]">
                  {selectedClaim.remarks}
                </p>
              </section>
            )}
          </div>
        )}

      </Modal>


      {/* =====================================================
          STATUS / APPROVAL MODAL
          ===================================================== */}

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Review & Approve Compensation Claim"
        maxWidth="max-w-[560px]"
        dialogClassName="claim-review-dialog"
      >

        <form
          onSubmit={handleUpdateStatus}
          className="space-y-4"
        >

          <SearchFilterSelect
            label="Claim Status"
            formField
            value={statusFormData.status}
            onValueChange={(value) =>
              setStatusFormData({
                ...statusFormData,
                status: value
              })
            }
            options={claimStatusOptions}
            required
            allowClear={false}
            iconType="status"
            matchSelectedOptionColor
            menuClassName="claim-review-status-menu"
          />


          <Input
            label="Approved Compensation Amount (₹)"
            type="number"
            value={statusFormData.approvedAmount}
            onChange={(e) =>
              setStatusFormData({
                ...statusFormData,
                approvedAmount: e.target.value
              })
            }
            required
          />


          <Textarea
            label="Officer Audit Remarks"
            value={statusFormData.remarks}
            onChange={(e) =>
              setStatusFormData({
                ...statusFormData,
                remarks: e.target.value
              })
            }
            placeholder="Add verification notes or approval rationale..."
          />


          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() =>
                setStatusModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Save Review Decision
            </Button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          UPLOAD DOCUMENTS MODAL
          ===================================================== */}

      <Modal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        title="Upload Supporting Medical & Claim Evidence"
      >

        <form
          onSubmit={handleUploadDocuments}
          className="space-y-4"
        >

          <FileUpload
            label="Attach Medical Bills / Hospital Reports"
            multiple
            onChange={(files) =>
              setSelectedDocuments(files)
            }
            accept="image/*,application/pdf"
          />


          <div className="flex justify-end gap-3">

            <Button
              variant="secondary"
              className="!border !border-[#dedede] !bg-white !text-[#111] !shadow-none hover:!bg-[#f8f8f8]"
              onClick={() =>
                setDocModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="!bg-[#111111] !text-white !shadow-none hover:!bg-[#2b2b2b]"
            >
              Upload Documents
            </Button>

          </div>

        </form>

      </Modal>


      {/* =====================================================
          DELETE DIALOG
          ===================================================== */}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        onConfirm={handleDeleteClaim}
        title="Delete Compensation Claim"
        message="Are you sure you want to permanently delete this compensation claim?"
        loading={submitting}
      />

      </div>
    </>
  );
};


export default CompensationClaims;
