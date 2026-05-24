import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'

export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await onLogin(email, password)
    setLoading(false)
    if (!result.success) {
      setError(result.message || 'Email ou mot de passe incorrect.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-light to-[#004a7a] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-white/3 rounded-full blur-2xl"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-8">
            <img src="/logo.jpg" alt="PARTAPEX" className="h-24 w-24 rounded-full object-cover ring-4 ring-white/20 shadow-2xl" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Bienvenue sur<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">votre espace dédié</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-md">
            Gérez vos demandes, suivez vos rendez-vous et accédez à tous nos services en un seul endroit.
          </p>

          {/* Features list */}
          <div className="mt-10 space-y-4">
            {[
              'Suivi de vos demandes en temps réel',
              'Prise de rendez-vous simplifiée',
              'Espace sécurisé et confidentiel',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70">
                <div className="w-2 h-2 rounded-full bg-white/40 shrink-0"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Subtle background decoration */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-text/60 hover:text-primary mb-10 text-sm font-medium cursor-pointer transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Retour au site
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/logo.jpg" alt="PARTAPEX" className="h-20 w-20 rounded-full object-cover shadow-lg" />
          </div>

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary/50" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/50">Espace client</span>
            </div>
            <h1 className="text-3xl font-extrabold text-primary mb-2">Connexion</h1>
            <p className="text-text/50">Entrez vos identifiants pour accéder à votre espace.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text/80 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text/80 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                  placeholder="••••••••"
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

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-[shake_0.3s_ease-in-out]">
                <div className="w-2 h-2 rounded-full bg-red-400 shrink-0"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-text/30 mt-10">
            © 2024 PARTAPEX CONSULTING — Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}
