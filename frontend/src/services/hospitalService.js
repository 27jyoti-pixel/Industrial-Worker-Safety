import api from '../api';

export const hospitalService = {
  getAllHospitals: async (params = {}) => {
    const response = await api.get('/hospitals', { params });
    return response.data;
  },

  getHospitalById: async (id) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  // getNearbyHospitals: async (lat, lng, radius = 50) => {
  //   const response = await api.get('/hospitals/nearby', {
  //     params: { lat, lng, radius }
  //   });
  //   return response.data;
  // },

  getNearbyHospitals: async (latitude, longitude, radius = 10) => {
  const response = await api.get('/hospitals/nearby', {
    params: { latitude, longitude, radius },
    timeout : 60000
  });
  return response.data;
},

  getEmergencyContacts: async (id) => {
    const response = await api.get(`/hospitals/${id}/emergency-contacts`);
    return response.data;
  },

  createHospital: async (hospitalData) => {
    const response = await api.post('/hospitals', hospitalData);
    return response.data;
  },

  updateHospital: async (id, hospitalData) => {
    const response = await api.put(`/hospitals/${id}`, hospitalData);
    return response.data;
  },

  deleteHospital: async (id) => {
    const response = await api.delete(`/hospitals/${id}`);
    return response.data;
  }
};

export default hospitalService;
