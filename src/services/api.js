import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization JWT header if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('echoverse_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public Endpoints
export const getSongs = (category) => api.get('/songs', { params: { category } });
export const getLatestSong = () => api.get('/songs/latest');
export const getSongBySlug = (identifier) => api.get(`/songs/${identifier}`);
export const getReels = () => api.get('/reels');
export const getMembers = () => api.get('/members');
export const getSettings = () => api.get('/settings');
export const subscribeNewsletter = (email) => api.post('/subscribe', { email });
export const sendContactMessage = (formData) => api.post('/contact', formData);

// Admin Endpoints
export const adminLogin = (credentials) => api.post('/auth/login', credentials);
export const checkAdminAuth = () => api.get('/auth/me');

// Admin Songs CRUD
export const createSong = (songData) => api.post('/songs', songData);
export const updateSong = (id, songData) => api.put(`/songs/${id}`, songData);
export const deleteSong = (id) => api.delete(`/songs/${id}`);

// Admin Reels CRUD
export const createReel = (reelData) => api.post('/reels', reelData);
export const updateReel = (id, reelData) => api.put(`/reels/${id}`, reelData);
export const deleteReel = (id) => api.delete(`/reels/${id}`);

// Admin Members CRUD
export const createMember = (memberData) => api.post('/members', memberData);
export const updateMember = (id, memberData) => api.put(`/members/${id}`, memberData);
export const deleteMember = (id) => api.delete(`/members/${id}`);

// Admin Settings
export const updateSettings = (settingsData) => api.put('/settings', settingsData);

// Admin Subscribers & Messages
export const getAdminSubscribers = () => api.get('/subscribe/admin/list');
export const deleteSubscriber = (id) => api.delete(`/subscribe/admin/${id}`);
export const getAdminMessages = () => api.get('/contact/admin/list');
export const markMessageRead = (id) => api.put(`/contact/admin/${id}/read`);
export const deleteMessage = (id) => api.delete(`/contact/admin/${id}`);

// Comments Endpoints
export const getSongComments = (songId) => api.get(`/comments/song/${songId}`);
export const postSongComment = (songId, commentData) => api.post(`/comments/song/${songId}`, commentData);
export const getAdminComments = () => api.get('/comments/admin/list');
export const toggleAdminComment = (id) => api.put(`/comments/admin/${id}/toggle`);
export const deleteAdminComment = (id) => api.delete(`/comments/admin/${id}`);

// Chatbot Endpoint
export const sendChatbotMessage = (message) => api.post('/chatbot', { message });

// Fan Lyrics Submission Endpoints
export const submitLyrics = (data) => api.post('/lyrics', data);
export const getFeaturedLyrics = () => api.get('/lyrics');
export const getAllLyricsAdmin = () => api.get('/lyrics/admin/all');
export const updateLyricStatus = (id, data) => api.put(`/lyrics/${id}/status`, data);
export const deleteLyricSubmission = (id) => api.delete(`/lyrics/${id}`);

export default api;



