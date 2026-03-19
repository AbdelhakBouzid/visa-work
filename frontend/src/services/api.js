import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('visa-work-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const extractApiError = (error, fallback = 'حدث خطأ غير متوقع.') => {
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((item) => item.message).join(' ');
  }

  return error.response?.data?.message || fallback;
};

export const publicApi = {
  getHome: async () => (await api.get('/public/home')).data,
  getArticles: async (params = {}) => (await api.get('/articles', { params })).data,
  getArticleBySlug: async (slug) => (await api.get(`/articles/${slug}`)).data,
  getCategories: async () => (await api.get('/categories')).data,
  getSettings: async () => (await api.get('/settings')).data,
  submitContact: async (payload) => (await api.post('/public/contact', payload)).data,
  subscribeNewsletter: async (payload) => (await api.post('/public/newsletter', payload)).data
};

export const authApi = {
  login: async (payload) => (await api.post('/auth/login', payload)).data,
  logout: async () => (await api.post('/auth/logout')).data,
  me: async () => (await api.get('/auth/me')).data
};

export const adminApi = {
  getStats: async () => (await api.get('/dashboard/stats')).data,
  getArticles: async (params = {}) =>
    (await api.get('/articles', { params: { scope: 'admin', ...params } })).data,
  getArticleById: async (id) => (await api.get(`/articles/id/${id}`)).data,
  createArticle: async (payload) => (await api.post('/articles', payload)).data,
  updateArticle: async (id, payload) => (await api.put(`/articles/${id}`, payload)).data,
  deleteArticle: async (id) => (await api.delete(`/articles/${id}`)).data,
  createCategory: async (payload) => (await api.post('/categories', payload)).data,
  updateCategory: async (id, payload) => (await api.put(`/categories/${id}`, payload)).data,
  deleteCategory: async (id) => (await api.delete(`/categories/${id}`)).data,
  getSettings: async () => (await api.get('/settings')).data,
  updateSettings: async (payload) => (await api.put('/settings', payload)).data,
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
};
