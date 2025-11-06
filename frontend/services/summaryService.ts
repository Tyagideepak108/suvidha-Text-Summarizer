import api from '@/lib/axios';

export const summaryService = {
  createSummary: async (originalText: string) => {
    const response = await api.post('/summaries', { original_text: originalText });
    return response.data;
  },

  getJobStatus: async (jobId: string) => {
    const response = await api.get(`/summaries/job/${jobId}`);
    return response.data;
  },

  getSummaries: async () => {
    const response = await api.get('/summaries');
    return response.data;
  },

  deleteSummary: async (id: number) => {
    const response = await api.delete(`/summaries/${id}`);
    return response.data;
  },
};
