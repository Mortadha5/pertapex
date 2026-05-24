import { useState, useEffect } from 'react'
import {
  LogOut, BarChart3, Clock, CheckCircle, XCircle, Plus, Trash2,
  ChevronDown, Calendar, FileText, UserPlus, Users, Eye, EyeOff,
  Shield, TrendingUp, AlertTriangle, User, Mail, Phone, MessageSquare, CalendarDays,
  Sparkles, Loader2, ArrowRight, Tag, Lightbulb, MessageCircle
} from 'lucide-react'
import {
  getRequests as apiGetRequests,
  updateRequestStatus as apiUpdateStatus,
  deleteRequest as apiDeleteRequest,
  getAvailability as apiGetAvailability,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  removeAllSlotsForDate as apiRemoveAllSlots,
  register as apiRegister,
  getUsers as apiGetUsers,
  deleteUser as apiDeleteUser,
  analyzeRequestWithAI,
} from '../services/api'
import socket from '../services/socket'

const STATUSES = ['Nouvelle', 'En cours', 'Terminée', 'Refusée']

const SUGGESTED_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00',
]

const STATUS_COLORS = {
  'Nouvelle': 'bg-blue-50 text-blue-700 border-blue-200',
  'En cours': 'bg-amber-50 text-amber-700 border-amber-200',
  'Terminée': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Refusée': 'bg-red-50 text-red-700 border-red-200',
}

const STATUS_DOT = {
  'Nouvelle': 'bg-blue-500',
  'En cours': 'bg-amber-500',
  'Terminée': 'bg-emerald-500',
  'Refusée': 'bg-red-500',
}

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('requests')
  const [requests, setRequests] = useState([])
  const [availability, setAvailability] = useState({})
  const [newDate, setNewDate] = useState('')
  const [newSlot, setNewSlot] = useState('')
  const [users, setUsers] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'client' })
  const [userFormError, setUserFormError] = useState('')
  const [userFormSuccess, setUserFormSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [analyzingId, setAnalyzingId] = useState(null)

  useEffect(() => {
    loadRequests()
    loadAvailability()
    loadUsers()
  }, [])

  const [notification, setNotification] = useState(null)

  // Real-time socket listeners
  useEffect(() => {
    const onCreated = (req) => {
      setRequests(prev => [req, ...prev])
      loadAvailability()
      // Sound notification
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczIjmf2teleicZPKDY6bhrKB84ptrsunIvJDmx3em6dDEoQbff5blyLyk/ud/mt3MuKUK94OW3cy4pQr3g5bdzLilCveDlt3MuKUK94OW3cy4pQr3g5bdzLilCvd/lt3MuKQ==')
        audio.volume = 0.5
        audio.play().catch(() => {})
      } catch {}
      // Visual notification
      const label = req.source === 'public' ? 'Visiteur' : 'Client'
      setNotification(`Nouvelle demande de ${req.clientName} (${label})`)
      setTimeout(() => setNotification(null), 5000)
    }
    const onUpdated = (req) => {
      setRequests(prev => prev.map(r => r._id === req._id ? req : r))
    }
    const onDeleted = ({ _id }) => {
      setRequests(prev => prev.filter(r => r._id !== _id))
    }

    socket.on('request:created', onCreated)
    socket.on('request:updated', onUpdated)
    socket.on('request:deleted', onDeleted)

    return () => {
      socket.off('request:created', onCreated)
      socket.off('request:updated', onUpdated)
      socket.off('request:deleted', onDeleted)
    }
  }, [])

  const loadRequests = async () => {
    try {
      const data = await apiGetRequests()
      setRequests(data)
    } catch { /* ignore */ }
  }

  const loadAvailability = async () => {
    try {
      const data = await apiGetAvailability()
      setAvailability(data)
    } catch { /* ignore */ }
  }

  const updateRequestStatus = async (id, newStatus) => {
    try {
      await apiUpdateStatus(id, newStatus)
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r))
    } catch { /* ignore */ }
  }

  const deleteRequest = async (id) => {
    try {
      await apiDeleteRequest(id)
      setRequests(prev => prev.filter(r => r._id !== id))
    } catch { /* ignore */ }
  }

  const addSlot = async () => {
    if (!newDate || !newSlot) return
    try {
      await addAvailabilitySlot(newDate, newSlot)
      await loadAvailability()
      setNewSlot('')
    } catch { /* ignore */ }
  }

  const removeSlot = async (date, slot) => {
    try {
      await removeAvailabilitySlot(date, slot)
      await loadAvailability()
    } catch { /* ignore */ }
  }

  const removeAllSlotsForDate = async (date) => {
    try {
      await apiRemoveAllSlots(date)
      await loadAvailability()
    } catch { /* ignore */ }
  }

  const loadUsers = async () => {
    try {
      const data = await apiGetUsers()
      setUsers(data)
    } catch { /* ignore */ }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setUserFormError('')
    setUserFormSuccess('')
    try {
      await apiRegister(userForm.name, userForm.email, userForm.password, userForm.role)
      setUserForm({ name: '', email: '', password: '', role: 'client' })
      setUserFormSuccess('Utilisateur créé avec succès.')
      setShowUserForm(false)
      await loadUsers()
      setTimeout(() => setUserFormSuccess(''), 4000)
    } catch (error) {
      setUserFormError(error.message || 'Erreur lors de la création.')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
    try {
      await apiDeleteUser(id)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch { /* ignore */ }
  }

  const handleAnalyze = async (id) => {
    setAnalyzingId(id)
    try {
      const updated = await analyzeRequestWithAI(id)
      setRequests(prev => prev.map(r => r._id === id ? updated : r))
    } catch { /* ignore */ }
    setAnalyzingId(null)
  }

  const stats = {
    total: requests.length,
    nouvelle: requests.filter(r => r.status === 'Nouvelle').length,
    enCours: requests.filter(r => r.status === 'En cours').length,
    terminee: requests.filter(r => r.status === 'Terminée').length,
  }

  const today = new Date().toISOString().split('T')[0]

  const TABS = [
    { key: 'requests', label: 'Demandes', icon: FileText, count: requests.length },
    { key: 'availability', label: 'Disponibilités', icon: Calendar, count: Object.keys(availability).length },
    { key: 'users', label: 'Utilisateurs', icon: Users, count: users.length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="PARTAPEX" className="h-14 w-14 rounded-full object-cover hover:scale-110 hover:rotate-[360deg] transition-all duration-500 hover:shadow-lg" />
            <div className="hidden sm:flex items-center gap-2">
              <Shield size={16} className="text-primary/50" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/50">Tableau de bord</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-primary">{user.email}</span>
            </div>
            <button
              onClick={() => { if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) onLogout() }}
              className="flex items-center gap-2 text-text/50 hover:text-red-600 text-sm font-medium cursor-pointer transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification toast */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-4 rounded-2xl shadow-2xl animate-[slideIn_0.3s_ease-out] flex items-center gap-3 max-w-sm">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse shrink-0"></div>
            <p className="text-sm font-medium">{notification}</p>
          </div>
        )}
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-primary via-primary-light to-[#004a7a] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-white rounded-full translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-1">Administration</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">Bonjour, {user.name || 'Admin'} 👋</h1>
            <p className="text-white/70 text-sm">Gérez vos demandes, disponibilités et utilisateurs.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={TrendingUp} label="Total demandes" value={stats.total} gradient="from-primary to-primary-light" />
          <StatCard icon={AlertTriangle} label="Nouvelles" value={stats.nouvelle} gradient="from-blue-500 to-blue-600" />
          <StatCard icon={Clock} label="En cours" value={stats.enCours} gradient="from-amber-500 to-amber-600" />
          <StatCard icon={CheckCircle} label="Terminées" value={stats.terminee} gradient="from-emerald-500 to-emerald-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                tab === t.key
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-text/60 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <t.icon size={18} />
              {t.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                tab === t.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <EmptyState icon={FileText} text="Aucune demande pour le moment." />
            ) : (
              requests.map(req => (
                <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary text-lg">{req.clientName}</h3>
                        <div className="flex items-center gap-3 text-sm text-text/50">
                          <span className="flex items-center gap-1"><Mail size={12} /> {req.email}</span>
                          <span className="flex items-center gap-1"><Phone size={12} /> {req.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[req.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[req.status]}`}></span>
                        {req.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        req.source === 'public'
                          ? 'bg-orange-50 text-orange-600 border border-orange-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {req.source === 'public' ? 'Visiteur' : 'Client'}
                      </span>
                      <button
                        onClick={() => deleteRequest(req._id)}
                        className="text-text/30 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    <InfoChip icon={FileText} label="Type" value={req.requestType} />
                    <InfoChip icon={MessageSquare} label="Objet" value={req.subject} />
                    <InfoChip icon={CalendarDays} label="Date" value={req.preferredDate} />
                    <InfoChip icon={Clock} label="Créneau" value={req.timeSlot} />
                  </div>

                  <div className="mb-5">
                    <p className="text-xs font-semibold text-text/40 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-text/70 text-sm bg-gray-50/80 p-4 rounded-xl leading-relaxed border border-gray-100">{req.message}</p>
                  </div>

                  {/* AI Analysis Card */}
                  {req.aiAnalysis?.analyzedAt && (
                    <div className="mb-5 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 border border-violet-100 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles size={16} className="text-violet-600" />
                        <span className="text-sm font-bold text-violet-700">Analyse IA</span>
                        <span className="text-[10px] text-violet-400 ml-auto">Analysé le {new Date(req.aiAnalysis.analyzedAt).toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 border border-violet-100">
                          <Tag size={13} className="text-violet-500" />
                          <div>
                            <p className="text-[10px] font-semibold text-text/30 uppercase">Priorité</p>
                            <p className={`text-sm font-bold ${req.aiAnalysis.priority === 'Haute' ? 'text-red-600' : req.aiAnalysis.priority === 'Moyenne' ? 'text-amber-600' : 'text-emerald-600'}`}>{req.aiAnalysis.priority}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 border border-violet-100">
                          <FileText size={13} className="text-violet-500" />
                          <div>
                            <p className="text-[10px] font-semibold text-text/30 uppercase">Catégorie</p>
                            <p className="text-sm font-medium text-text/80">{req.aiAnalysis.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2 border border-violet-100">
                          <ArrowRight size={13} className="text-violet-500" />
                          <div>
                            <p className="text-[10px] font-semibold text-text/30 uppercase">Statut recommandé</p>
                            <p className="text-sm font-medium text-text/80">{req.aiAnalysis.recommendedStatus}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-white/80 rounded-xl p-3 border border-violet-100">
                          <p className="text-[10px] font-semibold text-text/30 uppercase tracking-wider mb-1 flex items-center gap-1"><Lightbulb size={11} /> Résumé</p>
                          <p className="text-sm text-text/70">{req.aiAnalysis.summary}</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 border border-violet-100">
                          <p className="text-[10px] font-semibold text-text/30 uppercase tracking-wider mb-1 flex items-center gap-1"><MessageCircle size={11} /> Réponse suggérée</p>
                          <p className="text-sm text-text/70 italic">{req.aiAnalysis.suggestedResponse}</p>
                        </div>
                        <div className="bg-white/80 rounded-xl p-3 border border-violet-100">
                          <p className="text-[10px] font-semibold text-text/30 uppercase tracking-wider mb-1 flex items-center gap-1"><ArrowRight size={11} /> Prochaine action</p>
                          <p className="text-sm text-text/70">{req.aiAnalysis.nextAction}</p>
                        </div>
                      </div>
                      {req.aiAnalysis.recommendedStatus !== req.status && (
                        <button
                          onClick={() => updateRequestStatus(req._id, req.aiAnalysis.recommendedStatus)}
                          className="mt-4 flex items-center gap-2 bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors cursor-pointer"
                        >
                          <CheckCircle size={16} />
                          Appliquer le statut recommandé : {req.aiAnalysis.recommendedStatus}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <p className="text-xs text-text/40">Créé le {new Date(req.createdAt).toLocaleString('fr-FR')}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAnalyze(req._id)}
                        disabled={analyzingId === req._id}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-violet-200 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {analyzingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {analyzingId === req._id ? 'Analyse...' : 'Analyser avec IA'}
                      </button>
                      <span className="text-xs font-medium text-text/50">Statut :</span>
                      <div className="relative">
                        <select
                          value={req.status}
                          onChange={(e) => updateRequestStatus(req._id, e.target.value)}
                          className="pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white cursor-pointer hover:border-primary/30 transition-colors"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Availability Tab */}
        {tab === 'availability' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-primary text-lg mb-5 flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus size={18} className="text-primary" />
                </div>
                Ajouter une disponibilité
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  min={today}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                />
                <div className="relative">
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none pr-10 text-sm transition-all"
                  >
                    <option value="">Choisir un créneau</option>
                    {SUGGESTED_SLOTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                </div>
                <button
                  onClick={addSlot}
                  disabled={!newDate || !newSlot}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
            </div>

            {Object.keys(availability).sort().length === 0 ? (
              <EmptyState icon={Calendar} text="Aucune disponibilité configurée." />
            ) : (
              Object.keys(availability).sort().map(date => (
                <div key={date} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-gray-200 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center">
                        <CalendarDays size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary">
                          {new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </h3>
                        <p className="text-xs text-text/40">{availability[date].length} créneau(x)</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAllSlotsForDate(date)}
                      className="text-text/30 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-2 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                      Tout supprimer
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availability[date].map(slot => (
                      <div
                        key={slot}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/15 rounded-xl px-4 py-2 group/slot hover:border-primary/30 transition-all"
                      >
                        <Clock size={14} className="text-primary/50" />
                        <span className="text-sm font-semibold text-primary">{slot}</span>
                        <button
                          onClick={() => removeSlot(date, slot)}
                          className="text-text/20 hover:text-red-500 cursor-pointer ml-1 transition-colors"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">Gestion des utilisateurs</h3>
                    <p className="text-xs text-text/40">{users.length} utilisateur(s) enregistré(s)</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowUserForm(!showUserForm); setUserFormError(''); setUserFormSuccess('') }}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer"
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Nouvel utilisateur</span>
                </button>
              </div>

              {userFormSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2">
                  <CheckCircle size={16} />
                  {userFormSuccess}
                </div>
              )}

              {showUserForm && (
                <form onSubmit={handleCreateUser} className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 mb-4 space-y-4">
                  <p className="text-sm font-semibold text-primary/70 mb-2">Nouveau compte utilisateur</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Nom complet</label>
                      <input
                        value={userForm.name}
                        onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                        placeholder="Nom complet"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Mot de passe</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={userForm.password}
                          onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-12 text-sm transition-all"
                          placeholder="Min. 6 caractères"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text/30 hover:text-text/60 cursor-pointer transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Rôle</label>
                      <div className="relative">
                        <select
                          value={userForm.role}
                          onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none text-sm transition-all"
                        >
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {userFormError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <XCircle size={16} />
                      {userFormError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer flex items-center gap-2 text-sm"
                    >
                      <UserPlus size={18} />
                      Créer l'utilisateur
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUserForm(false)}
                      className="bg-white text-text/60 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 border border-gray-200 transition-all cursor-pointer text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>

            {users.length === 0 ? (
              <EmptyState icon={Users} text="Aucun utilisateur." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(u => (
                  <div key={u._id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">{u.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      {u._id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-text/20 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <h4 className="font-bold text-primary text-lg">{u.name}</h4>
                    <p className="text-sm text-text/50 mb-3 flex items-center gap-1.5">
                      <Mail size={12} />
                      {u.email}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        <Shield size={12} />
                        {u.role === 'admin' ? 'Administrateur' : 'Client'}
                      </span>
                      <span className="text-xs text-text/30">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, gradient }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-sm`}>
          <Icon className="text-white" size={22} />
        </div>
        <div>
          <p className="text-3xl font-extrabold text-primary">{value}</p>
          <p className="text-xs text-text/50 font-medium">{label}</p>
        </div>
      </div>
    </div>
  )
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50/80 rounded-xl px-3 py-2.5 border border-gray-100">
      <Icon size={14} className="text-text/30 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-text/30 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-text/80 font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-text/20" />
      </div>
      <p className="text-text/40 font-medium">{text}</p>
    </div>
  )
}
