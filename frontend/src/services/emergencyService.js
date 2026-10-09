import api from '../api';

const payload = (response) => response.data?.data || response.data;

export default {
  async getActive() { return payload(await api.get('/emergencies/active')); },
  async create(data) { return payload(await api.post('/emergencies', data)); },
  async acknowledge(id) { return payload(await api.post(`/emergencies/${id}/acknowledgements`)); },
  async updateStatus(id, status) { return payload(await api.patch(`/emergencies/${id}/status`, { status })); }
};
