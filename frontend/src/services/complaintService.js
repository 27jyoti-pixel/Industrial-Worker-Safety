import api from '../api';

export const complaintService = {
  getAllComplaints: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  updateComplaint: async (id, complaintData) => {
    const response = await api.put(`/complaints/${id}`, complaintData);
    return response.data;
  },

  updateComplaintStatus: async (id, statusData) => {
    const response = await api.patch(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },

  uploadImages: async (id, formData) => {
  const response = await api.post(`/complaints/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
},

deleteComplaintImage: async (complaintId, imageId) => {
  const response = await api.delete(
    `/complaints/${complaintId}/images/${imageId}`
  );
  return response.data;
}
};

export default complaintService;
