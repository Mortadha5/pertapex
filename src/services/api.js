const API_URL = 'http://localhost:5000/api'

function getToken() {
  const saved = localStorage.getItem('partapex_user')
  if (!saved) return null
  try {
    return JSON.parse(saved).token
  } catch {
    return null
  }
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Erreur serveur')
  }

  return data
}

// Auth
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const register = (name, email, password, role) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) })

export const getMe = () => request('/auth/me')

export const getUsers = () => request('/auth/users')

export const deleteUser = (id) =>
  request(`/auth/users/${id}`, { method: 'DELETE' })

// Requests
export const createRequest = (data) =>
  request('/requests', { method: 'POST', body: JSON.stringify(data) })

export const getRequests = () => request('/requests')

export const updateRequestStatus = (id, status) =>
  request(`/requests/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })

export const deleteRequest = (id) =>
  request(`/requests/${id}`, { method: 'DELETE' })

// AI
export const analyzeRequestWithAI = (id) =>
  request(`/ai/analyze-request/${id}`, { method: 'POST' })

// Availability
export const getAvailability = () => request('/availability')

export const addAvailabilitySlot = (date, slot) =>
  request('/availability', { method: 'POST', body: JSON.stringify({ date, slot }) })

export const removeAvailabilitySlot = (date, slot) =>
  request(`/availability/${date}/${slot}`, { method: 'DELETE' })

export const removeAllSlotsForDate = (date) =>
  request(`/availability/${date}`, { method: 'DELETE' })
