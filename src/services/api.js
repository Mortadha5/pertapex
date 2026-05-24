const API_URL = `${import.meta.env.VITE_API_URL}/api`

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

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  let data = {}

  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data.message || 'Erreur serveur')
  }

  return data
}

/* ==========================
   AUTH
========================== */

export const login = (email, password) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const register = (name, email, password, role) =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  })

export const getMe = () =>
  request('/auth/me')

export const getUsers = () =>
  request('/auth/users')

export const deleteUser = (id) =>
  request(`/auth/users/${id}`, {
    method: 'DELETE',
  })

export const createClientByAdmin = (data) =>
  request('/auth/create-client', {
    method: 'POST',
    body: JSON.stringify(data),
  })

/* ==========================
   REQUESTS
========================== */

export const createRequest = (payload) =>
  request('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const getRequests = () =>
  request('/requests')

export const updateRequestStatus = (id, status) =>
  request(`/requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })

export const deleteRequest = (id) =>
  request(`/requests/${id}`, {
    method: 'DELETE',
  })

/* ==========================
   AI
========================== */

export const analyzeRequestWithAI = (id) =>
  request(`/ai/analyze-request/${id}`, {
    method: 'POST',
  })

/* ==========================
   AVAILABILITY
========================== */

export const getAvailability = () =>
  request('/availability')

export const addAvailabilitySlot = (date, slot) =>
  request('/availability', {
    method: 'POST',
    body: JSON.stringify({
      date,
      slot,
    }),
  })

export const removeAvailabilitySlot = (date, slot) =>
  request(`/availability/${date}/${slot}`, {
    method: 'DELETE',
  })

export const removeAllSlotsForDate = (date) =>
  request(`/availability/${date}`, {
    method: 'DELETE',
  })

/* ==========================
   PUBLIC (no auth required)
========================== */

export const getPublicAvailability = () =>
  request('/public/availability')

export const createPublicRequest = (payload) =>
  request('/public/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export default {
  login,
  register,
  getMe,
  getUsers,
  deleteUser,
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequest,
  analyzeRequestWithAI,
  getAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  removeAllSlotsForDate,
  getPublicAvailability,
  createPublicRequest,
}