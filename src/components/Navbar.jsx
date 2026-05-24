import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar({ onLogin }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="group">
            <img src="/logo.jpg" alt="PARTAPEX" className={`h-20 w-20 rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg] group-hover:shadow-xl group-hover:shadow-primary/30 ${scrolled ? 'mix-blend-multiply' : 'ring-2 ring-white/30 animate-pulse'}`} />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'À propos', href: '#about' },
              { label: 'Services', href: '#services' },
              { label: 'Contact', href: '#contact' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/10 ${
                  scrolled ? 'text-text hover:text-primary hover:bg-primary/5' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onLogin}
              className="ml-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2 group"
            >
              Connexion
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <button onClick={() => setOpen(!open)} className={`md:hidden p-2 rounded-lg cursor-pointer ${scrolled ? 'text-primary' : 'text-white'}`}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}>
        <div className="bg-white/98 backdrop-blur-md border-t border-light-gray/50 px-4 pb-5 pt-2 space-y-1 shadow-xl">
          {[
            { label: 'À propos', href: '#about' },
            { label: 'Services', href: '#services' },
            { label: 'Contact', href: '#contact' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-text hover:text-primary hover:bg-primary/5 text-sm font-medium py-2.5 px-3 rounded-lg transition-all"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); onLogin() }}
            className="w-full bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors cursor-pointer mt-2"
          >
            Connexion
          </button>
        </div>
      </div>
    </nav>
  )
}
