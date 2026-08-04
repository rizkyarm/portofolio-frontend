import api from './api';

export const skillService = {
  getAll: () => api.get('/skills'),

  create: (data) => api.post('/admin/skills', data),

  update: (id, data) => {
    // Gunakan JSON biasa untuk update (tidak ada file upload)
    return api.put(`/admin/skills/${id}`, data);
  },

  delete: (id) => api.delete(`/admin/skills/${id}`),
};