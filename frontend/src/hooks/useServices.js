import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

// Query keys
export const serviceKeys = {
  all: ['services'],
  lists: () => [...serviceKeys.all, 'list'],
  list: (filters) => [...serviceKeys.lists(), filters],
  details: () => [...serviceKeys.all, 'detail'],
  detail: (id) => [...serviceKeys.details(), id],
};

// Get services with filters
export const useServices = (filters = {}) => {
  return useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      return api.get(`/services?${params}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single service
export const useService = (id) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => api.get(`/services/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create service mutation
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};

// Update service mutation
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }) => api.put(`/services/${id}`, formData),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id) });
    },
  });
};

// Delete service mutation
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
};