import api from '../api';

export const dashboardService = {
  getWorkerDashboard: async () => {
    const response = await api.get('/dashboard/worker');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }
};

export default dashboardService;
