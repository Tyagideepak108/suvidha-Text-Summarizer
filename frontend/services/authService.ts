import api from '@/lib/axios';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (email: string, password: string) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },
};
