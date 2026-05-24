import { Monitor, FileText, Users, Lightbulb, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Monitor,
    title: 'Transformation numérique complète',
    description:
      'Digitalisez vos processus, adoptez les outils modernes et optimisez votre productivité grâce à une transformation numérique sur mesure.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Gestion administrative et commerciale',
    description:
      'Externalisez votre gestion administrative et commerciale pour gagner en efficacité et réduire vos coûts opérationnels.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Users,
    title: 'Ressources humaines et paie',
    description:
      'Confiez-nous la gestion de vos ressources humaines, de la paie aux contrats, en passant par la formation et le développement des talents.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    icon: Lightbulb,
    title: 'Conseil stratégique',
    description:
      'Bénéficiez d\'un accompagnement stratégique personnalisé pour définir vos objectifs, structurer votre croissance et sécuriser votre avenir.',
    accent: 'from-amber-500 to-orange-500',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gradient-to-br from-primary via-primary to-primary-light relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 border border-white/30 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <span className="inline-block text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">Ce que nous offrons</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Nos Services</h2>
          <div className="w-16 h-1.5 bg-white/40 mx-auto rounded-full mb-8"></div>
          <p className="text-white/75 max-w-2xl mx-auto text-lg leading-relaxed">
            Des solutions complètes pour accompagner votre entreprise à chaque étape de son développement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${service.accent} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="text-white" size={26} />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-primary mb-3 transition-colors duration-300">{service.title}</h3>
              <p className="text-white/70 group-hover:text-text/80 leading-relaxed transition-colors duration-300">{service.description}</p>
              <div className="mt-6 flex items-center gap-2 text-white/50 group-hover:text-primary text-sm font-medium transition-colors duration-300">
                <span>En savoir plus</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
