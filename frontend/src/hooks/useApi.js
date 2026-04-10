import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService } from '../api/services.api';
import { getEmployees, createEmployee } from '../api/employees.api';
import { getAppointments, getMyAppointments, createAppointment } from '../api/appointments.api';

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: getAppointments,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useMyAppointments = () =>
  useQuery({
    queryKey: ["myAppointments"],
    queryFn: getMyAppointments,
  });