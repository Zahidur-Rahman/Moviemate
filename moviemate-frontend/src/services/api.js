// API service for MovieMate - Updated for Django backend
// Use Vite env var if provided, otherwise same-origin (works on Render)
const API_BASE = import.meta?.env?.VITE_API_BASE || '';

// Simple fetch wrapper with cookie-based JWT support
const apiCall = async (url, options = {}) => {
  console.log('Making API call to:', url);
  console.log('Cookies being sent:', document.cookie);
  
  const response = await fetch(url, {
    credentials: 'include', // This sends cookies automatically
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', response.status, response.statusText, errorData);
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status}`);
  }
  
  // Handle empty responses (like DELETE requests)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return {}; // Return empty object for non-JSON responses
  }
};

// Auth API - Updated for cookie-based authentication
export const authAPI = {
  login: async (username, password) => {
    return apiCall(`${API_BASE}/api/account/cookie-login/`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  
  register: async (userData) => {
    return apiCall(`${API_BASE}/api/account/register/`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: async () => {
    return apiCall(`${API_BASE}/api/account/cookie-logout/`, {
      method: 'POST'
    });
  },
  
  getUserInfo: async () => {
    return apiCall(`${API_BASE}/api/account/user-info/`);
  },
  
  refreshToken: async () => {
    return apiCall(`${API_BASE}/api/account/cookie-refresh/`, {
      method: 'POST'
    });
  }
};

// Movies API - Fixed to match Django endpoints
export const moviesAPI = {
  getMovies: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('title', params.search);
    if (params.platform) searchParams.append('platform__name', params.platform);
    if (params.page) searchParams.append('page', params.page);
    
    const url = `${API_BASE}/api/watch/list2/?${searchParams.toString()}`;
    return apiCall(url);
  },
  
  createMovie: async (movieData) => {
    return apiCall(`${API_BASE}/api/watch/list/`, {
      method: 'POST',
      body: JSON.stringify(movieData)
    });
  },
  
  updateMovie: async (id, movieData) => {
    return apiCall(`${API_BASE}/api/watch/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(movieData)
    });
  },
  
  deleteMovie: async (id) => {
    return apiCall(`${API_BASE}/api/watch/${id}/`, {
      method: 'DELETE'
    });
  },
  
  getMovie: async (id) => {
    return apiCall(`${API_BASE}/api/watch/${id}/`);
  },
  
  getReviews: async (movieId) => {
    return apiCall(`${API_BASE}/api/watch/${movieId}/review/`);
  },
  
  createReview: async (movieId, reviewData) => {
    return apiCall(`${API_BASE}/api/watch/${movieId}/review-create/`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  },
  
  getPlatforms: async () => {
    return apiCall(`${API_BASE}/api/watch/stream/`);
  },
  
  createPlatform: async (platformData) => {
    return apiCall(`${API_BASE}/api/watch/stream/`, {
      method: 'POST',
      body: JSON.stringify(platformData)
    });
  },
  
  updatePlatform: async (id, platformData) => {
    return apiCall(`${API_BASE}/api/watch/stream/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(platformData)
    });
  },
  
  deletePlatform: async (id) => {
    return apiCall(`${API_BASE}/api/watch/stream/${id}/`, {
      method: 'DELETE'
    });
  }
};
