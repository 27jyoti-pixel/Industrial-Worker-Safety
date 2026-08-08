import api from '../api';

export const workerService = {
  getAllWorkers: async (params = {}) => {
    const response = await api.get('/workers', { params });
    return response.data;
  },

  getWorkerById: async (id) => {
    const response = await api.get(`/workers/${id}`);
    return response.data;
  },

  getMyWorkerProfile: async () => {
  const response = await api.get('/workers/me');
  return response.data;
},

  createWorker: async (workerData) => {
    const response = await api.post('/workers', workerData);
    return response.data;
  },

  updateWorker: async (id, workerData) => {
    const response = await api.put(`/workers/${id}`, workerData);
    return response.data;
  },

  deleteWorker: async (id) => {
    const response = await api.delete(`/workers/${id}`);
    return response.data;
  },

  uploadProfileImage: async (id, formData) => {
    const response = await api.post(`/workers/${id}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default workerService;
