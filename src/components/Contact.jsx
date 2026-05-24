import { useState, useEffect, useMemo } from 'react'
import { Phone, Mail, Globe, MapPin, ArrowUpRight, FileText, Send, CheckCircle, Clock, Calendar, ChevronDown, ChevronLeft, ChevronRight, Loader2, XCircle, CalendarDays } from 'lucide-react'
import { getPublicAvailability, createPublicRequest } from '../services/api'

const contacts = [
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+33 07 58 58 02 67',
    href: 'tel:+330758580267',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@partapex.com',
    href: 'mailto:contact@partapex.com',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Globe,
    title: 'Site Web',
    value: 'www.partapex.com',
    href: 'http://www.partapex.com',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: '121 Rue Manin, 75019 Paris',
    href: null,
    color: 'from-amber-500 to-orange-500',
  },
]

export default function Contact() {
  const [showForm, setShowForm] = useState(false)
  const [availability, setAvailability] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    clientName: '', email: '', phone: '', requestType: '', subject: '', message: '', preferredDate: '', timeSlot: ''
  })

  // Auto-open form if navigated via #contact-form
  useEffect(() => {
    if (window.location.hash === '#contact-form') {
      setShowForm(true)
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [])

  useEffect(() => {
    if (showForm) {
      getPublicAvailability().then(setAvailability).catch(() => {})
    }
  }, [showForm])

  const availableSlots = form.preferredDate ? (availability[form.preferredDate] || []) : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await createPublicRequest(form)
      setSuccess(res.message || 'Votre demande a été envoyée avec succès.')
      setForm({ clientName: '', email: '', phone: '', requestType: '', subject: '', message: '', preferredDate: '', timeSlot: '' })
      // Refresh availability
      getPublicAvailability().then(setAvailability).catch(() => {})
      setTimeout(() => setSuccess(''), 6000)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi.')
    }
    setLoading(false)
  }

  return (
    <section id="contact" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary-light to-primary"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="inline-block text-primary/70 text-sm font-semibold uppercase tracking-widest mb-3">Contact</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary mb-6">
            Contactez-nous
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-primary-light mx-auto rounded-full mb-8"></div>
          <p className="text-text max-w-2xl mx-auto text-lg leading-relaxed">
            Prenez contact avec notre équipe pour discuter de vos besoins et démarrer votre transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((c, i) => {
            const Wrapper = c.href ? 'a' : 'div'
            const wrapperProps = c.href ? { href: c.href, ...(c.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : {}

            return (
              <Wrapper
                key={i}
                {...wrapperProps}
                className="group bg-white border border-gray-100 rounded-3xl p-7 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${c.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <c.icon className="text-white" size={26} />
                </div>
                <h3 className="font-bold text-primary mb-2 text-lg">{c.title}</h3>
                <p className="text-text/70 text-sm leading-relaxed group-hover:text-primary transition-colors">
                  {c.value}
                </p>
                {c.href && (
                  <ArrowUpRight size={16} className="mx-auto mt-3 text-text/30 group-hover:text-primary transition-colors" />
                )}
              </Wrapper>
            )
          })}
        </div>

        {/* Faire une demande */}
        <div id="faire-demande" className="mt-16 bg-gradient-to-br from-primary to-primary-light rounded-3xl p-10 sm:p-14 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Faire une demande</h3>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">Choisissez comment vous souhaitez nous contacter.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <FileText size={20} />
              Remplir le formulaire
            </button>
            <a
              href="mailto:contact@partapex.com"
              className="inline-flex items-center gap-2 bg-white/15 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/25 hover:scale-105 transition-all"
            >
              <Mail size={20} />
              Envoyer un email
            </a>
          </div>
        </div>

        {/* Public Request Form */}
        {showForm && (
          <div id="contact-form" className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-primary">Formulaire de demande</h3>
                <p className="text-text/50 text-sm mt-1">Remplissez le formulaire ci-dessous pour soumettre votre demande.</p>
              </div>
              <button
                onClick={() => { setShowForm(false); setSuccess(''); setError('') }}
                className="text-text/40 hover:text-red-500 text-2xl font-bold cursor-pointer transition-colors"
              >
                ×
              </button>
            </div>

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl text-sm mb-6 flex items-center gap-2">
                <CheckCircle size={18} />
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Nom complet *</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={(e) => setForm(prev => ({ ...prev, clientName: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Téléphone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Type de demande *</label>
                  <div className="relative">
                    <select
                      value={form.requestType}
                      onChange={(e) => setForm(prev => ({ ...prev, requestType: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none text-sm transition-all"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Prise de rendez-vous">Prise de rendez-vous</option>
                      <option value="Demande d'information">Demande d'information</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Objet *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                  placeholder="Objet de votre demande"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all resize-none"
                  placeholder="Décrivez votre besoin..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Date souhaitée *</label>
                  <PublicAvailabilityCalendar
                    availability={availability}
                    selected={form.preferredDate}
                    onSelect={(date) => setForm(prev => ({ ...prev, preferredDate: date, timeSlot: '' }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text/60 mb-2 uppercase tracking-wider">Créneau horaire *</label>
                  {form.preferredDate ? (
                    availableSlots.length > 0 ? (
                      <div className="relative">
                        <select
                          value={form.timeSlot}
                          onChange={(e) => setForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none text-sm transition-all"
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
                disabled={loading || !form.preferredDate || !form.timeSlot}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

function PublicAvailabilityCalendar({ availability, selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const availableDates = useMemo(() => new Set(Object.keys(availability || {})), [availability])

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7

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
    <div className="border border-gray-200 rounded-xl p-3 bg-white max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={prevMonth} disabled={!canGoPrev} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed">
          <ChevronLeft size={16} className="text-primary" />
        </button>
        <span className="text-xs font-semibold text-primary capitalize">{monthLabel}</span>
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 cursor-pointer">
          <ChevronRight size={16} className="text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-text/50 mb-1">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
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
                w-7 h-7 flex items-center justify-center text-[11px] rounded-md transition-all cursor-pointer mx-auto
                ${isPast ? 'text-text/20 cursor-not-allowed' : ''}
                ${!isPast && isAvailable && !isSelected ? 'bg-green-100 text-green-700 font-semibold hover:bg-green-200 ring-1 ring-green-300' : ''}
                ${!isPast && !isAvailable ? 'text-text/40 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-primary text-white font-bold ring-2 ring-primary' : ''}
              `}
              title={isAvailable ? `${availability[dateStr].length} créneau(x)` : ''}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-2 text-[10px] text-text/60">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-green-100 ring-1 ring-green-300"></div>
          Disponible
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-primary"></div>
          Sélectionné
        </div>
      </div>
    </div>
  )
}
