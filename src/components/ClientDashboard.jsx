import { useState, useEffect, useMemo } from 'react'
import {
  LogOut, Send, Mail, FileText, ChevronDown, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle, AlertCircle, User, Phone, Sparkles,
  CalendarDays, MessageSquare, ArrowLeft
} from 'lucide-react'
import { getAvailability, createRequest, getRequests } from '../services/api'
import socket from '../services/socket'

const REQUEST_TYPES = [
  'Prise de rendez-vous',
  'Demande d\'information',
  'Autre',
]

const emptyForm = {
  clientName: '',
  email: '',
  phone: '',
  requestType: '',
  subject: '',
  message: '',
  preferredDate: '',
  timeSlot: '',
}

export default function ClientDashboard({ user, onLogout }) {
  const [mode, setMode] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [availability, setAvailability] = useState({})
  const [availableSlots, setAvailableSlots] = useState([])
  const [success, setSuccess] = useState(false)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAvailability()
      .then(data => setAvailability(data))
      .catch(() => {})
    getRequests()
      .then(data => setRequests(data))
      .catch(() => {})
  }, [])

  // Real-time socket listeners
  useEffect(() => {
    const onCreated = (req) => {
      if (req.client === user.id || req.client === user._id) {
        setRequests(prev => [req, ...prev])
      }
      getAvailability().then(data => setAvailability(data)).catch(() => {})
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
  }, [user])

  useEffect(() => {
    if (form.preferredDate && availability[form.preferredDate]) {
      setAvailableSlots(availability[form.preferredDate])
    } else {
      setAvailableSlots([])
    }
    setForm(prev => ({ ...prev, timeSlot: '' }))
  }, [form.preferredDate, availability])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.preferredDate || !form.timeSlot) return
    setLoading(true)

    try {
      await createRequest({
        clientName: form.clientName,
        email: form.email,
        phone: form.phone,
        requestType: form.requestType,
        subject: form.subject,
        message: form.message,
        preferredDate: form.preferredDate,
        timeSlot: form.timeSlot,
      })

      const updatedAvailability = await getAvailability()
      setAvailability(updatedAvailability)
      const updatedRequests = await getRequests()
      setRequests(updatedRequests)

      setForm(emptyForm)
      setMode(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      alert(error.message || 'Erreur lors de l\'envoi de la demande.')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: requests.length,
    enAttente: requests.filter(r => r.status === 'en attente' || r.status === 'Nouvelle').length,
    acceptee: requests.filter(r => r.status === 'acceptée' || r.status === 'Terminée').length,
    refusee: requests.filter(r => r.status === 'refusée' || r.status === 'Refusée').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-18">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="PARTAPEX" className="h-14 w-14 rounded-full object-cover hover:scale-110 hover:rotate-[360deg] transition-all duration-500 hover:shadow-lg" />
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles size={14} className="text-primary/50" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/50">Espace client</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-primary">{user.name}</span>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-primary via-primary-light to-[#004a7a] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-16 w-40 h-40 bg-white rounded-full translate-y-1/2"></div>
          </div>
          <div className="relative z-10">
            <p className="text-white/60 text-sm mb-1">Bonjour,</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">{user.name} 👋</h1>
            <p className="text-white/70 text-sm">Bienvenue dans votre espace client PARTAPEX CONSULTING.</p>
          </div>
        </div>

        {/* Quick stats */}
        {requests.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all">
              <p className="text-2xl font-extrabold text-primary">{stats.total}</p>
              <p className="text-xs text-text/50 font-medium">Total</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all">
              <p className="text-2xl font-extrabold text-amber-600">{stats.enAttente}</p>
              <p className="text-xs text-text/50 font-medium">En attente</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all">
              <p className="text-2xl font-extrabold text-emerald-600">{stats.acceptee}</p>
              <p className="text-xs text-text/50 font-medium">Acceptées</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl mb-8 font-medium flex items-center gap-3">
            <CheckCircle size={20} />
            Votre demande a été envoyée avec succès.
          </div>
        )}

        {/* Make a request */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Faire une demande</h2>
              <p className="text-xs text-text/40">Choisissez votre méthode de contact</p>
            </div>
          </div>

          {!mode && (
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setMode('form')}
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-transparent rounded-2xl hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <FileText className="text-white" size={28} />
                </div>
                <span className="text-lg font-bold text-primary">Remplir un formulaire</span>
                <span className="text-sm text-text/50">Envoyez-nous une demande détaillée</span>
              </button>

              <a
                href="mailto:contact@partapex.com"
                className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-blue-50/50 to-blue-100/50 border-2 border-transparent rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Mail className="text-white" size={28} />
                </div>
                <span className="text-lg font-bold text-primary">Envoyer un email</span>
                <span className="text-sm text-text/50">Contactez-nous directement</span>
              </a>
            </div>
          )}

          {mode === 'form' && (
            <div>
              <button
                onClick={() => setMode(null)}
                className="flex items-center gap-1.5 text-sm text-text/50 hover:text-primary mb-6 cursor-pointer transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Retour aux options
              </button>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Nom complet</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/25" />
                      <input
                        name="clientName"
                        value={form.clientName}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/25" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Téléphone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/25" />
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Type de demande</label>
                    <div className="relative">
                      <select
                        name="requestType"
                        value={form.requestType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none focus:bg-white text-sm transition-all"
                      >
                        <option value="">Sélectionner...</option>
                        {REQUEST_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Objet</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none focus:bg-white text-sm transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Date souhaitée</label>
                    <AvailabilityCalendar
                      availability={availability}
                      selected={form.preferredDate}
                      onSelect={(date) => setForm(prev => ({ ...prev, preferredDate: date, timeSlot: '' }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Créneau horaire</label>
                    {form.preferredDate ? (
                      availableSlots.length > 0 ? (
                        <div className="relative">
                          <select
                            name="timeSlot"
                            value={form.timeSlot}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none focus:bg-white text-sm transition-all"
                          >
                            <option value="">Sélectionner un créneau</option>
                            {availableSlots.map(slot => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                          <XCircle size={16} />
                          Aucune disponibilité pour cette date.
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-text/40 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                        <CalendarDays size={16} />
                        Sélectionnez d'abord une date
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!form.preferredDate || !form.timeSlot || loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* My requests */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Mes demandes</h2>
              <p className="text-xs text-text/40">{requests.length} demande(s) envoyée(s)</p>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-text/20" />
              </div>
              <p className="text-text/40 font-medium">Aucune demande pour le moment.</p>
              <p className="text-xs text-text/30 mt-1">Vos demandes apparaîtront ici après envoi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req._id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-semibold text-text/40 bg-gray-50 px-2.5 py-1 rounded-lg">{req.requestType}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-text font-semibold text-sm">{req.subject}</p>
                      <p className="text-text/50 text-xs mt-1 line-clamp-2 leading-relaxed">{req.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-xs text-text/40 mb-1">
                        <CalendarDays size={12} />
                        {new Date(req.preferredDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text/40">
                        <Clock size={12} />
                        {req.timeSlot}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    'en attente': { icon: Clock, label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    'Nouvelle': { icon: Clock, label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    'En cours': { icon: Clock, label: 'En cours', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    'acceptée': { icon: CheckCircle, label: 'Acceptée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'Terminée': { icon: CheckCircle, label: 'Terminée', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    'refusée': { icon: XCircle, label: 'Refusée', className: 'bg-red-50 text-red-700 border-red-200' },
    'Refusée': { icon: XCircle, label: 'Refusée', className: 'bg-red-50 text-red-700 border-red-200' },
  }
  const c = config[status] || { icon: AlertCircle, label: status, className: 'bg-gray-50 text-gray-700 border-gray-200' }
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${c.className}`}>
      <Icon size={12} />
      {c.label}
    </span>
  )
}

function AvailabilityCalendar({ availability, selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const availableDates = useMemo(() => new Set(Object.keys(availability || {})), [availability])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7 // Monday = 0

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const formatDate = (day) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${viewYear}-${m}-${d}`
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth())

  return (
    <div className="border border-light-gray rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} disabled={!canGoPrev} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
          <ChevronLeft size={18} className="text-primary" />
        </button>
        <span className="text-sm font-semibold text-primary capitalize">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
          <ChevronRight size={18} className="text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-text/50 mb-1">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dateStr = formatDate(day)
          const dateObj = new Date(viewYear, viewMonth, day)
          const isPast = dateObj < today
          const isAvailable = availableDates.has(dateStr)
          const isSelected = selected === dateStr

          return (
            <button
              key={day}
              type="button"
              disabled={isPast || !isAvailable}
              onClick={() => onSelect(dateStr)}
              className={`
                w-full aspect-square flex items-center justify-center text-xs rounded-lg transition-all cursor-pointer
                ${isPast ? 'text-text/20 cursor-not-allowed' : ''}
                ${!isPast && isAvailable && !isSelected ? 'bg-green-100 text-green-700 font-semibold hover:bg-green-200 ring-1 ring-green-300' : ''}
                ${!isPast && !isAvailable ? 'text-text/40 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-primary text-white font-bold ring-2 ring-primary' : ''}
              `}
              title={isAvailable ? `${availability[dateStr].length} créneau(x) disponible(s)` : ''}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-text/60">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 ring-1 ring-green-300"></div>
          Disponible
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary"></div>
          Sélectionné
        </div>
      </div>
    </div>
  )
}
