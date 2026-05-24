import { ArrowDown, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt="Business background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary-light/70"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
          OPTIMISEZ VOTRE GESTION,{' '}
          <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
            SÉCURISEZ VOTRE CROISSANCE
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/85 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
          PME, TPE, Start Up : Libérez-vous des contraintes administratives !
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#services"
            className="group bg-white text-primary px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-sm sm:text-base inline-flex items-center justify-center gap-2"
          >
            Découvrir nos services
            <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#faire-demande"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('faire-demande')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/70 transition-all text-sm sm:text-base backdrop-blur-sm"
          >
            Prendre un rendez-vous
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>+50 entreprises accompagnées</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>98% de satisfaction client</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Expertise multi-sectorielle</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
