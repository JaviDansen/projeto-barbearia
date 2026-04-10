import api from './axios';

export const getAppointments = () => api.get('/appointments');
export const getMyAppointments = () => api.get('/my-appointments');
export const createAppointment = (data) => api.post('/appointments', data);