import api from '../api';

export const claimService = {
  getAllClaims: async (params = {}) => {
    const response = await api.get('/claims', { params });
    return response.data;
  },

  getClaimById: async (id) => {
    const response = await api.get(`/claims/${id}`);
    return response.data;
  },

  submitClaim: async (claimData) => {
    const response = await api.post('/claims', claimData);
    return response.data;
  },

  updateClaim: async (id, claimData) => {
    const response = await api.put(`/claims/${id}`, claimData);
    return response.data;
  },

  updateClaimStatus: async (id, statusData) => {
    const response = await api.patch(`/claims/${id}/status`, statusData);
    return response.data;
  },

  deleteClaim: async (id) => {
    const response = await api.delete(`/claims/${id}`);
    return response.data;
  },

  uploadDocuments: async (id, formData) => {
    const response = await api.post(`/claims/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default claimService;
