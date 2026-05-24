import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary to-[#001a30] text-white pt-16 pb-8 relative">
      {/* Back to top */}
      <a
        href="#"
        className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <ArrowUp size={18} className="text-primary" />
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <img src="/logo.jpg" alt="PARTAPEX" className="h-20 w-20 rounded-full object-cover hover:scale-110 hover:rotate-[360deg] transition-all duration-500 hover:shadow-xl hover:shadow-white/20 ring-2 ring-white/20" />
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm mb-6">
              Votre partenaire de confiance pour la gestion, la transformation numérique
              et la croissance durable de votre entreprise.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-5 text-white/90">Services</h3>
            <ul className="space-y-3 text-white/55 text-sm">
              <li className="hover:text-white/90 transition-colors cursor-pointer">Transformation numérique</li>
              <li className="hover:text-white/90 transition-colors cursor-pointer">Gestion administrative</li>
              <li className="hover:text-white/90 transition-colors cursor-pointer">Ressources humaines</li>
              <li className="hover:text-white/90 transition-colors cursor-pointer">Conseil stratégique</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-5 text-white/90">Contact</h3>
            <ul className="space-y-3 text-white/55 text-sm">
              <li className="flex items-center gap-3 hover:text-white/90 transition-colors">
                <Phone size={15} className="text-white/40" />
                <span>+33 07 58 58 02 67</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white/90 transition-colors">
                <Mail size={15} className="text-white/40" />
                <span>contact@partapex.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-white/90 transition-colors">
                <MapPin size={15} className="text-white/40" />
                <span>121 Rue Manin, 75019 Paris</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} PARTAPEX CONSULTING. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white/80 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/80 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
