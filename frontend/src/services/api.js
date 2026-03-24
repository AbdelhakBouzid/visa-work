import axios from 'axios';

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (!configuredBaseUrl) {
    return '/api';
  }

  if (typeof window === 'undefined') {
    return configuredBaseUrl;
  }

  try {
    const resolvedUrl = new URL(configuredBaseUrl, window.location.origin);
    const normalizedPath = resolvedUrl.pathname.replace(/\/+$/, '');
    const hasApiPrefix = normalizedPath === '/api' || normalizedPath.endsWith('/api');

    if (window.location.protocol === 'https:' && resolvedUrl.protocol === 'http:') {
      console.warn('Ignoring insecure VITE_API_URL on HTTPS page and falling back to /api.');
      return '/api';
    }

    if (resolvedUrl.origin === window.location.origin) {
      return hasApiPrefix ? `${normalizedPath || '/api'}` : '/api';
    }

    if (hasApiPrefix) {
      return `${resolvedUrl.origin}${normalizedPath}`;
    }

    return `${resolvedUrl.origin}${normalizedPath || ''}/api`;
  } catch {
    return '/api';
  }
};

const api = axios.create({
  baseURL: resolveApiBaseUrl()
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
  getSetupStatus: async () => (await api.get('/auth/setup-status')).data,
  initialSetup: async (payload) => (await api.post('/auth/setup', payload)).data,
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
