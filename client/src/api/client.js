import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor to normalize RFC 7807 error responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    const message =
      errorData?.detail ||
      errorData?.title ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.problem = errorData;
    return Promise.reject(customError);
  }
);

export const placeApi = {
  getPlaces: (params) => apiClient.get('/places', { params }),
  getPlaceById: (id) => apiClient.get(`/places/${id}`),
  getPlaceNotes: (id, params) => apiClient.get(`/places/${id}/notes`, { params }),
  createPlace: (data) => apiClient.post('/places', data),
  verifyFeature: (id, data) => apiClient.post(`/places/${id}/verify`, data),
  getHealth: () => apiClient.get('/health')
};

