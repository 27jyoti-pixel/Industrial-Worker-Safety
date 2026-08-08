import api from '../api';

export const accidentService = {
  getAllReports: async (params = {}) => {
    const response = await api.get('/accidents', { params });
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/accidents/${id}`);
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await api.post('/accidents', reportData);
    return response.data;
  },

  updateReport: async (id, reportData) => {
    const response = await api.put(`/accidents/${id}`, reportData);
    return response.data;
  },

  updateReportStatus: async (id, statusData) => {
    const response = await api.patch(`/accidents/${id}/status`, statusData);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/accidents/${id}`);
    return response.data;
  },

  uploadImages: async (id, formData) => {
    const response = await api.post(`/accidents/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default accidentService;
